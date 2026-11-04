import residential from '../assets/gallery/samfem-residential-cleaning.jpg'
import office from '../assets/gallery/samfem-office-cleaning.jpg'
import construction from '../assets/gallery/samfem-post-construction-cleaning.jpg'
import moveOut from '../assets/gallery/samfem-move-in-move-out-cleaning.jpg'

const photos = [
  {
    title: 'Residential Cleaning',
    image: residential,
    description: 'Fresh, clean and comfortable living spaces.',
  },
  {
    title: 'Office Cleaning',
    image: office,
    description: 'Neat and hygienic spaces for productive work.',
  },
  {
    title: 'Post-Construction Cleaning',
    image: construction,
    description: 'Removing dust and debris after construction.',
  },
  {
    title: 'Move-in / Move-out Cleaning',
    image: moveOut,
    description: 'A fresh start for your next home.',
  },
]

const Gallery = () => {
  return (
    <section id="gallery" className="bg-slate-50 px-4 py-12 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Our Cleaning Gallery
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Professional cleaning for homes, offices and commercial spaces.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {photos.map((photo) => (
            <article
              key={photo.title}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <img
                src={photo.image}
                alt={photo.title}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-base font-bold text-slate-900">
                  {photo.title}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {photo.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Gallery
