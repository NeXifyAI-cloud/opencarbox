"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Car, ShoppingBag, Wrench, Search, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigation = {
  carvantooo: [
    { name: "Shop", href: "/shop", icon: ShoppingBag },
    { name: "Fahrzeuge", href: "/fahrzeuge", icon: Car },
    { name: "Kontakt", href: "/kontakt", icon: User },
  ],
  opencarbox: [
    { name: "Werkstatt", href: "/werkstatt", icon: Wrench },
    { name: "Autohandel", href: "/autohandel", icon: Car },
    { name: "Kontakt", href: "/kontakt", icon: User },
  ],
}

interface NavigationProps {
  brand?: "carvantooo" | "opencarbox"
}

export function Navigation({ brand = "carvantooo" }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const pathname = usePathname()

  const navItems = navigation[brand]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-carvantooo-500 to-carvantooo-700">
                <Car className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight">
                  {brand === "carvantooo" ? "Carvantooo" : "OpenCarBox"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {brand === "carvantooo" ? "Premium Auto Shop" : "Automotive Services"}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-carvantooo-50 text-carvantooo-700 dark:bg-carvantooo-900/20 dark:text-carvantooo-300"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            {/* User */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex"
            >
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>

            {/* CTA Button */}
            <Button
              className={cn(
                "hidden sm:inline-flex",
                brand === "carvantooo"
                  ? "bg-gradient-to-r from-carvantooo-500 to-carvantooo-700 hover:from-carvantooo-600 hover:to-carvantooo-800"
                  : "bg-gradient-to-r from-opencarbox-500 to-opencarbox-700 hover:from-opencarbox-600 hover:to-opencarbox-800"
              )}
            >
              {brand === "carvantooo" ? "Jetzt shoppen" : "Termin buchen"}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-lg px-3 py-3 text-base font-medium transition-colors",
                      isActive
                        ? "bg-carvantooo-50 text-carvantooo-700 dark:bg-carvantooo-900/20 dark:text-carvantooo-300"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
              
              {/* Mobile CTA */}
              <div className="pt-4">
                <Button
                  className={cn(
                    "w-full",
                    brand === "carvantooo"
                      ? "bg-gradient-to-r from-carvantooo-500 to-carvantooo-700 hover:from-carvantooo-600 hover:to-carvantooo-800"
                      : "bg-gradient-to-r from-opencarbox-500 to-opencarbox-700 hover:from-opencarbox-600 hover:to-opencarbox-800"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {brand === "carvantooo" ? "Jetzt shoppen" : "Termin buchen"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}