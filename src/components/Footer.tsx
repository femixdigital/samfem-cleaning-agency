import samfemLogo from '../assets/samfem-logo.webp'
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react'

const Footer = () => {
  const adminLoginHref = `${import.meta.env.BASE_URL}admin/login`

  return (
    <footer className="bg-slate-950 px-4 py-10 text-white md:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <img
            src={samfemLogo}
            alt="SAMFEM Cleaning Agency"
            className="h-14 w-auto max-w-[220px] object-contain object-left"
          />

          <p className="mt-4 text-sm text-slate-400">
            Sparkle & Freshness Guaranteed!
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Quick Links</h3>

          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#payment">Payment</a>
            <a href="#contact">Contact</a>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">Contact Us</h3>

          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
            <a href="tel:09132915450" className="flex items-center gap-2">
              <Phone size={15} /> 09132915450
            </a>

            <a
              href="mailto:Itzsamfem@gmail.com"
              className="flex items-center gap-2"
            >
              <Mail size={15} /> Itzsamfem@gmail.com
            </a>

            <p className="flex items-center gap-2">
              <MapPin size={15} /> Alagbaka, Akure, Ondo State
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">Get in Touch</h3>

          <p className="mt-3 text-sm text-slate-400">
            Ready for a cleaner space?
          </p>

          <a
            href="https://wa.me/2349132915450"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold hover:bg-green-700"
          >
            <MessageCircle size={17} /> WhatsApp Us
          </a>
        </div>
      </div>

      <div className="mx-auto mt-8 flex flex-col items-center gap-4 border-t border-slate-800 pt-5 text-center">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} SAMFEM Cleaning Agency. All rights reserved.
        </p>

        <a
          href={adminLoginHref}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-blue-500 hover:bg-blue-600 hover:text-white"
        >
          <ShieldCheck size={17} />
          Admin Login
        </a>
      </div>
    </footer>
  )
}

export default Footer
