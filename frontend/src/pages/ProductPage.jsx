import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { featuredProducts } from '../data/mockData';
import { 
  Star, Heart, ShoppingCart, Truck, RotateCcw, Shield, 
  ChevronRight, Plus, Minus, Check, Info
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const ProductPage = () => {
  const { productId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Find product or use first one as demo
  const product = featuredProducts.find(p => p.id === parseInt(productId)) || featuredProducts[0];

  const productImages = [
    product.image,
    'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
  ];

  const specifications = [
    { label: 'Artikelnummer', value: `CT-${product.id}12345` },
    { label: 'Hersteller', value: product.brand },
    { label: 'Herstellernummer', value: 'OE 123.456.789' },
    { label: 'Gewicht', value: '1,5 kg' },
    { label: 'Einbauseite', value: 'Vorderachse' },
  ];

  const compatibility = [
    'VW Golf VII (2012-2020)',
    'VW Passat B8 (2014-2022)',
    'Audi A3 8V (2012-2020)',
    'Seat Leon III (2012-2020)',
    'Škoda Octavia III (2012-2020)',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartItems={quantity} />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#4fd1c5]">Startseite</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/kategorie/ersatzteile" className="hover:text-[#4fd1c5]">Ersatzteile</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[#1e3a5f] font-medium">{product.name}</span>
        </nav>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div>
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-red-500 text-white font-bold text-lg px-3 py-1">
                  -{product.discount}%
                </Badge>
                <button className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-md hover:bg-[#4fd1c5] hover:text-white transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
              </div>
              <div className="flex gap-3">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-[#4fd1c5]' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <span className="text-sm text-gray-500 uppercase tracking-wider">{product.brand}</span>
              <h1 className="text-2xl md:text-3xl font-bold text-[#1e3a5f] mt-1 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">({product.reviews} Bewertungen)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-[#1e3a5f]">
                  {product.price.toFixed(2).replace('.', ',')} €
                </span>
                <span className="text-lg text-gray-400 line-through">
                  {product.originalPrice.toFixed(2).replace('.', ',')} €
                </span>
                <Badge className="bg-red-100 text-red-600">Sie sparen {(product.originalPrice - product.price).toFixed(2).replace('.', ',')} €</Badge>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-green-600 font-medium">Auf Lager - Lieferbar in 1-3 Werktagen</span>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button className="flex-1 bg-[#4fd1c5] hover:bg-[#38b2ac] text-[#1e3a5f] font-semibold py-6 text-lg flex items-center justify-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  In den Warenkorb
                </Button>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-[#4fd1c5]" />
                  <span className="text-sm">Gratis Versand ab 120€</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-[#4fd1c5]" />
                  <span className="text-sm">30 Tage Rückgabe</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#4fd1c5]" />
                  <span className="text-sm">Herstellergarantie</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="description">Beschreibung</TabsTrigger>
              <TabsTrigger value="specifications">Spezifikationen</TabsTrigger>
              <TabsTrigger value="compatibility">Fahrzeuge</TabsTrigger>
              <TabsTrigger value="reviews">Bewertungen ({product.reviews})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description">
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-[#1e3a5f]">Produktbeschreibung</h3>
                <p className="text-gray-600 mt-2">
                  Hochwertige {product.name} vom Markenhersteller {product.brand}. Dieses Produkt 
                  entspricht den OE-Spezifikationen und ist für eine Vielzahl von Fahrzeugen geeignet. 
                  Die Qualität und Verarbeitung entspricht höchsten Standards und garantiert eine lange Lebensdauer.
                </p>
                <h4 className="font-semibold mt-4">Vorteile:</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>OE-Qualität vom Markenhersteller</li>
                  <li>Einfache Montage</li>
                  <li>Lange Lebensdauer</li>
                  <li>Inklusive Herstellergarantie</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="specifications">
              <table className="w-full">
                <tbody>
                  {specifications.map((spec, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-3 px-4 font-medium text-[#1e3a5f]">{spec.label}</td>
                      <td className="py-3 px-4 text-gray-600">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabsContent>
            
            <TabsContent value="compatibility">
              <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4">Passend für folgende Fahrzeuge:</h3>
              <ul className="space-y-2">
                {compatibility.map((car, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-600">
                    <Check className="h-4 w-4 text-green-500" />
                    {car}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-gray-500 flex items-center gap-1">
                <Info className="h-4 w-4" />
                Bitte überprüfen Sie die Kompatibilität mit Ihrem Fahrzeug vor dem Kauf.
              </p>
            </TabsContent>
            
            <TabsContent value="reviews">
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="border-b pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < 5 - index ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">Verifizierter Kauf</span>
                    </div>
                    <p className="text-gray-600">
                      {index === 0 && 'Hervorragende Qualität, passt perfekt. Schnelle Lieferung!'}
                      {index === 1 && 'Gutes Produkt, einfache Montage. Empfehlenswert.'}
                      {index === 2 && 'Sehr zufrieden mit dem Kauf. Preis-Leistung stimmt.'}
                    </p>
                    <span className="text-xs text-gray-400 mt-2 block">
                      {new Date(Date.now() - index * 86400000 * 7).toLocaleDateString('de-DE')}
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">Ähnliche Produkte</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredProducts.slice(0, 4).map((p) => (
              <Link
                key={p.id}
                to={`/produkt/${p.id}`}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all"
              >
                <img src={p.image} alt={p.name} className="w-full h-32 object-cover rounded mb-3" />
                <h3 className="text-sm font-medium text-[#1e3a5f] line-clamp-2">{p.name}</h3>
                <p className="text-lg font-bold text-[#1e3a5f] mt-2">{p.price.toFixed(2).replace('.', ',')} €</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
