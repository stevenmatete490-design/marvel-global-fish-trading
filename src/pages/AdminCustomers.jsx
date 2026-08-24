import { useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Users,
  Mail,
  Phone,
  Building2,
} from "lucide-react";
import { Link } from "react-router-dom";

const initialCustomers = [
  {
    id: "CUS-001",
    name: "John Smith",
    company: "John Smith Trading",
    email: "john@johnsmithtrading.com",
    phone: "+1 202 555 0142",
    country: "United States",
    status: "ACTIVE",
    orders: 24,
    balance: "$4,500",
  },
  {
    id: "CUS-002",
    name: "Ahmed Hassan",
    company: "Gulf Seafood LLC",
    email: "ahmed@gulfseafood.com",
    phone: "+971 50 555 0123",
    country: "United Arab Emirates",
    status: "ACTIVE",
    orders: 18,
    balance: "$7,200",
  },
  {
    id: "CUS-003",
    name: "Michael Brown",
    company: "Ocean Foods Ltd",
    email: "michael@oceanfoods.com",
    phone: "+44 20 5555 0123",
    country: "United Kingdom",
    status: "ACTIVE",
    orders: 12,
    balance: "$2,800",
  },
  {
    id: "CUS-004",
    name: "David Wilson",
    company: "Blue Coast Trading",
    email: "david@bluecoast.com",
    phone: "+61 2 5550 1234",
    country: "Australia",
    status: "PENDING",
    orders: 5,
    balance: "$6,150",
  },
];

function AdminCustomers() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    country: "",
  });

  const filteredCustomers = customers.filter((customer) =>
    `${customer.name} ${customer.company} ${customer.email} ${customer.country}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    const newCustomer = {
      id: `CUS-${String(customers.length + 1).padStart(3, "0")}`,
      ...form,
      status: "ACTIVE",
      orders: 0,
      balance: "$0",
    };

    setCustomers((current) => [...current, newCustomer]);

    setForm({
      name: "",
      company: "",
      email: "",
      phone: "",
      country: "",
    });

    setShowForm(false);
  };

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

          <Link
            to="/admin/customers"
            className="admin-nav-link active"
          >
            <Users size={17} />
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
              CUSTOMER MANAGEMENT
            </span>

            <h1>Customers</h1>

            <p>
              Manage MARVEL Global Fish Trading customers
              and trade accounts.
            </p>
          </div>

          <button
            className="admin-primary-button"
            onClick={() => setShowForm(true)}
          >
            <Plus size={17} />
            Add Customer
          </button>

        </header>

        <div className="admin-content">

          <div className="admin-toolbar">

            <div className="admin-search">

              <Search size={17} />

              <input
                type="text"
                placeholder="Search customers..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />

            </div>

            <span>
              {filteredCustomers.length} customers
            </span>

          </div>

          {showForm && (
            <div className="admin-form-panel">

              <div className="admin-panel-header">
                <div>
                  <span className="section-label">
                    NEW ACCOUNT
                  </span>
                  <h2>Add customer</h2>
                </div>
              </div>

              <form
                className="admin-form-grid"
                onSubmit={handleSubmit}
              >

                <input
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  required
                />

                <input
                  placeholder="Company name"
                  value={form.company}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      company: e.target.value,
                    })
                  }
                  required
                />

                <input
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  required
                />

                <input
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value,
                    })
                  }
                  required
                />

                <input
                  placeholder="Country"
                  value={form.country}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      country: e.target.value,
                    })
                  }
                  required
                />

                <div className="admin-form-actions">

                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="admin-secondary-button"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="admin-primary-button"
                  >
                    Create Customer
                  </button>

                </div>

              </form>

            </div>
          )}

          <div className="admin-panel">

            <div className="admin-table admin-customer-table">

              <div className="admin-table-head">
                <span>CUSTOMER</span>
                <span>CONTACT</span>
                <span>COUNTRY</span>
                <span>ORDERS</span>
                <span>BALANCE</span>
                <span>STATUS</span>
                <span></span>
              </div>

              {filteredCustomers.map((customer) => (

                <div
                  className="admin-table-row"
                  key={customer.id}
                >

                  <div className="admin-customer-name">
                    <strong>
                      {customer.company}
                    </strong>

                    <span>
                      {customer.id} · {customer.name}
                    </span>
                  </div>

                  <div className="admin-contact">

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

                  <button className="admin-more-button">
                    <MoreHorizontal size={17} />
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

export default AdminCustomers;