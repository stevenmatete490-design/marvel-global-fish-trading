import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ProtectedCustomerRoute from "./components/ProtectedCustomerRoute";
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
<<<<<<< HEAD
import AdminCustomers from "./pages/AdminCustomers";
=======
import Customers from "./pages/admin/Customers";
>>>>>>> ceffe9c7c6d47d15c954a08fb7eaaf41b529a13a
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminInvoices from "./pages/AdminInvoices";
import AdminPayments from "./pages/AdminPayments";
import AdminShipments from "./pages/AdminShipments";
<<<<<<< HEAD

import AdminReports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";

=======
import AdminReports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";
>>>>>>> ceffe9c7c6d47d15c954a08fb7eaaf41b529a13a
import "./App.css";

function AppLayout() {
  const { pathname } = useLocation();
  const isLoginPage = pathname === "/login";
  const isCustomerPortal = pathname === "/customer" || pathname.startsWith("/customer/");
  const isAdminPortal = pathname === "/admin" || pathname.startsWith("/admin/");
  const hidePublicLayout = isLoginPage || isCustomerPortal || isAdminPortal;

  return (
    <div className="app">
      {!hidePublicLayout && <Navbar />}
      <main>
        <Routes>
<<<<<<< HEAD
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
=======
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/global-trade" element={<GlobalTrade />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/request-quote" element={<RequestQuote />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedCustomerRoute />}>
            <Route path="/customer" element={<CustomerPortal />} />
            <Route path="/customer/invoices" element={<Invoices />} />
            <Route path="/customer/payments" element={<Payments />} />
            <Route path="/customer/orders" element={<Orders />} />
            <Route path="/customer/documents" element={<Documents />} />
          </Route>
          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/customers" element={<Customers />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/invoices" element={<AdminInvoices />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="/admin/shipments" element={<AdminShipments />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
>>>>>>> ceffe9c7c6d47d15c954a08fb7eaaf41b529a13a
        </Routes>
      </main>
      {!hidePublicLayout && <Footer />}
    </div>
  );
}

<<<<<<< HEAD
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
=======
export default function App() {
  return <BrowserRouter><AuthProvider><AppLayout /></AuthProvider></BrowserRouter>;
>>>>>>> ceffe9c7c6d47d15c954a08fb7eaaf41b529a13a
}
