import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Users,
  X,
  Save,
  Edit3,
  Trash2,
  Search,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import AdminLayout from "../components/AdminLayout";

import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  nextId,
  subscribeToDataChanges,
} from "../data/store";

const EMPTY_FORM = {
  name: "",
  company: "",
  email: "",
  phone: "",
  country: "Kenya",
  status: "Active",
};

export default function AdminCustomers() {
  // ============================================================
  // STATE
  // ============================================================

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    ...EMPTY_FORM,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  // ============================================================
  // LOAD CUSTOMERS
  // ============================================================

  const loadCustomers = () => {
    try {
      const data = getCustomers();

      setCustomers(
        Array.isArray(data) ? [...data] : []
      );
    } catch (err) {
      console.error(
        "MARVEL CUSTOMER LOAD ERROR:",
        err
      );

      setCustomers([]);
    }
  };

  // ============================================================
  // INITIAL LOAD + STORE SUBSCRIPTION
  // ============================================================

  useEffect(() => {
    console.log(
      "MARVEL ADMIN CUSTOMERS LOADED"
    );

    loadCustomers();

    const unsubscribe =
      subscribeToDataChanges((type) => {
        console.log(
          "MARVEL CUSTOMER STORE CHANGE:",
          type
        );

        loadCustomers();
      });

    return unsubscribe;
  }, []);

  // ============================================================
  // SEARCH
  // ============================================================

  const filteredCustomers = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return customers;
    }

    return customers.filter(
      (customer) => {
        const text = [
          customer.id,
          customer.name,
          customer.company,
          customer.email,
          customer.phone,
          customer.country,
          customer.status,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return text.includes(query);
      }
    );
  }, [customers, search]);

  // ============================================================
  // STATISTICS
  // ============================================================

  const activeCustomers =
    customers.filter(
      (customer) =>
        String(
          customer.status || ""
        ).toLowerCase() === "active"
    ).length;

  const pendingCustomers =
    customers.filter(
      (customer) =>
        String(
          customer.status || ""
        ).toLowerCase() === "pending"
    ).length;

  const inactiveCustomers =
    customers.filter(
      (customer) =>
        String(
          customer.status || ""
        ).toLowerCase() === "inactive"
    ).length;

  // ============================================================
  // OPEN ADD MODAL
  // ============================================================

  const openAddModal = () => {
    console.log(
      "MARVEL: ADD CUSTOMER"
    );

    setEditingId(null);

    setForm({
      ...EMPTY_FORM,
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // ============================================================
  // OPEN EDIT MODAL
  // ============================================================

  const openEditModal = (customer) => {
    console.log(
      "MARVEL: EDIT CUSTOMER",
      customer
    );

    setEditingId(customer.id);

    setForm({
      name: customer.name || "",
      company: customer.company || "",
      email: customer.email || "",
      phone: customer.phone || "",
      country:
        customer.country || "Kenya",
      status:
        customer.status || "Active",
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // ============================================================
  // CLOSE MODAL
  // ============================================================

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    setEditingId(null);

    setForm({
      ...EMPTY_FORM,
    });

    setError("");
    setSuccess("");
  };

  // ============================================================
  // FORM CHANGE
  // ============================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ============================================================
  // VALIDATE FORM
  // ============================================================

  const validateForm = () => {
    const name = String(
      form.name || ""
    ).trim();

    const company = String(
      form.company || ""
    ).trim();

    const email = String(
      form.email || ""
    ).trim();

    const phone = String(
      form.phone || ""
    ).trim();

    const country = String(
      form.country || ""
    ).trim();

    if (!name) {
      return "Please enter the customer's full name.";
    }

    if (!company) {
      return "Please enter the company name.";
    }

    if (!email) {
      return "Please enter the customer's email address.";
    }

    if (!phone) {
      return "Please enter the customer's phone number.";
    }

    if (!country) {
      return "Please enter the customer's country.";
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }

    return null;
  };

  // ============================================================
  // DUPLICATE EMAIL CHECK
  // ============================================================

  const emailExists = () => {
    const email = String(
      form.email || ""
    )
      .trim()
      .toLowerCase();

    return customers.some(
      (customer) => {
        const customerEmail =
          String(
            customer.email || ""
          )
            .trim()
            .toLowerCase();

        if (
          customerEmail !== email
        ) {
          return false;
        }

        if (
          editingId &&
          customer.id === editingId
        ) {
          return false;
        }

        return true;
      }
    );
  };

  // ============================================================
  // SAVE CUSTOMER
  // ============================================================

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(
      "MARVEL: CUSTOMER FORM SUBMITTED"
    );

    if (saving) {
      return;
    }

    setError("");
    setSuccess("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (emailExists()) {
      setError(
        "A customer with this email address already exists."
      );

      return;
    }

    const customerData = {
      name: String(
        form.name || ""
      ).trim(),

      company: String(
        form.company || ""
      ).trim(),

      email: String(
        form.email || ""
      ).trim(),

      phone: String(
        form.phone || ""
      ).trim(),

      country: String(
        form.country || "Kenya"
      ).trim(),

      status: String(
        form.status || "Active"
      ).trim(),
    };

    setSaving(true);

    try {
      // ========================================================
      // UPDATE EXISTING CUSTOMER
      // ========================================================

      if (editingId) {
        console.log(
          "MARVEL: UPDATING CUSTOMER",
          editingId
        );

        const updatedCustomer =
          updateCustomer(
            editingId,
            customerData
          );

        if (!updatedCustomer) {
          throw new Error(
            "Customer could not be updated."
          );
        }

        console.log(
          "MARVEL: CUSTOMER UPDATED",
          updatedCustomer
        );

        loadCustomers();

        setSuccess(
          "Customer updated successfully."
        );
      }

      // ========================================================
      // ADD NEW CUSTOMER
      // ========================================================

      else {
        console.log(
          "MARVEL: CREATING CUSTOMER"
        );

        const newCustomer =
          addCustomer(
            customerData
          );

        if (!newCustomer) {
          throw new Error(
            "Customer could not be created."
          );
        }

        console.log(
          "MARVEL: CUSTOMER CREATED",
          newCustomer
        );

        loadCustomers();

        setSuccess(
          `Customer ${newCustomer.id} created successfully.`
        );
      }

      // ========================================================
      // CLOSE AFTER SUCCESS
      // ========================================================

      setTimeout(() => {
        setShowModal(false);
        setEditingId(null);

        setForm({
          ...EMPTY_FORM,
        });

        setError("");
        setSuccess("");
        setSaving(false);

        loadCustomers();
      }, 700);
    } catch (err) {
      console.error(
        "MARVEL CUSTOMER SAVE ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to save customer."
      );

      setSaving(false);
    }
  };

  // ============================================================
  // DELETE CUSTOMER
  // ============================================================

  const handleDelete = (customer) => {
    const customerName =
      customer.company ||
      customer.name ||
      customer.id ||
      "this customer";

    console.log(
      "MARVEL: DELETE CUSTOMER",
      customer
    );

    const confirmed =
      window.confirm(
        `Delete "${customerName}"?\n\nThis action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      const result =
        deleteCustomer(
          customer.id
        );

      if (!Array.isArray(result)) {
        throw new Error(
          "Customer could not be deleted."
        );
      }

      setCustomers([
        ...result,
      ]);

      setSuccess(
        `${customerName} deleted successfully.`
      );

      setError("");

      console.log(
        "MARVEL: CUSTOMER DELETED",
        customer.id
      );

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (err) {
      console.error(
        "MARVEL CUSTOMER DELETE ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to delete customer."
      );
    }
  };

  // ============================================================
  // NEXT CUSTOMER ID
  // ============================================================

  const nextCustomerId =
    nextId(
      "CUS",
      customers
    );

  // ============================================================
  // STATUS CLASS
  // ============================================================

  const statusClass = (
    status
  ) => {
    const value = String(
      status || ""
    ).toLowerCase();

    if (value === "active") {
      return "success";
    }

    if (value === "pending") {
      return "warning";
    }

    return "inactive";
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <AdminLayout>
      <div className="admin-page">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <header className="admin-header">

          <div>
            <span className="section-label">
              CUSTOMER MANAGEMENT
            </span>

            <h1>
              Customers
            </h1>

            <p>
              Manage MARVEL Global Fish Trading
              customers and trade accounts.
            </p>
          </div>

          <button
            type="button"
            className="admin-primary-button"
            onClick={openAddModal}
          >
            <Plus size={17} />
            Add Customer
          </button>

        </header>

        <div className="admin-content">

          {/* ==================================================
              KPI CARDS
          ================================================== */}

          <section className="admin-kpis">

            <article className="admin-kpi">

              <Users size={20} />

              <div>
                <span>
                  Total Customers
                </span>

                <strong>
                  {customers.length}
                </strong>
              </div>

            </article>

            <article className="admin-kpi">

              <CheckCircle2 size={20} />

              <div>
                <span>
                  Active Customers
                </span>

                <strong>
                  {activeCustomers}
                </strong>
              </div>

            </article>

            <article className="admin-kpi">

              <AlertCircle size={20} />

              <div>
                <span>
                  Pending Customers
                </span>

                <strong>
                  {pendingCustomers}
                </strong>
              </div>

            </article>

            <article className="admin-kpi">

              <Users size={20} />

              <div>
                <span>
                  Inactive Customers
                </span>

                <strong>
                  {inactiveCustomers}
                </strong>
              </div>

            </article>

          </section>

          {/* ==================================================
              CUSTOMER PANEL
          ================================================== */}

          <section className="admin-panel">

            <div className="admin-panel-header">

              <div>
                <span className="section-label">
                  CUSTOMER DATABASE
                </span>

                <h2>
                  Customer Accounts
                </h2>
              </div>

              <div className="admin-search">

                <Search size={17} />

                <input
                  type="search"
                  placeholder="Search customers..."
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                />

              </div>

            </div>

            {/* SUCCESS MESSAGE */}

            {success && (
              <div className="admin-success-message">
                <CheckCircle2 size={17} />
                <span>
                  {success}
                </span>
              </div>
            )}

            {/* ERROR MESSAGE */}

            {error &&
              !showModal && (
                <div className="admin-error-message">
                  <AlertCircle size={17} />
                  <span>
                    {error}
                  </span>
                </div>
              )}

            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {filteredCustomers.length ===
            0 ? (

              <div className="admin-empty-state">

                <Users size={42} />

                <h3>
                  {search
                    ? "No customers found"
                    : "No customers yet"}
                </h3>

                <p>
                  {search
                    ? "Try another search."
                    : "Add your first MARVEL Global Fish Trading customer."}
                </p>

                {!search && (
                  <button
                    type="button"
                    className="admin-primary-button"
                    onClick={
                      openAddModal
                    }
                  >
                    <Plus size={17} />
                    Add Customer
                  </button>
                )}

              </div>

            ) : (

              <div className="admin-table-wrapper">

                <table className="admin-table">

                  <thead>

                    <tr>

                      <th>
                        Customer
                      </th>

                      <th>
                        Contact
                      </th>

                      <th>
                        Country
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Created
                      </th>

                      <th>
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredCustomers.map(
                      (customer) => (

                        <tr
                          key={
                            customer.id
                          }
                        >

                          <td>

                            <strong>
                              {customer.company ||
                                "Unnamed Company"}
                            </strong>

                            <small>
                              {customer.id}
                              {" · "}
                              {customer.name ||
                                "Unnamed Customer"}
                            </small>

                          </td>

                          <td>

                            <div className="admin-contact">

                              <span>

                                <Mail
                                  size={13}
                                />

                                {customer.email ||
                                  "No email"}

                              </span>

                              <span>

                                <Phone
                                  size={13}
                                />

                                {customer.phone ||
                                  "No phone"}

                              </span>

                            </div>

                          </td>

                          <td>
                            {customer.country ||
                              "Kenya"}
                          </td>

                          <td>

                            <span
                              className={`admin-status ${statusClass(
                                customer.status
                              )}`}
                            >
                              {String(
                                customer.status ||
                                  "Active"
                              ).toUpperCase()}
                            </span>

                          </td>

                          <td>
                            {customer.createdAt
                              ? new Date(
                                  customer.createdAt
                                ).toLocaleDateString()
                              : "—"}
                          </td>

                          <td>

                            <div className="admin-table-actions">

                              <button
                                type="button"
                                className="admin-icon-button"
                                title="Edit customer"
                                onClick={() =>
                                  openEditModal(
                                    customer
                                  )
                                }
                              >
                                <Edit3
                                  size={16}
                                />
                              </button>

                              <button
                                type="button"
                                className="admin-icon-button danger"
                                title="Delete customer"
                                onClick={() =>
                                  handleDelete(
                                    customer
                                  )
                                }
                              >
                                <Trash2
                                  size={16}
                                />
                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </section>

        </div>

        {/* ======================================================
            ADD / EDIT MODAL
        ====================================================== */}

        {showModal && (

          <div
            className="admin-modal-backdrop"
            onMouseDown={(event) => {

              if (
                event.target ===
                event.currentTarget
              ) {
                closeModal();
              }

            }}
          >

            <div
              className="admin-modal"
              role="dialog"
              aria-modal="true"
              onMouseDown={(event) =>
                event.stopPropagation()
              }
            >

              {/* MODAL HEADER */}

              <div className="admin-modal-header">

                <div>

                  <span className="section-label">

                    {editingId
                      ? "EDIT CUSTOMER"
                      : "NEW CUSTOMER"}

                  </span>

                  <h2>

                    {editingId
                      ? "Edit Customer"
                      : "Add Customer"}

                  </h2>

                  <small>

                    Customer ID:{" "}

                    <strong>
                      {editingId ||
                        nextCustomerId}
                    </strong>

                  </small>

                </div>

                <button
                  type="button"
                  className="admin-icon-button"
                  onClick={closeModal}
                  disabled={saving}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>

              </div>

              {/* FORM */}

              <form
                className="admin-form"
                onSubmit={
                  handleSubmit
                }
              >

                <div className="admin-form-grid">

                  {/* NAME */}

                  <div className="admin-form-group">

                    <label htmlFor="customer-name">
                      Full Name *
                    </label>

                    <input
                      id="customer-name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={
                        handleChange
                      }
                      placeholder="John Smith"
                      disabled={saving}
                      autoFocus
                    />

                  </div>

                  {/* COMPANY */}

                  <div className="admin-form-group">

                    <label htmlFor="customer-company">
                      Company Name *
                    </label>

                    <input
                      id="customer-company"
                      name="company"
                      type="text"
                      value={
                        form.company
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Ocean Foods Ltd"
                      disabled={saving}
                    />

                  </div>

                  {/* EMAIL */}

                  <div className="admin-form-group">

                    <label htmlFor="customer-email">
                      Email Address *
                    </label>

                    <input
                      id="customer-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={
                        handleChange
                      }
                      placeholder="customer@company.com"
                      disabled={saving}
                    />

                  </div>

                  {/* PHONE */}

                  <div className="admin-form-group">

                    <label htmlFor="customer-phone">
                      Phone Number *
                    </label>

                    <input
                      id="customer-phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={
                        handleChange
                      }
                      placeholder="+254 700 000000"
                      disabled={saving}
                    />

                  </div>

                  {/* COUNTRY */}

                  <div className="admin-form-group">

                    <label htmlFor="customer-country">
                      Country *
                    </label>

                    <input
                      id="customer-country"
                      name="country"
                      type="text"
                      value={
                        form.country
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Kenya"
                      disabled={saving}
                    />

                  </div>

                  {/* STATUS */}

                  <div className="admin-form-group">

                    <label htmlFor="customer-status">
                      Account Status
                    </label>

                    <select
                      id="customer-status"
                      name="status"
                      value={
                        form.status
                      }
                      onChange={
                        handleChange
                      }
                      disabled={saving}
                    >

                      <option value="Active">
                        Active
                      </option>

                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Inactive">
                        Inactive
                      </option>

                    </select>

                  </div>

                </div>

                {/* FORM ERROR */}

                {error && (
                  <div className="admin-error-message">

                    <AlertCircle
                      size={17}
                    />

                    <span>
                      {error}
                    </span>

                  </div>
                )}

                {/* FORM SUCCESS */}

                {success && (
                  <div className="admin-success-message">

                    <CheckCircle2
                      size={17}
                    />

                    <span>
                      {success}
                    </span>

                  </div>
                )}

                {/* BUTTONS */}

                <div className="admin-form-actions">

                  <button
                    type="button"
                    className="admin-secondary-button"
                    onClick={
                      closeModal
                    }
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="admin-primary-button"
                    disabled={saving}
                  >

                    <Save size={17} />

                    {saving
                      ? "Saving..."
                      : editingId
                      ? "Update Customer"
                      : "Create Customer"}

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

