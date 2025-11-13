import { Github, Twitter, Linkedin, Youtube } from "lucide-react"

export default function Footer() {
  const links = {
    Product: ["Features", "Pricing", "Roadmap", "Changelog"],
    Resources: ["Documentation", "Tutorials", "Blog", "Examples"],
    Company: ["About", "Careers", "Contact", "Partners"],
    Legal: ["Privacy", "Terms", "Security", "License"],
  }

  return (
    <footer className="border-t border-border py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center text-background font-bold">
                NW
              </div>
              <span className="text-xl font-bold">NotWP</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              The modern CMS for the web. Built by developers, for developers.
            </p>
            <div className="flex gap-3">
              <a href="#" className="hover:text-muted-foreground transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-muted-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-muted-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-muted-foreground transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-bold mb-4">{category}</h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">2025 NotWP. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
