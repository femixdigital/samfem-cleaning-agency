import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LogOut,
  RefreshCw,
  ClipboardList,
  Clock,
  CheckCircle,
  MessageCircle,
  Mail,
  Search,
  Download,
  Trash2,
  Phone,
  CalendarDays,
  Users,
  X,
  Eye,
  Filter,
  TrendingUp,
  Paperclip,
  FileText,
  ExternalLink,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import AdminReviews from '../components/AdminReviews'

type Enquiry = {
  id: string
  full_name: string
  phone: string
  email: string | null
  email_notifications_enabled: boolean
  notification_consent_at: string | null
  service: string
  property_location: string
  preferred_date: string
  details: string | null
  status: string
  created_at: string
  updated_at: string
  attachment_path: string | null
  attachment_name: string | null
  attachment_type: string | null
  attachment_size: number | null
}

const statuses = [
  'pending',
  'contacted',
  'quoted',
  'confirmed',
  'completed',
  'cancelled',
]

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  contacted: 'bg-blue-100 text-blue-700',
  quoted: 'bg-purple-100 text-purple-700',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
}

type EmailNotification = {
  id: string
  recipient: string
  subject: string
  notification_type: string
  status: 'pending' | 'sent' | 'failed'
  error_message: string | null
  sent_at: string | null
  created_at: string
}

type DateFilter = 'all' | 'today' | 'week' | 'month'

const STORAGE_BUCKET = 'enquiry-attachments'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')
  const [search, setSearch] = useState('')
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null)
  const [attachmentUrl, setAttachmentUrl] = useState('')
  const [attachmentLoading, setAttachmentLoading] = useState(false)
  const [attachmentError, setAttachmentError] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailHistory, setEmailHistory] = useState<EmailNotification[]>([])
  const [emailHistoryLoading, setEmailHistoryLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [emailSuccess, setEmailSuccess] = useState('')


  const fetchEnquiries = useCallback(async () => {
    setLoading(true)
    setError('')

    const { data, error: fetchError } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError('Unable to load enquiries. Please refresh and try again.')
      console.error('Enquiry loading error:', fetchError)
    } else {
      setEnquiries((data || []) as Enquiry[])
    }

    setLoading(false)
  }, [])

  const sendCustomEmail = async () => {
    if (!selectedEnquiry?.email) {
      setEmailError('This customer has no email address.')
      return
    }

    if (!selectedEnquiry.email_notifications_enabled) {
      setEmailError('The customer has not consented to email notifications.')
      return
    }

    if (!emailSubject.trim() || !emailMessage.trim()) {
      setEmailError('Enter both an email subject and message.')
      return
    }

    setSendingEmail(true)
    setEmailError('')
    setEmailSuccess('')

    const idempotencyKey = crypto.randomUUID()

    const { data, error: sendError } = await supabase.functions.invoke(
      'send-enquiry-email',
      {
        body: {
          enquiryId: selectedEnquiry.id,
          notificationType: 'custom',
          customSubject: emailSubject.trim(),
          customMessage: emailMessage.trim(),
          idempotencyKey,
        },
      }
    )

    if (sendError) {
      console.error('Custom email error:', sendError)
      setEmailError('Unable to send email. Please check your connection and try again.')
    } else if (data?.success && data?.duplicate) {
      setEmailSuccess('This email has already been submitted.')
    } else if (data?.success) {
      setEmailSuccess('Email submitted successfully.')
      setEmailSubject('')
      setEmailMessage('')
      await fetchEmailHistory(selectedEnquiry.id)
    } else {
      setEmailError(data?.error || 'Email could not be sent.')
    }

    setSendingEmail(false)
  }

  const fetchEmailHistory = useCallback(async (enquiryId: string) => {
    setEmailHistoryLoading(true)
    setEmailError('')

    const { data, error: historyError } = await supabase
      .from('email_notifications')
      .select('id, recipient, subject, notification_type, status, error_message, sent_at, created_at')
      .eq('enquiry_id', enquiryId)
      .order('created_at', { ascending: false })

    if (historyError) {
      console.error('Email history error:', historyError)
      setEmailError('Unable to load email history.')
      setEmailHistory([])
    } else {
      setEmailHistory((data || []) as EmailNotification[])
    }

    setEmailHistoryLoading(false)
  }, [])

  useEffect(() => {
    if (selectedEnquiry) {
      setEmailSubject('')
      setEmailMessage('')
      setEmailError('')
      setEmailSuccess('')
      void fetchEmailHistory(selectedEnquiry.id)
    } else {
      setEmailHistory([])
    }
  }, [selectedEnquiry, fetchEmailHistory])

  useEffect(() => {
    void fetchEnquiries()
  }, [fetchEnquiries])

  // Generate a temporary private URL when an enquiry with an attachment is opened.
  useEffect(() => {
    let active = true

    const loadAttachment = async () => {
      setAttachmentUrl('')
      setAttachmentError('')

      if (!selectedEnquiry?.attachment_path) {
        setAttachmentLoading(false)
        return
      }

      setAttachmentLoading(true)

      const { data, error: urlError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(selectedEnquiry.attachment_path, 300)

      if (!active) return

      if (urlError || !data?.signedUrl) {
        setAttachmentError(
          'Unable to load this attachment. Please check administrator permissions.'
        )
        console.error('Attachment URL error:', urlError)
      } else {
        setAttachmentUrl(data.signedUrl)
      }

      setAttachmentLoading(false)
    }

    void loadAttachment()

    return () => {
      active = false
    }
  }, [selectedEnquiry])

  const updateStatus = async (id: string, status: string) => {
    const previousEnquiry = enquiries.find(item => item.id === id)
    const previousStatus = previousEnquiry?.status

    setUpdatingId(id)
    setError('')
    setSuccess('')

    const { error: updateError } = await supabase
      .from('enquiries')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (updateError) {
      setError('Unable to update enquiry status.')
      console.error('Status update error:', updateError)
    } else {
      setEnquiries(current =>
        current.map(item =>
          item.id === id ? { ...item, status } : item
        )
      )

      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry(current =>
          current ? { ...current, status } : null
        )
      }

      let emailNotice = ''

      const shouldSendEmail =
        previousStatus !== status &&
        status !== 'pending' &&
        previousEnquiry?.email &&
        previousEnquiry.email_notifications_enabled

      if (shouldSendEmail) {
        const { error: emailError } = await supabase.functions.invoke(
          'send-enquiry-email',
          {
            body: {
              enquiryId: id,
              notificationType: status,
            },
          }
        )

        if (emailError) {
          console.error('Customer notification error:', emailError)
          emailNotice = ' However, the customer notification email could not be sent.'
        } else {
          emailNotice = ' Customer notification email sent.'
        }
      }

      setSuccess('Enquiry status updated successfully.' + emailNotice)
    }

    setUpdatingId(null)
  }

  const deleteEnquiry = async (item: Enquiry) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete the enquiry from ${item.full_name}?\n\nThis action cannot be undone.`
    )

    if (!confirmed) return

    setDeletingId(item.id)
    setError('')
    setSuccess('')

    // Delete the enquiry record first.
    const { data, error: deleteError } = await supabase
      .from('enquiries')
      .delete()
      .eq('id', item.id)
      .select('id')
      .maybeSingle()

    if (deleteError || !data) {
      setError(
        deleteError?.message ||
        'The enquiry could not be deleted. Check administrator permissions.'
      )
      console.error('Enquiry deletion error:', deleteError)
      setDeletingId(null)
      return
    }

    setEnquiries(current =>
      current.filter(enquiry => enquiry.id !== item.id)
    )

    if (selectedEnquiry?.id === item.id) {
      setSelectedEnquiry(null)
    }

    // Remove its private attachment after the enquiry is deleted.
    if (item.attachment_path) {
      const { error: storageError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([item.attachment_path])

      if (storageError) {
        console.error('Attachment cleanup error:', storageError)
        setSuccess(
          'Enquiry deleted. Its attachment could not be removed automatically; check Supabase Storage.'
        )
      } else {
        setSuccess('Enquiry and its attachment deleted successfully.')
      }
    } else {
      setSuccess('Enquiry deleted successfully.')
    }

    setDeletingId(null)
  }

  const downloadAttachment = async (item: Enquiry) => {
    if (!item.attachment_path) return

    setDownloading(true)
    setError('')

    const { data, error: downloadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(item.attachment_path)

    if (downloadError || !data) {
      setError('Unable to download this attachment.')
      console.error('Attachment download error:', downloadError)
      setDownloading(false)
      return
    }

    const objectUrl = URL.createObjectURL(data)
    const link = document.createElement('a')

    link.href = objectUrl
    link.download = item.attachment_name || 'SAMFEM-attachment'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(objectUrl)
    setDownloading(false)
  }

  const handleLogout = async () => {
    const { error: logoutError } = await supabase.auth.signOut()

    if (logoutError) {
      setError('Unable to sign out. Please try again.')
    } else {
      navigate('/admin/login', { replace: true })
    }
  }

  const filteredEnquiries = useMemo(() => {
    const query = search.trim().toLowerCase()

    return enquiries.filter(item => {
      const matchesStatus =
        filter === 'all' || item.status === filter

      const searchableText = [
        item.full_name,
        item.phone,
        item.email || '',
        item.service,
        item.property_location,
        item.details || '',
        item.attachment_name || '',
      ].join(' ').toLowerCase()

      const matchesSearch =
        !query || searchableText.includes(query)

      const submittedDate = new Date(item.created_at)
      const startOfToday = new Date()
      startOfToday.setHours(0, 0, 0, 0)

      const startOfWeek = new Date(startOfToday)
      startOfWeek.setDate(startOfWeek.getDate() - 6)

      const startOfMonth = new Date(
        startOfToday.getFullYear(),
        startOfToday.getMonth(),
        1
      )

      let matchesDate = true

      if (dateFilter === 'today') {
        matchesDate = submittedDate >= startOfToday
      } else if (dateFilter === 'week') {
        matchesDate = submittedDate >= startOfWeek
      } else if (dateFilter === 'month') {
        matchesDate = submittedDate >= startOfMonth
      }

      return matchesStatus && matchesSearch && matchesDate
    })
  }, [enquiries, filter, search, dateFilter])

  const counts = {
    total: enquiries.length,
    pending: enquiries.filter(item => item.status === 'pending').length,
    contacted: enquiries.filter(item => item.status === 'contacted').length,
    confirmed: enquiries.filter(item => item.status === 'confirmed').length,
    completed: enquiries.filter(item => item.status === 'completed').length,
    cancelled: enquiries.filter(item => item.status === 'cancelled').length,
  }

  const formatDate = (date: string) =>
    new Date(`${date}T00:00:00`).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })

  const formatDateTime = (date: string) =>
    new Date(date).toLocaleString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const formatFileSize = (size: number | null) => {
    if (!size) return 'File size unavailable'
    return `${(size / (1024 * 1024)).toFixed(2)} MB`
  }

  const getWhatsAppNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, '')
    return digits.startsWith('0') ? `234${digits.slice(1)}` : digits
  }

  const exportCSV = () => {
    if (filteredEnquiries.length === 0) {
      setError('There are no enquiries to export.')
      return
    }

    const headers = [
      'Customer Name',
      'Phone',
      'Email',
      'Email Notifications Enabled',
      'Service',
      'Location',
      'Preferred Date',
      'Details',
      'Attachment',
      'Status',
      'Submitted At',
    ]

    const escapeCSV = (value: string) =>
      `"${String(value).replace(/"/g, '""')}"`

    const rows = filteredEnquiries.map(item => [
      item.full_name,
      item.phone,
      item.email || '',
      item.email_notifications_enabled ? 'Yes' : 'No',
      item.service,
      item.property_location,
      item.preferred_date,
      item.details || '',
      item.attachment_name || 'None',
      item.status,
      item.created_at,
    ])

    const csv = [
      headers.map(escapeCSV).join(','),
      ...rows.map(row => row.map(escapeCSV).join(',')),
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csv], {
      type: 'text/csv;charset=utf-8;',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `SAMFEM-Enquiries-${new Date().toISOString().slice(0, 10)}.csv`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setSuccess('Enquiries exported successfully.')
  }

  const statCards = [
    {
      label: 'Total Enquiries',
      value: counts.total,
      icon: ClipboardList,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Pending',
      value: counts.pending,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Contacted',
      value: counts.contacted,
      icon: MessageCircle,
      color: 'bg-sky-50 text-sky-600',
    },
    {
      label: 'Confirmed',
      value: counts.confirmed,
      icon: CheckCircle,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Completed',
      value: counts.completed,
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Cancelled',
      value: counts.cancelled,
      icon: X,
      color: 'bg-red-50 text-red-600',
    },
  ]

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 md:px-8">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              SAMFEM Admin
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Cleaning Agency Management
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void fetchEnquiries()}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              type="button"
              onClick={() => void handleLogout()}
              className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="mb-7">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-blue-600">
            Management centre
          </p>
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Dashboard Overview
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Monitor customers, manage cleaning enquiries and track business progress.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {statCards.map(card => {
            const Icon = card.icon

            return (
              <div
                key={card.label}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-slate-500">
                    {card.label}
                  </span>
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${card.color}`}>
                    <Icon size={18} />
                  </span>
                </div>

                <p className="mt-3 text-2xl font-bold text-slate-900">
                  {card.value}
                </p>
              </div>
            )
          })}
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5 md:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Customer Enquiries
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Review requests, contact customers and manage their progress.
                </p>
              </div>

              <button
                type="button"
                onClick={exportCSV}
                disabled={filteredEnquiries.length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Download size={16} />
                Export CSV
              </button>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="search"
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                  placeholder="Search name, phone, service..."
                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="relative">
                <Filter
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  value={filter}
                  onChange={event => setFilter(event.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
                >
                  <option value="all">All statuses</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <CalendarDays
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  value={dateFilter}
                  onChange={event => setDateFilter(event.target.value as DateFilter)}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
                >
                  <option value="all">All dates</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 days</option>
                  <option value="month">This month</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-slate-500">
                Showing <strong>{filteredEnquiries.length}</strong> of{' '}
                <strong>{enquiries.length}</strong> enquiries
              </p>

              {(search || filter !== 'all' || dateFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('')
                    setFilter('all')
                    setDateFilter('all')
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="border-b border-red-100 bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="flex items-center justify-between gap-3 border-b border-green-100 bg-green-50 p-4 text-sm text-green-700"
            >
              <span>{success}</span>
              <button
                type="button"
                onClick={() => setSuccess('')}
                aria-label="Dismiss message"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {loading ? (
            <div className="p-12 text-center text-sm text-slate-500">
              <RefreshCw size={24} className="mx-auto mb-3 animate-spin text-blue-600" />
              Loading customer enquiries...
            </div>
          ) : filteredEnquiries.length === 0 ? (
            <div className="p-12 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                {search || filter !== 'all' || dateFilter !== 'all' ? (
                  <Search size={25} className="text-slate-400" />
                ) : (
                  <ClipboardList size={25} className="text-slate-400" />
                )}
              </span>

              <p className="mt-4 font-semibold text-slate-700">
                {enquiries.length === 0
                  ? 'No enquiries yet'
                  : 'No matching enquiries'}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {enquiries.length === 0
                  ? 'Customer enquiries will appear here when submitted.'
                  : 'Try changing your search or filter settings.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredEnquiries.map(item => {
                const whatsappNumber = getWhatsAppNumber(item.phone)

                const whatsappMessage = encodeURIComponent(
                  `Hello ${item.full_name}, thank you for contacting SAMFEM Cleaning Agency regarding ${item.service}. We are following up on your enquiry.`
                )

                return (
                  <article
                    key={item.id}
                    className="p-5 transition hover:bg-slate-50/70 md:p-6"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-slate-900">
                            {item.full_name}
                          </h4>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusStyles[item.status] || 'bg-slate-100 text-slate-600'}`}
                          >
                            {item.status}
                          </span>

                          {item.attachment_path && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                              <Paperclip size={12} />
                              Attachment
                            </span>
                          )}
                        </div>

                        <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                          <p className="flex items-center gap-2 break-all">
                            <Mail size={14} className="shrink-0 text-slate-400" />
                            {item.email || 'Email not provided'}
                          </p>
                          <p className="flex items-center gap-2">
                            <Phone size={14} className="shrink-0 text-slate-400" />
                            {item.phone}
                          </p>
                          <p className="flex items-center gap-2">
                            <ClipboardList size={14} className="shrink-0 text-slate-400" />
                            {item.service}
                          </p>
                          <p>
                            <strong>Location:</strong> {item.property_location}
                          </p>
                          <p>
                            <strong>Preferred date:</strong>{' '}
                            {formatDate(item.preferred_date)}
                          </p>
                        </div>

                        {item.details && (
                          <p className="mt-3 rounded-lg bg-slate-100 p-3 text-sm leading-6 text-slate-600">
                            {item.details}
                          </p>
                        )}

                        {item.attachment_path && (
                          <p className="mt-3 flex items-center gap-2 break-all text-xs text-indigo-700">
                            <FileText size={14} className="shrink-0" />
                            {item.attachment_name || 'Customer attachment'}
                          </p>
                        )}

                        <p className="mt-3 text-xs text-slate-400">
                          Submitted: {formatDateTime(item.created_at)}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 lg:w-48 lg:shrink-0 lg:flex-col">
                        <a
                          href={`tel:${item.phone}`}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 lg:flex-none"
                        >
                          <Phone size={15} />
                          Call
                        </a>

                        {item.email ? (
                          <a
                            href={`mailto:${item.email}`}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-200 px-3 py-2.5 text-xs font-bold text-blue-700 transition hover:bg-blue-50 lg:flex-none"
                          >
                            <Mail size={15} />
                            Email Customer
                          </a>
                        ) : (
                          <span className="text-center text-xs text-slate-400">
                            No email available
                          </span>
                        )}

                        <a
                          href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-green-700 lg:flex-none"
                        >
                          <MessageCircle size={15} />
                          WhatsApp
                        </a>

                        <button
                          type="button"
                          onClick={() => setSelectedEnquiry(item)}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-200 px-3 py-2.5 text-xs font-bold text-blue-700 transition hover:bg-blue-50 lg:flex-none"
                        >
                          <Eye size={15} />
                          View details
                        </button>

                        <select
                          value={item.status}
                          disabled={updatingId === item.id}
                          onChange={event =>
                            void updateStatus(item.id, event.target.value)
                          }
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold outline-none focus:border-blue-500 disabled:opacity-50"
                          aria-label={`Update status for ${item.full_name}`}
                        >
                          {statuses.map(status => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={() => void deleteEnquiry(item)}
                          disabled={deletingId === item.id}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 size={15} />
                          {deletingId === item.id ? 'Deleting...' : 'Delete enquiry'}
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>

        <div className="mt-6 flex flex-col items-center justify-between gap-2 text-xs text-slate-400 sm:flex-row">
          <AdminReviews />
          <p>SAMFEM Cleaning Agency · Administration</p>
          <p className="flex items-center gap-1">
            <Users size={13} />
            Secure management dashboard
          </p>
        </div>
      </div>

      {selectedEnquiry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          onClick={() => setSelectedEnquiry(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="enquiry-dialog-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
            onClick={event => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Enquiry details
                </p>
                <h3
                  id="enquiry-dialog-title"
                  className="mt-1 text-xl font-bold text-slate-900"
                >
                  {selectedEnquiry.full_name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close enquiry details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              {[
                ['Phone', selectedEnquiry.phone],
                ['Email', selectedEnquiry.email || 'Not provided'],
                ['Email notifications consent', selectedEnquiry.email_notifications_enabled ? 'Yes' : 'No'],
                ['Service', selectedEnquiry.service],
                ['Property location', selectedEnquiry.property_location],
                ['Preferred date', formatDate(selectedEnquiry.preferred_date)],
                ['Submitted', formatDateTime(selectedEnquiry.created_at)],
                ['Last updated', formatDateTime(selectedEnquiry.updated_at)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-col gap-1 border-b border-slate-100 pb-3"
                >
                  <span className="text-xs font-medium text-slate-400">
                    {label}
                  </span>
                  <span className="font-semibold text-slate-800">
                    {value}
                  </span>
                </div>
              ))}

              <div>
                <p className="text-xs font-medium text-slate-400">
                  Additional details
                </p>
                <p className="mt-2 rounded-lg bg-slate-50 p-3 leading-6 text-slate-700">
                  {selectedEnquiry.details || 'No additional details provided.'}
                </p>
              </div>

              {/* Customer attachment section */}
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
                <div className="flex items-center gap-2">
                  <Paperclip size={18} className="text-indigo-600" />
                  <h4 className="font-bold text-slate-800">
                    Customer Attachment
                  </h4>
                </div>

                {!selectedEnquiry.attachment_path ? (
                  <p className="mt-3 text-sm text-slate-500">
                    No file was attached to this enquiry.
                  </p>
                ) : (
                  <>
                    <div className="mt-3 flex items-start gap-3">
                      <FileText size={22} className="shrink-0 text-indigo-600" />
                      <div className="min-w-0">
                        <p className="break-all text-sm font-semibold text-slate-800">
                          {selectedEnquiry.attachment_name || 'Customer file'}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatFileSize(selectedEnquiry.attachment_size)}
                        </p>
                      </div>
                    </div>

                    {attachmentLoading && (
                      <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                        <RefreshCw size={15} className="animate-spin" />
                        Loading secure attachment...
                      </p>
                    )}

                    {attachmentError && (
                      <p className="mt-3 text-sm text-red-600">
                        {attachmentError}
                      </p>
                    )}

                    {attachmentUrl && (
                      <>
                        {selectedEnquiry.attachment_type?.startsWith('image/') && (
                          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white">
                            <img
                              src={attachmentUrl}
                              alt={selectedEnquiry.attachment_name || 'Customer attachment'}
                              className="max-h-80 w-full object-contain"
                            />
                          </div>
                        )}

                        {selectedEnquiry.attachment_type === 'application/pdf' && (
                          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white">
                            <iframe
                              src={attachmentUrl}
                              title="Customer PDF attachment"
                              className="h-80 w-full"
                            />
                          </div>
                        )}

                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <a
                            href={attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-white px-3 py-3 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100"
                          >
                            <ExternalLink size={15} />
                            Open file
                          </a>

                          <button
                            type="button"
                            onClick={() => void downloadAttachment(selectedEnquiry)}
                            disabled={downloading}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-3 text-xs font-bold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                          >
                            <Download size={15} />
                            {downloading ? 'Downloading...' : 'Download'}
                          </button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Custom customer email composer */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Mail size={18} className="text-blue-600" />
                  <h4 className="font-bold text-slate-800">Send customer email</h4>
                </div>

                {!selectedEnquiry.email ? (
                  <p className="text-sm text-slate-500">No customer email address is available.</p>
                ) : !selectedEnquiry.email_notifications_enabled ? (
                  <p className="text-sm text-amber-700">
                    This customer has not consented to email notifications.
                  </p>
                ) : (
                  <>
                    <p className="mb-3 break-all text-xs text-slate-500">
                      To: {selectedEnquiry.email}
                    </p>

                    <input
                      type="text"
                      value={emailSubject}
                      onChange={event => setEmailSubject(event.target.value)}
                      maxLength={200}
                      placeholder="Email subject"
                      className="mb-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500"
                    />

                    <textarea
                      value={emailMessage}
                      onChange={event => setEmailMessage(event.target.value)}
                      maxLength={5000}
                      rows={6}
                      placeholder="Write your quotation or service update..."
                      className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500"
                    />

                    <p className="mt-1 text-right text-xs text-slate-400">
                      {emailMessage.length}/5000 characters
                    </p>

                    <button
                      type="button"
                      onClick={() => void sendCustomEmail()}
                      disabled={sendingEmail || !emailSubject.trim() || !emailMessage.trim()}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Mail size={16} />
                      {sendingEmail ? 'Sending email...' : 'Send email'}
                    </button>
                  </>
                )}

                {emailError && (
                  <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {emailError}
                  </p>
                )}

                {emailSuccess && (
                  <p className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                    {emailSuccess}
                  </p>
                )}
              </div>

              {/* Customer email notification history */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h4 className="font-bold text-slate-800">Email history</h4>
                  <button
                    type="button"
                    onClick={() => void fetchEmailHistory(selectedEnquiry.id)}
                    disabled={emailHistoryLoading}
                    className="text-xs font-semibold text-blue-600 disabled:opacity-50"
                  >
                    Refresh
                  </button>
                </div>

                {emailHistoryLoading ? (
                  <p className="text-sm text-slate-500">Loading email history...</p>
                ) : emailHistory.length === 0 ? (
                  <p className="text-sm text-slate-500">No email notifications recorded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {emailHistory.map(item => (
                      <div key={item.id} className="rounded-lg bg-slate-50 p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-800">
                            {item.subject}
                          </p>
                          <span className={`rounded-full px-2 py-1 text-xs font-bold ${
                            item.status === 'sent'
                              ? 'bg-green-100 text-green-700'
                              : item.status === 'failed'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-700'
                          }`}>
                            {item.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="mt-1 break-all text-xs text-slate-500">
                          To: {item.recipient}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Type: {item.notification_type}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {formatDateTime(item.sent_at || item.created_at)}
                        </p>
                        {item.error_message && (
                          <p className="mt-2 text-xs text-red-600">
                            {item.error_message}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <p className="mb-2 text-xs font-medium text-slate-400">
                  Enquiry status
                </p>

                <select
                  value={selectedEnquiry.status}
                  disabled={updatingId === selectedEnquiry.id}
                  onChange={event =>
                    void updateStatus(selectedEnquiry.id, event.target.value)
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {selectedEnquiry.email && (
                <a
                  href={`mailto:${selectedEnquiry.email}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700"
                >
                  <Mail size={17} />
                  Email
                </a>
              )}

              <a
                href={`https://wa.me/${getWhatsAppNumber(selectedEnquiry.phone)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-bold text-white hover:bg-green-700"
              >
                <MessageCircle size={17} />
                WhatsApp
              </a>

              <button
                type="button"
                onClick={() => void deleteEnquiry(selectedEnquiry)}
                disabled={deletingId === selectedEnquiry.id}
                className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 size={17} />
                Delete
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}
