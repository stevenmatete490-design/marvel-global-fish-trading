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
}

export default Reports;
