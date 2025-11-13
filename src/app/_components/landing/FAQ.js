"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "Is NotWP really free?",
      answer:
        "Yes! NotWP is 100% free and open-source under the MIT license. You can use it for personal or commercial projects without any cost.",
    },
    {
      question: "How difficult is it to migrate from WordPress?",
      answer:
        "We provide comprehensive migration tools and guides to make the transition smooth. Most sites can be migrated in a few hours with minimal downtime.",
    },
    {
      question: "Can I use my existing WordPress plugins?",
      answer:
        "While WordPress plugins will not work directly, we offer similar functionality through our plugin ecosystem, and many popular WordPress features are built into the core.",
    },
    {
      question: "What hosting do I need?",
      answer:
        "NotWP works with any Node.js hosting provider. We recommend Vercel for the best experience, but you can also use AWS, DigitalOcean, or any other provider.",
    },
    {
      question: "Do you offer professional support?",
      answer:
        "Yes! We offer community support for free users and priority support for Pro and Enterprise plans. Our average response time is under 2 hours.",
    },
    {
      question: "Is NotWP production-ready?",
      answer:
        "NotWP is powering thousands of production sites, including enterprise applications. It is stable, secure, and battle-tested.",
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">Frequently asked questions</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Have questions? We have answers. Cannot find what you are looking for? Contact our support team.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-border rounded-lg overflow-hidden">
              <button
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-bold">{faq.question}</span>
                <ChevronDown className={`h-5 w-5 transition-transform ${openIndex === index ? "rotate-180" : ""}`} />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-muted-foreground leading-relaxed">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
