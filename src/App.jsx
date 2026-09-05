import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

import Home from "./pages/Home";
import Products from "./pages/Products";
import About from "./pages/About";
import GlobalTrade from "./pages/GlobalTrade";
import Contact from "./pages/Contact";
import RequestQuote from "./pages/RequestQuote";

import Login from "./pages/Login";

import CustomerPortal from "./pages/CustomerPortal";
import Invoices from "./pages/Invoices";
import Payments from "./pages/Payments";
import Orders from "./pages/Orders";
import Documents from "./pages/Documents";

import AdminDashboard from "./pages/AdminDashboard";
import AdminCustomers from "./pages/AdminCustomers";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminInvoices from "./pages/AdminInvoices";
import AdminPayments from "./pages/AdminPayments";
import AdminShipments from "./pages/AdminShipments";

import AdminReports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";

import "./App.css";

function AppLayout() {
  const location = useLocation();

  const isLoginPage =
    location.pathname === "/login";

  const isCustomerPortal =
    location.pathname === "/customer" ||
    location.pathname.startsWith("/customer/");

  const isAdminPortal =
    location.pathname === "/admin" ||
    location.pathname.startsWith("/admin/");

  const hidePublicLayout =
    isLoginPage ||
    isCustomerPortal ||
    isAdminPortal;

  return (
    <div className="app">
      {!hidePublicLayout && <Navbar />}

      <main>
        <Routes>
          {/* =====================================
              PUBLIC WEBSITE
          ====================================== */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/global-trade"
            element={<GlobalTrade />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="/request-quote"
            element={<RequestQuote />}
          />

          {/* =====================================
              AUTHENTICATION
          ====================================== */}

          <Route
            path="/login"
            element={<Login />}
          />

          {/* =====================================
              CUSTOMER PORTAL
          ====================================== */}

          <Route
            path="/customer"
            element={<CustomerPortal />}
          />

          <Route
            path="/customer/orders"
            element={<Orders />}
          />

          <Route
            path="/customer/invoices"
            element={<Invoices />}
          />

          <Route
            path="/customer/payments"
            element={<Payments />}
          />

          <Route
            path="/customer/documents"
            element={<Documents />}
          />

          {/* =====================================
              PROTECTED ADMIN PORTAL
          ====================================== */}

          <Route
            element={
              <ProtectedAdminRoute />
            }
          >
            {/* Dashboard */}

            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

            {/* Customers */}

            <Route
              path="/admin/customers"
              element={<AdminCustomers />}
            />

            {/* Products */}

            <Route
              path="/admin/products"
              element={<AdminProducts />}
            />

            {/* Orders */}

            <Route
              path="/admin/orders"
              element={<AdminOrders />}
            />

            {/* Invoices */}

            <Route
              path="/admin/invoices"
              element={<AdminInvoices />}
            />

            {/* Payments */}

            <Route
              path="/admin/payments"
              element={<AdminPayments />}
            />

            {/* Shipments */}

            <Route
              path="/admin/shipments"
              element={<AdminShipments />}
            />

            {/* Reports */}

            <Route
              path="/admin/reports"
              element={<AdminReports />}
            />

            {/* Settings */}

            <Route
              path="/admin/settings"
              element={<AdminSettings />}
            />
          </Route>

          {/* =====================================
              FALLBACK
          ====================================== */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />
        </Routes>
      </main>

      {!hidePublicLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;