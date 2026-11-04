import {
  ShieldCheck,
  Sparkles,
  HeartHandshake,
  Clock3,
} from 'lucide-react'

const reasons = [
  {
    icon: ShieldCheck,
    title: 'Professional Cleaning',
    description:
      'Careful cleaning with attention to hygiene, presentation and the needs of each space.',
  },
  {
    icon: Clock3,
    title: 'Reliable Service',
    description:
      'We value your time and aim to deliver services according to agreed schedules.',
  },
  {
    icon: Sparkles,
    title: 'Attention to Detail',
    description:
      'We focus on the details that help make your home or workplace feel fresh and clean.',
  },
  {
    icon: HeartHandshake,
    title: 'Customer-Focused Care',
    description:
      'Your needs matter. We listen to your requirements and work towards your satisfaction.',
  },
]

const WhyChooseUs = () => {
  return (
    <section id="about" className="bg-slate-50 px-4 py-14 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Why Choose SAMFEM?
          </span>

          <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
            Cleaning You Can Trust
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
            We are committed to making homes and workplaces cleaner,
            fresher and more comfortable.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => {
            const Icon = reason.icon

            return (
              <article
                key={reason.title}
                className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon size={27} />
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-900">
                  {reason.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {reason.description}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
