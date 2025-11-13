import { Rocket, Palette, Code, Lock, Globe, Boxes } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: Rocket,
      title: "Blazing Fast",
      description:
        "Built on modern architecture for lightning-fast load times. Your content loads in milliseconds, not seconds.",
    },
    {
      icon: Palette,
      title: "Fully Customizable",
      description: "No templates holding you back. Build exactly what you envision with complete creative freedom.",
    },
    {
      icon: Code,
      title: "Developer Friendly",
      description: "Modern APIs, clean code, and excellent documentation. Built by developers, for developers.",
    },
    {
      icon: Lock,
      title: "Secure by Default",
      description: "Security is not an afterthought. Protected from the ground up with modern security practices.",
    },
    {
      icon: Globe,
      title: "Global CDN",
      description: "Automatic edge caching and global distribution. Fast everywhere, for everyone.",
    },
    {
      icon: Boxes,
      title: "Plugin Ecosystem",
      description: "Extend functionality with thousands of plugins. If you can imagine it, you can build it.",
    },
  ]

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">
            Everything you need to build amazing sites
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Modern features for modern web development. No compromises.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border border-border hover:border-foreground/20 transition-colors"
            >
              <feature.icon className="h-10 w-10 mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
