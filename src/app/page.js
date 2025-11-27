import Navigation from "./_components/landing/Navigation"
import Hero from "./_components/landing/Hero"
import Footer from "./_components/landing/Footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Footer />
    </main>
  )
}
