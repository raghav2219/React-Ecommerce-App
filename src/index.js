import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import { AuthProvider } from "./context/AuthContext";

import {
  Home,
  Product,
  Products,
  AboutPage,
  ContactPage,
  Cart,
  Login,
  Register,
  Checkout,
  PageNotFound,
} from "./pages";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./components/AdminDashboard";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ScrollToTop>
      <Provider store={store}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product" element={<Products />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/cart" element={<Cart />} />
            
            {/* Guest only routes */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            
            {/* Protected routes */}
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<PageNotFound />} />
            <Route path="/product/*" element={<PageNotFound />} />
            
            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              {/* Add more admin routes here as needed */}
            </Route>
          </Routes>
        </AuthProvider>
      </Provider>
    </ScrollToTop>
    <Toaster />
  </BrowserRouter>
);
