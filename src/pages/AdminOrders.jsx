import { useMemo, useState } from "react";
import { ArrowLeft, Search, Ship } from "lucide-react";
import { Link } from "react-router-dom";

const initialOrders = [
  {
    id: "ORD-MAR-001",
    customer: "John Smith Trading",
    product: "Frozen Atlantic Mackerel",
    quantity: "2,000 KG",
    destination: "Dubai, UAE",
    date: "24 Aug 2026",
    status: "IN TRANSIT",
  },
  {
    id: "ORD-MAR-002",
    customer: "Gulf Seafood LLC",
    product: "Premium White Shrimp",
    quantity: "1,500 KG",
    destination: "Doha, Qatar",
    date: "23 Aug 2026",
    status: "PROCESSING",
  },
  {
    id: "ORD-MAR-003",
    customer: "Ocean Foods Ltd",
    product: "Fresh Nile Perch",
    quantity: "1,000 KG",
    destination: "Nairobi, Kenya",
    date: "22 Aug 2026",
    status: "DELIVERED",
  },
  {
    id: "ORD-MAR-004",
    customer: "Blue Coast Trading",
    product: "Frozen Tilapia",
    quantity: "3,000 KG",
    destination: "Mombasa, Kenya",
    date: "21 Aug 2026",
    status: "PENDING",
  },
];

const statuses = ["ALL STATUS", "PENDING", "PROCESSING", "IN TRANSIT", "DELIVERED"];

function AdminOrders() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL STATUS");

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch = !term || Object.values(order).join(" ").toLowerCase().includes(term);
      const matchesStatus = status === "ALL STATUS" || order.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, status]);

  const updateStatus = (id, newStatus) => {
    setOrders((current) => current.map((order) => (
      order.id === id ? { ...order, status: newStatus } : order
    )));
  };

  const statusClass = (value) => value.toLowerCase().replaceAll(" ", "-");

  return (
    <main className="admin-layout">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-brand">
          MARVEL
          <span>GLOBAL FISH TRADING</span>
        </Link>
        <div className="admin-sidebar-label">ADMINISTRATION</div>
        <nav className="admin-navigation">
          <Link to="/admin" className="admin-nav-link">Dashboard</Link>
          <Link to="/admin/customers" className="admin-nav-link">Customers</Link>
          <Link to="/admin/products" className="admin-nav-link">Products</Link>
          <Link to="/admin/orders" className="admin-nav-link active"><Ship size={17} />Orders</Link>
          <Link to="/admin/invoices" className="admin-nav-link">Invoices</Link>
          <Link to="/admin/payments" className="admin-nav-link">Payments</Link>
          <Link to="/admin/shipments" className="admin-nav-link">Shipments</Link>
          <Link to="/admin/reports" className="admin-nav-link">Reports</Link>
        </nav>
        <div className="admin-sidebar-bottom">
          <Link to="/admin/settings" className="admin-nav-link">Settings</Link>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-header">
          <div>
            <Link to="/admin" className="admin-back-link"><ArrowLeft size={16} />Dashboard</Link>
            <span className="section-label">ORDER MANAGEMENT</span>
            <h1>Orders</h1>
            <p>Track customer orders and manage fulfillment.</p>
          </div>
        </header>

        <div className="admin-content">
          <section className="admin-kpis">
            <article className="admin-kpi"><div className="admin-kpi-icon"><Ship size={20} /></div><div><span>Total Orders</span><strong>{orders.length}</strong><small>Current trade orders</small></div></article>
            <article className="admin-kpi"><div className="admin-kpi-icon"><Ship size={20} /></div><div><span>In Transit</span><strong>{orders.filter((order) => order.status === "IN TRANSIT").length}</strong><small>Active shipments</small></div></article>
            <article className="admin-kpi"><div className="admin-kpi-icon"><Ship size={20} /></div><div><span>Delivered</span><strong>{orders.filter((order) => order.status === "DELIVERED").length}</strong><small>Completed orders</small></div></article>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-header"><div><span className="section-label">TRADE OPERATIONS</span><h2>Order management</h2></div></div>
            <div className="admin-toolbar">
              <div className="product-search"><Search size={18} /><input type="search" placeholder="Search orders..." value={search} onChange={(event) => setSearch(event.target.value)} /></div>
              <select className="admin-select" value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter orders by status">
                {statuses.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div className="admin-table">
              <div className="admin-table-head"><span>ORDER</span><span>CUSTOMER</span><span>PRODUCT</span><span>QUANTITY</span><span>DESTINATION</span><span>STATUS</span></div>
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <div className="admin-table-row" key={order.id}>
                  <div className="admin-product-name"><div className="admin-order-icon"><Ship size={16} /></div><div><strong>{order.id}</strong><span>{order.date}</span></div></div>
                  <span>{order.customer}</span>
                  <span>{order.product}</span>
                  <strong>{order.quantity}</strong>
                  <span>{order.destination}</span>
                  <select className={`admin-status-select ${statusClass(order.status)}`} value={order.status} onChange={(event) => updateStatus(order.id, event.target.value)} aria-label={`Update ${order.id} status`}>
                    {statuses.filter((item) => item !== "ALL STATUS").map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
              )) : <div className="admin-empty-state"><Ship size={30} /><h3>No orders found</h3><p>Try changing your search or status filter.</p></div>}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default AdminOrders;
