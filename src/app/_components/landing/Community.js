import { Users, MessageCircle, BookOpen, Calendar } from "lucide-react"

export default function Community() {
  return (
    <section id="community" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">Join our thriving community</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Connect with thousands of developers, get help, share ideas, and contribute to the project.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-lg border border-border text-center">
            <Users className="h-10 w-10 mx-auto mb-4" />
            <h3 className="font-bold mb-2">Discord Server</h3>
            <p className="text-sm text-muted-foreground mb-4">15K members online</p>
            <a href="#" className="text-sm font-medium hover:underline">
              Join now
            </a>
          </div>

          <div className="p-6 rounded-lg border border-border text-center">
            <MessageCircle className="h-10 w-10 mx-auto mb-4" />
            <h3 className="font-bold mb-2">Forum</h3>
            <p className="text-sm text-muted-foreground mb-4">50K discussions</p>
            <a href="#" className="text-sm font-medium hover:underline">
              Browse
            </a>
          </div>

          <div className="p-6 rounded-lg border border-border text-center">
            <BookOpen className="h-10 w-10 mx-auto mb-4" />
            <h3 className="font-bold mb-2">Blog</h3>
            <p className="text-sm text-muted-foreground mb-4">Weekly tutorials</p>
            <a href="#" className="text-sm font-medium hover:underline">
              Read
            </a>
          </div>

          <div className="p-6 rounded-lg border border-border text-center">
            <Calendar className="h-10 w-10 mx-auto mb-4" />
            <h3 className="font-bold mb-2">Events</h3>
            <p className="text-sm text-muted-foreground mb-4">Monthly meetups</p>
            <a href="#" className="text-sm font-medium hover:underline">
              Schedule
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
