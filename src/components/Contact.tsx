import { MapPin, Phone, Mail, MessageCircle, ArrowRight } from 'lucide-react'

const Contact = () => {
  const today = new Date()
  const minDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  )
    .toISOString()
    .split('T')[0]

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const message = `
Hello SAMFEM Cleaning Agency!

I would like to request a cleaning service.

Full Name: ${formData.get('name')}
Phone Number: ${formData.get('phone')}
Cleaning Service: ${formData.get('service')}
Property Location: ${formData.get('location')}
Preferred Cleaning Date: ${formData.get('date')}
Additional Details: ${formData.get('details') || 'None'}

Please let me know the available options and quotation. Thank you.
    `

    const whatsappUrl = `https://wa.me/2349132915450?text=${encodeURIComponent(message)}`

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
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
                  <span className="block text-xs text-slate-500">Call Us</span>
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
                  <span className="block text-xs text-slate-500">Email Us</span>
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
                  <span className="block text-xs text-slate-500">Location</span>
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
                Complete the fields below to prepare your WhatsApp enquiry.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <div>
                <label htmlFor="customer-name" className="mb-2 block text-sm font-semibold text-slate-700">
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
                <label htmlFor="customer-phone" className="mb-2 block text-sm font-semibold text-slate-700">
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
              <label htmlFor="cleaning-service" className="mb-2 block text-sm font-semibold text-slate-700">
                Cleaning Service *
              </label>
              <select
                id="cleaning-service"
                name="service"
                required
                defaultValue=""
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="" disabled>Select the service you need</option>
                <option>Residential Cleaning</option>
                <option>Office & Commercial Cleaning</option>
                <option>Post-Construction Cleaning</option>
                <option>Move-In / Move-Out Cleaning</option>
              </select>
            </div>

            <div>
              <label htmlFor="property-location" className="mb-2 block text-sm font-semibold text-slate-700">
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
              <label htmlFor="cleaning-date" className="mb-2 block text-sm font-semibold text-slate-700">
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
              <label htmlFor="additional-details" className="mb-2 block text-sm font-semibold text-slate-700">
                Additional Details <span className="font-normal text-slate-400">(Optional)</span>
              </label>
              <textarea
                id="additional-details"
                name="details"
                rows={4}
                placeholder="For example: property size, number of rooms or specific cleaning requirements..."
                className="w-full resize-y rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
            >
              Continue to WhatsApp
              <ArrowRight size={18} />
            </button>

            <p className="text-center text-xs leading-5 text-slate-500">
              Your enquiry will open in WhatsApp for you to send. Your
              cleaning booking is confirmed only after SAMFEM responds.
            </p>
          </form>

        </div>
      </div>
    </section>
  )
}

export default Contact
