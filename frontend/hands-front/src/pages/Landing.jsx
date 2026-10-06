import Header from '../components/Header'
import Footer from '../components/Footer'
import Hero from '../sections/Hero'
import HowItWorks from '../sections/HowItWorks'
import Categories from '../sections/Categories'
import FeaturedProfessionals from '../sections/FeaturedProfessionals'
import Differentials from '../sections/Differentials'
import PlatformReviews from '../sections/PlatformReviews'
import Stats from '../sections/Stats'
import ForProfessionals from '../sections/ForProfessionals'
import FAQ from '../sections/FAQ'
import BottomCTA from '../sections/BottomCTA'

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <HowItWorks />
      <Categories />
      <FeaturedProfessionals />
      <Differentials />
      <PlatformReviews />
      <Stats />
      <ForProfessionals />
      <FAQ />
      <BottomCTA />
      <Footer />
    </div>
  )
}
