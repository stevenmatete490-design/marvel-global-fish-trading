import { Ship, MapPin, Package, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const shipments = [
  {
    id: "SHP-MAR-001",
    order: "ORD-MAR-001",
    customer: "John Smith Trading",
    origin: "Mombasa, Kenya",
    destination: "New York, USA",
    vessel: "MV Ocean Star",
    status: "IN TRANSIT",
    eta: "14 Sep 2026",
  },
  {
    id: "SHP-MAR-002",
    order: "ORD-MAR-002",
    customer: "Gulf Seafood LLC",
    origin: "Mombasa, Kenya",
    destination: "Dubai, UAE",
    vessel: "MV Blue Horizon",
    status: "PROCESSING",
    eta: "09 Sep 2026",
  },
  {
    id: "SHP-MAR-003",
    order: "ORD-MAR-003",
    customer: "Ocean Foods Ltd",
    origin: "Cape Town, South Africa",
    destination: "London, UK",
    vessel: "MV Atlantic",
    status: "DELIVERED",
    eta: "Delivered",
  },
];

function AdminShipments() {
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

          <Link to="/admin/payments" className="admin-nav-link">
            Payments
          </Link>

          <Link
            to="/admin/shipments"
            className="admin-nav-link active"
          >
            <Ship size={17} />
            Shipments
          </Link>

        </nav>

      </aside>

      <section className="admin-main">

        <header className="admin-header">

          <div>
            <span className="section-label">
              GLOBAL LOGISTICS
            </span>

            <h1>Shipments</h1>

            <p>
              Track international seafood shipments and delivery status.
            </p>
          </div>

        </header>

        <div className="admin-content">

          <div className="admin-kpis">

            <article className="admin-kpi">
              <div className="admin-kpi-icon">
                <Ship size={20} />
              </div>

              <div>
                <span>Active Shipments</span>
                <strong>8</strong>
                <small>Currently moving</small>
              </div>
            </article>

            <article className="admin-kpi">
              <div className="admin-kpi-icon">
                <Package size={20} />
              </div>

              <div>
                <span>Total Cargo</span>
                <strong>5,350 KG</strong>
                <small>In active shipments</small>
              </div>
            </article>

            <article className="admin-kpi">
              <div className="admin-kpi-icon">
                <Clock size={20} />
              </div>

              <div>
                <span>Destinations</span>
                <strong>5</strong>
                <small>International markets</small>
              </div>
            </article>

          </div>

          <div className="admin-shipment-grid">

            {shipments.map((shipment) => (

              <article
                className="admin-shipment-card"
                key={shipment.id}
              >

                <div className="admin-shipment-top">

                  <div className="admin-order-icon">
                    <Ship size={18} />
                  </div>

                  <div>
                    <strong>{shipment.id}</strong>
                    <span>{shipment.order}</span>
                  </div>

                  <span
                    className={`admin-status ${
                      shipment.status === "DELIVERED"
                        ? "paid"
                        : "pending"
                    }`}
                  >
                    {shipment.status}
                  </span>

                </div>

                <div className="admin-shipment-route">

                  <div>
                    <span>ORIGIN</span>
                    <strong>
                      <MapPin size={14} />
                      {shipment.origin}
                    </strong>
                  </div>

                  <Ship size={20} />

                  <div>
                    <span>DESTINATION</span>
                    <strong>
                      <MapPin size={14} />
                      {shipment.destination}
                    </strong>
                  </div>

                </div>

                <div className="admin-shipment-footer">

                  <span>
                    Vessel: <strong>{shipment.vessel}</strong>
                  </span>

                  <span>
                    ETA: <strong>{shipment.eta}</strong>
                  </span>

                </div>

              </article>

            ))}

          </div>

        </div>

      </section>

    </main>
  );
}

export default AdminShipments;