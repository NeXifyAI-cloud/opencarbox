'use client'

import { useEffect, useState } from 'react'
import { Wrench, Plus, Edit, Trash2, Clock } from 'lucide-react'

interface Service {
  id: string
  name: string
  slug: string
  description: string | null
  priceFrom: number | null
  priceTo: number | null
  priceType: string
  durationMinutes: number | null
  isActive: boolean
}

export default function ServicesVerwaltung() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/services?limit=100')
      .then((res) => res.json())
      .then((data) => { if (data.success) setServices(data.data) })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Werkstatt-Services</h1>
          <p className="text-gray-500 mt-1">Verwalte alle Werkstatt-Dienstleistungen</p>
        </div>
        <button className="flex items-center gap-2 bg-[#4fd1c5] text-white px-4 py-2 rounded-lg hover:bg-[#38b2ac] transition-colors text-sm font-medium">
          <Plus className="h-4 w-4" /> Neuer Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-gray-500 col-span-full text-center py-8">Lade Services...</p>
        ) : services.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center py-8">Keine Services vorhanden</p>
        ) : (
          services.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-teal-50">
                    <Wrench className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{service.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{service.description}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${service.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {service.isActive ? 'Aktiv' : 'Inaktiv'}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="text-gray-500">
                  {service.priceType === 'FROM' && service.priceFrom && (
                    <span>ab € {service.priceFrom.toFixed(2)}</span>
                  )}
                  {service.priceType === 'FIXED' && service.priceFrom && (
                    <span>€ {service.priceFrom.toFixed(2)}</span>
                  )}
                  {service.priceType === 'ON_REQUEST' && <span>Auf Anfrage</span>}
                </div>
                {service.durationMinutes && (
                  <div className="flex items-center gap-1 text-gray-400">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-xs">{service.durationMinutes} Min.</span>
                  </div>
                )}
              </div>
              <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
                <button className="flex-1 flex items-center justify-center gap-1 text-xs text-gray-500 hover:text-green-600 py-1.5 rounded hover:bg-gray-50">
                  <Edit className="h-3.5 w-3.5" /> Bearbeiten
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 text-xs text-gray-500 hover:text-red-600 py-1.5 rounded hover:bg-gray-50">
                  <Trash2 className="h-3.5 w-3.5" /> Löschen
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}