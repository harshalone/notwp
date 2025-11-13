import { Code2, Server, Database, Cloud } from "lucide-react"

export default function TechStack() {
  const technologies = [
    { icon: Code2, name: "React", description: "Modern component-based UI" },
    { icon: Server, name: "Node.js", description: "Fast server-side runtime" },
    { icon: Database, name: "PostgreSQL", description: "Reliable data storage" },
    { icon: Cloud, name: "Edge Ready", description: "Deploy anywhere" },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">Built on modern technology</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Leveraging the best tools and frameworks for maximum performance and reliability.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border border-border text-center hover:border-foreground/20 transition-colors"
            >
              <tech.icon className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">{tech.name}</h3>
              <p className="text-sm text-muted-foreground">{tech.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
