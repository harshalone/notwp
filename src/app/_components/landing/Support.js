import { Mail, MessageSquare, Phone, Clock } from "lucide-react"
import Button from "./Button"

export default function Support() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">We are here to help</h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Our support team is available 24/7 to answer your questions and help you succeed with NotWP.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-card border border-border">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Email Support</h3>
                  <p className="text-sm text-muted-foreground">support@notwp.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-card border border-border">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Live Chat</h3>
                  <p className="text-sm text-muted-foreground">Available 24/7 for all users</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-card border border-border">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Phone Support</h3>
                  <p className="text-sm text-muted-foreground">Enterprise plans only</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-card border border-border">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Response Time</h3>
                  <p className="text-sm text-muted-foreground">Average: 2 hours</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-lg border border-border bg-card">
            <h3 className="text-2xl font-bold mb-6">Quick Contact</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background resize-none"
                  placeholder="How can we help?"
                  rows="4"
                ></textarea>
              </div>
              <Button className="w-full">Send Message</Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
