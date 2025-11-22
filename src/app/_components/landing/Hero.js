import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Button from "./Button"
import BookMeeting from "./BookMeeting"

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-muted text-sm font-medium">
            <span>Modern | Powerful | Community-Driven</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance">
            The modern alternative to WordPress
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Fast, secure, and developer-friendly. NotWP is the content management system developers love and marketers
            trust.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/editor">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <BookMeeting />
          </div>

          <p className="text-sm text-muted-foreground mt-6">Join 100K developers already using NotWP</p>
        </div>
      </div>
    </section>
  )
}
