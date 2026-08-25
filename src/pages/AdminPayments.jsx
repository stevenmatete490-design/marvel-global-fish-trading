import { useState } from "react";
import {
  Search,
  Wallet,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const payments = [
  {
    id: "PAY-MAR-001",
    invoice: "INV-MAR-001",
    customer: "John Smith Trading",
    amount: "$4,500",
    method: "Bank Transfer",
    date: "24 Aug 2026",
    status: "COMPLETED",
  },
  {
    id: "PAY-MAR-002",
    invoice: "INV-MAR-003",
    customer: "Ocean Foods Ltd",
    amount: "$2,800",
    method: "Wire Transfer",
    date: "22 Aug 2026",
    status: "COMPLETED",
  },
  {
    id: "PAY-MAR-003",
    invoice: "INV-MAR-002",
    customer: "Gulf Seafood LLC",
    amount: "$7,200",
    method: "Bank Transfer",
    date: "23 Aug 2026",
    status: "PENDING",
  },
];

function AdminPayments() {
  const [search, setSearch] = useState("");

  const filteredPayments = payments.filter((payment) =>
    `${payment.id} ${payment.invoice} ${payment.customer} ${payment.method}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const completedTotal = payments
    .filter((payment) => payment.status === "COMPLETED")
    .reduce(
      (total, payment) =>
        total + Number(payment.amount.replace(/[$,]/g, "")),
      0
    );

  const pendingTotal = payments
    .filter((payment) => payment.status === "PENDING")
    .reduce(
      (total, payment) =>
        total + Number(payment.amount.replace(/[$,]/g, "")),
      0
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

          <Link to="/admin/invoices" className="admin-nav-link">
            Invoices
          </Link>

          <Link
            to="/admin/payments"
            className="admin-nav-link active"
          >
            <Wallet size={17} />
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
              FINANCIAL ACTIVITY
            </span>

            <h1>Payments</h1>

            <p>
              Monitor incoming customer payments and settlements.
            </p>
          </div>

        </header>

        <div className="admin-content">

          <section className="admin-kpis">

            <article className="admin-kpi">

              <div className="admin-kpi-icon">
                <CheckCircle size={20} />
              </div>

              <div>
                <span>Completed</span>
                <strong>
                  ${completedTotal.toLocaleString()}
                </strong>
                <small>Received payments</small>
              </div>

            </article>

            <article className="admin-kpi">

              <div className="admin-kpi-icon">
                <Clock size={20} />
              </div>

              <div>
                <span>Pending</span>
                <strong>
                  ${pendingTotal.toLocaleString()}
                </strong>
                <small>Awaiting settlement</small>
              </div>

            </article>

            <article className="admin-kpi">

              <div className="admin-kpi-icon">
                <Wallet size={20} />
              </div>

              <div>
                <span>Total Payments</span>
                <strong>{payments.length}</strong>
                <small>This period</small>
              </div>

            </article>

          </section>

          <div className="admin-toolbar">

            <div className="admin-search">

              <Search size={17} />

              <input
                placeholder="Search payments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>

          </div>

          <div className="admin-panel">

            <div className="admin-table">

              <div className="admin-table-head">
                <span>PAYMENT</span>
                <span>INVOICE</span>
                <span>CUSTOMER</span>
                <span>METHOD</span>
                <span>DATE</span>
                <span>AMOUNT</span>
                <span>STATUS</span>
              </div>

              {filteredPayments.map((payment) => (

                <div
                  className="admin-table-row"
                  key={payment.id}
                >

                  <strong>{payment.id}</strong>

                  <span>{payment.invoice}</span>

                  <span>{payment.customer}</span>

                  <span>{payment.method}</span>

                  <span>{payment.date}</span>

                  <strong>{payment.amount}</strong>

                  <span
                    className={`admin-status ${
                      payment.status === "COMPLETED"
                        ? "paid"
                        : "pending"
                    }`}
                  >
                    {payment.status}
                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default AdminPayments;