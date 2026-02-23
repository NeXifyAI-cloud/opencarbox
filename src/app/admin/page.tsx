import Link from 'next/link'
import {
  ShoppingCart,
  Wrench,
  Car,
  Users,
  Package,
  Calendar,
  TrendingUp,
  Euro,
  Clock,
  AlertTriangle,
} from 'lucide-react'

const stats = [
  { label: 'Produkte', value: '—', icon: Package, href: '/admin/produkte', color: 'bg-blue-500' },
  { label: 'Bestellungen', value: '—', icon: ShoppingCart, href: '/admin/bestellungen', color: 'bg-green-500' },
  { label: 'Termine', value: '—', icon: Calendar, href: '/admin/termine', color: 'bg-purple-500' },
  { label: 'Fahrzeuge', value: '—', icon: Car, href: '/admin/fahrzeuge', color: 'bg-orange-500' },
  { label: 'Benutzer', value: '—', icon: Users, href: '/admin/benutzer', color: 'bg-pink-500' },
  { label: 'Services', value: '—', icon: Wrench, href: '/admin/services', color: 'bg-teal-500' },
]

const quickActions = [
  { label: 'Neues Produkt', href: '/admin/produkte?action=neu', icon: Package },
  { label: 'Neuer Service', href: '/admin/services?action=neu', icon: Wrench },
  { label: 'Neues Fahrzeug', href: '/admin/fahrzeuge?action=neu', icon: Car },
  { label: 'CSV Import', href: '/admin/csv-import', icon: TrendingUp },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Willkommen im OpenCarBox Admin Portal</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Schnellzugriff</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#4fd1c5] hover:bg-[#4fd1c5]/5 transition-colors"
                >
                  <Icon className="h-5 w-5 text-[#4fd1c5]" />
                  <span className="text-sm font-medium text-gray-700">{action.label}</span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Letzte Aktivitäten</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-green-50">
                <ShoppingCart className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Neue Bestellung CV-2024-0001</p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <Clock className="h-3 w-3" /> Gerade eben
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Termin bestätigt: Ölwechsel</p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <Clock className="h-3 w-3" /> Vor 5 Minuten
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Niedriger Bestand: Bremsscheiben</p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <Clock className="h-3 w-3" /> Vor 1 Stunde
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bereiche Übersicht */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-50">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Shop (Carvantooo)</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Aktive Produkte</span>
              <span className="font-medium">—</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Offene Bestellungen</span>
              <span className="font-medium">—</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Umsatz (Monat)</span>
              <span className="font-medium flex items-center gap-1"><Euro className="h-3 w-3" /> —</span>
            </div>
          </div>
          <Link href="/admin/produkte" className="mt-4 block text-sm text-[#4fd1c5] hover:underline">
            Zur Shop-Verwaltung →
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-teal-50">
              <Wrench className="h-5 w-5 text-teal-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Werkstatt</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Aktive Services</span>
              <span className="font-medium">—</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Termine heute</span>
              <span className="font-medium">—</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Auslastung</span>
              <span className="font-medium">—</span>
            </div>
          </div>
          <Link href="/admin/services" className="mt-4 block text-sm text-[#4fd1c5] hover:underline">
            Zur Werkstatt-Verwaltung →
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-orange-50">
              <Car className="h-5 w-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Autohandel</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Fahrzeuge im Bestand</span>
              <span className="font-medium">—</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Anfragen (Woche)</span>
              <span className="font-medium">—</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Verkäufe (Monat)</span>
              <span className="font-medium">—</span>
            </div>
          </div>
          <Link href="/admin/fahrzeuge" className="mt-4 block text-sm text-[#4fd1c5] hover:underline">
            Zur Autohandel-Verwaltung →
          </Link>
        </div>
      </div>
    </div>
  )
}