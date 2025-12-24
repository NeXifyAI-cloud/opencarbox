import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";

// Pages
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/kategorie/:categoryId" element={<CategoryPage />} />
          <Route path="/kategorie/:categoryId/:subcategoryId" element={<CategoryPage />} />
          <Route path="/produkt/:productId" element={<ProductPage />} />
          <Route path="/warenkorb" element={<CartPage />} />
          {/* Placeholder routes */}
          <Route path="/konto" element={<HomePage />} />
          <Route path="/merkzettel" element={<HomePage />} />
          <Route path="/newsletter" element={<HomePage />} />
          <Route path="/hilfe" element={<HomePage />} />
          <Route path="/kategorien" element={<CategoryPage />} />
          <Route path="/angebote" element={<CategoryPage />} />
          <Route path="/marken" element={<HomePage />} />
          <Route path="/marke/:brandId" element={<CategoryPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
