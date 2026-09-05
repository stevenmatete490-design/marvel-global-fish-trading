<<<<<<< HEAD
import {
  Bell,
  ChevronRight,
  FileText,
  Package,
  Ship,
  Users,
  Wallet,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

=======
import { useEffect, useState } from "react";
import { ArrowUpRight, Bell, ChevronRight, FileText, Package, Ship, Users, Wallet } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getCustomers, getOrders, getProducts, subscribeToDataChanges } from "../data/store";
>>>>>>> ceffe9c7c6d47d15c954a08fb7eaaf41b529a13a
import { useAuth } from "../auth/AuthContext";
import AdminLayout from "../components/AdminLayout";

const navItems = [["/admin", "Dashboard", Wallet], ["/admin/customers", "Customers", Users], ["/admin/products", "Products", Package], ["/admin/orders", "Orders", Ship], ["/admin/invoices", "Invoices", FileText], ["/admin/payments", "Payments", Wallet], ["/admin/shipments", "Shipments", Ship], ["/admin/reports", "Reports", ArrowUpRight]];

function AdminDashboard() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();
<<<<<<< HEAD

  /*
   * ==========================================
   * LOGOUT
   * ==========================================
   */

  const handleLogout = () => {
    logout();

    // Remove authentication data from
    // the previous login system.
    localStorage.removeItem(
      "marvel_authenticated"
    );

    localStorage.removeItem(
      "marvel_customer"
    );

    sessionStorage.removeItem(
      "marvel_authenticated"
    );

    sessionStorage.removeItem(
      "marvel_customer"
    );

    navigate("/login", {
      replace: true,
    });
  };

  /*
   * ==========================================
   * USER AVATAR
   * ==========================================
   */

  const getUserInitials = () => {
    if (!user?.name) {
      return "MG";
    }

    return user.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        {/* =====================================
            HEADER
        ====================================== */}

        <header className="admin-header">
          <div>
            <span className="section-label">
              MARVEL ADMINISTRATION
            </span>

            <h1>Business overview</h1>
          </div>

          <div className="admin-header-actions">
            {/* NOTIFICATIONS */}

            <button
              type="button"
              className="admin-icon-button"
              aria-label="Notifications"
            >
              <Bell size={18} />
            </button>

            {/* USER */}

            <div className="admin-user">
              <div className="admin-avatar">
                {getUserInitials()}
              </div>

              <div>
                <strong>
                  {user?.name ||
                    "MARVEL Admin"}
                </strong>

                <span>
                  {user?.role === "admin"
                    ? "Administrator"
                    : "User"}
                </span>
              </div>
            </div>

            {/* LOGOUT */}

            <button
              type="button"
              className="admin-logout"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* =====================================
            CONTENT
        ====================================== */}

        <div className="admin-content">
          {/* ===================================
              KPI CARDS
          ==================================== */}

          <section className="admin-kpis">
            <article className="admin-kpi">
              <div className="admin-kpi-icon">
                <Wallet size={20} />
              </div>

              <div>
                <span>
                  Total Revenue
                </span>

                <strong>
                  $48,650
                </strong>

                <small>
                  +12.8% this month
                </small>
              </div>
            </article>

            <article className="admin-kpi">
              <div className="admin-kpi-icon">
                <Users size={20} />
              </div>

              <div>
                <span>
                  Customers
                </span>

                <strong>
                  126
                </strong>

                <small>
                  +8 new this month
                </small>
              </div>
            </article>

            <article className="admin-kpi">
              <div className="admin-kpi-icon">
                <FileText size={20} />
              </div>

              <div>
                <span>
                  Pending Invoices
                </span>

                <strong>
                  14
                </strong>

                <small>
                  $31,400 outstanding
                </small>
              </div>
            </article>

            <article className="admin-kpi">
              <div className="admin-kpi-icon">
                <Ship size={20} />
              </div>

              <div>
                <span>
                  Active Shipments
                </span>

                <strong>
                  8
                </strong>

                <small>
                  Across 5 destinations
                </small>
              </div>
            </article>
          </section>

          {/* ===================================
              QUICK ACTIONS
          ==================================== */}

          <section className="admin-section">
            <div className="admin-section-heading">
              <div>
                <span className="section-label">
                  QUICK ACTIONS
                </span>

                <h2>
                  Manage operations
                </h2>
              </div>
            </div>

            <div className="admin-actions">
              {/* CREATE INVOICE */}

              <Link
                to="/admin/invoices"
                className="admin-action"
              >
                <FileText size={20} />

                <div>
                  <strong>
                    Create Invoice
                  </strong>

                  <span>
                    Issue a new customer
                    invoice
                  </span>
                </div>

                <ChevronRight
                  size={16}
                />
              </Link>

              {/* ADD CUSTOMER */}

              <Link
                to="/admin/customers"
                className="admin-action"
              >
                <Users size={20} />

                <div>
                  <strong>
                    Add Customer
                  </strong>

                  <span>
                    Create a new trade
                    account
                  </span>
                </div>

                <ChevronRight
                  size={16}
                />
              </Link>

              {/* MANAGE PRODUCTS */}

              <Link
                to="/admin/products"
                className="admin-action"
              >
                <Package size={20} />

                <div>
                  <strong>
                    Manage Products
                  </strong>

                  <span>
                    Update seafood
                    catalogue
                  </span>
                </div>

                <ChevronRight
                  size={16}
                />
              </Link>
            </div>
          </section>

          {/* ===================================
              TRANSACTIONS + ORDERS
          ==================================== */}

          <section className="admin-two-column">
            {/* =================================
                TRANSACTIONS
            ================================== */}

            <div className="admin-panel">
              <div className="admin-panel-header">
                <div>
                  <span className="section-label">
                    FINANCIAL ACTIVITY
                  </span>

                  <h2>
                    Recent transactions
                  </h2>
                </div>

                <Link to="/admin/payments">
                  View all

                  <ChevronRight
                    size={14}
                  />
                </Link>
              </div>

              <div className="admin-table">
                <div className="admin-table-head">
                  <span>
                    INVOICE
                  </span>

                  <span>
                    CUSTOMER
                  </span>

                  <span>
                    AMOUNT
                  </span>

                  <span>
                    STATUS
                  </span>
                </div>

                {transactions.map(
                  (transaction) => (
                    <div
                      className="admin-table-row"
                      key={
                        transaction.id
                      }
                    >
                      <strong>
                        {
                          transaction.id
                        }
                      </strong>

                      <span>
                        {
                          transaction.customer
                        }
                      </span>

                      <strong>
                        {
                          transaction.amount
                        }
                      </strong>

                      <span
                        className={
                          transaction.status ===
                          "PAID"
                            ? "admin-status paid"
                            : "admin-status pending"
                        }
                      >
                        {
                          transaction.status
                        }
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* =================================
                RECENT ORDERS
            ================================== */}

            <div className="admin-panel">
              <div className="admin-panel-header">
                <div>
                  <span className="section-label">
                    LOGISTICS
                  </span>

                  <h2>
                    Recent orders
                  </h2>
                </div>

                <Link to="/admin/orders">
                  View all

                  <ChevronRight
                    size={14}
                  />
                </Link>
              </div>

              <div className="admin-orders">
                {orders.map((order) => (
                  <div
                    className="admin-order"
                    key={order.id}
                  >
                    <div className="admin-order-icon">
                      <Ship size={17} />
                    </div>

                    <div className="admin-order-info">
                      <strong>
                        {order.id}
                      </strong>

                      <span>
                        {order.product}{" "}
                        ·{" "}
                        {order.quantity}
                      </span>
                    </div>

                    <span
                      className={`admin-status ${order.status
                        .toLowerCase()
                        .replaceAll(
                          " ",
                          "-"
                        )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
=======
  const [orders, setOrders] = useState(getOrders);
  const [customers, setCustomers] = useState(getCustomers);
  const [products, setProducts] = useState(getProducts);
  useEffect(() => subscribeToDataChanges(() => { setOrders(getOrders()); setCustomers(getCustomers()); setProducts(getProducts()); }), []);
  const pendingOrders = orders.filter((order) => order.status === "PENDING" || order.status === "PROCESSING").length;
  const activeShipments = orders.filter((order) => order.status === "IN TRANSIT" || order.status === "PROCESSING").length;
  const handleLogout = () => { logout(); navigate("/login", { replace: true }); };

  return <main className="admin-layout"><aside className="admin-sidebar"><Link to="/" className="admin-brand">MARVEL<span>GLOBAL FISH TRADING</span></Link><div className="admin-sidebar-label">ADMINISTRATION</div><nav className="admin-navigation">{navItems.map(([path, label, Icon]) => <Link key={path} to={path} className={`admin-nav-link ${path === "/admin" ? "active" : ""}`}><Icon size={17} />{label}</Link>)}</nav><div className="admin-sidebar-bottom"><Link to="/admin/settings" className="admin-nav-link">Settings</Link><button type="button" className="admin-logout" onClick={handleLogout}>Sign Out</button></div></aside><section className="admin-main"><header className="admin-header"><div><span className="section-label">MARVEL ADMINISTRATION</span><h1>Business overview</h1></div><div className="admin-header-actions"><button type="button" className="admin-icon-button" aria-label="Notifications"><Bell size={18} /></button><div className="admin-user"><div className="admin-avatar">{user?.name?.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase() || "MG"}</div><div><strong>{user?.name || "MARVEL Admin"}</strong><span>{user?.role === "admin" ? "Administrator" : "User"}</span></div></div></div></header><div className="admin-content"><section className="admin-kpis"><article className="admin-kpi"><div className="admin-kpi-icon"><Wallet size={20} /></div><div><span>Total Orders</span><strong>{orders.length}</strong><small>Live local records</small></div></article><article className="admin-kpi"><div className="admin-kpi-icon"><Users size={20} /></div><div><span>Customers</span><strong>{customers.length}</strong><small>Trade accounts</small></div></article><article className="admin-kpi"><div className="admin-kpi-icon"><Package size={20} /></div><div><span>Products</span><strong>{products.length}</strong><small>Catalogue products</small></div></article><article className="admin-kpi"><div className="admin-kpi-icon"><Ship size={20} /></div><div><span>Active Shipments</span><strong>{activeShipments}</strong><small>{pendingOrders} orders need action</small></div></article></section><section className="admin-section"><div className="admin-section-heading"><div><span className="section-label">QUICK ACTIONS</span><h2>Manage operations</h2></div></div><div className="admin-actions"><Link to="/admin/orders" className="admin-action"><Ship size={20} /><div><strong>Create or update orders</strong><span>Manage fulfillment and status</span></div><ChevronRight size={16} /></Link><Link to="/admin/customers" className="admin-action"><Users size={20} /><div><strong>Manage customers</strong><span>Create and maintain trade accounts</span></div><ChevronRight size={16} /></Link><Link to="/admin/products" className="admin-action"><Package size={20} /><div><strong>Manage products</strong><span>Update the live seafood catalogue</span></div><ChevronRight size={16} /></Link></div></section><section className="admin-panel"><div className="admin-panel-header"><div><span className="section-label">LOGISTICS</span><h2>Recent orders</h2></div><Link to="/admin/orders">View all<ChevronRight size={14} /></Link></div><div className="admin-orders">{orders.slice(0, 5).map((order) => <div className="admin-order" key={order.id}><div className="admin-order-icon"><Ship size={17} /></div><div className="admin-order-info"><strong>{order.id}</strong><span>{order.product} · {order.quantity}</span></div><span className={`admin-status ${order.status.toLowerCase().replaceAll(" ", "-")}`}>{order.status}</span></div>)}{orders.length === 0 && <div className="admin-empty-state"><Ship size={30} /><h3>No orders yet</h3><p>Create your first trade order from the Orders page.</p></div>}</div></section></div></section></main>;
>>>>>>> ceffe9c7c6d47d15c954a08fb7eaaf41b529a13a
}

export default AdminDashboard;
