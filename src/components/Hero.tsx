import { ArrowRight, MessageCircle, MapPin } from 'lucide-react'
import heroImage from '../assets/hero.png'

const Hero = () => {
  return (
    <section
      id="home"
      className="overflow-hidden bg-slate-50 px-4 py-12 md:px-8 md:py-16"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2">

        <div>
          <span className="mb-4 inline-flex rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold tracking-wide text-blue-700">
            PROFESSIONAL CLEANING SERVICES
          </span>

          <h1 className="max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
            A Cleaner Space.
            <span className="block text-blue-600">
              A Fresher Life.
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-sm leading-7 text-slate-600 md:text-base">
            From homes and offices to post-construction and move-in cleaning,
            SAMFEM helps make your spaces cleaner, fresher and more comfortable.
          </p>

          <div className="mt-5 flex items-center gap-2 text-sm font-medium text-slate-600">
            <MapPin size={18} className="shrink-0 text-blue-600" />
            Alagbaka, Akure, Ondo State
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-blue-700"
            >
              Request a Quote
              <ArrowRight size={17} />
            </a>

            <a
              href="https://wa.me/2349132915450?text=Hello%20SAMFEM%20Cleaning%20Agency!%20I%20would%20like%20to%20enquire%20about%20your%20cleaning%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-green-600 bg-white px-5 py-3 text-sm font-bold text-green-700 transition hover:bg-green-50"
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
            </a>
          </div>

          <p className="mt-6 text-xs font-medium text-slate-500">
            Residential • Office • Commercial • Post-Construction Cleaning
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl shadow-xl">
            <img
              src={heroImage}
              alt="Cleaning service presentation for SAMFEM Cleaning Agency"
              className="h-64 w-full object-cover sm:h-80 md:h-[420px]"
            />
          </div>

          <div className="absolute -bottom-4 left-4 rounded-xl bg-white px-4 py-3 shadow-lg">
            <p className="text-sm font-bold text-slate-900">
              SAMFEM Cleaning Agency
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Sparkle & Freshness Guaranteed!
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Hero
