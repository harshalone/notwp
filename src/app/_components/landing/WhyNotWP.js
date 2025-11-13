import { X, Check } from "lucide-react"

export default function WhyNotWP() {
  const comparisons = [
    { old: "Slow loading times", new: "Lightning-fast performance" },
    { old: "Bloated with unused features", new: "Lean and optimized" },
    { old: "Security vulnerabilities", new: "Secure by default" },
    { old: "Complex admin interface", new: "Intuitive and clean" },
    { old: "Outdated technology", new: "Modern tech stack" },
    { old: "Plugin conflicts", new: "Seamless integrations" },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">Why developers are switching</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Leave the legacy behind. Embrace the future of content management.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Old Way</div>
              {comparisons.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
                  <X className="h-5 w-5 text-destructive shrink-0" />
                  <span className="text-muted-foreground">{item.old}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="text-sm font-semibold uppercase tracking-wide mb-4">NotWP Way</div>
              {comparisons.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-card border border-foreground/20">
                  <Check className="h-5 w-5 shrink-0" />
                  <span className="font-medium">{item.new}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
