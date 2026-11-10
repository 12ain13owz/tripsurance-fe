import { CoverageSection } from './components/CoverageSection'
import { CtaSection } from './components/CtaSection'
import { FaqSection } from './components/FaqSection'
import { HeroSection } from './components/HeroSection'
import { StepsSection } from './components/StepsSection'
import { WhySection } from './components/WhySection'

export function HomeView() {
  return (
    <>
      <HeroSection />
      <WhySection />
      <CoverageSection />
      <StepsSection />
      <FaqSection />
      <CtaSection />
    </>
  )
}
