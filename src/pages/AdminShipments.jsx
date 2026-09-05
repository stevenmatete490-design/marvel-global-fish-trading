import {
Ship,
MapPin,
Package,
Clock,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";

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
return ( <AdminLayout> <div className="admin-page">
{/* HEADER */} <header className="admin-header"> <div> <span className="section-label">
GLOBAL LOGISTICS </span>

```
        <h1>Shipments</h1>

        <p>
          Track international seafood shipments and delivery
          status.
        </p>
      </div>
    </header>

    <div className="admin-content">
      {/* KPI CARDS */}
      <section className="admin-kpis">
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
      </section>

      {/* SHIPMENT CARDS */}
      <section className="admin-shipment-grid">
        {shipments.map((shipment) => (
          <article
            className="admin-shipment-card"
            key={shipment.id}
          >
            {/* TOP */}
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

            {/* ROUTE */}
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

            {/* FOOTER */}
            <div className="admin-shipment-footer">
              <span>
                Vessel:{" "}
                <strong>{shipment.vessel}</strong>
              </span>

              <span>
                ETA: <strong>{shipment.eta}</strong>
              </span>
            </div>
          </article>
        ))}
      </section>
    </div>
  </div>
</AdminLayout>
);
}

export default AdminShipments;
