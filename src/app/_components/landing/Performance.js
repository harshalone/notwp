import { Gauge, TrendingUp, Target } from "lucide-react"

export default function Performance() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">Performance that speaks for itself</h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Every millisecond matters. NotWP is optimized from the ground up for speed, delivering exceptional
              performance without compromise.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-card border border-border">
                  <Gauge className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">100/100 Lighthouse Score</h3>
                  <p className="text-sm text-muted-foreground">Perfect scores across all metrics</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-card border border-border">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">50ms Average Load Time</h3>
                  <p className="text-sm text-muted-foreground">Instant page loads worldwide</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-card border border-border">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">99.99% Uptime</h3>
                  <p className="text-sm text-muted-foreground">Always available, always reliable</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="/performance-metrics-dashboard.png"
              alt="Performance Metrics"
              className="rounded-lg border border-border shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
