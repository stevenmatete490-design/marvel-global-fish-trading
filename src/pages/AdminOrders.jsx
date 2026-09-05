import { useEffect, useMemo, useState } from "react";
<<<<<<< HEAD
import {
  Search,
  Plus,
  Ship,
  ChevronRight,
  X,
  Save,
  Trash2,
  AlertCircle,
} from "lucide-react";

import AdminLayout from "../components/AdminLayout";

import {
  getOrders,
  addOrder,
  updateOrder,
  deleteOrder,
  nextId,
  subscribeToDataChanges,
  getCustomers,
  getProducts,
} from "../data/store";

const EMPTY_FORM = {
  customerId: "",
  customerName: "",
  productId: "",
  productName: "",
  quantity: "",
  destination: "",
  currency: "USD",
  subtotal: "",
  status: "PENDING",
  paymentStatus: "PENDING",
  shippingStatus: "PENDING",
};

const ORDER_STATUSES = [
  "PENDING",
  "PROCESSING",
  "IN TRANSIT",
  "DELIVERED",
];

function formatDate(dateValue) {
  if (!dateValue) return "—";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getOrderProduct(order) {
  if (Array.isArray(order.items) && order.items.length > 0) {
    const firstItem = order.items[0];

    return {
      name:
        firstItem.productName ||
        firstItem.name ||
        firstItem.product ||
        order.productName ||
        order.product ||
        "Seafood Order",

      quantity:
        firstItem.quantity !== undefined
          ? `${firstItem.quantity} ${firstItem.unit || ""}`.trim()
          : order.quantity || "—",
    };
  }

  return {
    name:
      order.productName ||
      order.product ||
      "Seafood Order",

    quantity: order.quantity || "—",
  };
}

function getOrderDestination(order) {
  return (
    order.destination ||
    order.shippingAddress ||
    order.deliveryAddress ||
    order.country ||
    "—"
  );
}

function AdminOrders() {
  const [orders, setOrders] = useState(() => getOrders());

  const [customers, setCustomers] = useState(() =>
    getCustomers()
  );

  const [products, setProducts] = useState(() =>
    getProducts()
  );

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingOrder, setEditingOrder] = useState(null);

  const [form, setForm] = useState({
    ...EMPTY_FORM,
  });

  const [error, setError] = useState("");

  /*
   * ==========================================
   * STORE SUBSCRIPTION
   * ==========================================
   */

  useEffect(() => {
    const unsubscribe = subscribeToDataChanges(() => {
      setOrders(getOrders());
      setCustomers(getCustomers());
      setProducts(getProducts());
    });

    return unsubscribe;
  }, []);

  /*
   * ==========================================
   * SEARCH
   * ==========================================
   */

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return orders;
    }

    return orders.filter((order) => {
      const product = getOrderProduct(order);

      const searchableText = `
        ${order.id || ""}
        ${order.customerName || ""}
        ${order.customer || ""}
        ${product.name || ""}
        ${getOrderDestination(order)}
        ${order.status || ""}
        ${order.paymentStatus || ""}
        ${order.shippingStatus || ""}
      `;

      return searchableText
        .toLowerCase()
        .includes(query);
    });
  }, [orders, search]);

  /*
   * ==========================================
   * KPI STATISTICS
   * ==========================================
   */

  const stats = useMemo(() => {
    return {
      total: orders.length,

      pending: orders.filter(
        (order) => order.status === "PENDING"
      ).length,

      processing: orders.filter(
        (order) => order.status === "PROCESSING"
      ).length,

      transit: orders.filter(
        (order) => order.status === "IN TRANSIT"
      ).length,

      delivered: orders.filter(
        (order) => order.status === "DELIVERED"
      ).length,
    };
  }, [orders]);

  /*
   * ==========================================
   * CREATE ORDER
   * ==========================================
   */

  const openCreateForm = () => {
    setEditingOrder(null);

    setForm({
      ...EMPTY_FORM,
    });

    setError("");

    setShowForm(true);
  };

  /*
   * ==========================================
   * EDIT ORDER
   * ==========================================
   */

  const openEditForm = (order) => {
    const product = getOrderProduct(order);

    setEditingOrder(order);

    setError("");

    setForm({
      customerId: order.customerId || "",

      customerName:
        order.customerName ||
        order.customer ||
        "",

      productId:
        order.productId ||
        (Array.isArray(order.items) &&
          order.items[0]?.productId) ||
        "",

      productName: product.name || "",

      quantity:
        order.quantity ||
        (Array.isArray(order.items) &&
          order.items[0]?.quantity) ||
        "",

      destination: getOrderDestination(order),

      currency: order.currency || "USD",

      subtotal: order.subtotal ?? "",

      status: order.status || "PENDING",

      paymentStatus:
        order.paymentStatus || "PENDING",

      shippingStatus:
        order.shippingStatus || "PENDING",
    });

    setShowForm(true);
  };

  /*
   * ==========================================
   * CLOSE FORM
   * ==========================================
   */

  const closeForm = () => {
    setShowForm(false);

    setEditingOrder(null);

    setForm({
      ...EMPTY_FORM,
    });

    setError("");
  };

  /*
   * ==========================================
   * FORM CHANGE
   * ==========================================
   */

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "customerId") {
      const customer = customers.find(
        (item) => item.id === value
      );

      setForm((current) => ({
        ...current,

        customerId: value,

        customerName: customer
          ? customer.name ||
            customer.company ||
            ""
          : current.customerName,
      }));

      setError("");

      return;
    }

    if (name === "productId") {
      const product = products.find(
        (item) => item.id === value
      );

      setForm((current) => ({
        ...current,

        productId: value,

        productName: product
          ? product.name
          : current.productName,
      }));

      setError("");

      return;
    }

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  /*
   * ==========================================
   * VALIDATION
   * ==========================================
   */

  const validateForm = () => {
    if (!form.customerName.trim()) {
      return "Customer is required.";
    }

    if (!form.productName.trim()) {
      return "Product is required.";
    }

    if (
      !form.quantity ||
      Number(form.quantity) <= 0
    ) {
      return "Enter a valid quantity.";
    }

    if (!form.destination.trim()) {
      return "Destination is required.";
    }

    if (
      form.subtotal !== "" &&
      (
        Number.isNaN(Number(form.subtotal)) ||
        Number(form.subtotal) < 0
      )
    ) {
      return "Enter a valid subtotal.";
    }

    return "";
  };

  /*
   * ==========================================
   * SAVE ORDER
   * ==========================================
   */

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const quantity = Number(form.quantity);

    const subtotal =
      form.subtotal === ""
        ? 0
        : Number(form.subtotal);

    const orderData = {
      customerId: form.customerId || "",

      customerName: form.customerName.trim(),

      productId: form.productId || "",

      productName: form.productName.trim(),

      quantity,

      destination: form.destination.trim(),

      currency: form.currency || "USD",

      subtotal,

      total: subtotal,

      status: form.status,

      paymentStatus: form.paymentStatus,

      shippingStatus: form.shippingStatus,

      items: [
        {
          productId: form.productId || "",

          productName:
            form.productName.trim(),

          name:
            form.productName.trim(),

          quantity,
        },
      ],

      updatedAt: new Date().toISOString(),
    };

    try {
      if (editingOrder) {
        updateOrder(
          editingOrder.id,
          orderData
        );
      } else {
        addOrder({
          id: nextId("ORD", orders),

          ...orderData,

          createdAt:
            new Date().toISOString(),
        });
      }

      closeForm();
    } catch (err) {
      console.error(
        "Unable to save order:",
        err
      );

      setError(
        "Unable to save the order. Please try again."
      );
    }
  };

  /*
   * ==========================================
   * CYCLE ORDER STATUS
   * ==========================================
   */

  const cycleStatus = (order) => {
    const currentIndex =
      ORDER_STATUSES.indexOf(
        order.status
      );

    const safeIndex =
      currentIndex === -1
        ? 0
        : currentIndex;

    const nextStatus =
      ORDER_STATUSES[
        (safeIndex + 1) %
          ORDER_STATUSES.length
      ];

    updateOrder(order.id, {
      status: nextStatus,

      updatedAt:
        new Date().toISOString(),
    });
  };

  /*
   * ==========================================
   * DELETE ORDER
   * ==========================================
   */

  const handleDelete = (order) => {
    const confirmed = window.confirm(
      `Delete order ${order.id}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    deleteOrder(order.id);
  };

  /*
   * ==========================================
   * RENDER
   * ==========================================
   */

  return (
    <AdminLayout>
      <div className="admin-page">
        {/* =====================================
            PAGE HEADER
        ====================================== */}

        <header className="admin-header">
          <div>
            <span className="section-label">
              ORDER MANAGEMENT
            </span>

            <h1>Orders</h1>

            <p>
              Track and manage customer
              seafood orders.
            </p>
          </div>

          <button
            type="button"
            className="admin-primary-button"
            onClick={openCreateForm}
          >
            <Plus size={17} />

            Create Order
          </button>
        </header>

        {/* =====================================
            CONTENT
        ====================================== */}

        <div className="admin-content">
          {/* ===================================
              KPI CARDS
          ==================================== */}

          <div className="admin-kpis">
            <div className="admin-kpi">
              <span>Total Orders</span>

              <strong>
                {stats.total}
              </strong>
            </div>

            <div className="admin-kpi">
              <span>Pending</span>

              <strong>
                {stats.pending}
              </strong>
            </div>

            <div className="admin-kpi">
              <span>Processing</span>

              <strong>
                {stats.processing}
              </strong>
            </div>

            <div className="admin-kpi">
              <span>In Transit</span>

              <strong>
                {stats.transit}
              </strong>
            </div>

            <div className="admin-kpi">
              <span>Delivered</span>

              <strong>
                {stats.delivered}
              </strong>
            </div>
          </div>

          {/* ===================================
              SEARCH TOOLBAR
          ==================================== */}

          <div className="admin-toolbar">
            <div className="admin-search">
              <Search size={17} />

              <input
                type="search"
                placeholder="Search orders..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
              />
            </div>

            <span>
              {filteredOrders.length}{" "}
              {filteredOrders.length === 1
                ? "order"
                : "orders"}
            </span>
          </div>

          {/* ===================================
              ORDERS TABLE
          ==================================== */}

          <div className="admin-panel">
            <div className="admin-table">
              <div className="admin-table-head">
                <span>ORDER</span>

                <span>CUSTOMER</span>

                <span>PRODUCT</span>

                <span>DESTINATION</span>

                <span>DATE</span>

                <span>STATUS</span>

                <span>ACTIONS</span>
              </div>

              {filteredOrders.length ===
              0 ? (
                <div className="admin-empty-state">
                  <Ship size={32} />

                  <h3>
                    No orders found
                  </h3>

                  <p>
                    {search
                      ? "Try changing your search."
                      : "Create your first customer order."}
                  </p>

                  {!search && (
                    <button
                      type="button"
                      className="admin-primary-button"
                      onClick={
                        openCreateForm
                      }
                    >
                      <Plus size={16} />

                      Create Order
                    </button>
                  )}
                </div>
              ) : (
                filteredOrders.map(
                  (order) => {
                    const product =
                      getOrderProduct(
                        order
                      );

                    const status =
                      order.status ||
                      "PENDING";

                    const statusClass =
                      status
                        .toLowerCase()
                        .replaceAll(
                          " ",
                          "-"
                        );

                    return (
                      <div
                        className="admin-table-row"
                        key={order.id}
                      >
                        {/* ORDER */}

                        <strong>
                          {order.id}
                        </strong>

                        {/* CUSTOMER */}

                        <span>
                          {order.customerName ||
                            order.customer ||
                            "—"}
                        </span>

                        {/* PRODUCT */}

                        <div>
                          <strong>
                            {
                              product.name
                            }
                          </strong>

                          <span>
                            {
                              product.quantity
                            }
                          </span>
                        </div>

                        {/* DESTINATION */}

                        <span>
                          {getOrderDestination(
                            order
                          )}
                        </span>

                        {/* DATE */}

                        <span>
                          {formatDate(
                            order.createdAt ||
                              order.date
                          )}
                        </span>

                        {/* STATUS */}

                        <button
                          type="button"
                          className={`admin-status ${statusClass}`}
                          onClick={() =>
                            cycleStatus(
                              order
                            )
                          }
                          title="Click to update status"
                        >
                          {status}
                        </button>

                        {/* ACTIONS */}

                        <div className="admin-row-actions">
                          <button
                            type="button"
                            onClick={() =>
                              openEditForm(
                                order
                              )
                            }
                            title="Edit order"
                          >
                            <ChevronRight
                              size={16}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                order
                              )
                            }
                            title="Delete order"
                          >
                            <Trash2
                              size={16}
                            />
                          </button>
                        </div>
                      </div>
                    );
                  }
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          CREATE / EDIT ORDER MODAL
      ========================================== */}

      {showForm && (
        <div
          className="admin-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeForm();
            }
          }}
        >
          <div className="admin-modal">
            {/* ===================================
                MODAL HEADER
            ==================================== */}

            <div className="admin-modal-header">
              <div>
                <span className="section-label">
                  ORDER MANAGEMENT
                </span>

                <h2>
                  {editingOrder
                    ? "Edit Order"
                    : "Create Order"}
                </h2>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={closeForm}
                aria-label="Close order form"
              >
                <X size={20} />
              </button>
            </div>

            {/* ===================================
                FORM
            ==================================== */}

            <form
              className="admin-form"
              onSubmit={handleSubmit}
            >
              {/* ERROR */}

              {error && (
                <div className="admin-form-error">
                  <AlertCircle
                    size={17}
                  />

                  <span>
                    {error}
                  </span>
                </div>
              )}

              <div className="admin-form-grid">
                {/* CUSTOMER SELECT */}

                <label>
                  <span>
                    Customer
                  </span>

                  <select
                    name="customerId"
                    value={
                      form.customerId
                    }
                    onChange={
                      handleChange
                    }
                  >
                    <option value="">
                      Select customer
                    </option>

                    {customers.map(
                      (customer) => (
                        <option
                          key={
                            customer.id
                          }
                          value={
                            customer.id
                          }
                        >
                          {customer.name ||
                            customer.company ||
                            customer.id}
                        </option>
                      )
                    )}
                  </select>

                  {!customers.length && (
                    <small>
                      No customers
                      available. Enter
                      the customer name
                      below.
                    </small>
                  )}
                </label>

                {/* CUSTOMER NAME */}

                <label>
                  <span>
                    Customer Name *
                  </span>

                  <input
                    name="customerName"
                    value={
                      form.customerName
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Customer name"
                  />
                </label>

                {/* PRODUCT SELECT */}

                <label>
                  <span>
                    Product
                  </span>

                  <select
                    name="productId"
                    value={
                      form.productId
                    }
                    onChange={
                      handleChange
                    }
                  >
                    <option value="">
                      Select product
                    </option>

                    {products.map(
                      (product) => (
                        <option
                          key={
                            product.id
                          }
                          value={
                            product.id
                          }
                        >
                          {product.name}
                        </option>
                      )
                    )}
                  </select>

                  {!products.length && (
                    <small>
                      No products
                      available. Enter
                      the product name
                      below.
                    </small>
                  )}
                </label>

                {/* PRODUCT NAME */}

                <label>
                  <span>
                    Product Name *
                  </span>

                  <input
                    name="productName"
                    value={
                      form.productName
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Product name"
                  />
                </label>

                {/* QUANTITY */}

                <label>
                  <span>
                    Quantity *
                  </span>

                  <input
                    type="number"
                    min="1"
                    name="quantity"
                    value={
                      form.quantity
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. 2000"
                  />
                </label>

                {/* CURRENCY */}

                <label>
                  <span>
                    Currency
                  </span>

                  <select
                    name="currency"
                    value={
                      form.currency
                    }
                    onChange={
                      handleChange
                    }
                  >
                    <option value="USD">
                      USD
                    </option>

                    <option value="KES">
                      KES
                    </option>

                    <option value="EUR">
                      EUR
                    </option>

                    <option value="GBP">
                      GBP
                    </option>

                    <option value="AED">
                      AED
                    </option>
                  </select>
                </label>

                {/* SUBTOTAL */}

                <label>
                  <span>
                    Subtotal
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="subtotal"
                    value={
                      form.subtotal
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="0.00"
                  />
                </label>

                {/* DESTINATION */}

                <label>
                  <span>
                    Destination *
                  </span>

                  <input
                    name="destination"
                    value={
                      form.destination
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. Dubai, UAE"
                  />
                </label>

                {/* ORDER STATUS */}

                <label>
                  <span>
                    Order Status
                  </span>

                  <select
                    name="status"
                    value={
                      form.status
                    }
                    onChange={
                      handleChange
                    }
                  >
                    {ORDER_STATUSES.map(
                      (status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      )
                    )}
                  </select>
                </label>

                {/* PAYMENT STATUS */}

                <label>
                  <span>
                    Payment Status
                  </span>

                  <select
                    name="paymentStatus"
                    value={
                      form.paymentStatus
                    }
                    onChange={
                      handleChange
                    }
                  >
                    <option value="PENDING">
                      PENDING
                    </option>

                    <option value="PAID">
                      PAID
                    </option>

                    <option value="PARTIAL">
                      PARTIAL
                    </option>

                    <option value="OVERDUE">
                      OVERDUE
                    </option>
                  </select>
                </label>

                {/* SHIPPING STATUS */}

                <label>
                  <span>
                    Shipping Status
                  </span>

                  <select
                    name="shippingStatus"
                    value={
                      form.shippingStatus
                    }
                    onChange={
                      handleChange
                    }
                  >
                    <option value="PENDING">
                      PENDING
                    </option>

                    <option value="PROCESSING">
                      PROCESSING
                    </option>

                    <option value="IN TRANSIT">
                      IN TRANSIT
                    </option>

                    <option value="DELIVERED">
                      DELIVERED
                    </option>
                  </select>
                </label>
              </div>

              {/* =================================
                  FORM ACTIONS
              ================================== */}

              <div className="admin-form-footer">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                >
                  <Save size={17} />

                  {editingOrder
                    ? "Update Order"
                    : "Create Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminOrders;

=======
import { ArrowLeft, Edit3, Plus, Search, Ship, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { getCustomers, getOrders, getProducts, nextId, saveOrders, subscribeToDataChanges } from "../data/store";

const statuses = ["ALL STATUS", "PENDING", "PROCESSING", "IN TRANSIT", "DELIVERED"];
const emptyForm = { customerId: "", productId: "", quantity: "", destination: "", origin: "Mombasa, Kenya", date: "", status: "PENDING", payment: "PENDING", delivery: "" };
const todayLabel = () => new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

function AdminOrders() {
  const [orders, setOrders] = useState(getOrders);
  const [customers, setCustomers] = useState(getCustomers);
  const [products, setProducts] = useState(getProducts);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL STATUS");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");
  useEffect(() => subscribeToDataChanges(() => { setOrders(getOrders()); setCustomers(getCustomers()); setProducts(getProducts()); }), []);

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    return orders.filter((order) => (!term || Object.values(order).join(" ").toLowerCase().includes(term)) && (status === "ALL STATUS" || order.status === status));
  }, [orders, search, status]);

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const openCreate = () => { setEditingId(null); setForm({ ...emptyForm, customerId: customers[0]?.id || "", productId: products[0]?.id || "", date: todayLabel() }); setFormError(""); };
  const openEdit = (order) => { setEditingId(order.id); setForm({ ...emptyForm, ...order }); setFormError(""); };
  const cancelForm = () => { setEditingId(null); setForm(emptyForm); setFormError(""); };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.customerId || !form.productId || !form.quantity.trim() || !form.destination.trim() || !form.date.trim()) { setFormError("Customer, product, quantity, destination and date are required."); return; }
    const current = getOrders();
    const customer = getCustomers().find((item) => item.id === form.customerId);
    const product = getProducts().find((item) => item.id === form.productId);
    const order = { ...form, customer: customer?.name || "Unknown customer", product: product?.name || "Unknown product", quantity: form.quantity.trim(), destination: form.destination.trim(), origin: form.origin.trim(), date: form.date.trim(), delivery: form.delivery.trim() || "To be confirmed", invoice: editingId ? current.find((item) => item.id === editingId)?.invoice || `MAR-${String(current.length + 1).padStart(3, "0")}` : `MAR-${String(current.length + 1).padStart(3, "0")}` };
    const next = editingId ? current.map((item) => item.id === editingId ? { ...item, ...order, id: editingId } : item) : [...current, { ...order, id: nextId("ORD-MAR", current) }];
    saveOrders(next); setOrders(next); cancelForm();
  };

  const updateStatus = (id, newStatus) => { const next = getOrders().map((order) => order.id === id ? { ...order, status: newStatus } : order); saveOrders(next); setOrders(next); };
  const handleDelete = (order) => { if (!window.confirm(`Delete ${order.id} from orders?`)) return; const next = getOrders().filter((item) => item.id !== order.id); saveOrders(next); setOrders(next); };
  const statusClass = (value) => value.toLowerCase().replaceAll(" ", "-");

  return <main className="admin-layout"><aside className="admin-sidebar"><Link to="/" className="admin-brand">MARVEL<span>GLOBAL FISH TRADING</span></Link><div className="admin-sidebar-label">ADMINISTRATION</div><nav className="admin-navigation"><Link to="/admin" className="admin-nav-link">Dashboard</Link><Link to="/admin/customers" className="admin-nav-link">Customers</Link><Link to="/admin/products" className="admin-nav-link">Products</Link><Link to="/admin/orders" className="admin-nav-link active"><Ship size={17} />Orders</Link><Link to="/admin/invoices" className="admin-nav-link">Invoices</Link><Link to="/admin/payments" className="admin-nav-link">Payments</Link><Link to="/admin/shipments" className="admin-nav-link">Shipments</Link><Link to="/admin/reports" className="admin-nav-link">Reports</Link></nav><div className="admin-sidebar-bottom"><Link to="/admin/settings" className="admin-nav-link">Settings</Link></div></aside><section className="admin-main"><header className="admin-header"><div><Link to="/admin" className="admin-back-link"><ArrowLeft size={16} />Dashboard</Link><span className="section-label">ORDER MANAGEMENT</span><h1>Orders</h1><p>Track customer orders and manage fulfillment.</p></div><button type="button" className="admin-primary-button" onClick={openCreate}><Plus size={17} />Create Order</button></header><div className="admin-content"><section className="admin-kpis"><article className="admin-kpi"><div className="admin-kpi-icon"><Ship size={20} /></div><div><span>Total Orders</span><strong>{orders.length}</strong><small>Current trade orders</small></div></article><article className="admin-kpi"><div className="admin-kpi-icon"><Ship size={20} /></div><div><span>In Transit</span><strong>{orders.filter((order) => order.status === "IN TRANSIT").length}</strong><small>Active shipments</small></div></article><article className="admin-kpi"><div className="admin-kpi-icon"><Ship size={20} /></div><div><span>Delivered</span><strong>{orders.filter((order) => order.status === "DELIVERED").length}</strong><small>Completed orders</small></div></article></section>{(editingId || form.customerId) && <form className="admin-form-panel" onSubmit={handleSubmit}><div className="admin-panel-header"><div><span className="section-label">{editingId ? "EDIT ORDER" : "NEW ORDER"}</span><h2>{editingId ? "Update order" : "Create an order"}</h2></div><button type="button" className="admin-more-button" onClick={cancelForm} aria-label="Close order form"><X size={18} /></button></div><div className="admin-form-grid"><label>Customer<select name="customerId" value={form.customerId} onChange={updateField} required><option value="">Select customer</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}</select></label><label>Product<select name="productId" value={form.productId} onChange={updateField} required><option value="">Select product</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select></label><label>Quantity<input name="quantity" value={form.quantity} onChange={updateField} placeholder="2,000 KG" required /></label><label>Destination<input name="destination" value={form.destination} onChange={updateField} placeholder="Dubai, UAE" required /></label><label>Origin<input name="origin" value={form.origin} onChange={updateField} required /></label><label>Order date<input name="date" value={form.date} onChange={updateField} placeholder="24 Aug 2026" required /></label><label>Status<select name="status" value={form.status} onChange={updateField}>{statuses.filter((item) => item !== "ALL STATUS").map((item) => <option key={item}>{item}</option>)}</select></label><label>Payment<select name="payment" value={form.payment} onChange={updateField}><option>PAID</option><option>PENDING</option></select></label><label>Estimated delivery<input name="delivery" value={form.delivery} onChange={updateField} placeholder="02 Sep 2026" /></label></div>{formError && <p className="login-error" role="alert">{formError}</p>}<div className="admin-form-actions"><button type="button" className="admin-secondary-button" onClick={cancelForm}>Cancel</button><button type="submit" className="admin-primary-button">{editingId ? "Save order" : "Create order"}</button></div></form>}<section className="admin-panel"><div className="admin-panel-header"><div><span className="section-label">TRADE OPERATIONS</span><h2>Order management</h2></div></div><div className="admin-toolbar"><div className="product-search"><Search size={18} /><input type="search" placeholder="Search orders..." value={search} onChange={(event) => setSearch(event.target.value)} /></div><select className="admin-select" value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter orders by status">{statuses.map((item) => <option key={item}>{item}</option>)}</select></div><div className="admin-table"><div className="admin-table-head"><span>ORDER</span><span>CUSTOMER</span><span>PRODUCT</span><span>QUANTITY</span><span>DESTINATION</span><span>STATUS</span><span>ACTIONS</span></div>{filteredOrders.length ? filteredOrders.map((order) => <div className="admin-table-row" key={order.id}><div className="admin-product-name"><div className="admin-order-icon"><Ship size={16} /></div><div><strong>{order.id}</strong><span>{order.date}</span></div></div><span>{order.customer}</span><span>{order.product}</span><strong>{order.quantity}</strong><span>{order.destination}</span><select className={`admin-status-select ${statusClass(order.status)}`} value={order.status} onChange={(event) => updateStatus(order.id, event.target.value)} aria-label={`Update ${order.id} status`}>{statuses.filter((item) => item !== "ALL STATUS").map((item) => <option key={item}>{item}</option>)}</select><div className="admin-row-actions"><button type="button" onClick={() => openEdit(order)} aria-label={`Edit ${order.id}`}><Edit3 size={16} /></button><button type="button" onClick={() => handleDelete(order)} aria-label={`Delete ${order.id}`}><Trash2 size={16} /></button></div></div>) : <div className="admin-empty-state"><Ship size={30} /><h3>No orders found</h3><p>Try changing your search or status filter.</p></div>}</div></section></div></section></main>;
}

export default AdminOrders;
>>>>>>> ceffe9c7c6d47d15c954a08fb7eaaf41b529a13a
