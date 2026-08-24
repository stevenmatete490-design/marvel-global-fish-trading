import {
  ArrowLeft,
  ChevronRight,
  Download,
  FileText,
  Search,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const invoices = [
  {
    id: "MAR-001",
    product: "Frozen Fish",
    quantity: "2,000 KG",
    amount: "$4,500",
    status: "PAID",
    date: "18 Aug 2026",
  },
  {
    id: "MAR-002",
    product: "Premium Shrimp",
    quantity: "1,500 KG",
    amount: "$7,200",
    status: "PENDING",
    date: "21 Aug 2026",
  },
  {
    id: "MAR-003",
    product: "Fresh Fish",
    quantity: "1,000 KG",
    amount: "$2,800",
    status: "PAID",
    date: "12 Aug 2026",
  },
  {
    id: "MAR-004",
    product: "Frozen Mackerel",
    quantity: "3,000 KG",
    amount: "$6,900",
    status: "PENDING",
    date: "23 Aug 2026",
  },
];

function Invoices() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.id.toLowerCase().includes(search.toLowerCase()) ||
      invoice.product.toLowerCase().includes(search.toLowerCase())
  );

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

          <Link
            to="/customer"
            className="portal-nav-link"
          >
            <FileText size={18} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/customer/invoices"
            className="portal-nav-link active"
          >
            <FileText size={18} />
            <span>Invoices</span>
          </Link>

          <Link
            to="/customer/payments"
            className="portal-nav-link"
          >
            <FileText size={18} />
            <span>Payments</span>
          </Link>

          <Link
            to="/customer/orders"
            className="portal-nav-link"
          >
            <FileText size={18} />
            <span>Orders</span>
          </Link>

          <Link
            to="/customer/documents"
            className="portal-nav-link"
          >
            <FileText size={18} />
            <span>Documents</span>
          </Link>
        </nav>

        <button
          className="portal-logout"
          onClick={() => navigate("/login")}
        >
          ← Sign Out
        </button>
      </aside>

      <section className="customer-main">
        <header className="customer-header">
          <div>
            <span className="section-label">
              FINANCIAL ACTIVITY
            </span>

            <h1>Invoices</h1>
          </div>
        </header>

        <div className="customer-content">

          <div className="invoice-page-header">
            <div>
              <Link
                to="/customer"
                className="invoice-back"
              >
                <ArrowLeft size={15} />
                Back to Dashboard
              </Link>

              <h2>Your invoices</h2>

              <p>
                View, download and manage your MARVEL trade invoices.
              </p>
            </div>

            <div className="invoice-search">
              <Search size={17} />

              <input
                type="text"
                placeholder="Search invoices..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>
          </div>

          <div className="invoice-summary">
            <div>
              <span>Total</span>
              <strong>12</strong>
            </div>

            <div>
              <span>Paid</span>
              <strong>8</strong>
            </div>

            <div>
              <span>Pending</span>
              <strong>4</strong>
            </div>
          </div>

          <section className="invoice-list-section">

            <div className="invoice-list-header">
              <span>INVOICE</span>
              <span>PRODUCT</span>
              <span>QUANTITY</span>
              <span>DATE</span>
              <span>AMOUNT</span>
              <span>STATUS</span>
              <span>ACTION</span>
            </div>

            {filteredInvoices.map((invoice) => (
              <div
                className="invoice-list-row"
                key={invoice.id}
              >
                <div className="invoice-number">
                  <div className="invoice-icon">
                    <FileText size={17} />
                  </div>

                  <strong>{invoice.id}</strong>
                </div>

                <span>{invoice.product}</span>

                <span>{invoice.quantity}</span>

                <span>{invoice.date}</span>

                <strong>{invoice.amount}</strong>

                <span
                  className={`invoice-status ${invoice.status.toLowerCase()}`}
                >
                  {invoice.status}
                </span>

                <div className="invoice-actions">

                  <button
                    title="Download PDF"
                    className="invoice-icon-button"
                    onClick={() =>
                      alert(
                        `PDF generation for ${invoice.id} will be connected in Phase 3.`
                      )
                    }
                  >
                    <Download size={16} />
                  </button>

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
                        alert(
                          `Invoice ${invoice.id} details will open here.`
                        )
                      }
                    >
                      View
                    </button>
                  )}

                  <ChevronRight size={15} />
                </div>
              </div>
            ))}

            {filteredInvoices.length === 0 && (
              <div className="invoice-empty">
                <FileText size={35} />

                <h3>No invoices found</h3>

                <p>
                  Try searching with another invoice number
                  or product name.
                </p>
              </div>
            )}

          </section>

        </div>
      </section>
    </main>
  );
}

export default Invoices;