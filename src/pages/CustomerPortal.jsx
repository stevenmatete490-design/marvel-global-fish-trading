import {
  Bell,
  ChevronRight,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  Ship,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const invoices = [
  {
    id: "MAR-001",
    product: "Frozen Fish",
    amount: "$4,500",
    status: "PAID",
    date: "18 Aug 2026",
  },
  {
    id: "MAR-002",
    product: "Premium Shrimp",
    amount: "$7,200",
    status: "PENDING",
    date: "21 Aug 2026",
  },
  {
    id: "MAR-003",
    product: "Fresh Fish",
    amount: "$2,800",
    status: "PAID",
    date: "12 Aug 2026",
  },
];

const navigation = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/customer",
  },
  {
    label: "Invoices",
    icon: FileText,
    path: "/customer/invoices",
  },
  {
    label: "Payments",
    icon: CreditCard,
    path: "/customer/payments",
  },
  {
    label: "Orders",
    icon: Package,
    path: "/customer/orders",
  },
  {
    label: "Documents",
    icon: Ship,
    path: "/customer/documents",
  },
];

function CustomerPortal() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <main className="customer-portal">
      <aside className="customer-sidebar">
        <Link to="/" className="portal-brand">
          MARVEL
          <span>GLOBAL FISH TRADING</span>
        </Link>

        <nav className="portal-navigation">
          <div className="portal-nav-label">
            CUSTOMER PORTAL
          </div>

          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`portal-nav-link ${
                  item.label === "Dashboard" ? "active" : ""
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          className="portal-logout"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </aside>

      <section className="customer-main">
        <header className="customer-header">
          <div>
            <span className="section-label">
              CUSTOMER PORTAL
            </span>

            <h1>Welcome back, Customer.</h1>
          </div>

          <button className="notification-button">
            <Bell size={19} />
          </button>
        </header>

        <div className="customer-content">
          <div className="customer-stats">
            <div className="customer-stat">
              <span>Total Invoices</span>
              <strong>12</strong>
              <small>All invoices</small>
            </div>

            <div className="customer-stat">
              <span>Paid</span>
              <strong>8</strong>
              <small>Completed payments</small>
            </div>

            <div className="customer-stat pending">
              <span>Pending</span>
              <strong>4</strong>
              <small>Requires attention</small>
            </div>
          </div>

          <section className="portal-section">
            <div className="portal-section-header">
              <div>
                <span className="section-label">
                  FINANCIAL ACTIVITY
                </span>

                <h2>Recent Invoices</h2>
              </div>

              <Link to="/customer/invoices">
                View all
                <ChevronRight size={15} />
              </Link>
            </div>

            <div className="invoice-table">
              <div className="invoice-table-header">
                <span>Invoice</span>
                <span>Product</span>
                <span>Date</span>
                <span>Amount</span>
                <span>Status</span>
                <span></span>
              </div>

              {invoices.map((invoice) => (
                <div
                  className="invoice-table-row"
                  key={invoice.id}
                >
                  <strong>{invoice.id}</strong>

                  <span>{invoice.product}</span>

                  <span>{invoice.date}</span>

                  <strong>{invoice.amount}</strong>

                  <span
                    className={`invoice-status ${invoice.status.toLowerCase()}`}
                  >
                    {invoice.status}
                  </span>

                  {invoice.status === "PENDING" ? (
                    <button
                      className="table-action pay"
                      onClick={() =>
                        navigate("/customer/payments")
                      }
                    >
                      Pay Now
                    </button>
                  ) : (
                    <button
                      className="table-action"
                      onClick={() =>
                        navigate("/customer/invoices")
                      }
                    >
                      View
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="portal-section portal-quick-actions">
            <div className="portal-section-header">
              <div>
                <span className="section-label">
                  QUICK ACCESS
                </span>

                <h2>Manage your business</h2>
              </div>
            </div>

            <div className="quick-action-grid">
              <Link to="/customer/invoices">
                <FileText size={24} />
                <strong>Invoices</strong>
                <span>View and download invoices</span>
              </Link>

              <Link to="/customer/payments">
                <CreditCard size={24} />
                <strong>Payments</strong>
                <span>View payment history and pending payments</span>
              </Link>

              <Link to="/customer/orders">
                <Package size={24} />
                <strong>Orders</strong>
                <span>Track your seafood orders</span>
              </Link>

              <Link to="/customer/documents">
                <Ship size={24} />
                <strong>Documents</strong>
                <span>Access shipping and trade documents</span>
              </Link>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default CustomerPortal;