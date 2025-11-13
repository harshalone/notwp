import { Shield, Lock, Eye, RefreshCw } from "lucide-react"

export default function Security() {
  const features = [
    { icon: Shield, title: "DDoS Protection", description: "Enterprise-grade protection built-in" },
    { icon: Lock, title: "SSL by Default", description: "Automatic HTTPS for all sites" },
    { icon: Eye, title: "Privacy First", description: "GDPR compliant out of the box" },
    { icon: RefreshCw, title: "Auto Updates", description: "Security patches applied automatically" },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">Security you can trust</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Your site security is our top priority. Protected 24/7 with enterprise-grade security features.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="p-6 rounded-lg border border-border text-center">
              <feature.icon className="h-10 w-10 mx-auto mb-4" />
              <h3 className="font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
