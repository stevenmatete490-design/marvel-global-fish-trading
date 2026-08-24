import { useState } from "react";
import { Bell, Save, Settings as SettingsIcon, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

function Settings() {
  const [companyName, setCompanyName] = useState("MARVEL Global Fish Trading");
  const [email, setEmail] = useState("admin@marvelglobal.com");
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

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
          <Link to="/admin/reports" className="admin-nav-link">Reports</Link>
        </nav>
        <div className="admin-sidebar-bottom"><Link to="/admin/settings" className="admin-nav-link active"><SettingsIcon size={17} />Settings</Link></div>
      </aside>

      <section className="admin-main">
        <header className="admin-header"><div><span className="section-label">WORKSPACE CONFIGURATION</span><h1>Settings</h1><p>Keep your company profile and admin preferences current.</p></div></header>
        <div className="admin-content">
          <form className="admin-form-panel" onSubmit={handleSubmit}>
            <div className="admin-panel-header"><div><span className="section-label">COMPANY PROFILE</span><h2>Workspace details</h2></div></div>
            <div className="admin-form-grid">
              <label>Company name<input value={companyName} onChange={(event) => setCompanyName(event.target.value)} required /></label>
              <label>Admin email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
            </div>
            <div className="admin-form-actions"><button type="button" className="admin-secondary-button" onClick={() => setNotifications((current) => !current)}><Bell size={16} />{notifications ? "Notifications on" : "Notifications off"}</button><button type="submit" className="admin-primary-button"><Save size={16} />Save changes</button></div>
            {saved && <p role="status" className="admin-save-message"><ShieldCheck size={16} />Settings saved for this session.</p>}
          </form>
        </div>
      </section>
    </main>
  );
}

export default Settings;
