import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { CheckCircle2, CreditCard, Truck, AlertTriangle } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import axios from 'axios';
import { useToast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CheckoutPage = () => {
  const { cart, clearCart, sessionId } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    paymentMethod: 'card'
  });

  const cartItems = cart.items || [];
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 120 ? 0 : 5.99;
  const total = subtotal + shipping;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // 1. Create order payload
      const orderData = {
        shipping_address: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          address: {
            street: formData.address,
            city: formData.city,
            postal_code: formData.zip,
            country: "AT" // Default for now
          }
        },
        payment_method: formData.paymentMethod,
        items: cartItems.map(item => ({
          product_id: item.product_id || item.id,
          quantity: item.quantity,
          price: item.price
        })),
        session_id: sessionId
      };

      // 2. Send to backend
      const response = await axios.post(`${API}/orders`, orderData);
      
      if (response.data.id || response.data.order_number) {
        // 3. Clear cart and redirect
        await clearCart();
        navigate(`/bestellung/${response.data.order_number}`);
      } else {
        throw new Error("Keine Bestellnummer erhalten");
      }

    } catch (error) {
      console.error("Order failed:", error);
      toast({
        variant: "destructive",
        title: "Fehler bei der Bestellung",
        description: error.response?.data?.detail || "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && step === 1) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#1e3a5f] mb-4">Ihr Warenkorb ist leer</h1>
            <Button onClick={() => navigate('/')}>Zurück zum Shop</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-8 relative">
          <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-10"></div>
          
          <div className={`flex flex-col items-center bg-gray-50 px-4 z-10 ${step >= 1 ? 'text-[#1e3a5f]' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 font-bold ${
              step >= 1 ? 'bg-[#1e3a5f] text-white' : 'bg-gray-200'
            }`}>1</div>
            <span className="text-sm font-medium">Adresse</span>
          </div>
          
          <div className={`flex flex-col items-center bg-gray-50 px-4 z-10 ${step >= 2 ? 'text-[#1e3a5f]' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 font-bold ${
              step >= 2 ? 'bg-[#1e3a5f] text-white' : 'bg-gray-200'
            }`}>2</div>
            <span className="text-sm font-medium">Zahlung</span>
          </div>
          
          <div className={`flex flex-col items-center bg-gray-50 px-4 z-10 ${step >= 3 ? 'text-[#1e3a5f]' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 font-bold ${
              step >= 3 ? 'bg-[#1e3a5f] text-white' : 'bg-gray-200'
            }`}>3</div>
            <span className="text-sm font-medium">Prüfen</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Lieferadresse</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Vorname</Label>
                      <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Max" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nachname</Label>
                      <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Mustermann" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="max@beispiel.at" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Straße & Hausnummer</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Musterstraße 1" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zip">PLZ</Label>
                      <Input id="zip" name="zip" value={formData.zip} onChange={handleInputChange} placeholder="1010" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Stadt</Label>
                      <Input id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="Wien" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleNextStep} className="bg-[#1e3a5f] hover:bg-[#2d4a6f]" disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.address}>
                    Weiter zur Zahlung
                  </Button>
                </CardFooter>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Zahlungsart</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div 
                    className={`border p-4 rounded-lg flex items-center gap-4 cursor-pointer ${formData.paymentMethod === 'card' ? 'border-[#4fd1c5] bg-teal-50' : 'border-gray-200'}`}
                    onClick={() => setFormData({...formData, paymentMethod: 'card'})}
                  >
                    <div className="bg-white p-2 rounded-full border">
                      <CreditCard className="h-6 w-6 text-[#1e3a5f]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1e3a5f]">Kreditkarte</h3>
                      <p className="text-sm text-gray-500">Visa, Mastercard, Amex</p>
                    </div>
                    {formData.paymentMethod === 'card' && <CheckCircle2 className="ml-auto h-5 w-5 text-[#4fd1c5]" />}
                  </div>

                  <div 
                    className={`border p-4 rounded-lg flex items-center gap-4 cursor-pointer ${formData.paymentMethod === 'paypal' ? 'border-[#4fd1c5] bg-teal-50' : 'border-gray-200'}`}
                    onClick={() => setFormData({...formData, paymentMethod: 'paypal'})}
                  >
                    <div className="bg-white p-2 rounded-full border">
                      <span className="font-bold text-[#003087]">Pay</span><span className="font-bold text-[#009cde]">Pal</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1e3a5f]">PayPal</h3>
                      <p className="text-sm text-gray-500">Schnell und sicher bezahlen</p>
                    </div>
                    {formData.paymentMethod === 'paypal' && <CheckCircle2 className="ml-auto h-5 w-5 text-[#4fd1c5]" />}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevStep}>Zurück</Button>
                  <Button onClick={handleNextStep} className="bg-[#1e3a5f] hover:bg-[#2d4a6f]">Weiter zur Prüfung</Button>
                </CardFooter>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Bestellung prüfen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-bold text-[#1e3a5f] mb-2">Lieferadresse</h3>
                      <p className="text-sm text-gray-600">
                        {formData.firstName} {formData.lastName}<br />
                        {formData.address}<br />
                        {formData.zip} {formData.city}<br />
                        {formData.email}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-[#1e3a5f] mb-2">Artikel</h3>
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div key={item.id || item.product_id} className="flex justify-between text-sm">
                            <span className="text-gray-600">{item.quantity}x {item.name}</span>
                            <span className="font-medium text-[#1e3a5f]">{(item.price * item.quantity).toFixed(2).replace('.', ',')} €</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevStep}>Zurück</Button>
                  <Button 
                    onClick={handlePlaceOrder} 
                    className="bg-[#4fd1c5] hover:bg-[#38b2ac] text-[#1e3a5f] font-bold"
                    disabled={loading}
                  >
                    {loading ? 'Wird verarbeitet...' : `Kostenpflichtig bestellen (${total.toFixed(2).replace('.', ',')} €)`}
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-6">
              <h2 className="text-lg font-bold text-[#1e3a5f] mb-4">Zusammenfassung</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Zwischensumme</span>
                  <span>{subtotal.toFixed(2).replace('.', ',')} €</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Versand</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>
                    {shipping === 0 ? 'Kostenlos' : `${shipping.toFixed(2).replace('.', ',')} €`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold text-[#1e3a5f] border-t pt-3">
                  <span>Gesamtsumme</span>
                  <span>{total.toFixed(2).replace('.', ',')} €</span>
                </div>
                <p className="text-xs text-gray-500">inkl. MwSt.</p>
              </div>
              
              <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
                <Truck className="h-4 w-4 text-[#4fd1c5]" />
                <span>Lieferung in 1-3 Werktagen</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckoutPage;
