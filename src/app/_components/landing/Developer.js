import { Terminal, FileCode, GitBranch, Wrench } from "lucide-react"

export default function Developer() {
  const features = [
    {
      icon: Terminal,
      title: "CLI Tools",
      description: "Powerful command-line tools for scaffolding, deployment, and management",
    },
    {
      icon: FileCode,
      title: "Clean APIs",
      description: "RESTful and GraphQL APIs with comprehensive documentation",
    },
    {
      icon: GitBranch,
      title: "Version Control",
      description: "Built-in Git integration for seamless workflow",
    },
    {
      icon: Wrench,
      title: "Dev Tools",
      description: "Hot reload, debugging, and testing tools included",
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">Developer experience first</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Built by developers who understand what makes great DX. Every feature is designed with your workflow in
            mind.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border border-border hover:border-foreground/20 transition-colors"
            >
              <feature.icon className="h-8 w-8 mb-4" />
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
 
      </div>
    </section>
  )
}
