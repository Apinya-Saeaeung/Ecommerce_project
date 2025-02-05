import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from './pages/Home'
import SearchResults from './pages/SearchResults';
import ProductDetail from './pages/ProductDetail';
import Seller from './pages/Seller';
import AllProducts from './pages/AllProducts';
import ProductCategory from './pages/ProductCategory';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Order from './pages/Order';
import OrderSuccess from './pages/OrderSuccess';
import QRCodePage from './pages/QRCodePage';
import ChangeAddress from "./components/ChangeAddress";
import OrderTrackingPage from './pages/OrderTrackingPage';

const App = () => {
  return (
    <GoogleOAuthProvider clientId="504170200070-l2skku7pohrtbp71g9ht3q00bi14426k.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path='/allproducts' element={<AllProducts />} />
          <Route path='/category/:categoryId' element={<ProductCategory />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/seller/:sellerId" element={<Seller />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/order" element={<Order />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/qrcode" element={<QRCodePage />} />
          <Route path="/change-address" element={<ChangeAddress />} />
          <Route path="/order-tracking" element={<OrderTrackingPage />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
    
  );
}

export default App;
