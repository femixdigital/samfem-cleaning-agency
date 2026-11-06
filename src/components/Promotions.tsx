import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react'

const Promotions = () => {
  return (
    <section className="bg-white px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-slate-900 px-6 py-8 text-white shadow-md md:px-10 md:py-10">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-100">
                <Sparkles size={14} />
                SAMFEM Cleaning Agency
              </span>

              <h2 className="mt-4 text-2xl font-bold leading-tight md:text-3xl">
                A Cleaner Space.
                <br />
                A Fresher Life.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100">
                Professional cleaning for homes, offices and commercial spaces.
                Let SAMFEM help you enjoy a cleaner, fresher environment.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
              >
                Request a Quote
                <ArrowRight size={17} />
              </a>

              <a
                href="https://wa.me/2349132915450?text=Hello%20SAMFEM%20Cleaning%20Agency!%20I%20would%20like%20to%20make%20an%20enquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/40 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <MessageCircle size={17} />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Promotions
