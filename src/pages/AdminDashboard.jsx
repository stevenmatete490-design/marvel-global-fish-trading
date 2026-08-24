import {
  ArrowUpRight,
  Bell,
  ChevronRight,
  FileText,
  Package,
  Ship,
  Users,
  Wallet,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const transactions = [
  {
    id: "MAR-001",
    customer: "John Smith Trading",
    amount: "$4,500",
    status: "PAID",
    date: "24 Aug 2026",
  },
  {
    id: "MAR-002",
    customer: "Gulf Seafood LLC",
    amount: "$7,200",
    status: "PENDING",
    date: "23 Aug 2026",
  },
  {
    id: "MAR-003",
    customer: "Ocean Foods Ltd",
    amount: "$2,800",
    status: "PAID",
    date: "22 Aug 2026",
  },
  {
    id: "MAR-004",
    customer: "Blue Coast Trading",
    amount: "$6,150",
    status: "PENDING",
    date: "21 Aug 2026",
  },
];

const orders = [
  {
    id: "ORD-MAR-001",
    product: "Frozen Fish",
    quantity: "2,000 KG",
    status: "IN TRANSIT",
  },
  {
    id: "ORD-MAR-002",
    product: "Premium Shrimp",
    quantity: "1,500 KG",
    status: "PROCESSING",
  },
  {
    id: "ORD-MAR-003",
    product: "Fresh Fish",
    quantity: "1,000 KG",
    status: "DELIVERED",
  },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();

    // Remove authentication data from the previous login system.
    localStorage.removeItem("marvel_authenticated");
    localStorage.removeItem("marvel_customer");

    sessionStorage.removeItem("marvel_authenticated");
    sessionStorage.removeItem("marvel_customer");

    navigate("/login", { replace: true });
  };

  return (
    <main className="admin-layout">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="admin-sidebar">

        <Link to="/" className="admin-brand">
          MARVEL
          <span>GLOBAL FISH TRADING</span>
        </Link>

        <div className="admin-sidebar-label">
          ADMINISTRATION
        </div>

        <nav className="admin-navigation">

          <Link
            to="/admin"
            className="admin-nav-link active"
          >
            <Wallet size={17} />
            Dashboard
          </Link>

          <Link
            to="/admin/customers"
            className="admin-nav-link"
          >
            <Users size={17} />
            Customers
          </Link>

          <Link
            to="/admin/products"
            className="admin-nav-link"
          >
            <Package size={17} />
            Products
          </Link>

          <Link
            to="/admin/orders"
            className="admin-nav-link"
          >
            <Ship size={17} />
            Orders
          </Link>

          <Link
            to="/admin/invoices"
            className="admin-nav-link"
          >
            <FileText size={17} />
            Invoices
          </Link>

          <Link
            to="/admin/payments"
            className="admin-nav-link"
          >
            <Wallet size={17} />
            Payments
          </Link>

          <Link
            to="/admin/shipments"
            className="admin-nav-link"
          >
            <Ship size={17} />
            Shipments
          </Link>

          <Link
            to="/admin/reports"
            className="admin-nav-link"
          >
            <ArrowUpRight size={17} />
            Reports
          </Link>

        </nav>

        <div className="admin-sidebar-bottom">

          <Link
            to="/admin/settings"
            className="admin-nav-link"
          >
            Settings
          </Link>

          <button
            type="button"
            className="admin-logout"
            onClick={handleLogout}
          >
            Sign Out
          </button>

        </div>

      </aside>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <section className="admin-main">

        {/* HEADER */}

        <header className="admin-header">

          <div>
            <span className="section-label">
              MARVEL ADMINISTRATION
            </span>

            <h1>Business overview</h1>
          </div>

          <div className="admin-header-actions">

            <button
              type="button"
              className="admin-icon-button"
              aria-label="Notifications"
            >
              <Bell size={18} />
            </button>

            <div className="admin-user">

              <div className="admin-avatar">
                {user?.name
                  ? user.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  : "MG"}
              </div>

              <div>
                <strong>
                  {user?.name || "MARVEL Admin"}
                </strong>

                <span>
                  {user?.role === "admin"
                    ? "Administrator"
                    : "User"}
                </span>
              </div>

            </div>

          </div>

        </header>

        <div className="admin-content">

          {/* =========================
              KPI CARDS
          ========================= */}

          <section className="admin-kpis">

            <article className="admin-kpi">

              <div className="admin-kpi-icon">
                <Wallet size={20} />
              </div>

              <div>
                <span>Total Revenue</span>
                <strong>$48,650</strong>
                <small>+12.8% this month</small>
              </div>

            </article>

            <article className="admin-kpi">

              <div className="admin-kpi-icon">
                <Users size={20} />
              </div>

              <div>
                <span>Customers</span>
                <strong>126</strong>
                <small>+8 new this month</small>
              </div>

            </article>

            <article className="admin-kpi">

              <div className="admin-kpi-icon">
                <FileText size={20} />
              </div>

              <div>
                <span>Pending Invoices</span>
                <strong>14</strong>
                <small>$31,400 outstanding</small>
              </div>

            </article>

            <article className="admin-kpi">

              <div className="admin-kpi-icon">
                <Ship size={20} />
              </div>

              <div>
                <span>Active Shipments</span>
                <strong>8</strong>
                <small>Across 5 destinations</small>
              </div>

            </article>

          </section>

          {/* =========================
              QUICK ACTIONS
          ========================= */}

          <section className="admin-section">

            <div className="admin-section-heading">

              <div>
                <span className="section-label">
                  QUICK ACTIONS
                </span>

                <h2>Manage operations</h2>
              </div>

            </div>

            <div className="admin-actions">

              {/* FIXED: invoices/create → invoices */}

              <Link
                to="/admin/invoices"
                className="admin-action"
              >
                <FileText size={20} />

                <div>
                  <strong>Create Invoice</strong>

                  <span>
                    Issue a new customer invoice
                  </span>
                </div>

                <ChevronRight size={16} />
              </Link>

              <Link
                to="/admin/customers"
                className="admin-action"
              >
                <Users size={20} />

                <div>
                  <strong>Add Customer</strong>

                  <span>
                    Create a new trade account
                  </span>
                </div>

                <ChevronRight size={16} />
              </Link>

              <Link
                to="/admin/products"
                className="admin-action"
              >
                <Package size={20} />

                <div>
                  <strong>Manage Products</strong>

                  <span>
                    Update seafood catalogue
                  </span>
                </div>

                <ChevronRight size={16} />
              </Link>

            </div>

          </section>

          {/* =========================
              TRANSACTIONS + ORDERS
          ========================= */}

          <section className="admin-two-column">

            {/* TRANSACTIONS */}

            <div className="admin-panel">

              <div className="admin-panel-header">

                <div>
                  <span className="section-label">
                    FINANCIAL ACTIVITY
                  </span>

                  <h2>Recent transactions</h2>
                </div>

                <Link to="/admin/payments">
                  View all
                  <ChevronRight size={14} />
                </Link>

              </div>

              <div className="admin-table">

                <div className="admin-table-head">
                  <span>INVOICE</span>
                  <span>CUSTOMER</span>
                  <span>AMOUNT</span>
                  <span>STATUS</span>
                </div>

                {transactions.map((transaction) => (

                  <div
                    className="admin-table-row"
                    key={transaction.id}
                  >

                    <strong>
                      {transaction.id}
                    </strong>

                    <span>
                      {transaction.customer}
                    </span>

                    <strong>
                      {transaction.amount}
                    </strong>

                    <span
                      className={
                        transaction.status === "PAID"
                          ? "admin-status paid"
                          : "admin-status pending"
                      }
                    >
                      {transaction.status}
                    </span>

                  </div>

                ))}

              </div>

            </div>

            {/* ORDERS */}

            <div className="admin-panel">

              <div className="admin-panel-header">

                <div>
                  <span className="section-label">
                    LOGISTICS
                  </span>

                  <h2>Recent orders</h2>
                </div>

                <Link to="/admin/orders">
                  View all
                  <ChevronRight size={14} />
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
                        {order.product} ·{" "}
                        {order.quantity}
                      </span>

                    </div>

                    <span
                      className={`admin-status ${order.status
                        .toLowerCase()
                        .replaceAll(" ", "-")}`}
                    >
                      {order.status}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </section>

        </div>

      </section>

    </main>
  );
}

export default AdminDashboard;