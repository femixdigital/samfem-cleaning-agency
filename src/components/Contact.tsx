import { useState, type FormEvent } from 'react'
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Paperclip,
  FileText,
  X,
} from 'lucide-react'
import { supabase } from '../lib/supabase'

const MAX_FILE_SIZE = 20 * 1024 * 1024

const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [submittedWhatsappUrl, setSubmittedWhatsappUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const today = new Date()

  const minDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  )
    .toISOString()
    .split('T')[0]

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null

    if (!file) {
      setSelectedFile(null)
      return
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setSubmitMessage(
        'Unsupported file type. Please select JPG, PNG, WEBP or PDF.'
      )
      event.target.value = ''
      setSelectedFile(null)
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setSubmitMessage('File is too large. Maximum allowed size is 20 MB.')
      event.target.value = ''
      setSelectedFile(null)
      return
    }

    setSubmitMessage('')
    setSelectedFile(file)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSubmitting) return
    setSubmittedWhatsappUrl('')

    const form = event.currentTarget
    const formData = new FormData(form)

    const enquiry = {
      full_name: String(formData.get('name') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      service: String(formData.get('service') || ''),
      property_location: String(formData.get('location') || '').trim(),
      preferred_date: String(formData.get('date') || ''),
      details: String(formData.get('details') || '').trim() || null,
    }

    const whatsappMessage = `Hello SAMFEM Cleaning Agency!

I would like to request a cleaning service.

Full Name: ${enquiry.full_name}
Phone Number: ${enquiry.phone}
Cleaning Service: ${enquiry.service}
Property Location: ${enquiry.property_location}
Preferred Cleaning Date: ${enquiry.preferred_date}
Additional Details: ${enquiry.details || 'None'}
Attachment: ${selectedFile ? selectedFile.name : 'None'}

Please let me know the available options and quotation. Thank you.`

    const whatsappUrl =
      `https://wa.me/2349132915450?text=${encodeURIComponent(whatsappMessage)}`

    setIsSubmitting(true)
    setSubmitMessage('Preparing your enquiry...')

    try {
      let attachmentPath: string | null = null
      let attachmentName: string | null = null
      let attachmentType: string | null = null
      let attachmentSize: number | null = null

      if (selectedFile) {
        setSubmitMessage('Uploading your attachment...')

        const safeFileName = selectedFile.name
          .replace(/[^a-zA-Z0-9._-]/g, '_')
          .slice(-150)

        const filePath =
          `public-enquiries/${crypto.randomUUID()}-${safeFileName}`

        const { error: uploadError } = await supabase.storage
          .from('enquiry-attachments')
          .upload(filePath, selectedFile, {
            contentType: selectedFile.type,
            upsert: false,
          })

        if (uploadError) {
          throw new Error(
            `Attachment upload failed: ${uploadError.message}`
          )
        }

        attachmentPath = filePath
        attachmentName = selectedFile.name
        attachmentType = selectedFile.type
        attachmentSize = selectedFile.size
      }

      setSubmitMessage('Saving your enquiry...')

      const { error } = await supabase
        .from('enquiries')
        .insert({
          ...enquiry,
          attachment_path: attachmentPath,
          attachment_name: attachmentName,
          attachment_type: attachmentType,
          attachment_size: attachmentSize,
        })

      if (error) {
        throw new Error(`Unable to save enquiry: ${error.message}`)
      }

      setSelectedFile(null)
      form.reset()
      setSubmitMessage('')
      setSubmittedWhatsappUrl(whatsappUrl)

    } catch (error) {
      console.error('Enquiry submission error:', error)

      setSubmitMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="bg-white px-4 py-14 md:px-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-9 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Get Started
          </span>

          <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
            Request Your Cleaning Quote
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
            Tell us what you need cleaned, and contact SAMFEM to discuss
            your cleaning requirements.
          </p>
        </div>

        <div className="grid items-start gap-8 md:grid-cols-2">

          {/* Contact Information */}
          <div className="rounded-2xl bg-slate-50 p-6 md:p-8">

            <h3 className="text-xl font-bold text-slate-900">
              Let's Talk About Your Cleaning Needs
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Have questions or need more information? Reach out to SAMFEM
              using any of the contact details below.
            </p>

            <div className="mt-7 space-y-6">

              <a
                href="tel:09132915450"
                className="flex items-center gap-4 rounded-lg transition hover:text-blue-600"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Phone size={20} />
                </span>

                <span>
                  <span className="block text-xs text-slate-500">
                    Call Us
                  </span>

                  <span className="mt-1 block text-sm font-semibold text-slate-800">
                    09132915450
                  </span>
                </span>
              </a>

              <a
                href="mailto:Itzsamfem@gmail.com"
                className="flex items-center gap-4 transition hover:text-blue-600"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Mail size={20} />
                </span>

                <span className="min-w-0">
                  <span className="block text-xs text-slate-500">
                    Email Us
                  </span>

                  <span className="mt-1 block break-all text-sm font-semibold text-slate-800">
                    Itzsamfem@gmail.com
                  </span>
                </span>
              </a>

              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <MapPin size={20} />
                </span>

                <span>
                  <span className="block text-xs text-slate-500">
                    Location
                  </span>

                  <span className="mt-1 block text-sm font-semibold text-slate-800">
                    Alagbaka, Akure, Ondo State
                  </span>
                </span>
              </div>

            </div>

            <a
              href="https://wa.me/2349132915450?text=Hello%20SAMFEM%20Cleaning%20Agency!%20I%20would%20like%20to%20make%20an%20enquiry."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700"
            >
              <MessageCircle size={19} />
              Chat with Us on WhatsApp
            </a>

          </div>

          {/* Booking Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
          >

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Cleaning Enquiry Form
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Complete the fields below to submit your cleaning enquiry.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <div>
                <label
                  htmlFor="customer-name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Full Name *
                </label>

                <input
                  id="customer-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="customer-phone"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Phone Number *
                </label>

                <input
                  id="customer-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  minLength={10}
                  maxLength={15}
                  pattern="[0-9+ ]{10,15}"
                  title="Enter a valid phone number using 10 to 15 digits, spaces or a plus sign."
                  placeholder="e.g. 08012345678"
                  className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

            </div>

            <div>
              <label
                htmlFor="cleaning-service"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Cleaning Service *
              </label>

              <select
                id="cleaning-service"
                name="service"
                required
                defaultValue=""
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="" disabled>
                  Select the service you need
                </option>

                <option>Residential Cleaning</option>
                <option>Office & Commercial Cleaning</option>
                <option>Post-Construction Cleaning</option>
                <option>Move-In / Move-Out Cleaning</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="property-location"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Property Location *
              </label>

              <input
                id="property-location"
                name="location"
                type="text"
                autoComplete="street-address"
                required
                placeholder="Enter the area or property address"
                className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="cleaning-date"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Preferred Cleaning Date *
              </label>

              <input
                id="cleaning-date"
                name="date"
                type="date"
                required
                min={minDate}
                className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="additional-details"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Additional Details{' '}
                <span className="font-normal text-slate-400">
                  (Optional)
                </span>
              </label>

              <textarea
                id="additional-details"
                name="details"
                rows={4}
                placeholder="For example: property size, number of rooms or specific cleaning requirements..."
                className="w-full resize-y rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* File Attachment */}
            <div>
              <label
                htmlFor="enquiry-attachment"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Attach Photos or Documents{' '}
                <span className="font-normal text-slate-400">
                  (Optional)
                </span>
              </label>

              <label
                htmlFor="enquiry-attachment"
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-blue-500 hover:bg-blue-50"
              >
                <Paperclip className="mb-2 text-blue-600" size={25} />

                <span className="text-sm font-semibold text-slate-700">
                  Choose a file to attach
                </span>

                <span className="mt-1 text-xs text-slate-500">
                  JPG, PNG, WEBP or PDF · Maximum 20 MB
                </span>

                <input
                  id="enquiry-attachment"
                  name="attachment"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>

              {selectedFile && (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <FileText size={20} className="shrink-0 text-blue-600" />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {selectedFile.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null)
                      const input = document.getElementById(
                        'enquiry-attachment'
                      ) as HTMLInputElement | null

                      if (input) input.value = ''
                    }}
                    className="shrink-0 rounded-lg p-2 text-slate-500 transition hover:bg-red-100 hover:text-red-600"
                    aria-label="Remove attachment"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing your enquiry...
                </>
              ) : (
                <>
                  Submit Enquiry
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {isSubmitting && (
              <div
                role="status"
                aria-live="polite"
                className="rounded-lg bg-blue-50 p-3 text-center text-sm font-medium text-blue-700"
              >
                <Loader2 size={18} className="mr-2 inline animate-spin" />
                {submitMessage || 'Please wait while we process your enquiry...'}
              </div>
            )}

            {submitMessage && !isSubmitting && (
              <p role="alert" className="break-words text-center text-sm text-red-600">
                {submitMessage}
              </p>
            )}

            {submittedWhatsappUrl && (
              <div
                role="status"
                aria-live="polite"
                className="space-y-4 rounded-xl border border-green-200 bg-green-50 p-5"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={28} className="shrink-0 text-green-600" />
                  <div>
                    <h4 className="font-bold text-green-800">
                      Enquiry submitted successfully!
                    </h4>
                    <p className="mt-1 text-sm text-green-700">
                      Your enquiry has been saved securely. You can now continue to WhatsApp to send your message.
                    </p>
                  </div>
                </div>

                <a
                  href={submittedWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.45 0 .09 5.36.09 11.95c0 2.11.55 4.17 1.6 5.99L0 24l6.22-1.63a11.94 11.94 0 0 0 5.81 1.48h.01c6.59 0 11.95-5.36 11.95-11.95 0-3.2-1.25-6.21-3.47-8.42ZM12.04 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.69.97.98-3.6-.23-.37a9.9 9.9 0 0 1-1.52-5.26c0-5.47 4.45-9.92 9.93-9.92 2.65 0 5.14 1.03 7.01 2.91a9.87 9.87 0 0 1 2.9 7.02c0 5.47-4.45 9.92-9.97 9.92Zm5.45-7.43c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.08 4.5.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.08-.12-.27-.2-.57-.35Z" />
                  </svg>
                  Continue to WhatsApp
                  <ArrowRight size={18} />
                </a>
              </div>
            )}

            <p className="text-center text-xs leading-5 text-slate-500">
              Your enquiry and any attachment will be saved securely first. After successful submission, you can choose to continue to WhatsApp and send your message to SAMFEM. Your cleaning booking is confirmed only after SAMFEM responds.
            </p>

          </form>

        </div>
      </div>
    </section>
  )
}

export default Contact
