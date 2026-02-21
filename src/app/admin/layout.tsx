import type { Metadata } from 'next'
import Link from 'next/link'
import {
  LayoutDashboard,
  ShoppingCart,
  Wrench,
  Car,
  Users,
  Package,
  Calendar,
  Star,
  Settings,
  FileText,
  BarChart3,
  Upload,
  LogOut,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Admin Portal | OpenCarBox',
  description: 'Verwaltungsportal für Shop, Werkstatt und Autohandel',
}

const navSections = [
  {
    title: 'Übersicht',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/statistiken', label: 'Statistiken', icon: BarChart3 },
    ],
  },
  {
    title: 'Shop (Carvantooo)',
    items: [
      { href: '/admin/produkte', label: 'Produkte', icon: Package },
      { href: '/admin/kategorien', label: 'Kategorien', icon: FileText },
      { href: '/admin/bestellungen', label: 'Bestellungen', icon: ShoppingCart },
      { href: '/admin/bewertungen', label: 'Bewertungen', icon: Star },
    ],
  },
  {
    title: 'Werkstatt (OpenCarBox)',
    items: [
      { href: '/admin/services', label: 'Services', icon: Wrench },
      { href: '/admin/termine', label: 'Termine', icon: Calendar },
    ],
  },
  {
    title: 'Autohandel',
    items: [
      { href: '/admin/fahrzeuge', label: 'Fahrzeuge', icon: Car },
    ],
  },
  {
    title: 'System',
    items: [
      { href: '/admin/benutzer', label: 'Benutzer', icon: Users },
      { href: '/admin/csv-import', label: 'CSV Import', icon: Upload },
      { href: '/admin/einstellungen', label: 'Einstellungen', icon: Settings },
    ],
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e3a5f] text-white flex flex-col fixed h-full z-40">
        <div className="p-4 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#4fd1c5] flex items-center justify-center font-bold text-[#1e3a5f]">
              O
            </div>
            <div>
              <span className="font-bold text-sm">OpenCarBox</span>
              <span className="block text-xs text-white/60">Admin Portal</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {navSections.map((section) => (
            <div key={section.title} className="mb-4">
              <h3 className="px-4 text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                {section.title}
              </h3>
              {section.items.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Zurück zur Website
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900">Admin Portal</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">admin@opencarbox.at</span>
              <div className="w-8 h-8 rounded-full bg-[#4fd1c5] flex items-center justify-center text-sm font-bold text-white">
                A
              </div>
            </div>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}