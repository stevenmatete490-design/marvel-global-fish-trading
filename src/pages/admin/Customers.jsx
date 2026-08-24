import {
  ArrowLeft,
  Mail,
  Phone,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const initialCustomers = [
  {
    id: "CUS-001",
    name: "John Smith Trading",
    email: "john@johnsmithtrading.com",
    phone: "+1 555 014 2201",
    country: "United States",
    status: "ACTIVE",
    orders: 12,
    balance: "$0",
  },
  {
    id: "CUS-002",
    name: "Gulf Seafood LLC",
    email: "accounts@gulfseafood.com",
    phone: "+971 50 442 1188",
    country: "United Arab Emirates",
    status: "ACTIVE",
    orders: 8,
    balance: "$7,200",
  },
  {
    id: "CUS-003",
    name: "Ocean Foods Ltd",
    email: "sales@oceanfoods.com",
    phone: "+44 20 7946 0192",
    country: "United Kingdom",
    status: "ACTIVE",
    orders: 15,
    balance: "$0",
  },
  {
    id: "CUS-004",
    name: "Blue Coast Trading",
    email: "info@bluecoast.com",
    phone: "+254 712 456 789",
    country: "Kenya",
    status: "PENDING",
    orders: 3,
    balance: "$6,150",
  },
];

function Customers() {
  const [customers] = useState(initialCustomers);
  const [search, setSearch] = useState("");

  const filteredCustomers = customers.filter((customer) => {
    const value = search.toLowerCase();

    return (
      customer.name.toLowerCase().includes(value) ||
      customer.email.toLowerCase().includes(value) ||
      customer.country.toLowerCase().includes(value) ||
      customer.id.toLowerCase().includes(value)
    );
  });

  return (
    <main className="admin-layout">

      {/* SIDEBAR */}

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

          <Link
            to="/admin/customers"
            className="admin-nav-link active"
          >
            Customers
          </Link>

          <Link
            to="/admin/products"
            className="admin-nav-link"
          >
            Products
          </Link>

          <Link
            to="/admin/orders"
            className="admin-nav-link"
          >
            Orders
          </Link>

          <Link
            to="/admin/invoices"
            className="admin-nav-link"
          >
            Invoices
          </Link>

          <Link
            to="/admin/payments"
            className="admin-nav-link"
          >
            Payments
          </Link>

          <Link
            to="/admin/shipments"
            className="admin-nav-link"
          >
            Shipments
          </Link>

          <Link
            to="/admin/reports"
            className="admin-nav-link"
          >
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

          <Link
            to="/login"
            className="admin-logout"
          >
            Sign Out
          </Link>

        </div>

      </aside>

      {/* MAIN */}

      <section className="admin-main">

        <header className="admin-header">

          <div>

            <Link
              to="/admin"
              className="admin-back-link"
            >
              <ArrowLeft size={15} />
              Dashboard
            </Link>

            <span className="section-label">
              CUSTOMER MANAGEMENT
            </span>

            <h1>Customers</h1>

            <p>
              Manage MARVEL Global Fish Trading customer
              accounts and trade relationships.
            </p>

          </div>

          <button
            type="button"
            className="admin-primary-button"
          >
            <Plus size={17} />
            Add Customer
          </button>

        </header>

        <div className="admin-content">

          {/* SUMMARY */}

          <section className="admin-kpis">

            <article className="admin-kpi">

              <div className="admin-kpi-icon">
                <Users size={20} />
              </div>

              <div>
                <span>Total Customers</span>
                <strong>{customers.length}</strong>
                <small>Registered accounts</small>
              </div>

            </article>

            <article className="admin-kpi">

              <div className="admin-kpi-icon">
                <Users size={20} />
              </div>

              <div>
                <span>Active Customers</span>
                <strong>
                  {
                    customers.filter(
                      (customer) =>
                        customer.status === "ACTIVE"
                    ).length
                  }
                </strong>
                <small>Currently trading</small>
              </div>

            </article>

            <article className="admin-kpi">

              <div className="admin-kpi-icon">
                <Mail size={20} />
              </div>

              <div>
                <span>Pending Accounts</span>
                <strong>
                  {
                    customers.filter(
                      (customer) =>
                        customer.status === "PENDING"
                    ).length
                  }
                </strong>
                <small>Awaiting approval</small>
              </div>

            </article>

          </section>

          {/* CUSTOMER TABLE */}

          <section className="admin-panel">

            <div className="admin-panel-header">

              <div>

                <span className="section-label">
                  CUSTOMER DIRECTORY
                </span>

                <h2>All customers</h2>

              </div>

              <div className="admin-search">

                <Search size={17} />

                <input
                  type="search"
                  placeholder="Search customers..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />

              </div>

            </div>

            <div className="admin-table">

              <div className="admin-table-head">

                <span>CUSTOMER</span>
                <span>CONTACT</span>
                <span>COUNTRY</span>
                <span>ORDERS</span>
                <span>BALANCE</span>
                <span>STATUS</span>

              </div>

              {filteredCustomers.map((customer) => (

                <div
                  className="admin-table-row"
                  key={customer.id}
                >

                  <div>
                    <strong>{customer.name}</strong>
                    <small>{customer.id}</small>
                  </div>

                  <div>
                    <span>
                      <Mail size={13} />
                      {customer.email}
                    </span>

                    <span>
                      <Phone size={13} />
                      {customer.phone}
                    </span>
                  </div>

                  <span>
                    {customer.country}
                  </span>

                  <strong>
                    {customer.orders}
                  </strong>

                  <strong>
                    {customer.balance}
                  </strong>

                  <span
                    className={`admin-status ${
                      customer.status === "ACTIVE"
                        ? "paid"
                        : "pending"
                    }`}
                  >
                    {customer.status}
                  </span>

                </div>

              ))}

              {filteredCustomers.length === 0 && (

                <div className="admin-empty-state">

                  <Users size={30} />

                  <h3>No customers found</h3>

                  <p>
                    Try changing your search criteria.
                  </p>

                </div>

              )}

            </div>

          </section>

        </div>

      </section>

    </main>
  );
}

export default Customers;