import { useState } from "react";
import {
  Search,
  Plus,
  Ship,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const initialOrders = [
  {
    id: "ORD-MAR-001",
    customer: "John Smith Trading",
    product: "Frozen Fish",
    quantity: "2,000 KG",
    destination: "New York, USA",
    date: "24 Aug 2026",
    status: "IN TRANSIT",
  },
  {
    id: "ORD-MAR-002",
    customer: "Gulf Seafood LLC",
    product: "Premium Shrimp",
    quantity: "1,500 KG",
    destination: "Dubai, UAE",
    date: "23 Aug 2026",
    status: "PROCESSING",
  },
  {
    id: "ORD-MAR-003",
    customer: "Ocean Foods Ltd",
    product: "Fresh Fish",
    quantity: "1,000 KG",
    destination: "London, UK",
    date: "22 Aug 2026",
    status: "DELIVERED",
  },
  {
    id: "ORD-MAR-004",
    customer: "Blue Coast Trading",
    product: "Hake Fillets",
    quantity: "850 KG",
    destination: "Sydney, Australia",
    date: "21 Aug 2026",
    status: "PENDING",
  },
];

function AdminOrders() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");

  const filteredOrders = orders.filter((order) =>
    `${order.id} ${order.customer} ${order.product} ${order.destination}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const cycleStatus = (id) => {
    const statuses = [
      "PENDING",
      "PROCESSING",
      "IN TRANSIT",
      "DELIVERED",
    ];

    setOrders((current) =>
      current.map((order) => {
        if (order.id !== id) return order;

        const index = statuses.indexOf(order.status);

        return {
          ...order,
          status: statuses[(index + 1) % statuses.length],
        };
      })
    );
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

          <Link to="/admin/customers" className="admin-nav-link">
            Customers
          </Link>

          <Link to="/admin/products" className="admin-nav-link">
            Products
          </Link>

          <Link
            to="/admin/orders"
            className="admin-nav-link active"
          >
            <Ship size={17} />
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
              ORDER MANAGEMENT
            </span>

            <h1>Orders</h1>

            <p>
              Track and manage customer seafood orders.
            </p>
          </div>

          <button className="admin-primary-button">
            <Plus size={17} />
            Create Order
          </button>

        </header>

        <div className="admin-content">

          <div className="admin-toolbar">

            <div className="admin-search">

              <Search size={17} />

              <input
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>

            <span>
              {filteredOrders.length} orders
            </span>

          </div>

          <div className="admin-panel">

            <div className="admin-table">

              <div className="admin-table-head">
                <span>ORDER</span>
                <span>CUSTOMER</span>
                <span>PRODUCT</span>
                <span>DESTINATION</span>
                <span>DATE</span>
                <span>STATUS</span>
                <span></span>
              </div>

              {filteredOrders.map((order) => (

                <div
                  className="admin-table-row"
                  key={order.id}
                >

                  <strong>{order.id}</strong>

                  <span>{order.customer}</span>

                  <div>
                    <strong>{order.product}</strong>
                    <span>{order.quantity}</span>
                  </div>

                  <span>{order.destination}</span>

                  <span>{order.date}</span>

                  <button
                    className={`admin-status ${order.status
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                    onClick={() => cycleStatus(order.id)}
                    title="Click to update status"
                  >
                    {order.status}
                  </button>

                  <ChevronRight size={16} />

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default AdminOrders;