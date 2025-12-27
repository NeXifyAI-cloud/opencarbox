import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, Truck, Shield, Tag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, applyCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');
  
  const cartItems = cart.items || [];
  
  // Calculations (Backend handles this ideally, but good for UI responsiveness)
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 120 ? 0 : 5.99;
  const total = subtotal + shipping;

  const handleUpdateQuantity = (id, newQty) => {
      if (newQty < 1) return;
      updateQuantity(id, newQty);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartItems={cart.item_count} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#1e3a5f] mb-8">Warenkorb</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-[#1e3a5f] mb-2">Ihr Warenkorb ist leer</h2>
            <p className="text-gray-500 mb-6">Entdecken Sie unsere Produkte und füllen Sie Ihren Warenkorb!</p>
            <Link to="/">
              <Button className="bg-[#4fd1c5] hover:bg-[#38b2ac] text-[#1e3a5f]">
                Weiter einkaufen
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id || item.product_id}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex gap-4"
                >
                  <Link to={`/produkt/${item.product_id || item.id}`} className="flex-shrink-0">
                    <img
                      src={item.image || 'https://via.placeholder.com/150'}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </Link>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <span className="text-xs text-gray-500">{item.brand}</span>
                        <Link to={`/produkt/${item.product_id || item.id}`}>
                          <h3 className="font-semibold text-[#1e3a5f] hover:text-[#4fd1c5] transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-green-600 mt-1">Auf Lager</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product_id || item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => handleUpdateQuantity(item.product_id || item.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.product_id || item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-[#1e3a5f]">
                          {(item.price * item.quantity).toFixed(2).replace('.', ',')} €
                        </span>
                        {item.quantity > 1 && (
                          <p className="text-xs text-gray-500">
                            {item.price.toFixed(2).replace('.', ',')} € / Stück
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Link to="/" className="inline-flex items-center text-[#4fd1c5] hover:text-[#38b2ac] font-medium">
                <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
                Weiter einkaufen
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-6">
                <h2 className="text-lg font-bold text-[#1e3a5f] mb-4">Bestellzusammenfassung</h2>
                
                {/* Coupon Code */}
                <div className="mb-4">
                  <label className="text-sm text-gray-600 mb-2 block">Gutscheincode</label>
                  <div className="flex gap-2">
                    <Input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Code eingeben"
                      className="flex-1"
                    />
                    <Button 
                        variant="outline" 
                        className="flex items-center gap-1"
                        onClick={() => applyCoupon(couponCode)}
                    >
                      <Tag className="h-4 w-4" />
                      Einlösen
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Zwischensumme</span>
                    <span>{subtotal.toFixed(2).replace('.', ',')} €</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Versand</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                      {shipping === 0 ? 'Kostenlos' : `${shipping.toFixed(2).replace('.', ',')} €`}
                    </span>
                  </div>
                  {subtotal < 120 && (
                    <p className="text-xs text-gray-500">
                      Noch {(120 - subtotal).toFixed(2).replace('.', ',')} € bis zum kostenlosen Versand
                    </p>
                  )}
                  <div className="flex justify-between text-lg font-bold text-[#1e3a5f] border-t pt-3">
                    <span>Gesamtsumme</span>
                    <span>{total.toFixed(2).replace('.', ',')} €</span>
                  </div>
                  <p className="text-xs text-gray-500">inkl. MwSt.</p>
                </div>

                <Link to="/kasse">
                    <Button className="w-full mt-6 bg-[#4fd1c5] hover:bg-[#38b2ac] text-[#1e3a5f] font-semibold py-6 text-lg">
                    Zur Kasse
                    </Button>
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="h-4 w-4 text-[#4fd1c5]" />
                    <span>Gratis Versand ab 120€</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4 text-[#4fd1c5]" />
                    <span>Sichere Zahlung</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
