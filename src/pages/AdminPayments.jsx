import { useState } from "react";
import {
Search,
Wallet,
CheckCircle,
Clock,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";

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

return ( <AdminLayout> <div className="admin-page"> <header className="admin-header"> <div> <span className="section-label">
FINANCIAL ACTIVITY </span>

```
        <h1>Payments</h1>

        <p>
          Monitor incoming customer payments and settlements.
        </p>
      </div>
    </header>

    <div className="admin-content">
      {/* KPI CARDS */}
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

      {/* SEARCH */}
      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search payments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* PAYMENTS TABLE */}
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

          {filteredPayments.length > 0 ? (
            filteredPayments.map((payment) => (
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
            ))
          ) : (
            <div className="admin-empty-state">
              <Wallet size={32} />

              <h3>No payments found</h3>

              <p>
                Try adjusting your search criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
</AdminLayout>
);
}

export default AdminPayments;
