import React, { lazy, Suspense } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { Loader } from "lucide-react";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Lazy Loaded Pages
const HomePage = lazy(() => import("./pages/HomePage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrderConfirmationPage = lazy(() => import("./pages/OrderConfirmationPage"));

const SpecialProductsPage = lazy(() => import("./pages/SpecialProductsPage"));
const MarkenPage = lazy(() => import("./pages/MarkenPage"));
const AlleKategorienPage = lazy(() => import("./pages/AlleKategorienPage"));

const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const AccountPage = lazy(() => import("./pages/AccountPage"));

const ImpressumPage = lazy(() => import("./pages/ImpressumPage"));
const DatenschutzPage = lazy(() => import("./pages/DatenschutzPage"));
const AGBPage = lazy(() => import("./pages/AGBPage"));
const VersandPage = lazy(() => import("./pages/VersandPage"));
const RueckgabePage = lazy(() => import("./pages/RueckgabePage"));
const ZahlungsartenPage = lazy(() => import("./pages/ZahlungsartenPage"));
const HilfePage = lazy(() => import("./pages/HilfePage"));
const KontaktPage = lazy(() => import("./pages/KontaktPage"));

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminProductEdit = lazy(() => import("./pages/admin/AdminProductEdit")); // New
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers"));
const AdminWorkshop = lazy(() => import("./pages/admin/AdminWorkshop"));
const AdminCars = lazy(() => import("./pages/admin/AdminCars"));

const WorkshopPage = lazy(() => import("./pages/WorkshopPage"));
const CarDealershipPage = lazy(() => import("./pages/CarDealershipPage"));

const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gray-50">
    <div className="text-center">
      <Loader className="h-10 w-10 animate-spin text-[#1e3a5f] mx-auto mb-4" />
      <p className="text-gray-500 font-medium">Laden...</p>
    </div>
  </div>
);

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/kategorie/:categoryId" element={<CategoryPage />} />
                <Route path="/kategorie/:categoryId/:subcategoryId" element={<CategoryPage />} />
                <Route path="/produkt/:productId" element={<ProductPage />} />
                <Route path="/warenkorb" element={<CartPage />} />
                <Route path="/kasse" element={<CheckoutPage />} />
                <Route path="/bestellung/:orderId" element={<OrderConfirmationPage />} />

                {/* Lists */}
                <Route path="/kategorien" element={<AlleKategorienPage />} />
                <Route path="/angebote" element={<SpecialProductsPage title="Aktuelle Angebote" type="offers" />} />
                <Route path="/neuheiten" element={<SpecialProductsPage title="Neuheiten" type="new" />} />
                <Route path="/bestseller" element={<SpecialProductsPage title="Bestseller" type="bestseller" />} />
                <Route path="/marken" element={<MarkenPage />} />
                <Route path="/marke/:brandId" element={<CategoryPage />} />

                {/* Service & Pillars */}
                <Route path="/werkstatt" element={<WorkshopPage />} />
                <Route path="/fahrzeuge" element={<CarDealershipPage />} />
                <Route path="/ankauf" element={<KontaktPage />} />

                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/registrieren" element={<RegisterPage />} />
                <Route path="/konto" element={<AccountPage />} />
                <Route path="/passwort-vergessen" element={<LoginPage />} />

                {/* Legal & Info Routes */}
                <Route path="/impressum" element={<ImpressumPage />} />
                <Route path="/datenschutz" element={<DatenschutzPage />} />
                <Route path="/agb" element={<AGBPage />} />
                <Route path="/widerruf" element={<AGBPage />} />
                <Route path="/versand" element={<VersandPage />} />
                <Route path="/rueckgabe" element={<RueckgabePage />} />
                <Route path="/zahlung" element={<ZahlungsartenPage />} />
                <Route path="/hilfe" element={<HilfePage />} />
                <Route path="/kontakt" element={<KontaktPage />} />
                <Route path="/newsletter" element={<HomePage />} />
                <Route path="/business" element={<KontaktPage />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/werkstatt" element={<AdminWorkshop />} />
                <Route path="/admin/fahrzeuge" element={<AdminCars />} />
                <Route path="/admin/produkte" element={<AdminProducts />} />
                <Route path="/admin/produkte/neu" element={<AdminProductEdit />} />
                <Route path="/admin/produkte/:id" element={<AdminProductEdit />} />
                <Route path="/admin/bestellungen" element={<AdminOrders />} />
                <Route path="/admin/kunden" element={<AdminCustomers />} />
                <Route path="/admin/*" element={<AdminDashboard />} />

              </Routes>
            </Suspense>
          </BrowserRouter>
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
