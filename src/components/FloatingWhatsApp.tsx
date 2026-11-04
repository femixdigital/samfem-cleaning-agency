import { Phone } from 'lucide-react'

const FloatingWhatsApp = () => {
  return (
    <div className="fixed bottom-6 right-5 z-50 flex items-center gap-3">
      <a
        href="tel:09132915450"
        aria-label="Call SAMFEM Cleaning Agency"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:scale-110 hover:bg-blue-700"
      >
        <Phone size={25} />
      </a>

      <a
        href="https://wa.me/2349132915450"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with SAMFEM on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-110 hover:bg-[#20BA5A]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="32"
          height="32"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M16.04 3C8.88 3 3.06 8.8 3.06 15.94c0 2.28.6 4.5 1.74 6.47L3 29l6.78-1.77a13 13 0 0 0 6.25 1.59h.01C23.18 28.82 29 23.02 29 15.9 29 8.78 23.18 3 16.04 3Zm0 23.65h-.01a10.7 10.7 0 0 1-5.45-1.49l-.39-.23-4.03 1.05 1.08-3.93-.25-.4a10.65 10.65 0 0 1-1.64-5.71c0-5.9 4.8-10.7 10.7-10.7 2.85 0 5.53 1.11 7.55 3.13a10.62 10.62 0 0 1 3.13 7.56c0 5.9-4.8 10.72-10.69 10.72Zm5.87-8.02c-.32-.16-1.9-.94-2.2-1.05-.3-.11-.51-.16-.72.16-.21.32-.83 1.05-1.02 1.27-.19.21-.38.24-.7.08-.32-.16-1.35-.5-2.57-1.58-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.15-.15.32-.38.48-.56.16-.19.21-.32.32-.53.11-.21.06-.4-.03-.56-.08-.16-.72-1.73-.99-2.37-.26-.62-.53-.54-.72-.55h-.61c-.21 0-.56.08-.86.4-.3.32-1.12 1.1-1.12 2.67s1.15 3.1 1.31 3.32c.16.21 2.26 3.45 5.48 4.83.77.33 1.37.53 1.84.68.77.24 1.47.21 2.02.13.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z" />
        </svg>
      </a>
    </div>
  )
}

export default FloatingWhatsApp
