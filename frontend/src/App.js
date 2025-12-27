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

// Auth Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccountPage from "./pages/AccountPage";

// Legal Pages
import ImpressumPage from "./pages/ImpressumPage";
import DatenschutzPage from "./pages/DatenschutzPage";
import AGBPage from "./pages/AGBPage";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCustomers from "./pages/admin/AdminCustomers";

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

              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registrieren" element={<RegisterPage />} />
              <Route path="/konto" element={<AccountPage />} />

              {/* Legal Routes */}
              <Route path="/impressum" element={<ImpressumPage />} />
              <Route path="/datenschutz" element={<DatenschutzPage />} />
              <Route path="/agb" element={<AGBPage />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/produkte" element={<AdminProducts />} />
              <Route path="/admin/bestellungen" element={<AdminOrders />} />
              <Route path="/admin/kunden" element={<AdminCustomers />} />

              {/* Placeholder Routes */}
              <Route path="/kategorien" element={<CategoryPage />} />
              <Route path="/angebote" element={<CategoryPage />} />
              <Route path="/marken" element={<HomePage />} />
              <Route path="/marke/:brandId" element={<CategoryPage />} />
              <Route path="/merkzettel" element={<AccountPage />} />
              <Route path="/newsletter" element={<HomePage />} />
              <Route path="/hilfe" element={<HomePage />} />
              <Route path="/widerruf" element={<AGBPage />} />
              <Route path="/werkstatt" element={<WorkshopPage />} />
              <Route path="/fahrzeuge" element={<CarDealershipPage />} />
              <Route path="/kontakt" element={<ImpressumPage />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
