"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import Button from "./Button"
import Image from "next/image"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState({})
  const [navigationItems, setNavigationItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/public/navigation')
        const data = await response.json()

        if (data.success) {
          setSettings(data.settings || {})
          setNavigationItems(data.navigation || [])
        }
      } catch (error) {
        console.error('Error fetching navigation data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const brandName = settings.brand_name || settings.website_name || settings.app_name || 'NotWP'
  const logoUrl = settings.logo_url

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg shadow-sm">
      <div className="w-full px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            {loading ? (
              <>
                <div className="h-8 w-8 bg-muted/50 animate-pulse rounded-md" />
                <div className="h-5 w-24 bg-muted/50 animate-pulse rounded-md" />
              </>
            ) : logoUrl ? (
              <Image
                src={logoUrl}
                alt={brandName}
                width={128}
                height={128}
                quality={80}
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
                className="h-8 w-auto object-contain"
              />
            ) : (
              <div className="h-8 px-1 bg-foreground rounded-md flex items-center justify-center text-background font-bold">
                NW
              </div>
            )}
            {!loading && (
              <Link href="/" className="text-lg font-semibold">
                {brandName}
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-8">
            {loading ? (
              <>
                <div className="h-4 w-16 bg-muted/50 animate-pulse rounded-md" />
                <div className="h-4 w-16 bg-muted/50 animate-pulse rounded-md" />
                <div className="h-8 w-20 bg-muted/50 animate-pulse rounded-md" />
              </>
            ) : (
              <>
                {navigationItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`/p${item.url}`}
                    target={item.target || '_self'}
                    className="text-sm hover:text-muted-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                ))} 
              </>
            )}
          </div>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-3">
            {loading ? (
              <>
                <div className="h-4 w-20 bg-muted/50 animate-pulse rounded-md" />
                <div className="h-4 w-20 bg-muted/50 animate-pulse rounded-md" />
                <div className="h-9 w-full bg-muted/50 animate-pulse rounded-md" />
              </>
            ) : (
              <>
                {navigationItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`/p${item.url}`}
                    target={item.target || '_self'}
                    className="block text-sm py-2"
                  >
                    {item.label}
                  </Link>
                ))} 
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
