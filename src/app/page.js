import Navigation from "./_components/landing/Navigation"
import Hero from "./_components/landing/Hero"
import Video from "./_components/landing/Video"
import Stats from "./_components/landing/Stats"
import Features from "./_components/landing/Features"
import WhyNotWP from "./_components/landing/WhyNotWP"
import TechStack from "./_components/landing/TechStack"
import Performance from "./_components/landing/Performance"
import Developer from "./_components/landing/Developer"
import Plugins from "./_components/landing/Plugins"
import Security from "./_components/landing/Security"
import Comparison from "./_components/landing/Comparison"
import UseCases from "./_components/landing/UseCases"
import Community from "./_components/landing/Community"
import Testimonials from "./_components/landing/Testimonials"
import Showcase from "./_components/landing/Showcase"
import Roadmap from "./_components/landing/Roadmap"
import Pricing from "./_components/landing/Pricing"
import Documentation from "./_components/landing/Documentation"
import Support from "./_components/landing/Support"
import FAQ from "./_components/landing/FAQ"
import CTA from "./_components/landing/CTA"
import Footer from "./_components/landing/Footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Video />
      <Stats />
      <Features />
      <WhyNotWP />
      <TechStack />
      <Performance />
      <Developer />
      <Plugins />
      <Security />
      <Comparison />
      <UseCases />
      <Community />
      <Testimonials />
      <Showcase />
      <Roadmap />
      {/* <Pricing /> */}
      <Documentation />
      <Support />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
