import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from "react-router-dom";
import Navbar from "./Components/UI/Navbar";
import Footer from "./Components/UI/Footer";
import Cursor from "./Components/UI/Cursor";
import ScrollToTop from "./Components/UI/ScrollToTop";
import { AnimatePresence, motion } from "framer-motion";
import Home from "./Pages/public/Home";
import Menu from "./Pages/public/Menu";
import MealDetails from "./Pages/public/MealDetails";

import Cart from "./Pages/public/Cart";
import Login from "./Pages/public/Login";
import Signup from "./Pages/public/Signup";
import ForgotPassword from "./Pages/public/ForgotPassword";
import ResetPassword from "./Pages/public/ResetPassword";
import Booking from "./Pages/public/Booking";
import Profile from "./Pages/public/Profile";
import About from "./Pages/public/About";
import AdminLayout from "./Components/Layout/AdminLayout";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import AdminOrders from "./Pages/admin/AdminOrders";
import AdminMenu from "./Pages/admin/AdminMenu";
import AdminAddMeal from "./Pages/admin/AdminAddMeal";
import AdminEditMeal from "./Pages/admin/AdminEditMeal";
import AdminBookings from "./Pages/admin/AdminBookings";
import AdminCustomers from "./Pages/admin/AdminCustomers";
import AdminSettings from "./Pages/admin/AdminSettings";
import AdminLogin from "./Pages/admin/AdminLogin";
import AdminRoute from "./Components/Layout/AdminRoute";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import { ToastProvider } from "./context/ToastContext";


function AppContent() {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-gray-950 selection:bg-amber-500/30">
            <ScrollToTop />
            <Cursor />
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    {/* Public Routes */}
                    <Route element={
                        <>
                            <Navbar />
                            <motion.main
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as any }}
                            >
                                <Outlet />
                            </motion.main>
                            <Footer />
                        </>
                    }>
                        <Route path="/" element={<Home />} />
                        <Route path="/menu" element={<Menu />} />
                        <Route path="/meal/:id" element={<MealDetails />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:token" element={<ResetPassword />} />
                        <Route path="/booking" element={<Booking />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/order-history" element={<Profile initialTab="orders" />} />
                    </Route>

                    {/* Admin Login */}
                    <Route path="/admin/login" element={<AdminLogin />} />

                    {/* Protected Admin Routes */}
                    <Route path="/admin" element={
                        <AdminRoute>
                            <AdminLayout />
                        </AdminRoute>
                    }>
                        <Route index element={<AdminDashboard />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="menu" element={<AdminMenu />} />
                        <Route path="menu/add" element={<AdminAddMeal />} />
                        <Route path="menu/edit/:id" element={<AdminEditMeal />} />
                        <Route path="bookings" element={<AdminBookings />} />
                        <Route path="users" element={<AdminCustomers />} />
                        <Route path="settings" element={<AdminSettings />} />
                        <Route path="*" element={<div className="p-8 text-white">Page Under Construction</div>} />
                    </Route>
                </Routes>
            </AnimatePresence>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <ToastProvider>
                <CartProvider>
                    <OrderProvider>
                        <Router>
                            <AppContent />
                        </Router>
                    </OrderProvider>
                </CartProvider>
            </ToastProvider>
        </AuthProvider>
    );
}

export default App;
