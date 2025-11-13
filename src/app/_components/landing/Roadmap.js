import { CheckCircle2, Clock, Circle } from "lucide-react"

export default function Roadmap() {
  const items = [
    { title: "Visual Page Builder", status: "completed", quarter: "Q1 2024" },
    { title: "Multi-language Support", status: "completed", quarter: "Q2 2024" },
    { title: "Advanced Analytics", status: "in-progress", quarter: "Q4 2024" },
    { title: "AI Content Assistant", status: "planned", quarter: "Q1 2025" },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">Product roadmap</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            See what we are building and what is coming next. Our roadmap is transparent and community-driven.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex items-start gap-4 p-6 rounded-lg border border-border">
              {item.status === "completed" && <CheckCircle2 className="h-6 w-6 shrink-0" />}
              {item.status === "in-progress" && <Clock className="h-6 w-6 shrink-0" />}
              {item.status === "planned" && <Circle className="h-6 w-6 shrink-0" />}

              <div className="flex-1">
                <h3 className="font-bold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.quarter}</p>
              </div>

              <span className="text-xs px-3 py-1 rounded-full border border-border">
                {item.status === "completed" && "Completed"}
                {item.status === "in-progress" && "In Progress"}
                {item.status === "planned" && "Planned"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
