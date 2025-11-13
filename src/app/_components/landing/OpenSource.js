import { Star, GitFork, Users, Github } from "lucide-react"
import Button from "./Button"

export default function OpenSource() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">Open source and proud</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            NotWP is free, open-source software. Built by the community, for the community.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="p-6 rounded-lg border border-border text-center">
            <Star className="h-8 w-8 mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">25K</div>
            <div className="text-sm text-muted-foreground">GitHub Stars</div>
          </div>

          <div className="p-6 rounded-lg border border-border text-center">
            <GitFork className="h-8 w-8 mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">3.5K</div>
            <div className="text-sm text-muted-foreground">Forks</div>
          </div>

          <div className="p-6 rounded-lg border border-border text-center">
            <Users className="h-8 w-8 mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">1,200</div>
            <div className="text-sm text-muted-foreground">Contributors</div>
          </div>

          <div className="p-6 rounded-lg border border-border text-center">
            <Github className="h-8 w-8 mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">MIT</div>
            <div className="text-sm text-muted-foreground">License</div>
          </div>
        </div>

        <div className="text-center">
          <Button size="lg">
            <Github className="mr-2 h-5 w-5" />
            Contribute on GitHub
          </Button>
        </div>
      </div>
    </section>
  )
}
