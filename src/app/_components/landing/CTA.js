import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Button from "./Button"

export default function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center p-12 rounded-2xl border border-border bg-card">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">Ready to build something amazing?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of developers who have already made the switch to NotWP. Start building faster, better
            websites today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/editor">
              <Button size="lg">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              View Pricing
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">14-day trial available | 5 minute setup</p>
        </div>
      </div>
    </section>
  )
}
