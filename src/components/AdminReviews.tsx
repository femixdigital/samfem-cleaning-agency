import { useCallback, useEffect, useState } from 'react'
import { CheckCircle, Clock, Loader2, Star, Trash2, XCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

type CustomerReview = {
  id: string
  customer_name: string
  service_name: string
  rating: number
  review_text: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

const filters = ['all', 'pending', 'approved', 'rejected'] as const

export default function AdminReviews() {
  const [reviews, setReviews] = useState<CustomerReview[]>([])
  const [filter, setFilter] = useState<(typeof filters)[number]>('pending')
  const [loading, setLoading] = useState(true)
  const [workingId, setWorkingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    setError('')

    const { data, error: fetchError } = await supabase
      .from('customer_reviews')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError('Unable to load customer reviews. Please refresh.')
    } else {
      setReviews((data || []) as CustomerReview[])
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    void fetchReviews()
  }, [fetchReviews])

  const updateStatus = async (
    review: CustomerReview,
    status: 'approved' | 'rejected',
  ) => {
    setWorkingId(review.id)
    setError('')
    setSuccess('')

    const { error: updateError } = await supabase
      .from('customer_reviews')
      .update({
        status,
        approved_at: status === 'approved' ? new Date().toISOString() : null,
      })
      .eq('id', review.id)

    if (updateError) {
      setError('Unable to update this review. Please try again.')
    } else {
      setSuccess(
        status === 'approved'
          ? 'Review approved and published.'
          : 'Review rejected.',
      )
      await fetchReviews()
    }

    setWorkingId(null)
  }

  const deleteReview = async (review: CustomerReview) => {
    const confirmed = window.confirm(
      `Permanently delete the review submitted by ${review.customer_name}?`,
    )

    if (!confirmed) return

    setWorkingId(review.id)
    setError('')
    setSuccess('')

    const { error: deleteError } = await supabase
      .from('customer_reviews')
      .delete()
      .eq('id', review.id)

    if (deleteError) {
      setError('Unable to delete this review. Please try again.')
    } else {
      setSuccess('Review deleted.')
      await fetchReviews()
    }

    setWorkingId(null)
  }

  const visibleReviews =
    filter === 'all'
      ? reviews
      : reviews.filter(review => review.status === filter)

  const counts = {
    all: reviews.length,
    pending: reviews.filter(review => review.status === 'pending').length,
    approved: reviews.filter(review => review.status === 'approved').length,
    rejected: reviews.filter(review => review.status === 'rejected').length,
  }

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5 md:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Customer Reviews
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Verify customer feedback before publishing it on the website.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void fetchReviews()}
            disabled={loading}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Refresh reviews
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {filters.map(item => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition ${
                filter === item
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item} ({counts[item]})
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 md:p-6">
        {error && (
          <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {success && (
          <p role="status" className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {success}
          </p>
        )}

        {loading ? (
          <div className="flex items-center gap-2 py-8 text-sm text-slate-500">
            <Loader2 size={18} className="animate-spin" />
            Loading reviews...
          </div>
        ) : visibleReviews.length === 0 ? (
          <div className="rounded-xl bg-slate-50 py-10 text-center">
            <Clock className="mx-auto mb-3 text-slate-400" size={28} />
            <p className="font-semibold text-slate-700">
              No {filter === 'all' ? '' : filter} reviews
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Customer submissions will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {visibleReviews.map(review => (
              <article
                key={review.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900">
                      {review.customer_name}
                    </h4>
                    <p className="mt-1 text-xs text-slate-500">
                      {review.service_name} ·{' '}
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      review.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : review.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {review.status}
                  </span>
                </div>

                <div className="mt-3 flex gap-1">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      size={16}
                      className={
                        index < review.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }
                    />
                  ))}
                </div>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {review.review_text}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                  {review.status !== 'approved' && (
                    <button
                      type="button"
                      disabled={workingId === review.id}
                      onClick={() => void updateStatus(review, 'approved')}
                      className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      <CheckCircle size={15} />
                      Approve & publish
                    </button>
                  )}

                  {review.status !== 'rejected' && (
                    <button
                      type="button"
                      disabled={workingId === review.id}
                      onClick={() => void updateStatus(review, 'rejected')}
                      className="inline-flex items-center gap-2 rounded-lg bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-200 disabled:opacity-50"
                    >
                      <XCircle size={15} />
                      Reject
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={workingId === review.id}
                    onClick={() => void deleteReview(review)}
                    className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>

                  {workingId === review.id && (
                    <Loader2 size={17} className="animate-spin text-slate-500" />
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
