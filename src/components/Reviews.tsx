import { useEffect, useState, type FormEvent } from 'react'
import { CheckCircle2, Loader2, Send, Star } from 'lucide-react'
import { supabase } from '../lib/supabase'

type CustomerReview = {
  id: string
  customer_name: string
  service_name: string
  rating: number
  review_text: string
  created_at: string
}

export default function Reviews() {
  const [reviews, setReviews] = useState<CustomerReview[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [serviceName, setServiceName] = useState('')
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [consent, setConsent] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('customer_reviews')
        .select('id, customer_name, service_name, rating, review_text, created_at')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(12)

      if (!error) {
        setReviews((data || []) as CustomerReview[])
      }

      setLoading(false)
    }

    void fetchReviews()
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!consent) {
      setError('Please agree to the publication of your review.')
      return
    }

    setSubmitting(true)

    const { error: submitError } = await supabase
      .from('customer_reviews')
      .insert({
        customer_name: customerName.trim(),
        service_name: serviceName.trim(),
        rating,
        review_text: reviewText.trim(),
        publish_consent: true,
        status: 'pending',
      })

    setSubmitting(false)

    if (submitError) {
      setError('Your review could not be submitted. Please try again.')
      return
    }

    setCustomerName('')
    setServiceName('')
    setRating(5)
    setReviewText('')
    setConsent(false)
    setMessage('Thank you! Your review has been submitted for approval.')
  }

  return (
    <section id="customer-reviews" className="bg-slate-50 py-16 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            Customer feedback
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            Your Experience Matters
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Have you used SAMFEM Cleaning Agency? Share your honest experience
            and help others make informed decisions.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="mb-5 text-xl font-bold text-slate-900 dark:text-white">
              Customer Reviews
            </h3>

            {loading ? (
              <div className="flex items-center gap-2 py-8 text-sm text-slate-500">
                <Loader2 className="animate-spin" size={18} />
                Loading customer reviews...
              </div>
            ) : reviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-7 dark:border-slate-700 dark:bg-slate-900">
                <Star className="mb-3 text-amber-500" size={28} />
                <h4 className="font-bold text-slate-900 dark:text-white">
                  Be our first reviewer
                </h4>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  We are inviting customers to share their genuine experiences.
                  Published reviews will appear here after verification.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map(review => (
                  <article
                    key={review.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="mb-3 flex gap-1" aria-label={`${review.rating} out of 5 stars`}>
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star
                          key={index}
                          size={17}
                          className={
                            index < review.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }
                        />
                      ))}
                    </div>

                    <p className="text-sm leading-7 text-slate-700 dark:text-slate-200">
                      “{review.review_text}”
                    </p>

                    <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
                      <p className="font-bold text-slate-900 dark:text-white">
                        {review.customer_name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {review.service_name}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Share Your Review
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Tell us about a service you have actually received.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="review-name" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Your name
                </label>
                <input
                  id="review-name"
                  required
                  minLength={2}
                  maxLength={80}
                  value={customerName}
                  onChange={event => setCustomerName(event.target.value)}
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="review-service" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Service received
                </label>
                <input
                  id="review-service"
                  required
                  minLength={2}
                  maxLength={120}
                  value={serviceName}
                  onChange={event => setServiceName(event.target.value)}
                  placeholder="e.g. Residential cleaning"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Your rating
                </span>
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }, (_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setRating(index + 1)}
                      aria-label={`Rate ${index + 1} out of 5`}
                      aria-pressed={rating === index + 1}
                      className="rounded-md p-1 transition hover:scale-110"
                    >
                      <Star
                        size={29}
                        className={
                          index < rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-slate-500">
                    {rating}/5
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="review-text" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Your experience
                </label>
                <textarea
                  id="review-text"
                  required
                  minLength={20}
                  maxLength={1000}
                  rows={5}
                  value={reviewText}
                  onChange={event => setReviewText(event.target.value)}
                  placeholder="Describe your genuine experience with our service..."
                  className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <p className="mt-1 text-right text-xs text-slate-400">
                  {reviewText.length}/1000
                </p>
              </div>

              <label className="flex items-start gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={event => setConsent(event.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-blue-600"
                />
                I confirm this review reflects my genuine experience and
                consent to SAMFEM publishing it after approval.
              </label>

              {error && (
                <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
                  {error}
                </p>
              )}

              {message && (
                <p role="status" className="flex items-start gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-300">
                  <CheckCircle2 size={18} className="shrink-0" />
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>

              <p className="text-xs leading-5 text-slate-400">
                Reviews are checked by our team before they become publicly visible.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
