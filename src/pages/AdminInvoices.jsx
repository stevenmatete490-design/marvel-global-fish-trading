import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  FileText,
  Download,
  X,
  Trash2,
  CalendarDays,
  User,
  Package,
  Calculator,
} from "lucide-react";

import AdminLayout from "../components/AdminLayout";

import {
  getInvoices,
  addInvoice,
  getCustomers,
  getProducts,
  subscribeToDataChanges,
  nextId,
} from "../data/store";

const EMPTY_FORM = {
  customerId: "",
  customerName: "",
  dueDate: "",
  currency: "KES",
  taxRate: 0,
  notes: "",
};

function formatCurrency(amount, currency = "KES") {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function getDefaultDueDate() {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return date.toISOString().split("T")[0];
}

function formatDate(dateString) {
  if (!dateString) return "—";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusClass(status) {
  const normalized = String(status || "").toLowerCase();

  if (normalized === "paid") return "paid";
  if (normalized === "overdue") return "overdue";

  return "pending";
}

function AdminInvoices() {
  const [invoices, setInvoices] = useState(() =>
    getInvoices()
  );

  const [customers, setCustomers] = useState(() =>
    getCustomers()
  );

  const [products, setProducts] = useState(() =>
    getProducts()
  );

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    ...EMPTY_FORM,
    dueDate: getDefaultDueDate(),
  });

  const [items, setItems] = useState([]);

  const [selectedProductId, setSelectedProductId] =
    useState("");

  const [selectedQuantity, setSelectedQuantity] =
    useState(1);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const unsubscribe =
      subscribeToDataChanges((type) => {
        if (
          !type ||
          type === "marvel_invoices" ||
          type === "marvel_customers" ||
          type === "marvel_products"
        ) {
          setInvoices(getInvoices());
          setCustomers(getCustomers());
          setProducts(getProducts());
        }
      });

    return unsubscribe;
  }, []);

  const filteredInvoices = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return invoices;
    }

    return invoices.filter((invoice) =>
      `${invoice.id} ${invoice.invoiceNumber || ""} ${
        invoice.customerName || ""
      }`
        .toLowerCase()
        .includes(query)
    );
  }, [invoices, search]);

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total +
        Number(item.quantity || 0) *
          Number(item.unitPrice || 0),
      0
    );
  }, [items]);

  const taxAmount = useMemo(() => {
    return (
      subtotal *
      (Number(form.taxRate) || 0) /
      100
    );
  }, [subtotal, form.taxRate]);

  const total = subtotal + taxAmount;

  const paidInvoices = invoices.filter(
    (invoice) =>
      String(invoice.status).toLowerCase() ===
      "paid"
  ).length;

  const pendingInvoices = invoices.filter(
    (invoice) =>
      String(invoice.status).toLowerCase() ===
      "pending"
  ).length;

  const overdueInvoices = invoices.filter(
    (invoice) =>
      String(invoice.status).toLowerCase() ===
      "overdue"
  ).length;

  const openCreateForm = () => {
    setForm({
      ...EMPTY_FORM,
      dueDate: getDefaultDueDate(),
    });

    setItems([]);
    setSelectedProductId("");
    setSelectedQuantity(1);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const closeCreateForm = () => {
    setShowForm(false);
    setError("");
  };

  const handleCustomerChange = (event) => {
    const customerId = event.target.value;

    const customer = customers.find(
      (item) => item.id === customerId
    );

    setForm((current) => ({
      ...current,
      customerId,
      customerName:
        customer?.company ||
        customer?.name ||
        "",
    }));
  };

  const addLineItem = () => {
    setError("");

    if (!selectedProductId) {
      setError("Please select a product.");
      return;
    }

    const quantity =
      Number(selectedQuantity);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      setError(
        "Quantity must be greater than zero."
      );
      return;
    }

    const product = products.find(
      (item) =>
        item.id === selectedProductId
    );

    if (!product) {
      setError("Selected product could not be found.");
      return;
    }

    const existingItem = items.find(
      (item) =>
        item.productId === product.id
    );

    if (existingItem) {
      setItems((current) =>
        current.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity:
                  Number(item.quantity) +
                  quantity,
              }
            : item
        )
      );
    } else {
      setItems((current) => [
        ...current,
        {
          productId: product.id,
          productName: product.name,
          unit: product.unit || "Kg",
          quantity,
          unitPrice:
            Number(product.price) || 0,
        },
      ]);
    }

    setSelectedProductId("");
    setSelectedQuantity(1);
  };

  const updateItemQuantity = (
    productId,
    value
  ) => {
    const quantity = Number(value);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  };

  const removeLineItem = (productId) => {
    setItems((current) =>
      current.filter(
        (item) =>
          item.productId !== productId
      )
    );
  };

  const handleSaveInvoice = (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.customerName.trim()) {
      setError("Please select a customer.");
      return;
    }

    if (!form.dueDate) {
      setError("Please select a due date.");
      return;
    }

    if (items.length === 0) {
      setError(
        "Please add at least one product to the invoice."
      );
      return;
    }

    if (subtotal <= 0) {
      setError(
        "Invoice total must be greater than zero."
      );
      return;
    }

    const invoice = addInvoice({
      id: nextId(
        "INV",
        invoices
      ),

      customerId:
        form.customerId,

      customerName:
        form.customerName.trim(),

      items,

      subtotal,

      tax: taxAmount,

      total,

      currency:
        form.currency || "KES",

      status: "Pending",

      dueDate: form.dueDate,

      notes:
        form.notes.trim(),

      createdAt:
        new Date().toISOString(),
    });

    if (!invoice) {
      setError(
        "The invoice could not be saved. Please try again."
      );
      return;
    }

    setInvoices(getInvoices());

    setSuccess(
      `${invoice.invoiceNumber} created successfully.`
    );

    setShowForm(false);

    setForm({
      ...EMPTY_FORM,
      dueDate: getDefaultDueDate(),
    });

    setItems([]);
  };

  const handleDownload = (invoice) => {
    const invoiceItems = Array.isArray(
      invoice.items
    )
      ? invoice.items
      : [];

    const itemLines =
      invoiceItems
        .map(
          (item) =>
            `${item.productName} | ${
              item.quantity
            } ${item.unit || ""} | ${formatCurrency(
              item.unitPrice,
              invoice.currency
            )} | ${formatCurrency(
              Number(item.quantity) *
                Number(item.unitPrice),
              invoice.currency
            )}`
        )
        .join("\n");

    const content = `
MARVEL GLOBAL FISH TRADING
INVOICE

Invoice: ${
      invoice.invoiceNumber || invoice.id
    }
Customer: ${invoice.customerName || "—"}
Issue Date: ${formatDate(
      invoice.createdAt
    )}
Due Date: ${formatDate(
      invoice.dueDate
    )}
Status: ${invoice.status}

ITEMS
${itemLines || "No line items"}

Subtotal: ${formatCurrency(
      invoice.subtotal,
      invoice.currency
    )}
Tax: ${formatCurrency(
      invoice.tax,
      invoice.currency
    )}
TOTAL: ${formatCurrency(
      invoice.total,
      invoice.currency
    )}

Thank you for doing business with
MARVEL GLOBAL FISH TRADING.
`.trim();

    const blob = new Blob(
      [content],
      {
        type: "text/plain;charset=utf-8",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download = `${
      invoice.invoiceNumber ||
      invoice.id
    }.txt`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <header className="admin-header">
          <div>
            <span className="section-label">
              FINANCE
            </span>

            <h1>Invoices</h1>

            <p>
              Create, track and manage customer
              invoices.
            </p>
          </div>

          <button
            type="button"
            className="admin-primary-button"
            onClick={openCreateForm}
          >
            <Plus size={17} />
            Create Invoice
          </button>
        </header>

        {success && (
          <div className="admin-success-message">
            {success}
          </div>
        )}

        <div className="admin-content">
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <span>Total Invoices</span>
              <strong>
                {invoices.length}
              </strong>
            </div>

            <div className="admin-stat-card">
              <span>Paid</span>
              <strong>
                {paidInvoices}
              </strong>
            </div>

            <div className="admin-stat-card">
              <span>Pending</span>
              <strong>
                {pendingInvoices}
              </strong>
            </div>

            <div className="admin-stat-card">
              <span>Overdue</span>
              <strong>
                {overdueInvoices}
              </strong>
            </div>
          </div>

          <div className="admin-toolbar">
            <div className="admin-search">
              <Search size={17} />

              <input
                type="text"
                placeholder="Search invoices..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
              />
            </div>

            <span>
              {filteredInvoices.length} invoices
            </span>
          </div>

          <div className="admin-panel">
            <div className="admin-table">
              <div className="admin-table-head">
                <span>INVOICE</span>
                <span>CUSTOMER</span>
                <span>AMOUNT</span>
                <span>ISSUED</span>
                <span>DUE DATE</span>
                <span>STATUS</span>
                <span></span>
              </div>

              {filteredInvoices.length ===
              0 ? (
                <div className="admin-empty-state">
                  <FileText size={28} />

                  <strong>
                    No invoices found
                  </strong>

                  <span>
                    Create an invoice or
                    adjust your search.
                  </span>
                </div>
              ) : (
                filteredInvoices.map(
                  (invoice) => (
                    <div
                      className="admin-table-row"
                      key={invoice.id}
                    >
                      <div className="admin-product-name">
                        <div className="admin-order-icon">
                          <FileText size={16} />
                        </div>

                        <div>
                          <strong>
                            {invoice.invoiceNumber ||
                              invoice.id}
                          </strong>

                          <span>
                            MARVEL Invoice
                          </span>
                        </div>
                      </div>

                      <span>
                        {invoice.customerName ||
                          "—"}
                      </span>

                      <strong>
                        {formatCurrency(
                          invoice.total,
                          invoice.currency
                        )}
                      </strong>

                      <span>
                        {formatDate(
                          invoice.createdAt
                        )}
                      </span>

                      <span>
                        {formatDate(
                          invoice.dueDate
                        )}
                      </span>

                      <span
                        className={`admin-status ${getStatusClass(
                          invoice.status
                        )}`}
                      >
                        {String(
                          invoice.status ||
                            "Pending"
                        ).toUpperCase()}
                      </span>

                      <button
                        type="button"
                        className="admin-more-button"
                        title="Download invoice"
                        aria-label={`Download ${
                          invoice.invoiceNumber ||
                          invoice.id
                        }`}
                        onClick={() =>
                          handleDownload(
                            invoice
                          )
                        }
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  )
                )
              )}
            </div>
          </div>
        </div>

        {showForm && (
          <div
            className="admin-modal-backdrop"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeCreateForm();
              }
            }}
          >
            <div
              className="admin-modal admin-invoice-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="create-invoice-title"
            >
              <div className="admin-modal-header">
                <div>
                  <span className="section-label">
                    NEW DOCUMENT
                  </span>

                  <h2 id="create-invoice-title">
                    Create Invoice
                  </h2>

                  <p>
                    Create a customer invoice
                    with products and automatic
                    calculations.
                  </p>
                </div>

                <button
                  type="button"
                  className="admin-modal-close"
                  onClick={
                    closeCreateForm
                  }
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={
                  handleSaveInvoice
                }
              >
                <div className="admin-modal-body">
                  {error && (
                    <div className="admin-error-message">
                      {error}
                    </div>
                  )}

                  <div className="admin-form-section">
                    <div className="admin-form-section-title">
                      <User size={17} />
                      Customer Details
                    </div>

                    <div className="admin-form-grid">
                      <label className="admin-form-field">
                        <span>
                          Customer
                        </span>

                        <select
                          value={
                            form.customerId
                          }
                          onChange={
                            handleCustomerChange
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
                                {customer.company ||
                                  customer.name}
                              </option>
                            )
                          )}
                        </select>
                      </label>

                      <label className="admin-form-field">
                        <span>
                          Customer Name
                        </span>

                        <input
                          type="text"
                          value={
                            form.customerName
                          }
                          onChange={(event) =>
                            setForm(
                              (
                                current
                              ) => ({
                                ...current,
                                customerName:
                                  event
                                    .target
                                    .value,
                              })
                            )
                          }
                          placeholder="Customer or company name"
                        />
                      </label>
                    </div>

                    {customers.length ===
                      0 && (
                      <p className="admin-form-help">
                        No customers are currently
                        saved. You can enter the
                        customer name manually.
                      </p>
                    )}
                  </div>

                  <div className="admin-form-section">
                    <div className="admin-form-section-title">
                      <CalendarDays size={17} />
                      Invoice Details
                    </div>

                    <div className="admin-form-grid">
                      <label className="admin-form-field">
                        <span>
                          Issue Date
                        </span>

                        <input
                          type="date"
                          value={getToday()}
                          readOnly
                        />
                      </label>

                      <label className="admin-form-field">
                        <span>
                          Due Date
                        </span>

                        <input
                          type="date"
                          value={
                            form.dueDate
                          }
                          min={getToday()}
                          onChange={(event) =>
                            setForm(
                              (
                                current
                              ) => ({
                                ...current,
                                dueDate:
                                  event
                                    .target
                                    .value,
                              })
                            )
                          }
                        />
                      </label>

                      <label className="admin-form-field">
                        <span>
                          Currency
                        </span>

                        <select
                          value={
                            form.currency
                          }
                          onChange={(event) =>
                            setForm(
                              (
                                current
                              ) => ({
                                ...current,
                                currency:
                                  event
                                    .target
                                    .value,
                              })
                            )
                          }
                        >
                          <option value="KES">
                            KES — Kenyan Shilling
                          </option>

                          <option value="USD">
                            USD — US Dollar
                          </option>

                          <option value="EUR">
                            EUR — Euro
                          </option>
                        </select>
                      </label>

                      <label className="admin-form-field">
                        <span>
                          Tax (%)
                        </span>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={
                            form.taxRate
                          }
                          onChange={(event) =>
                            setForm(
                              (
                                current
                              ) => ({
                                ...current,
                                taxRate:
                                  event
                                    .target
                                    .value,
                              })
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>

                  <div className="admin-form-section">
                    <div className="admin-form-section-title">
                      <Package size={17} />
                      Products
                    </div>

                    <div className="admin-invoice-add-item">
                      <select
                        value={
                          selectedProductId
                        }
                        onChange={(event) =>
                          setSelectedProductId(
                            event.target
                              .value
                          )
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
                              {product.name} —{" "}
                              {formatCurrency(
                                product.price,
                                form.currency
                              )}{" "}
                              /{" "}
                              {product.unit ||
                                "unit"}
                            </option>
                          )
                        )}
                      </select>

                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={
                          selectedQuantity
                        }
                        onChange={(event) =>
                          setSelectedQuantity(
                            event.target
                              .value
                          )
                        }
                        placeholder="Qty"
                      />

                      <button
                        type="button"
                        className="admin-secondary-button"
                        onClick={
                          addLineItem
                        }
                      >
                        <Plus size={16} />
                        Add Item
                      </button>
                    </div>

                    {items.length > 0 && (
                      <div className="admin-invoice-items">
                        <div className="admin-invoice-items-head">
                          <span>
                            PRODUCT
                          </span>
                          <span>
                            QTY
                          </span>
                          <span>
                            PRICE
                          </span>
                          <span>
                            TOTAL
                          </span>
                          <span></span>
                        </div>

                        {items.map(
                          (item) => (
                            <div
                              className="admin-invoice-item"
                              key={
                                item.productId
                              }
                            >
                              <div>
                                <strong>
                                  {
                                    item.productName
                                  }
                                </strong>

                                <span>
                                  {item.unit}
                                </span>
                              </div>

                              <input
                                type="number"
                                min="1"
                                step="1"
                                value={
                                  item.quantity
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateItemQuantity(
                                    item.productId,
                                    event
                                      .target
                                      .value
                                  )
                                }
                              />

                              <span>
                                {formatCurrency(
                                  item.unitPrice,
                                  form.currency
                                )}
                              </span>

                              <strong>
                                {formatCurrency(
                                  Number(
                                    item.quantity
                                  ) *
                                    Number(
                                      item.unitPrice
                                    ),
                                  form.currency
                                )}
                              </strong>

                              <button
                                type="button"
                                className="admin-more-button danger"
                                onClick={() =>
                                  removeLineItem(
                                    item.productId
                                  )
                                }
                                title="Remove item"
                                aria-label="Remove item"
                              >
                                <Trash2
                                  size={16}
                                />
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {products.length ===
                      0 && (
                      <p className="admin-form-help">
                        No products are currently
                        available. Add products from
                        the Products section first.
                      </p>
                    )}
                  </div>

                  <div className="admin-form-section">
                    <div className="admin-form-section-title">
                      <Calculator size={17} />
                      Invoice Summary
                    </div>

                    <div className="admin-invoice-summary">
                      <div>
                        <span>
                          Subtotal
                        </span>

                        <strong>
                          {formatCurrency(
                            subtotal,
                            form.currency
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Tax (
                          {Number(
                            form.taxRate
                          ) || 0}
                          %)
                        </span>

                        <strong>
                          {formatCurrency(
                            taxAmount,
                            form.currency
                          )}
                        </strong>
                      </div>

                      <div className="total">
                        <span>
                          Total
                        </span>

                        <strong>
                          {formatCurrency(
                            total,
                            form.currency
                          )}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="admin-form-section">
                    <label className="admin-form-field">
                      <span>
                        Notes
                      </span>

                      <textarea
                        rows="3"
                        value={
                          form.notes
                        }
                        onChange={(event) =>
                          setForm(
                            (
                              current
                            ) => ({
                              ...current,
                              notes:
                                event
                                  .target
                                  .value,
                            })
                          )
                        }
                        placeholder="Payment terms, delivery notes or additional information..."
                      />
                    </label>
                  </div>
                </div>

                <div className="admin-modal-footer">
                  <button
                    type="button"
                    className="admin-secondary-button"
                    onClick={
                      closeCreateForm
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="admin-primary-button"
                  >
                    <FileText size={17} />
                    Save Invoice
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminInvoices;
