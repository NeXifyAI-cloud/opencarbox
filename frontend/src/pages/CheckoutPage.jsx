import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Checkbox } from '../components/ui/checkbox';
import axios from 'axios';
import { 
  ChevronRight, CreditCard, Truck, Shield, Lock, Check,
  AlertCircle
} from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CheckoutPage = () => {
  const { cart, sessionId, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    street: '',
    house_number: '',
    postal_code: '',
    city: '',
    country: 'Österreich',
    billing_same: true,
    payment_method: 'paypal',
    notes: '',
    terms_accepted: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const applyCoupon = async () => {
    try {
      const response = await axios.post(`${API}/cart/coupon?code=${couponCode}`, null, {
        headers: { 'X-Session-ID': sessionId }
      });
      setCouponApplied(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Gutschein ungültig');
      setCouponApplied(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.terms_accepted) {
      setError('Bitte akzeptieren Sie die AGB');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        shipping_info: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          address: {
            street: formData.street,
            house_number: formData.house_number,
            postal_code: formData.postal_code,
            city: formData.city,
            country: formData.country
          }
        },
        billing_same_as_shipping: formData.billing_same,
        payment_method: formData.payment_method,
        coupon_code: couponApplied?.code || null,
        notes: formData.notes || null
      };

      const response = await axios.post(`${API}/orders`, orderData, {
        headers: { 'X-Session-ID': sessionId }
      });

      // Weiterleitung zur Bestellbestätigung
      navigate(`/bestellung/${response.data.order_number}`, {
        state: { order: response.data, isNew: true }
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Bestellung fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart.subtotal || 0;
  const shipping = subtotal >= 120 ? 0 : 5.99;
  const discount = couponApplied?.discount || 0;
  const total = subtotal + shipping - discount;

  if (cart.items?.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-[#1e3a5f] mb-4">Ihr Warenkorb ist leer</h1>
          <Link to="/">
            <Button className="bg-[#4fd1c5] hover:bg-[#38b2ac] text-[#1e3a5f]">Weiter einkaufen</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartItems={cart.item_count} />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-[#4fd1c5]">Startseite</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/warenkorb" className="hover:text-[#4fd1c5]">Warenkorb</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[#1e3a5f]">Kasse</span>
        </nav>

        <h1 className="text-3xl font-bold text-[#1e3a5f] mb-8">Zur Kasse</h1>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Lieferadresse */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-[#4fd1c5]" />
                    Lieferadresse
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Vorname *</Label>
                      <Input name="first_name" value={formData.first_name} onChange={handleChange} required />
                    </div>
                    <div>
                      <Label>Nachname *</Label>
                      <Input name="last_name" value={formData.last_name} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>E-Mail *</Label>
                      <Input name="email" type="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div>
                      <Label>Telefon *</Label>
                      <Input name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Label>Straße *</Label>
                      <Input name="street" value={formData.street} onChange={handleChange} required />
                    </div>
                    <div>
                      <Label>Hausnr. *</Label>
                      <Input name="house_number" value={formData.house_number} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>PLZ *</Label>
                      <Input name="postal_code" value={formData.postal_code} onChange={handleChange} required />
                    </div>
                    <div className="col-span-2">
                      <Label>Stadt *</Label>
                      <Input name="city" value={formData.city} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="billing_same" 
                      checked={formData.billing_same}
                      onCheckedChange={(checked) => setFormData(prev => ({...prev, billing_same: checked}))}
                    />
                    <label htmlFor="billing_same" className="text-sm">Rechnungsadresse ist gleich der Lieferadresse</label>
                  </div>
                </CardContent>
              </Card>

              {/* Zahlungsart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-[#4fd1c5]" />
                    Zahlungsart
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={formData.payment_method} 
                    onValueChange={(value) => setFormData(prev => ({...prev, payment_method: value}))}
                  >
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-[#4fd1c5] cursor-pointer">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <label htmlFor="paypal" className="flex-1 cursor-pointer">
                        <span className="font-medium">PayPal</span>
                        <p className="text-sm text-gray-500">Sicher bezahlen mit PayPal</p>
                      </label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-[#4fd1c5] cursor-pointer">
                      <RadioGroupItem value="credit_card" id="credit_card" />
                      <label htmlFor="credit_card" className="flex-1 cursor-pointer">
                        <span className="font-medium">Kreditkarte</span>
                        <p className="text-sm text-gray-500">Visa, Mastercard, American Express</p>
                      </label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-[#4fd1c5] cursor-pointer">
                      <RadioGroupItem value="klarna" id="klarna" />
                      <label htmlFor="klarna" className="flex-1 cursor-pointer">
                        <span className="font-medium">Klarna</span>
                        <p className="text-sm text-gray-500">Rechnung oder Ratenzahlung</p>
                      </label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-[#4fd1c5] cursor-pointer">
                      <RadioGroupItem value="sepa" id="sepa" />
                      <label htmlFor="sepa" className="flex-1 cursor-pointer">
                        <span className="font-medium">SEPA-Lastschrift</span>
                        <p className="text-sm text-gray-500">Direkt vom Bankkonto</p>
                      </label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Bemerkungen */}
              <Card>
                <CardHeader>
                  <CardTitle>Bemerkungen (optional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea 
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Besondere Anweisungen zur Lieferung..."
                    className="w-full p-3 border rounded-lg resize-none h-24"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Bestellzusammenfassung</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3 max-h-60 overflow-auto">
                    {cart.items?.map((item, index) => (
                      <div key={index} className="flex gap-3">
                        <img 
                          src={item.product?.image || 'https://via.placeholder.com/60'} 
                          alt="" 
                          className="w-14 h-14 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.product?.name}</p>
                          <p className="text-xs text-gray-500">{item.quantity}x {item.price?.toFixed(2)} €</p>
                        </div>
                        <span className="font-semibold text-sm">{item.total?.toFixed(2)} €</span>
                      </div>
                    ))}
                  </div>

                  {/* Gutschein */}
                  <div className="border-t pt-4">
                    <Label>Gutscheincode</Label>
                    <div className="flex gap-2 mt-1">
                      <Input 
                        value={couponCode} 
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Code eingeben"
                      />
                      <Button type="button" variant="outline" onClick={applyCoupon}>Einlösen</Button>
                    </div>
                    {couponApplied && (
                      <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                        <Check className="h-4 w-4" /> {couponApplied.message}
                      </p>
                    )}
                  </div>

                  {/* Totals */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Zwischensumme</span>
                      <span>{subtotal.toFixed(2).replace('.', ',')} €</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Versand</span>
                      <span className={shipping === 0 ? 'text-green-600' : ''}>
                        {shipping === 0 ? 'Kostenlos' : `${shipping.toFixed(2).replace('.', ',')} €`}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Rabatt</span>
                        <span>-{discount.toFixed(2).replace('.', ',')} €</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Gesamt</span>
                      <span className="text-[#1e3a5f]">{total.toFixed(2).replace('.', ',')} €</span>
                    </div>
                    <p className="text-xs text-gray-500">inkl. MwSt.</p>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-2">
                    <Checkbox 
                      id="terms" 
                      checked={formData.terms_accepted}
                      onCheckedChange={(checked) => setFormData(prev => ({...prev, terms_accepted: checked}))}
                    />
                    <label htmlFor="terms" className="text-xs text-gray-600">
                      Ich akzeptiere die <Link to="/agb" className="text-[#4fd1c5] hover:underline">AGB</Link> und 
                      <Link to="/datenschutz" className="text-[#4fd1c5] hover:underline"> Datenschutzerklärung</Link> *
                    </label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#4fd1c5] hover:bg-[#38b2ac] text-[#1e3a5f] font-semibold py-6"
                    disabled={loading || !formData.terms_accepted}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    {loading ? 'Wird verarbeitet...' : 'Zahlungspflichtig bestellen'}
                  </Button>

                  {/* Trust */}
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Shield className="h-4 w-4 text-[#4fd1c5]" />
                    <span>SSL-verschlüsselte Verbindung</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
