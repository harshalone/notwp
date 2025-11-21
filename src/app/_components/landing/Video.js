export default function Video() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            See NotWP in Action
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch how easy it is to build modern websites with NotWP
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-2xl"
              src="https://www.youtube.com/embed/1nHhwr5vzCk"
              title="NotWP Demo Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  )
}
