import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import Features from '../components/Features.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import PricingPlans from '../components/PricingPlans.jsx'
import Footer from '../components/Footer.jsx'

export default function Home() {
  return (
    <>
       <style>{`
       * {
  font-family: 'Poppins', sans-serif;
}
      `}</style>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <PricingPlans />
      <Footer />
    </>
  )
}