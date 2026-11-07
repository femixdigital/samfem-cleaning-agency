import { useEffect, useState } from 'react'
import {
  ArrowRight,
  MessageCircle,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import residential from '../assets/gallery/samfem-residential-cleaning.jpg'
import office from '../assets/gallery/samfem-office-cleaning.jpg'
import construction from '../assets/gallery/samfem-post-construction-cleaning.jpg'
import moveOut from '../assets/gallery/samfem-move-in-move-out-cleaning.jpg'

const slides = [
  {
    image: residential,
    eyebrow: 'PROFESSIONAL CLEANING SERVICES',
    title: 'A Cleaner Space.',
    highlight: 'A Fresher Life.',
    description:
      'From homes and offices to post-construction and move-in cleaning, SAMFEM helps make your spaces cleaner, fresher and more comfortable.',
    alt: 'SAMFEM cleaning service presentation',
  },
  {
    image: office,
    eyebrow: 'OFFICE & COMMERCIAL CLEANING',
    title: 'A Cleaner Workplace.',
    highlight: 'A Better Environment.',
    description:
      'Keep your office and commercial spaces neat, fresh and welcoming with professional cleaning.',
    alt: 'Office cleaning service',
  },
  {
    image: construction,
    eyebrow: 'POST-CONSTRUCTION CLEANING',
    title: 'From Construction.',
    highlight: 'To Clean Perfection.',
    description:
      'Prepare newly constructed or renovated spaces for use with post-construction cleaning.',
    alt: 'Post-construction cleaning service',
  },
  {
    image: moveOut,
    eyebrow: 'MOVE-IN / MOVE-OUT CLEANING',
    title: 'A Fresh Start.',
    highlight: 'A Cleaner Move.',
    description:
      'Make your next move more comfortable with cleaning for spaces you are moving into or leaving.',
    alt: 'Move-in and move-out cleaning service',
  },
]

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const activeSlide = slides[activeIndex]

  useEffect(() => {
    if (isPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [isPaused])

  const previousSlide = () => {
    setActiveIndex((current) =>
      current === 0 ? slides.length - 1 : current - 1
    )
  }

  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % slides.length)
  }

  return (
    <section
      id="home"
      className="overflow-hidden bg-slate-50 px-4 py-12 md:px-8 md:py-16"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2">
        <div>
          <span
            key={activeSlide.eyebrow}
            className="hero-fade mb-4 inline-flex rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold tracking-wide text-blue-700"
          >
            {activeSlide.eyebrow}
          </span>

          <h1
            key={activeSlide.title}
            className="hero-fade max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl"
          >
            {activeSlide.title}
            <span className="block text-blue-600">
              {activeSlide.highlight}
            </span>
          </h1>

          <p
            key={activeSlide.description}
            className="hero-fade mt-5 max-w-lg text-sm leading-7 text-slate-600 md:text-base"
          >
            {activeSlide.description}
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

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden rounded-2xl shadow-xl">
            <img
              key={activeSlide.image}
              src={activeSlide.image}
              alt={activeSlide.alt}
              loading="eager"
              decoding="async"
              fetchPriority={activeIndex === 0 ? 'high' : 'auto'}
              className="hero-fade h-64 w-full object-cover sm:h-80 md:h-[420px]"
            />

            <div className="absolute inset-x-0 bottom-0 h-24 rounded-b-2xl bg-gradient-to-t from-slate-950/50 to-transparent" />

            <div className="absolute bottom-5 left-4 text-white">
              <p className="text-sm font-bold">SAMFEM Cleaning Agency</p>
              <p className="mt-1 text-xs text-white/90">
                Sparkle & Freshness Guaranteed!
              </p>
            </div>

            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <button
                type="button"
                onClick={previousSlide}
                aria-label="Previous slide"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow transition hover:bg-white"
              >
                <ChevronLeft size={21} />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next slide"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow transition hover:bg-white"
              >
                <ChevronRight size={21} />
              </button>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.eyebrow}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show slide ${index + 1}: ${slide.eyebrow}`}
                aria-pressed={activeIndex === index}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? 'w-7 bg-blue-600'
                    : 'w-2.5 bg-slate-300 hover:bg-blue-400'
                }`}
              />
            ))}
          </div>

          <div className="absolute -bottom-4 left-4 -z-10 h-20 w-20 rounded-full bg-blue-200/60 blur-2xl" />
        </div>
      </div>
    </section>
  )
}

export default Hero
