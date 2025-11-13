import { Zap, Shield, ImageIcon, Puzzle } from "lucide-react"

export default function Plugins() {
  const plugins = [
    { icon: Zap, name: "SEO Optimizer", installs: "50K" },
    { icon: Shield, name: "Security Suite", installs: "45K" },
    { icon: ImageIcon, name: "Image Optimizer", installs: "40K" },
    { icon: Puzzle, name: "Form Builder", installs: "38K" },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">Powerful plugin ecosystem</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Extend functionality with thousands of free and premium plugins. Built and maintained by our amazing
            community.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plugins.map((plugin, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
            >
              <plugin.icon className="h-10 w-10 mb-4" />
              <h3 className="font-bold mb-2">{plugin.name}</h3>
              <p className="text-sm text-muted-foreground">{plugin.installs} installs</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="#" className="text-sm font-medium hover:underline">
            Browse all 5000 plugins
          </a>
        </div>
      </div>
    </section>
  )
}
