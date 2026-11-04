import {
  House,
  Building2,
  HardHat,
  Truck,
  ArrowRight,
} from 'lucide-react'

const services = [
  {
    icon: House,
    title: 'Residential Cleaning',
    description: 'Keep your home spotless, fresh and comfortable.',
  },
  {
    icon: Building2,
    title: 'Office & Commercial',
    description: 'Professional cleaning for productive workplaces.',
  },
  {
    icon: HardHat,
    title: 'Post-Construction',
    description: 'Remove dust, debris and construction mess.',
  },
  {
    icon: Truck,
    title: 'Move-In / Move-Out',
    description: 'Enjoy a fresh start in a clean space.',
  },
]

const Services = () => {
  return (
    <section id="services" className="bg-white px-4 py-14 md:px-8">

      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              What We Do
            </span>

            <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
              Our Cleaning Services
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Professional care for every space.
            </p>
          </div>

          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Get a Quote
            <ArrowRight size={16} />
          </a>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {services.map((service) => {
            const Icon = service.icon

            return (
              <div
                key={service.title}
                className="group rounded-xl border border-slate-100 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <Icon size={23} />
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {service.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {service.description}
                </p>

                <a
                  href="#contact"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-600"
                >
                  Learn More
                  <ArrowRight size={14} />
                </a>
              </div>
            )
          })}

        </div>
      </div>
    </section>
  )
}

export default Services
