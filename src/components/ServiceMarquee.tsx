const messages = [
  { text: 'RESIDENTIAL CLEANING', target: '#services' },
  { text: 'OFFICE & COMMERCIAL CLEANING', target: '#services' },
  { text: 'POST-CONSTRUCTION CLEANING', target: '#services' },
  { text: 'MOVE-IN / MOVE-OUT CLEANING', target: '#services' },
  { text: 'SPARKLE & FRESHNESS GUARANTEED!', target: '#contact' },
]

const ServiceMarquee = () => (
  <div
    className="service-marquee"
    role="region"
    aria-label="SAMFEM cleaning services"
  >
    <div className="service-marquee-track">
      {[0, 1].map(group => (
        <div
          className="service-marquee-group"
          key={group}
          aria-hidden={group === 1}
        >
          {messages.map(message => (
            <a
              href={message.target}
              className="service-marquee-item cursor-pointer transition-opacity hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400"
              key={`${group}-${message.text}`}
              tabIndex={group === 1 ? -1 : 0}
            >
              {message.text}
              <span className="service-marquee-star" aria-hidden="true">✦</span>
            </a>
          ))}
        </div>
      ))}
    </div>
  </div>
)

export default ServiceMarquee
