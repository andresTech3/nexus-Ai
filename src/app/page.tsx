import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import ServicesSection from '@/components/sections/ServicesSection'
import WorksSection from '@/components/sections/WorksSection'
import AboutSection from '@/components/sections/AboutSection'
import CtaSection from '@/components/sections/CtaSection'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <WorksSection />
        <AboutSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
