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
}

export default Reports;
