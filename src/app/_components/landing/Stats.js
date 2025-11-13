import { Download, Users, GitFork, Zap } from "lucide-react"

export default function Stats() {
  const stats = [
    { icon: Download, label: "Downloads", value: "500K" },
    { icon: Users, label: "Active Users", value: "50K" },
    { icon: GitFork, label: "Contributors", value: "1200" },
    { icon: Zap, label: "Sites Powered", value: "25K" },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <stat.icon className="h-8 w-8 mx-auto mb-3" />
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
