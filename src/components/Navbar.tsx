import { useEffect, useState } from 'react'
import {
  Menu,
  X,
  ArrowRight,
  Sun,
  Moon,
  ShieldCheck,
} from 'lucide-react'
import samfemLogo from '../assets/samfem-logo.webp'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light'

    return window.localStorage.getItem('samfem-theme') === 'dark'
      ? 'dark'
      : 'light'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('samfem-theme', theme)
  }, [theme])

  const closeMenu = () => setMenuOpen(false)

  const toggleTheme = () =>
    setTheme(current => current === 'light' ? 'dark' : 'light')

  const adminLoginHref = `${import.meta.env.BASE_URL}admin/login`

  const links = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'About', href: '#about' },
    { name: 'Payment', href: '#payment' },
    { name: 'Contact', href: '#contact' },
  ]

  const ThemeButton = () => (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
      <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
    </button>
  )

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-8">

        <a
          href="#home"
          onClick={closeMenu}
          className="flex shrink-0 items-center"
          aria-label="SAMFEM Cleaning Agency home"
        >
          <img
            src={samfemLogo}
            alt="SAMFEM Cleaning Agency"
            className="h-12 w-auto object-contain"
          />
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {links.map(link => (
            <a
              key={link.name}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <ThemeButton />

          <a
            href={adminLoginHref}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          >
            <ShieldCheck size={16} />
            Admin Login
          </a>

          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
          >
            Get a Quote <ArrowRight size={16} />
          </a>
        </div>

        {/* Mobile and Tablet Controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeButton />

          <button
            type="button"
            onClick={() => setMenuOpen(current => !current)}
            className="rounded-lg p-2 text-slate-800 transition hover:bg-slate-100"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>
      </nav>

      {/* Mobile and Tablet Dropdown */}
      {menuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-slate-100 bg-white px-4 py-4 shadow-lg lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map(link => (
              <a
                key={link.name}
                href={link.href}
                onClick={closeMenu}
                className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
              >
                {link.name}
              </a>
            ))}

            <a
              href={adminLoginHref}
              onClick={closeMenu}
              className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            >
              <ShieldCheck size={17} />
              Admin Login
            </a>

            <a
              href="#contact"
              onClick={closeMenu}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Get a Quote <ArrowRight size={16} />
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
