<<<<<<< HEAD
import {
BarChart3,
Download,
Package,
ShoppingCart,
TrendingUp,
Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getProducts } from "../../data/store";
import AdminLayout from "../../components/AdminLayout";

function Reports() {
const products = getProducts();

const availableProducts = products.filter((product) => {
const status = String(product.status || "").toUpperCase();


return (
  status === "AVAILABLE" ||
  status === "IN STOCK" ||
  status === "ACTIVE"
);


}).length;

const lowStockProducts = products.filter((product) => {
const status = String(product.status || "").toUpperCase();


return (
  status === "LOW STOCK" ||
  status === "LOW_STOCK" ||
  Number(product.stock) <= 10
);


}).length;

const totalStock = products.reduce(
(total, product) => total + Number(product.stock || 0),
0
);

const handleExport = () => {
const reportDate = new Date().toLocaleDateString(
"en-GB",
{
day: "2-digit",
month: "short",
year: "numeric",
}
);


const report = `


MARVEL GLOBAL FISH TRADING
BUSINESS PERFORMANCE REPORT

Generated: ${reportDate}

========================================
CATALOGUE SUMMARY
=================

Total Products: ${products.length}
Available Products: ${availableProducts}
Low Stock Products: ${lowStockProducts}
Total Stock: ${totalStock.toLocaleString()} KG

========================================
PRODUCT CATALOGUE
=================

${products
.map(
(product, index) => `${index + 1}. ${product.name || "Unnamed Product"}
   ID: ${product.id || "N/A"}
   Category: ${product.category || "N/A"}
   Origin: ${product.origin || "N/A"}
   Stock: ${Number(product.stock || 0).toLocaleString()}
   Unit: ${product.unit || "N/A"}
   Price: ${product.price || "N/A"}`
)
.join("\n")}

========================================
END OF REPORT
=============

MARVEL GLOBAL FISH TRADING
International Seafood Trading & Logistics
`;


const blob = new Blob([report], {
  type: "text/plain;charset=utf-8",
});

const url = URL.createObjectURL(blob);

const link = document.createElement("a");
link.href = url;
link.download = `Marvel-Fish-Trading-Report-${Date.now()}.txt`;

document.body.appendChild(link);
link.click();

document.body.removeChild(link);
URL.revokeObjectURL(url);


};

return ( <AdminLayout> <div className="admin-page">
{/* HEADER */} <header className="admin-header"> <div> <span className="section-label">
BUSINESS INSIGHTS </span>

```
        <h1>Reports</h1>

        <p>
          Monitor catalogue performance and business
          activity from one place.
        </p>
      </div>

      <button
        type="button"
        className="admin-primary-button"
        onClick={handleExport}
      >
        <Download size={17} />
        Export Report
      </button>
    </header>

    <div className="admin-content">
      {/* KPI CARDS */}
      <section className="admin-kpis">
        <article className="admin-kpi">
          <div className="admin-kpi-icon">
            <Package size={20} />
          </div>

          <div>
            <span>Total Products</span>
            <strong>{products.length}</strong>
            <small>Products in catalogue</small>
          </div>
        </article>

        <article className="admin-kpi">
          <div className="admin-kpi-icon">
            <TrendingUp size={20} />
          </div>

          <div>
            <span>Available Products</span>
            <strong>{availableProducts}</strong>
            <small>Ready for quotation</small>
          </div>
        </article>

        <article className="admin-kpi">
          <div className="admin-kpi-icon">
            <BarChart3 size={20} />
          </div>

          <div>
            <span>Low Stock</span>
            <strong>{lowStockProducts}</strong>
            <small>Requires attention</small>
          </div>
        </article>
      </section>

      {/* PERFORMANCE SUMMARY */}
      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <span className="section-label">
              PERFORMANCE SUMMARY
            </span>

            <h2>Catalogue overview</h2>
          </div>
        </div>

        <div className="admin-report-grid">
          {/* PRODUCTS */}
          <article className="admin-report-card">
            <Package size={24} />

            <h3>Product Management</h3>

            <p>
              You currently have{" "}
              <strong>{products.length}</strong>{" "}
              products in your seafood catalogue.
            </p>

            <Link to="/admin/products">
              Manage Products →
            </Link>
          </article>

          {/* ORDERS */}
          <article className="admin-report-card">
            <ShoppingCart size={24} />

            <h3>Orders</h3>

            <p>
              Review customer orders and track the
              progress of each transaction.
            </p>

            <Link to="/admin/orders">
              View Orders →
            </Link>
          </article>

          {/* CUSTOMERS */}
          <article className="admin-report-card">
            <Users size={24} />

            <h3>Customers</h3>

            <p>
              Review customer records and manage
              business relationships.
            </p>

            <Link to="/admin/customers">
              View Customers →
            </Link>
          </article>
        </div>
      </section>
    </div>
  </div>
</AdminLayout>
);
=======
import { BarChart3, FileDown, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const reportRows = [
  { label: "Revenue this month", value: "$48,650", detail: "+12.8% vs last month" },
  { label: "Orders fulfilled", value: "38", detail: "92% on-time delivery" },
  { label: "Average order value", value: "$6,081", detail: "Across active trade orders" },
  { label: "Top destination", value: "Dubai", detail: "18% of shipped volume" },
];

function Reports() {
  return (
    <main className="admin-layout">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-brand">MARVEL<span>GLOBAL FISH TRADING</span></Link>
        <div className="admin-sidebar-label">ADMINISTRATION</div>
        <nav className="admin-navigation">
          <Link to="/admin" className="admin-nav-link">Dashboard</Link>
          <Link to="/admin/customers" className="admin-nav-link">Customers</Link>
          <Link to="/admin/products" className="admin-nav-link">Products</Link>
          <Link to="/admin/orders" className="admin-nav-link">Orders</Link>
          <Link to="/admin/invoices" className="admin-nav-link">Invoices</Link>
          <Link to="/admin/payments" className="admin-nav-link">Payments</Link>
          <Link to="/admin/shipments" className="admin-nav-link">Shipments</Link>
          <Link to="/admin/reports" className="admin-nav-link active"><BarChart3 size={17} />Reports</Link>
        </nav>
        <div className="admin-sidebar-bottom"><Link to="/admin/settings" className="admin-nav-link">Settings</Link></div>
      </aside>

      <section className="admin-main">
        <header className="admin-header"><div><span className="section-label">BUSINESS INTELLIGENCE</span><h1>Reports</h1><p>Review the signals that keep MARVEL trade operations moving.</p></div><button type="button" className="admin-primary-button" onClick={() => window.print()}><FileDown size={17} />Export report</button></header>
        <div className="admin-content">
          <section className="admin-kpis">
            {reportRows.slice(0, 3).map((report) => <article className="admin-kpi" key={report.label}><div className="admin-kpi-icon"><TrendingUp size={20} /></div><div><span>{report.label}</span><strong>{report.value}</strong><small>{report.detail}</small></div></article>)}
          </section>
          <section className="admin-panel"><div className="admin-panel-header"><div><span className="section-label">PERFORMANCE SNAPSHOT</span><h2>Current operating picture</h2></div></div><div className="admin-table"><div className="admin-table-head"><span>MEASURE</span><span>VALUE</span><span>CONTEXT</span></div>{reportRows.map((report) => <div className="admin-table-row" key={report.label}><strong>{report.label}</strong><strong>{report.value}</strong><span>{report.detail}</span></div>)}</div></section>
        </div>
      </section>
    </main>
  );
>>>>>>> ceffe9c7c6d47d15c954a08fb7eaaf41b529a13a
}

export default Reports;
