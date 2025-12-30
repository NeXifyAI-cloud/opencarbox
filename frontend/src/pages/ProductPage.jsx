import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { featuredProducts } from '../data/mockData';
import { 
  Star, Heart, ShoppingCart, Truck, RotateCcw, Shield, 
  ChevronRight, Plus, Minus, Check, Info, Loader, Wrench, ArrowRight
} from 'lucide-react';
import { Button } from '../components/ui/button';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../hooks/use-toast';

const ProductPage = () => {
  const { productId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        let data = null;
        try {
            data = await productService.getById(productId);
        } catch (err) {
             console.warn("API fetch failed, falling back to mock data", err);
             data = featuredProducts.find(p => p.id === parseInt(productId) || p.id === productId);
        }

        if (!data) {
             data = featuredProducts[0];
        }

        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    const result = await addToCart(product.id, quantity);
    if (result.success) {
        toast({
            title: "Hinzugefügt",
            description: `${quantity}x ${product.name} wurde zum Warenkorb hinzugefügt.`,
        });
    } else {
         toast({
            variant: "destructive",
            title: "Fehler",
            description: "Konnte nicht zum Warenkorb hinzugefügt werden.",
        });
    }
  };

  if (loading || !product) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <Loader className="h-10 w-10 animate-spin text-[#1e3a5f]" />
        </div>
      );
  }

  const productImages = product.images || [product.image] || ['https://via.placeholder.com/600'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#4fd1c5]">Startseite</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/kategorien" className="hover:text-[#4fd1c5]">Produkte</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[#1e3a5f] font-medium truncate">{product.name}</span>
        </nav>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div>
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                <ImageWithFallback
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.discount_percent && (
                    <Badge className="absolute top-4 left-4 bg-red-500 text-white font-bold text-lg px-3 py-1">
                      -{product.discount_percent}%
                    </Badge>
                )}
                <button className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-md hover:bg-[#4fd1c5] hover:text-white transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
              </div>
              {productImages.length > 1 && (
                  <div className="flex gap-3">
                    {productImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === index ? 'border-[#4fd1c5]' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <ImageWithFallback src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
              )}
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
                        i < Math.floor(product.rating || 4)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">({product.review_count || 0} Bewertungen)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-[#1e3a5f]">
                  {product.price?.toFixed(2).replace('.', ',')} €
                </span>
                {product.original_price && (
                    <>
                        <span className="text-lg text-gray-400 line-through">
                          {product.original_price.toFixed(2).replace('.', ',')} €
                        </span>
                        <Badge className="bg-red-100 text-red-600">Sie sparen {(product.original_price - product.price).toFixed(2).replace('.', ',')} €</Badge>
                    </>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                <Check className={`h-5 w-5 ${product.is_active ? 'text-green-500' : 'text-red-500'}`} />
                <span className={`${product.is_active ? 'text-green-600' : 'text-red-600'} font-medium`}>
                    {product.is_active ? 'Auf Lager - Lieferbar in 1-3 Werktagen' : 'Derzeit nicht verfügbar'}
                </span>
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
                <Button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-[#4fd1c5] hover:bg-[#38b2ac] text-[#1e3a5f] font-semibold py-6 text-lg flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  In den Warenkorb
                </Button>
              </div>

              {/* Cross-Sell Workshop Service */}
              <div className="bg-[#e6fffa] border border-[#4fd1c5] rounded-lg p-4 mb-6 flex items-start gap-4">
                <div className="bg-white p-2 rounded-full shadow-sm">
                  <Wrench className="h-6 w-6 text-[#1e3a5f]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#1e3a5f]">Einbau-Service gewünscht?</h3>
                  <p className="text-sm text-gray-700 mt-1">
                    Lassen Sie dieses Ersatzteil direkt in unserer OpenCarBox Werkstatt montieren.
                  </p>
                  <Link to="/werkstatt" className="inline-flex items-center text-sm font-bold text-[#1e3a5f] hover:text-[#4fd1c5] mt-2 group">
                    Termin vereinbaren <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
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
              <TabsTrigger value="reviews">Bewertungen</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description">
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-[#1e3a5f]">Produktbeschreibung</h3>
                <p className="text-gray-600 mt-2">
                  {product.description || `Hochwertige ${product.name} vom Markenhersteller ${product.brand}.`}
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="specifications">
               <p>Keine Spezifikationen verfügbar.</p>
            </TabsContent>
            
            <TabsContent value="compatibility">
              <p className="mt-4 text-sm text-gray-500 flex items-center gap-1">
                <Info className="h-4 w-4" />
                Bitte überprüfen Sie die Kompatibilität mit Ihrem Fahrzeug vor dem Kauf.
              </p>
            </TabsContent>
            
            <TabsContent value="reviews">
              <p>Noch keine Bewertungen.</p>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
