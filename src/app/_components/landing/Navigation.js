"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import Button from "./Button"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg shadow-sm">
      <div className="w-full px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="h-8 px-1 bg-foreground rounded-md flex items-center justify-center text-background font-bold">
              NW
            </div> 
            <Link href="/" className="text-lg font-semibold">
              NotWP
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/blog" className="text-sm hover:text-muted-foreground transition-colors">
              Blog
            </Link>
            <Link href="/docs" className="text-sm hover:text-muted-foreground transition-colors">
              Docs
            </Link>
            <Link href="/editor">
              <Button variant="default" size="sm">
                Editor
              </Button>
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-3">
            <Link href="/blog" className="block text-sm py-2">
              Blog
            </Link>
            <Link href="/docs" className="block text-sm py-2">
              Docs
            </Link>
            <Link href="/editor">
              <Button variant="default" size="sm" className="w-full">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
