import flyer1 from '../assets/samfem-flyer-1.webp'

const Promotions = () => {
  return (
    <section className="w-full bg-white py-8">
      <div className="w-full">
        <div className="mb-6 px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            SAMFEM Promotions
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Discover our cleaning services and special offers.
          </p>
        </div>

        <img
          src={flyer1}
          alt="SAMFEM Cleaning Agency promotional flyer"
          className="block h-auto w-full"
        />
      </div>
    </section>
  )
}

export default Promotions
