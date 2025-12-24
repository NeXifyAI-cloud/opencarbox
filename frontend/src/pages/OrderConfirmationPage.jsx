import React from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { CheckCircle, Package, Truck, Mail, Phone, ArrowRight } from 'lucide-react';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const order = location.state?.order;
  const isNew = location.state?.isNew;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-3xl mx-auto px-4 py-12">
        {isNew && (
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-[#1e3a5f] mb-2">Vielen Dank für Ihre Bestellung!</h1>
            <p className="text-gray-600">
              Wir haben Ihre Bestellung erhalten und werden sie schnellstmöglich bearbeiten.
            </p>
          </div>
        )}

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6 pb-6 border-b">
              <div>
                <p className="text-sm text-gray-500">Bestellnummer</p>
                <p className="text-xl font-mono font-bold text-[#1e3a5f]">
                  {order?.order_number || orderId}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Bestelldatum</p>
                <p className="font-medium">
                  {order?.created_at 
                    ? new Date(order.created_at).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })
                    : new Date().toLocaleDateString('de-DE')
                  }
                </p>
              </div>
            </div>

            {order && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-[#1e3a5f] mb-3 flex items-center gap-2">
                      <Truck className="h-5 w-5 text-[#4fd1c5]" /> Lieferadresse
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium">
                        {order.shipping_info?.first_name} {order.shipping_info?.last_name}
                      </p>
                      <p className="text-gray-600">
                        {order.shipping_info?.address?.street} {order.shipping_info?.address?.house_number}
                      </p>
                      <p className="text-gray-600">
                        {order.shipping_info?.address?.postal_code} {order.shipping_info?.address?.city}
                      </p>
                      <p className="text-gray-600">{order.shipping_info?.address?.country}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1e3a5f] mb-3 flex items-center gap-2">
                      <Mail className="h-5 w-5 text-[#4fd1c5]" /> Kontakt
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-4 w-4" /> {order.shipping_info?.email}
                      </p>
                      <p className="flex items-center gap-2 text-gray-600 mt-2">
                        <Phone className="h-4 w-4" /> {order.shipping_info?.phone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-[#1e3a5f] mb-3 flex items-center gap-2">
                    <Package className="h-5 w-5 text-[#4fd1c5]" /> Bestellte Artikel
                  </h3>
                  <div className="space-y-3">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <img 
                          src={item.product_image || 'https://via.placeholder.com/60'} 
                          alt={item.product_name}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-gray-500">SKU: {item.product_sku}</p>
                          <p className="text-sm text-gray-500">Menge: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">{item.total_price?.toFixed(2).replace('.', ',')} €</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Zwischensumme</span>
                      <span>{order.subtotal?.toFixed(2).replace('.', ',')} €</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Versand</span>
                      <span className={order.shipping_cost === 0 ? 'text-green-600' : ''}>
                        {order.shipping_cost === 0 ? 'Kostenlos' : `${order.shipping_cost?.toFixed(2).replace('.', ',')} €`}
                      </span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Rabatt ({order.discount_code})</span>
                        <span>-{order.discount?.toFixed(2).replace('.', ',')} €</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xl font-bold pt-2 border-t">
                      <span>Gesamt</span>
                      <span className="text-[#1e3a5f]">{order.total?.toFixed(2).replace('.', ',')} €</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="bg-[#1e3a5f]/5 rounded-lg p-6 text-center">
          <h3 className="font-semibold text-[#1e3a5f] mb-2">Was passiert als Nächstes?</h3>
          <p className="text-gray-600 mb-4">
            Sie erhalten in Kürze eine Bestätigungs-E-Mail mit den Bestelldetails. 
            Sobald Ihre Bestellung versandt wurde, senden wir Ihnen die Tracking-Informationen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="bg-[#4fd1c5] hover:bg-[#38b2ac] text-[#1e3a5f]">
                Weiter einkaufen <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link to="/konto">
              <Button variant="outline">Meine Bestellungen</Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmationPage;
