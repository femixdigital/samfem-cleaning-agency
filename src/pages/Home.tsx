import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ServiceMarquee from '../components/ServiceMarquee'
import Services from '../components/Services'
import Gallery from '../components/Gallery'
import Promotions from '../components/Promotions'
import WhyChooseUs from '../components/WhyChooseUs'
import Payment from '../components/Payment'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import FloatingWhatsApp from '../components/FloatingWhatsApp'

const Home = () => {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
          <ServiceMarquee />
        <Services />
        <Gallery />
        <Promotions />
        <WhyChooseUs />
        <Payment />
        <Contact />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </>
  )
}

export default Home
