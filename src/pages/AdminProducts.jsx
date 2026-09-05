import { useEffect, useMemo, useState } from "react";
import {
  Edit3,
  Package,
  Plus,
  Search,
  Trash2,
  X,
  Save,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import AdminLayout from "../components/AdminLayout";

import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  nextId,
  subscribeToDataChanges,
} from "../data/store";

const EMPTY_FORM = {
  name: "",
  category: "Fresh Fish",
  origin: "Kenya",
  unit: "Kg",
  price: "",
  stock: "",
};

const CATEGORIES = [
  "Fresh Fish",
  "Frozen Fish",
  "Seafood",
  "Fillets",
  "Shellfish",
  "Other",
];

const UNITS = [
  "Kg",
  "Ton",
  "Box",
  "Carton",
  "Piece",
];

export default function AdminProducts() {
  // ============================================================
  // STATE
  // ============================================================

  const [products, setProducts] = useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [form, setForm] = useState({
    ...EMPTY_FORM,
  });

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  // ============================================================
  // LOAD PRODUCTS
  // ============================================================

  const loadProducts = () => {
    try {
      const data = getProducts();

      setProducts(
        Array.isArray(data)
          ? [...data]
          : []
      );
    } catch (err) {
      console.error(
        "MARVEL PRODUCT LOAD ERROR:",
        err
      );

      setProducts([]);

      setError(
        "Unable to load products."
      );
    }
  };

  // ============================================================
  // INITIAL LOAD + STORE LISTENER
  // ============================================================

  useEffect(() => {
    console.log(
      "MARVEL ADMIN PRODUCTS LOADED"
    );

    loadProducts();

    const unsubscribe =
      subscribeToDataChanges(() => {
        loadProducts();
      });

    return unsubscribe;
  }, []);

  // ============================================================
  // FILTER PRODUCTS
  // ============================================================

  const filteredProducts = useMemo(() => {
    const query =
      searchTerm
        .trim()
        .toLowerCase();

    return products.filter(
      (product) => {
        const matchesSearch =
          !query ||
          [
            product.id,
            product.name,
            product.category,
            product.origin,
            product.unit,
            product.status,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(query);

        const matchesCategory =
          categoryFilter === "All" ||
          product.category ===
            categoryFilter;

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );
  }, [
    products,
    searchTerm,
    categoryFilter,
  ]);

  // ============================================================
  // PRODUCT STATISTICS
  // ============================================================

  const totalStock = products.reduce(
    (total, product) =>
      total +
      (Number(product.stock) || 0),
    0
  );

  const inStock = products.filter(
    (product) =>
      Number(product.stock) > 50
  ).length;

  const lowStock = products.filter(
    (product) => {
      const stock =
        Number(product.stock) || 0;

      return (
        stock > 0 &&
        stock <= 50
      );
    }
  ).length;

  const outOfStock =
    products.filter(
      (product) =>
        Number(product.stock) <= 0
    ).length;

  // ============================================================
  // OPEN ADD FORM
  // ============================================================

  const openAddForm = () => {
    console.log(
      "MARVEL: ADD PRODUCT"
    );

    setEditingId(null);

    setForm({
      ...EMPTY_FORM,
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  // ============================================================
  // OPEN EDIT FORM
  // ============================================================

  const openEditForm = (product) => {
    console.log(
      "MARVEL: EDIT PRODUCT",
      product
    );

    setEditingId(product.id);

    setForm({
      name: product.name || "",
      category:
        product.category ||
        "Fresh Fish",
      origin:
        product.origin || "Kenya",
      unit:
        product.unit || "Kg",
      price:
        product.price ?? "",
      stock:
        product.stock ?? "",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  // ============================================================
  // CLOSE FORM
  // ============================================================

  const closeForm = () => {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingId(null);

    setForm({
      ...EMPTY_FORM,
    });

    setError("");
    setSuccess("");
  };

  // ============================================================
  // INPUT CHANGE
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
    const name =
      String(form.name || "")
        .trim();

    const category =
      String(form.category || "")
        .trim();

    const origin =
      String(form.origin || "")
        .trim();

    const unit =
      String(form.unit || "")
        .trim();

    const price =
      Number(form.price);

    const stock =
      Number(form.stock);

    if (!name) {
      return "Product name is required.";
    }

    if (!category) {
      return "Product category is required.";
    }

    if (!origin) {
      return "Product origin is required.";
    }

    if (!unit) {
      return "Product unit is required.";
    }

    if (
      form.price === "" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return "Enter a valid product price.";
    }

    if (
      form.stock === "" ||
      !Number.isFinite(stock) ||
      stock < 0
    ) {
      return "Enter a valid stock quantity.";
    }

    return null;
  };

  // ============================================================
  // SUBMIT FORM
  // ============================================================

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(
      "MARVEL: PRODUCT FORM SUBMITTED"
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

    const productData = {
      name: String(
        form.name || ""
      ).trim(),

      category: String(
        form.category ||
          "Fresh Fish"
      ).trim(),

      origin: String(
        form.origin ||
          "Kenya"
      ).trim(),

      unit: String(
        form.unit || "Kg"
      ).trim(),

      price: Math.max(
        0,
        Number(form.price) || 0
      ),

      stock: Math.max(
        0,
        Number(form.stock) || 0
      ),
    };

    setSaving(true);

    try {
      // ========================================================
      // UPDATE
      // ========================================================

      if (editingId) {
        console.log(
          "MARVEL: UPDATING PRODUCT",
          editingId
        );

        const updated =
          updateProduct(
            editingId,
            productData
          );

        if (!updated) {
          throw new Error(
            "Product could not be updated."
          );
        }

        loadProducts();

        setSuccess(
          "Product updated successfully."
        );
      }

      // ========================================================
      // ADD
      // ========================================================

      else {
        console.log(
          "MARVEL: CREATING PRODUCT"
        );

        const created =
          addProduct(
            productData
          );

        if (!created) {
          throw new Error(
            "Product could not be created."
          );
        }

        console.log(
          "MARVEL: PRODUCT CREATED",
          created
        );

        loadProducts();

        setSuccess(
          `Product ${created.id} added successfully.`
        );
      }

      // ========================================================
      // CLOSE AFTER SUCCESS
      // ========================================================

      setTimeout(() => {
        setShowForm(false);
        setEditingId(null);

        setForm({
          ...EMPTY_FORM,
        });

        setSuccess("");
        setError("");
        setSaving(false);

        loadProducts();
      }, 700);
    } catch (err) {
      console.error(
        "MARVEL PRODUCT SAVE ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to save product."
      );

      setSaving(false);
    }
  };

  // ============================================================
  // DELETE PRODUCT
  // ============================================================

  const handleDelete = (product) => {
    const productName =
      product.name ||
      product.id ||
      "this product";

    console.log(
      "MARVEL: DELETE PRODUCT",
      product
    );

    const confirmed =
      window.confirm(
        `Delete "${productName}"?\n\nThis action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      const result =
        deleteProduct(
          product.id
        );

      if (!Array.isArray(result)) {
        throw new Error(
          "Product could not be deleted."
        );
      }

      setProducts([
        ...result,
      ]);

      setSuccess(
        `${productName} deleted successfully.`
      );

      setError("");

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (err) {
      console.error(
        "MARVEL PRODUCT DELETE ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to delete product."
      );
    }
  };

  // ============================================================
  // STATUS
  // ============================================================

  const getStatus = (product) => {
    const stock =
      Number(product.stock) || 0;

    if (stock <= 0) {
      return {
        label: "Out of Stock",
        className: "out-of-stock",
      };
    }

    if (stock <= 50) {
      return {
        label: "Low Stock",
        className: "low-stock",
      };
    }

    return {
      label: "In Stock",
      className: "in-stock",
    };
  };

  // ============================================================
  // NEXT ID
  // ============================================================

  const nextProductId =
    nextId(
      "PRD",
      products
    );

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
              PRODUCT MANAGEMENT
            </span>

            <h1>
              Products
            </h1>

            <p>
              Manage MARVEL Global Fish Trading
              seafood products and inventory.
            </p>
          </div>

          <button
            type="button"
            className="admin-primary-button"
            onClick={openAddForm}
          >
            <Plus size={17} />
            Add Product
          </button>

        </header>

        <div className="admin-content">

          {/* ==================================================
              KPI CARDS
          ================================================== */}

          <section className="admin-kpis">

            <article className="admin-kpi">

              <Package size={20} />

              <div>
                <span>
                  Total Products
                </span>

                <strong>
                  {products.length}
                </strong>
              </div>

            </article>

            <article className="admin-kpi">

              <CheckCircle2 size={20} />

              <div>
                <span>
                  In Stock
                </span>

                <strong>
                  {inStock}
                </strong>
              </div>

            </article>

            <article className="admin-kpi">

              <AlertCircle size={20} />

              <div>
                <span>
                  Low Stock
                </span>

                <strong>
                  {lowStock}
                </strong>
              </div>

            </article>

            <article className="admin-kpi">

              <AlertCircle size={20} />

              <div>
                <span>
                  Out of Stock
                </span>

                <strong>
                  {outOfStock}
                </strong>
              </div>

            </article>

          </section>

          {/* ==================================================
              PRODUCT PANEL
          ================================================== */}

          <section className="admin-panel">

            <div className="admin-panel-header">

              <div>
                <span className="section-label">
                  INVENTORY
                </span>

                <h2>
                  Product Catalogue
                </h2>
              </div>

              <div>
                <strong>
                  {totalStock.toLocaleString()}
                </strong>{" "}
                total units
              </div>

            </div>

            {/* SUCCESS MESSAGE */}

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

            {/* ERROR MESSAGE */}

            {error &&
              !showForm && (
                <div className="admin-error-message">

                  <AlertCircle
                    size={17}
                  />

                  <span>
                    {error}
                  </span>

                </div>
              )}

            {/* =================================================
                TOOLBAR
            ================================================= */}

            <div className="admin-toolbar">

              <div className="admin-search">

                <Search size={17} />

                <input
                  type="search"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value
                    )
                  }
                />

              </div>

              <select
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(
                    event.target.value
                  )
                }
                className="admin-filter-select"
              >

                <option value="All">
                  All Categories
                </option>

                {CATEGORIES.map(
                  (category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {filteredProducts.length ===
            0 ? (

              <div className="admin-empty-state">

                <Package size={42} />

                <h3>
                  {searchTerm ||
                  categoryFilter !== "All"
                    ? "No products found"
                    : "No products yet"}
                </h3>

                <p>
                  {searchTerm ||
                  categoryFilter !== "All"
                    ? "Try changing your search or filter."
                    : "Add your first product to the catalogue."}
                </p>

                {!searchTerm &&
                  categoryFilter ===
                    "All" && (
                    <button
                      type="button"
                      className="admin-primary-button"
                      onClick={
                        openAddForm
                      }
                    >
                      <Plus size={17} />
                      Add Product
                    </button>
                  )}

              </div>

            ) : (

              /* =================================================
                 TABLE
              ================================================= */

              <div className="admin-table-wrapper">

                <table className="admin-table">

                  <thead>

                    <tr>

                      <th>
                        Product
                      </th>

                      <th>
                        Category
                      </th>

                      <th>
                        Origin
                      </th>

                      <th>
                        Price
                      </th>

                      <th>
                        Stock
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredProducts.map(
                      (product) => {

                        const status =
                          getStatus(
                            product
                          );

                        return (
                          <tr
                            key={
                              product.id
                            }
                          >

                            {/* PRODUCT */}

                            <td>

                              <div className="admin-product-name">

                                <Package
                                  size={19}
                                />

                                <div>

                                  <strong>
                                    {product.name ||
                                      "Unnamed Product"}
                                  </strong>

                                  <span>
                                    {product.id}
                                  </span>

                                </div>

                              </div>

                            </td>

                            {/* CATEGORY */}

                            <td>
                              {product.category ||
                                "—"}
                            </td>

                            {/* ORIGIN */}

                            <td>
                              {product.origin ||
                                "—"}
                            </td>

                            {/* PRICE */}

                            <td>

                              KES{" "}

                              {Number(
                                product.price ||
                                  0
                              ).toLocaleString(
                                "en-KE",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}

                              <small>
                                /{" "}
                                {product.unit ||
                                  "Kg"}
                              </small>

                            </td>

                            {/* STOCK */}

                            <td>

                              <strong>
                                {Number(
                                  product.stock ||
                                    0
                                ).toLocaleString()}
                              </strong>{" "}

                              {product.unit ||
                                "Kg"}

                            </td>

                            {/* STATUS */}

                            <td>

                              <span
                                className={`admin-status ${status.className}`}
                              >
                                {status.label}
                              </span>

                            </td>

                            {/* ACTIONS */}

                            <td>

                              <div className="admin-table-actions">

                                <button
                                  type="button"
                                  className="admin-icon-button"
                                  title="Edit product"
                                  onClick={() =>
                                    openEditForm(
                                      product
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
                                  title="Delete product"
                                  onClick={() =>
                                    handleDelete(
                                      product
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
                        );
                      }
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

        {showForm && (

          <div
            className="admin-modal-backdrop"
            onMouseDown={(event) => {

              if (
                event.target ===
                event.currentTarget
              ) {
                closeForm();
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
                      ? "EDIT PRODUCT"
                      : "NEW PRODUCT"}

                  </span>

                  <h2>

                    {editingId
                      ? "Edit Product"
                      : "Add Product"}

                  </h2>

                  <small>

                    Product ID:{" "}

                    <strong>
                      {editingId ||
                        nextProductId}
                    </strong>

                  </small>

                </div>

                <button
                  type="button"
                  className="admin-icon-button"
                  onClick={closeForm}
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

                    <label htmlFor="product-name">
                      Product Name *
                    </label>

                    <input
                      id="product-name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={
                        handleChange
                      }
                      placeholder="Fresh Nile Perch"
                      disabled={saving}
                      autoFocus
                    />

                  </div>

                  {/* CATEGORY */}

                  <div className="admin-form-group">

                    <label htmlFor="product-category">
                      Category *
                    </label>

                    <select
                      id="product-category"
                      name="category"
                      value={
                        form.category
                      }
                      onChange={
                        handleChange
                      }
                      disabled={saving}
                    >

                      {CATEGORIES.map(
                        (category) => (
                          <option
                            key={category}
                            value={category}
                          >
                            {category}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  {/* ORIGIN */}

                  <div className="admin-form-group">

                    <label htmlFor="product-origin">
                      Origin *
                    </label>

                    <input
                      id="product-origin"
                      name="origin"
                      type="text"
                      value={
                        form.origin
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Kenya"
                      disabled={saving}
                    />

                  </div>

                  {/* UNIT */}

                  <div className="admin-form-group">

                    <label htmlFor="product-unit">
                      Unit *
                    </label>

                    <select
                      id="product-unit"
                      name="unit"
                      value={form.unit}
                      onChange={
                        handleChange
                      }
                      disabled={saving}
                    >

                      {UNITS.map(
                        (unit) => (
                          <option
                            key={unit}
                            value={unit}
                          >
                            {unit}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  {/* PRICE */}

                  <div className="admin-form-group">

                    <label htmlFor="product-price">
                      Price (KES) *
                    </label>

                    <input
                      id="product-price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={
                        handleChange
                      }
                      placeholder="850"
                      disabled={saving}
                    />

                  </div>

                  {/* STOCK */}

                  <div className="admin-form-group">

                    <label htmlFor="product-stock">
                      Stock Quantity *
                    </label>

                    <input
                      id="product-stock"
                      name="stock"
                      type="number"
                      min="0"
                      step="1"
                      value={form.stock}
                      onChange={
                        handleChange
                      }
                      placeholder="100"
                      disabled={saving}
                    />

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

                {/* FORM ACTIONS */}

                <div className="admin-form-actions">

                  <button
                    type="button"
                    className="admin-secondary-button"
                    onClick={closeForm}
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
                      ? "Update Product"
                      : "Add Product"}

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

