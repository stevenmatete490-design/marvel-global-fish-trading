import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Edit3, Mail, Phone, Plus, Search, Trash2, Users, X } from "lucide-react";
import { Link } from "react-router-dom";
import { getCustomers, nextId, saveCustomers, subscribeToDataChanges } from "../../data/store";

const emptyForm = { name: "", email: "", phone: "", country: "", status: "ACTIVE", balance: "$0" };

function Customers() {
  const [customers, setCustomers] = useState(getCustomers);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");
  useEffect(() => subscribeToDataChanges(() => setCustomers(getCustomers())), []);

  const filteredCustomers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return customers.filter((customer) => !term || Object.values(customer).join(" ").toLowerCase().includes(term));
  }, [customers, search]);

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const openCreate = () => { setEditingId(null); setForm(emptyForm); setFormError(""); };
  const openEdit = (customer) => { setEditingId(customer.id); setForm({ ...emptyForm, ...customer }); setFormError(""); };
  const cancelForm = () => { setEditingId(null); setForm(emptyForm); setFormError(""); };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.country.trim()) { setFormError("Name, email, phone and country are required."); return; }
    const current = getCustomers();
    const customer = { ...form, name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), country: form.country.trim() };
    const next = editingId ? current.map((item) => item.id === editingId ? { ...item, ...customer, id: editingId } : item) : [...current, { ...customer, id: nextId("CUS", current), orders: 0 }];
    saveCustomers(next); setCustomers(next); cancelForm();
  };

  const handleDelete = (customer) => {
    if (!window.confirm(`Delete ${customer.name} from customer records?`)) return;
    const next = getCustomers().filter((item) => item.id !== customer.id);
    saveCustomers(next); setCustomers(next);
  };

  return <main className="admin-layout"><aside className="admin-sidebar"><Link to="/" className="admin-brand">MARVEL<span>GLOBAL FISH TRADING</span></Link><div className="admin-sidebar-label">ADMINISTRATION</div><nav className="admin-navigation"><Link to="/admin" className="admin-nav-link">Dashboard</Link><Link to="/admin/customers" className="admin-nav-link active"><Users size={17} />Customers</Link><Link to="/admin/products" className="admin-nav-link">Products</Link><Link to="/admin/orders" className="admin-nav-link">Orders</Link><Link to="/admin/invoices" className="admin-nav-link">Invoices</Link><Link to="/admin/payments" className="admin-nav-link">Payments</Link><Link to="/admin/shipments" className="admin-nav-link">Shipments</Link><Link to="/admin/reports" className="admin-nav-link">Reports</Link></nav><div className="admin-sidebar-bottom"><Link to="/admin/settings" className="admin-nav-link">Settings</Link></div></aside><section className="admin-main"><header className="admin-header"><div><Link to="/admin" className="admin-back-link"><ArrowLeft size={16} />Dashboard</Link><span className="section-label">CUSTOMER MANAGEMENT</span><h1>Customers</h1><p>Manage customer accounts and trade relationships.</p></div><button type="button" className="admin-primary-button" onClick={openCreate}><Plus size={17} />Add Customer</button></header><div className="admin-content"><section className="admin-kpis"><article className="admin-kpi"><div className="admin-kpi-icon"><Users size={20} /></div><div><span>Total Customers</span><strong>{customers.length}</strong><small>Registered accounts</small></div></article><article className="admin-kpi"><div className="admin-kpi-icon"><Users size={20} /></div><div><span>Active Customers</span><strong>{customers.filter((customer) => customer.status === "ACTIVE").length}</strong><small>Currently trading</small></div></article><article className="admin-kpi"><div className="admin-kpi-icon"><Mail size={20} /></div><div><span>Pending Accounts</span><strong>{customers.filter((customer) => customer.status === "PENDING").length}</strong><small>Awaiting approval</small></div></article></section>{(editingId || form.name) && <form className="admin-form-panel" onSubmit={handleSubmit}><div className="admin-panel-header"><div><span className="section-label">{editingId ? "EDIT CUSTOMER" : "NEW CUSTOMER"}</span><h2>{editingId ? "Update customer" : "Add a customer"}</h2></div><button type="button" className="admin-more-button" onClick={cancelForm} aria-label="Close customer form"><X size={18} /></button></div><div className="admin-form-grid"><label>Company name<input name="name" value={form.name} onChange={updateField} required /></label><label>Email<input type="email" name="email" value={form.email} onChange={updateField} required /></label><label>Phone<input name="phone" value={form.phone} onChange={updateField} required /></label><label>Country<input name="country" value={form.country} onChange={updateField} required /></label><label>Status<select name="status" value={form.status} onChange={updateField}><option>ACTIVE</option><option>PENDING</option><option>INACTIVE</option></select></label><label>Balance<input name="balance" value={form.balance} onChange={updateField} /></label></div>{formError && <p className="login-error" role="alert">{formError}</p>}<div className="admin-form-actions"><button type="button" className="admin-secondary-button" onClick={cancelForm}>Cancel</button><button type="submit" className="admin-primary-button">{editingId ? "Save customer" : "Create customer"}</button></div></form>}<section className="admin-panel"><div className="admin-panel-header"><div><span className="section-label">CUSTOMER DIRECTORY</span><h2>All customers</h2></div><div className="admin-search"><Search size={17} /><input type="search" placeholder="Search customers..." value={search} onChange={(event) => setSearch(event.target.value)} /></div></div><div className="admin-table"><div className="admin-table-head"><span>CUSTOMER</span><span>CONTACT</span><span>COUNTRY</span><span>ORDERS</span><span>BALANCE</span><span>STATUS</span><span>ACTIONS</span></div>{filteredCustomers.length ? filteredCustomers.map((customer) => <div className="admin-table-row" key={customer.id}><div><strong>{customer.name}</strong><small>{customer.id}</small></div><div className="admin-contact"><span><Mail size={13} />{customer.email}</span><span><Phone size={13} />{customer.phone}</span></div><span>{customer.country}</span><strong>{customer.orders}</strong><strong>{customer.balance}</strong><span className={`admin-status ${customer.status === "ACTIVE" ? "paid" : "pending"}`}>{customer.status}</span><div className="admin-row-actions"><button type="button" onClick={() => openEdit(customer)} aria-label={`Edit ${customer.name}`}><Edit3 size={16} /></button><button type="button" onClick={() => handleDelete(customer)} aria-label={`Delete ${customer.name}`}><Trash2 size={16} /></button></div></div>) : <div className="admin-empty-state"><Users size={30} /><h3>No customers found</h3><p>Try changing your search criteria.</p></div>}</div></section></div></section></main>;
}

export default Customers;
