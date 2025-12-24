import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  User, Package, MapPin, Settings, LogOut, Edit, Plus, Trash2,
  ChevronRight, Clock, Check, Truck, XCircle
} from 'lucide-react';

const AccountPage = () => {
  const { user, logout, updateProfile } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || ''
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = async () => {
    await updateProfile(formData);
    setEditing(false);
  };

  // Mock-Bestellungen
  const orders = [
    {
      id: 'CT-20251224-ABC123',
      date: '24.12.2024',
      status: 'delivered',
      total: 145.47,
      items: 3
    },
    {
      id: 'CT-20251220-DEF456',
      date: '20.12.2024',
      status: 'shipped',
      total: 89.99,
      items: 1
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Ausstehend', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Bestätigt', icon: Check, color: 'bg-blue-100 text-blue-800' },
      shipped: { label: 'Versendet', icon: Truck, color: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Geliefert', icon: Check, color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Storniert', icon: XCircle, color: 'bg-red-100 text-red-800' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartItems={cart.item_count} />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#4fd1c5]">Startseite</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[#1e3a5f]">Mein Konto</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-[#4fd1c5]/20 flex items-center justify-center mx-auto mb-3">
                    <User className="h-10 w-10 text-[#4fd1c5]" />
                  </div>
                  <h2 className="font-semibold text-[#1e3a5f]">
                    {user.first_name} {user.last_name}
                  </h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <nav className="space-y-1">
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg bg-[#4fd1c5]/10 text-[#1e3a5f]">
                    <User className="h-5 w-5" /> Mein Profil
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg text-gray-600 hover:bg-gray-100">
                    <Package className="h-5 w-5" /> Bestellungen
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg text-gray-600 hover:bg-gray-100">
                    <MapPin className="h-5 w-5" /> Adressen
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg text-gray-600 hover:bg-gray-100">
                    <Settings className="h-5 w-5" /> Einstellungen
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5" /> Abmelden
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="profile">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="profile">Profil</TabsTrigger>
                <TabsTrigger value="orders">Bestellungen</TabsTrigger>
                <TabsTrigger value="addresses">Adressen</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Persönliche Daten</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditing(!editing)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {editing ? 'Abbrechen' : 'Bearbeiten'}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {editing ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Vorname</Label>
                            <Input 
                              value={formData.first_name}
                              onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label>Nachname</Label>
                            <Input 
                              value={formData.last_name}
                              onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Telefon</Label>
                          <Input 
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          />
                        </div>
                        <Button onClick={handleSave} className="bg-[#4fd1c5] hover:bg-[#38b2ac] text-[#1e3a5f]">
                          Speichern
                        </Button>
                      </div>
                    ) : (
                      <dl className="grid grid-cols-2 gap-4">
                        <div>
                          <dt className="text-sm text-gray-500">Vorname</dt>
                          <dd className="font-medium text-[#1e3a5f]">{user.first_name}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Nachname</dt>
                          <dd className="font-medium text-[#1e3a5f]">{user.last_name}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">E-Mail</dt>
                          <dd className="font-medium text-[#1e3a5f]">{user.email}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Telefon</dt>
                          <dd className="font-medium text-[#1e3a5f]">{user.phone || '-'}</dd>
                        </div>
                      </dl>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Meine Bestellungen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Noch keine Bestellungen vorhanden</p>
                        <Link to="/">
                          <Button className="mt-4 bg-[#4fd1c5] hover:bg-[#38b2ac] text-[#1e3a5f]">
                            Jetzt einkaufen
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="border rounded-lg p-4 hover:border-[#4fd1c5] transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-mono text-sm text-gray-500">{order.id}</span>
                              {getStatusBadge(order.status)}
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-500">Bestellt am {order.date}</p>
                                <p className="text-sm text-gray-500">{order.items} Artikel</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-[#1e3a5f]">{order.total.toFixed(2).replace('.', ',')} €</p>
                                <Link to={`/bestellung/${order.id}`} className="text-sm text-[#4fd1c5] hover:underline">
                                  Details ansehen
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="addresses">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Gespeicherte Adressen</CardTitle>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" /> Neue Adresse
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {(!user.addresses || user.addresses.length === 0) ? (
                      <div className="text-center py-8">
                        <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Keine Adressen gespeichert</p>
                        <Button className="mt-4" variant="outline">
                          <Plus className="h-4 w-4 mr-2" /> Adresse hinzufügen
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.addresses.map((address, index) => (
                          <div key={index} className="border rounded-lg p-4 relative">
                            {address.is_default && (
                              <span className="absolute top-2 right-2 text-xs bg-[#4fd1c5]/20 text-[#1e3a5f] px-2 py-1 rounded">
                                Standard
                              </span>
                            )}
                            <p className="font-medium">{address.street} {address.house_number}</p>
                            <p className="text-gray-600">{address.postal_code} {address.city}</p>
                            <p className="text-gray-600">{address.country}</p>
                            <div className="mt-3 flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccountPage;
