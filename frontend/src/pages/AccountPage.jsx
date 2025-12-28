import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { LogOut, Package, User, MapPin, CreditCard, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AccountPage = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await axios.get(`${API}/orders/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Bestellungen konnten nicht geladen werden", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-[#1e3a5f] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                  </div>
                  <h2 className="font-bold text-lg">{user?.first_name} {user?.last_name}</h2>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" /> Abmelden
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#1e3a5f] mb-6">Mein Konto</h1>
            
            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <Package className="h-4 w-4" /> Bestellungen
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" /> Profil
                </TabsTrigger>
                <TabsTrigger value="addresses" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Adressen
                </TabsTrigger>
              </TabsList>

              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Meine Bestellungen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingOrders ? (
                      <p>Laden...</p>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>Noch keine Bestellungen vorhanden.</p>
                        <Button className="mt-4 bg-[#1e3a5f]" onClick={() => navigate('/')}>Jetzt einkaufen</Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#4fd1c5] transition-colors">
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <span className="font-mono font-bold text-[#1e3a5f]">{order.order_number}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                  order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {order.status === 'pending' ? 'In Bearbeitung' : order.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500">
                                {new Date(order.created_at).toLocaleDateString('de-DE')} • {order.items?.length} Artikel
                              </p>
                            </div>
                            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                              <span className="font-bold text-[#1e3a5f]">{order.total?.toFixed(2).replace('.', ',')} €</span>
                              <Button variant="ghost" size="sm" onClick={() => navigate(`/bestellung/${order.order_number}`)}>
                                Details <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="profile">
                <Card>
                  <CardHeader><CardTitle>Persönliche Daten</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Vorname</label>
                        <p className="font-medium">{user?.first_name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Nachname</label>
                        <p className="font-medium">{user?.last_name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">E-Mail</label>
                        <p className="font-medium">{user?.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Telefon</label>
                        <p className="font-medium">{user?.phone || '-'}</p>
                      </div>
                    </div>
                    <Button variant="outline" className="mt-6">Daten bearbeiten</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="addresses">
                <Card>
                  <CardHeader><CardTitle>Adressbuch</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-gray-500">Hier können Sie Ihre Liefer- und Rechnungsadressen verwalten.</p>
                    {/* Placeholder for Address Management */}
                    <Button className="mt-4 bg-[#1e3a5f]">Neue Adresse hinzufügen</Button>
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
