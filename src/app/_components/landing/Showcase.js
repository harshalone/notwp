export default function Showcase() {
  const sites = [
    { name: "TechCorp", category: "Enterprise", image: "/modern-corporate-website.png" },
    { name: "StyleShop", category: "E-commerce", image: "/modern-ecommerce-store.png" },
    { name: "DevBlog", category: "Publishing", image: "/modern-blog-website.jpg" },
    { name: "LearnHub", category: "Education", image: "/modern-education-platform.jpg" },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">Built with NotWP</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Explore stunning websites and applications powered by NotWP from our community.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sites.map((site, index) => (
            <div
              key={index}
              className="rounded-lg border border-border overflow-hidden hover:border-foreground/20 transition-colors"
            >
              <img src={site.image || "/placeholder.svg"} alt={site.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-bold mb-1">{site.name}</h3>
                <p className="text-sm text-muted-foreground">{site.category}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="#" className="text-sm font-medium hover:underline">
            View full showcase
          </a>
        </div>
      </div>
    </section>
  )
}
