import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Public Pages
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";

// Special List Pages
import SpecialProductsPage from "./pages/SpecialProductsPage";
import MarkenPage from "./pages/MarkenPage";
import AlleKategorienPage from "./pages/AlleKategorienPage";

// Auth Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccountPage from "./pages/AccountPage";

// Legal & Info Pages
import ImpressumPage from "./pages/ImpressumPage";
import DatenschutzPage from "./pages/DatenschutzPage";
import AGBPage from "./pages/AGBPage";
import VersandPage from "./pages/VersandPage";
import RueckgabePage from "./pages/RueckgabePage";
import ZahlungsartenPage from "./pages/ZahlungsartenPage";
import HilfePage from "./pages/HilfePage";
import KontaktPage from "./pages/KontaktPage";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminWorkshop from "./pages/admin/AdminWorkshop";
import AdminCars from "./pages/admin/AdminCars";

import WorkshopPage from "./pages/WorkshopPage";
import CarDealershipPage from "./pages/CarDealershipPage";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
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
              <Route path="/admin/bestellungen" element={<AdminOrders />} />
              <Route path="/admin/kunden" element={<AdminCustomers />} />
              {/* Fallback for other admin routes to Dashboard or specific page */}
              <Route path="/admin/*" element={<AdminDashboard />} />

            </Routes>
          </BrowserRouter>
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
