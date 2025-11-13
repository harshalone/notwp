export default function Comparison() {
  const features = [
    { name: "Page Load Speed", notwp: "Under 100ms", wordpress: "Over 2000ms", other: "Over 1000ms" },
    { name: "Core Size", notwp: "2MB", wordpress: "50MB", other: "15MB" },
    { name: "Plugin Conflicts", notwp: "None", wordpress: "Common", other: "Occasional" },
    { name: "Security Updates", notwp: "Automatic", wordpress: "Manual", other: "Semi-Auto" },
    { name: "Modern Stack", notwp: "Yes", wordpress: "No", other: "Partial" },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">How we compare</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            See how NotWP stacks up against the competition. The numbers speak for themselves.
          </p>
        </div>

        <div className="max-w-4xl mx-auto overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 font-bold">Feature</th>
                <th className="text-center py-4 px-4 font-bold">NotWP</th>
                <th className="text-center py-4 px-4 font-bold text-muted-foreground">WordPress</th>
                <th className="text-center py-4 px-4 font-bold text-muted-foreground">Others</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index} className="border-b border-border">
                  <td className="py-4 px-4 font-medium">{feature.name}</td>
                  <td className="py-4 px-4 text-center font-bold">{feature.notwp}</td>
                  <td className="py-4 px-4 text-center text-muted-foreground">{feature.wordpress}</td>
                  <td className="py-4 px-4 text-center text-muted-foreground">{feature.other}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
