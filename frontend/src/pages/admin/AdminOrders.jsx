import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from '../../components/ui/badge';
import { 
  Search, Eye, ChevronLeft, ChevronRight, Clock, Check, Truck, XCircle
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: '20' });
      if (statusFilter) params.append('status', statusFilter);

      const response = await axios.get(`${API}/orders?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.orders || []);
      setTotalPages(response.data.pages || 1);
    } catch (error) {
      console.error('Bestellungen laden fehlgeschlagen:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${API}/orders/${orderId}/status?new_status=${newStatus}`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders();
    } catch (error) {
      alert('Status-Update fehlgeschlagen');
    }
  };

  const statusConfig = {
    pending: { label: 'Ausstehend', icon: Clock, class: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: 'Bestätigt', icon: Check, class: 'bg-blue-100 text-blue-800' },
    processing: { label: 'In Bearbeitung', icon: Clock, class: 'bg-indigo-100 text-indigo-800' },
    shipped: { label: 'Versendet', icon: Truck, class: 'bg-purple-100 text-purple-800' },
    delivered: { label: 'Geliefert', icon: Check, class: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Storniert', icon: XCircle, class: 'bg-red-100 text-red-800' }
  };

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.class}`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1e3a5f]">Bestellungen</h1>
          <p className="text-gray-500">Verwalten Sie alle Bestellungen</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Bestellung suchen..." className="pl-10" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Alle Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Alle Status</SelectItem>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>{config.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bestellnummer</TableHead>
                  <TableHead>Kunde</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead>Betrag</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">Laden...</TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Keine Bestellungen gefunden
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">{order.order_number}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {order.shipping_info?.first_name} {order.shipping_info?.last_name}
                          </p>
                          <p className="text-xs text-gray-500">{order.shipping_info?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(order.created_at).toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {order.total?.toFixed(2).replace('.', ',')} €
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Select 
                            value={order.status} 
                            onValueChange={(value) => updateStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-36">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(statusConfig).map(([key, config]) => (
                                <SelectItem key={key} value={key}>{config.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">Seite {page} von {totalPages}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="h-4 w-4" /> Zurück
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  Weiter <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Detail Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Bestellung {selectedOrder?.order_number}</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Lieferadresse</h4>
                    <p>{selectedOrder.shipping_info?.first_name} {selectedOrder.shipping_info?.last_name}</p>
                    <p>{selectedOrder.shipping_info?.address?.street} {selectedOrder.shipping_info?.address?.house_number}</p>
                    <p>{selectedOrder.shipping_info?.address?.postal_code} {selectedOrder.shipping_info?.address?.city}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Zusammenfassung</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between"><span>Zwischensumme:</span><span>{selectedOrder.subtotal?.toFixed(2)} €</span></div>
                      <div className="flex justify-between"><span>Versand:</span><span>{selectedOrder.shipping_cost?.toFixed(2)} €</span></div>
                      {selectedOrder.discount > 0 && (
                        <div className="flex justify-between text-green-600"><span>Rabatt:</span><span>-{selectedOrder.discount?.toFixed(2)} €</span></div>
                      )}
                      <div className="flex justify-between font-bold border-t pt-1"><span>Gesamt:</span><span>{selectedOrder.total?.toFixed(2)} €</span></div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Bestellte Artikel</h4>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                        <img src={item.product_image || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded object-cover" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.product_name}</p>
                          <p className="text-xs text-gray-500">SKU: {item.product_sku}</p>
                        </div>
                        <span>{item.quantity}x</span>
                        <span className="font-semibold">{item.total_price?.toFixed(2)} €</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
