import { useState } from 'react'
import {
  Building2,
  Copy,
  Check,
  ShieldCheck,
  MessageCircle,
  CreditCard,
} from 'lucide-react'

const ACCOUNT_NUMBER = '0237252366'

const Payment = () => {
  const [copied, setCopied] = useState(false)

  const copyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText(ACCOUNT_NUMBER)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch {
      window.prompt('Copy the account number:', ACCOUNT_NUMBER)
    }
  }

  const whatsappMessage = encodeURIComponent(
    'Hello SAMFEM Cleaning Agency, I have made a bank transfer for my cleaning service. I would like to send my payment confirmation.'
  )

  return (
    <section id="payment" className="bg-white px-4 py-14 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-9 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Secure Payment
          </span>

          <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
            Make Your Payment
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
            You can pay for your confirmed cleaning service through bank transfer
            using the account details below.
          </p>
        </div>

        <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-6 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                <Building2 size={26} />
              </div>

              <div>
                <p className="text-sm text-blue-100">Bank Transfer</p>
                <h3 className="text-xl font-bold">Wema Bank Plc</h3>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-6 md:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Account Name
              </p>
              <p className="mt-2 break-words text-base font-bold text-slate-900">
                SAMUEL OLUWAFEMI OJODAKO
              </p>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Account Number
              </p>

              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <p className="text-2xl font-extrabold tracking-wider text-blue-800">
                  {ACCOUNT_NUMBER}
                </p>

                <button
                  type="button"
                  onClick={() => void copyAccountNumber()}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
                >
                  {copied ? <Check size={17} /> : <Copy size={17} />}
                  {copied ? 'Copied!' : 'Copy Number'}
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-blue-50 p-5">
              <div className="flex items-center gap-2 text-blue-800">
                <CreditCard size={19} />
                <h4 className="font-bold">Payment Instructions</h4>
              </div>

              <ol className="mt-3 list-inside list-decimal space-y-2 text-sm leading-6 text-slate-700">
                <li>Confirm the total service charge with SAMFEM before payment.</li>
                <li>Transfer the agreed amount to the account displayed above.</li>
                <li>Verify the account name before completing your transfer.</li>
                <li>Keep your transaction receipt and send your payment confirmation to us.</li>
              </ol>
            </div>

            <a
              href={`https://wa.me/2349132915450?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-green-700"
            >
              <MessageCircle size={19} />
              Send Payment Confirmation on WhatsApp
            </a>

            <div className="flex items-start gap-2 text-xs leading-5 text-slate-500">
              <ShieldCheck size={17} className="mt-0.5 shrink-0 text-green-600" />
              <p>
                Always verify the account name and details before transferring.
                Your booking is subject to confirmation by SAMFEM Cleaning Agency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Payment
