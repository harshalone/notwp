export default function Footer() {
  return (
    <footer className="bg-white shadow-sm">
      <div className="w-full px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between h-16 gap-4 sm:gap-0">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p className="text-sm text-muted-foreground">2025 NotWP. All rights reserved.</p>
            <p className="text-sm text-muted-foreground">
              Powered by{" "}
              <a
                href="https://www.notwp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors underline"
              >
                notwp
              </a>
            </p>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
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
