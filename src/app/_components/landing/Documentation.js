import { BookOpen, Video, Code, LifeBuoy } from "lucide-react"

export default function Documentation() {
  const resources = [
    {
      icon: BookOpen,
      title: "Documentation",
      description: "Comprehensive guides and API references",
      link: "Read docs",
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Step-by-step video courses",
      link: "Watch now",
    },
    {
      icon: Code,
      title: "Code Examples",
      description: "Real-world examples and templates",
      link: "Browse examples",
    },
    {
      icon: LifeBuoy,
      title: "Support Center",
      description: "24/7 help and troubleshooting",
      link: "Get help",
    },
  ]

  return (
    <section id="docs" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">Everything you need to succeed</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Extensive documentation, tutorials, and support to help you build amazing things.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border border-border hover:border-foreground/20 transition-colors"
            >
              <resource.icon className="h-10 w-10 mb-4" />
              <h3 className="text-lg font-bold mb-2">{resource.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{resource.description}</p>
              <a href="#" className="text-sm font-medium hover:underline">
                {resource.link}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
