import { Star } from "lucide-react"

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Switching to NotWP was the best decision we made. Our site is 10x faster and our developers are happier.",
      author: "Sarah Chen",
      role: "CTO at TechStart",
      rating: 5,
    },
    {
      quote: "Finally, a CMS that does not fight against modern web development. NotWP just gets out of the way.",
      author: "Marcus Johnson",
      role: "Lead Developer at WebFlow",
      rating: 5,
    },
    {
      quote: "The performance improvements alone paid for the migration cost. Our bounce rate dropped by 60%.",
      author: "Emily Rodriguez",
      role: "Product Manager at ShopCo",
      rating: 5,
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">Loved by developers worldwide</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            See what our community has to say about their experience with NotWP.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-6 rounded-lg border border-border bg-card">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-foreground" />
                ))}
              </div>
              <p className="text-sm mb-6 leading-relaxed">{testimonial.quote}</p>
              <div>
                <div className="font-bold text-sm">{testimonial.author}</div>
                <div className="text-xs text-muted-foreground">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
