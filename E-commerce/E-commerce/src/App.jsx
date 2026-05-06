import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Public pages
import Home from './pages/public/Home';
import Products from './pages/public/Products';
import ProductDetail from './pages/public/ProductDetail';
import Category from './pages/public/Category';
import Search from './pages/public/Search';
import Cart from './pages/public/Cart';
import Checkout from './pages/public/Checkout';
import OrderSuccess from './pages/public/OrderSuccess';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import ForgotPassword from './pages/public/ForgotPassword';
import ResetPassword from './pages/public/ResetPassword';
import Contact from './pages/public/Contact';
import NotFound from './pages/public/NotFound';

// Account pages
import MyOrders from './pages/account/MyOrders';
import OrderDetail from './pages/account/OrderDetail';
import Wishlist from './pages/account/Wishlist';
import Profile from './pages/account/Profile';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ProductList from './pages/admin/ProductList';
import OrderList from './pages/admin/OrderList';

// Route guards
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();
  if (!currentUser) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// Layout wrapper (with Navbar + Footer)
const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

// Admin layout (no Navbar/Footer — sidebar is embedded)
const AdminLayout = ({ children }) => <div>{children}</div>;

const AppRoutes = () => (
  <>
    <ScrollToTop />
    <Routes>
      {/* Public */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/products" element={<Layout><Products /></Layout>} />
      <Route path="/products/:id" element={<Layout><ProductDetail /></Layout>} />
      <Route path="/category/:slug" element={<Layout><Category /></Layout>} />
      <Route path="/search" element={<Layout><Search /></Layout>} />
      <Route path="/cart" element={<Layout><Cart /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />
      <Route path="/checkout" element={<Layout><ProtectedRoute><Checkout /></ProtectedRoute></Layout>} />
      <Route path="/order-success" element={<Layout><OrderSuccess /></Layout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Account */}
      <Route path="/account/orders" element={<Layout><ProtectedRoute><MyOrders /></ProtectedRoute></Layout>} />
      <Route path="/account/orders/:id" element={<Layout><ProtectedRoute><OrderDetail /></ProtectedRoute></Layout>} />
      <Route path="/account/wishlist" element={<Layout><ProtectedRoute><Wishlist /></ProtectedRoute></Layout>} />
      <Route path="/account/profile" element={<Layout><ProtectedRoute><Profile /></ProtectedRoute></Layout>} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
      <Route path="/admin/products" element={<AdminRoute><ProductList /></AdminRoute>} />
      <Route path="/admin/orders" element={<AdminRoute><OrderList /></AdminRoute>} />

      {/* 404 */}
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  </>
);

const App = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default App;
