import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Button from "./Button"

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-blue-50 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance">
            The Modern Alternative to WordPress
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Start editing your website with NotWP, the CMS built for developers and content creators who want flexibility, performance, and ease of use.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="https://www.notwp.com/docs" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="w-full sm:w-auto cursor-pointer" variant="default">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/install" rel="noopener noreferrer">
              <Button size="lg" className="w-full sm:w-auto cursor-pointer" variant="outline">
                Install
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
