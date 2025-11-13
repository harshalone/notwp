import { Store, Newspaper, Briefcase, GraduationCap, Heart, Building } from "lucide-react"

export default function UseCases() {
  const cases = [
    { icon: Store, title: "E-commerce", description: "Online stores with seamless checkout" },
    { icon: Newspaper, title: "Publishing", description: "Blogs and news platforms" },
    { icon: Briefcase, title: "Corporate", description: "Business websites and portfolios" },
    { icon: GraduationCap, title: "Education", description: "Learning management systems" },
    { icon: Heart, title: "Non-profit", description: "Charities and foundations" },
    { icon: Building, title: "Enterprise", description: "Large-scale applications" },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">Perfect for any use case</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            From personal blogs to enterprise applications, NotWP scales with your needs.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((useCase, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border border-border hover:border-foreground/20 transition-colors"
            >
              <useCase.icon className="h-10 w-10 mb-4" />
              <h3 className="text-lg font-bold mb-2">{useCase.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
