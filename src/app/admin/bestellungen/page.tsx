'use client'

import { useEffect, useState } from 'react'
import { Search, Eye, Clock, CheckCircle, Truck, XCircle } from 'lucide-react'

interface Order {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  total: number
  createdAt: string
  user?: { name: string; email: string } | null
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  PENDING: { label: 'Ausstehend', color: 'bg-yellow-50 text-yellow-700', icon: Clock },
  PROCESSING: { label: 'In Bearbeitung', color: 'bg-blue-50 text-blue-700', icon: Clock },
  SHIPPED: { label: 'Versendet', color: 'bg-purple-50 text-purple-700', icon: Truck },
  DELIVERED: { label: 'Zugestellt', color: 'bg-green-50 text-green-700', icon: CheckCircle },
  CANCELLED: { label: 'Storniert', color: 'bg-red-50 text-red-700', icon: XCircle },
}

export default function BestellungenVerwaltung() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/orders?limit=100')
      .then((res) => res.json())
      .then((data) => { if (data.success) setOrders(data.data) })
      .finally(() => setLoading(false))
  }, [])

  const filtered = orders.filter((o) =>
    o.orderNumber.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bestellungen</h1>
        <p className="text-gray-500 mt-1">Alle Shop-Bestellungen verwalten</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input type="text" placeholder="Bestellnummer suchen..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fd1c5] focus:border-transparent text-sm" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Bestellnr.</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Datum</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Zahlung</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Summe</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Lade Bestellungen...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Keine Bestellungen vorhanden</td></tr>
            ) : (
              filtered.map((order) => {
                const sc = statusConfig[order.status] || statusConfig.PENDING
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono font-medium text-gray-900">{order.orderNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('de-AT')}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${sc.color}`}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${order.paymentStatus === 'PAID' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                        {order.paymentStatus === 'PAID' ? 'Bezahlt' : 'Offen'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">€ {order.total.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600" title="Details">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}