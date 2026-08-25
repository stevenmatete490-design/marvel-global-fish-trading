import { useState } from "react";
import {
  Search,
  Plus,
  FileText,
  Download,
} from "lucide-react";
import { Link } from "react-router-dom";

const initialInvoices = [
  {
    id: "INV-MAR-001",
    customer: "John Smith Trading",
    amount: "$4,500",
    issueDate: "24 Aug 2026",
    dueDate: "07 Sep 2026",
    status: "PAID",
  },
  {
    id: "INV-MAR-002",
    customer: "Gulf Seafood LLC",
    amount: "$7,200",
    issueDate: "23 Aug 2026",
    dueDate: "06 Sep 2026",
    status: "PENDING",
  },
  {
    id: "INV-MAR-003",
    customer: "Ocean Foods Ltd",
    amount: "$2,800",
    issueDate: "22 Aug 2026",
    dueDate: "05 Sep 2026",
    status: "PAID",
  },
  {
    id: "INV-MAR-004",
    customer: "Blue Coast Trading",
    amount: "$6,150",
    issueDate: "21 Aug 2026",
    dueDate: "04 Sep 2026",
    status: "OVERDUE",
  },
];

function AdminInvoices() {
  const [invoices] = useState(initialInvoices);
  const [search, setSearch] = useState("");

  const filteredInvoices = invoices.filter((invoice) =>
    `${invoice.id} ${invoice.customer}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="admin-layout">

      <aside className="admin-sidebar">

        <Link to="/" className="admin-brand">
          MARVEL
          <span>GLOBAL FISH TRADING</span>
        </Link>

        <div className="admin-sidebar-label">
          ADMINISTRATION
        </div>

        <nav className="admin-navigation">

          <Link to="/admin" className="admin-nav-link">
            Dashboard
          </Link>

          <Link to="/admin/customers" className="admin-nav-link">
            Customers
          </Link>

          <Link to="/admin/products" className="admin-nav-link">
            Products
          </Link>

          <Link to="/admin/orders" className="admin-nav-link">
            Orders
          </Link>

          <Link
            to="/admin/invoices"
            className="admin-nav-link active"
          >
            <FileText size={17} />
            Invoices
          </Link>

          <Link to="/admin/payments" className="admin-nav-link">
            Payments
          </Link>

          <Link to="/admin/shipments" className="admin-nav-link">
            Shipments
          </Link>

        </nav>

      </aside>

      <section className="admin-main">

        <header className="admin-header">

          <div>
            <span className="section-label">
              FINANCE
            </span>

            <h1>Invoices</h1>

            <p>
              Create, track and manage customer invoices.
            </p>
          </div>

          <Link
            to="/admin/invoices/create"
            className="admin-primary-button"
          >
            <Plus size={17} />
            Create Invoice
          </Link>

        </header>

        <div className="admin-content">

          <div className="admin-toolbar">

            <div className="admin-search">

              <Search size={17} />

              <input
                placeholder="Search invoices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>

            <span>
              {filteredInvoices.length} invoices
            </span>

          </div>

          <div className="admin-panel">

            <div className="admin-table">

              <div className="admin-table-head">
                <span>INVOICE</span>
                <span>CUSTOMER</span>
                <span>AMOUNT</span>
                <span>ISSUED</span>
                <span>DUE DATE</span>
                <span>STATUS</span>
                <span></span>
              </div>

              {filteredInvoices.map((invoice) => (

                <div
                  className="admin-table-row"
                  key={invoice.id}
                >

                  <div className="admin-product-name">

                    <div className="admin-order-icon">
                      <FileText size={16} />
                    </div>

                    <div>
                      <strong>{invoice.id}</strong>
                      <span>MARVEL Invoice</span>
                    </div>

                  </div>

                  <span>{invoice.customer}</span>

                  <strong>{invoice.amount}</strong>

                  <span>{invoice.issueDate}</span>

                  <span>{invoice.dueDate}</span>

                  <span
                    className={`admin-status ${
                      invoice.status === "PAID"
                        ? "paid"
                        : invoice.status === "OVERDUE"
                        ? "overdue"
                        : "pending"
                    }`}
                  >
                    {invoice.status}
                  </span>

                  <button
                    className="admin-more-button"
                    title="Download invoice"
                  >
                    <Download size={16} />
                  </button>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default AdminInvoices;