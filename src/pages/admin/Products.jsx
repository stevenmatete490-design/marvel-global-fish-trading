import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Edit3,
  Package,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  getProducts,
  nextId,
  saveProducts,
  subscribeToDataChanges,
} from "../../data/store";

const emptyForm = {
  name: "",
  category: "Fresh Fish",
  origin: "Kenya",
  unit: "Kg",
  price: "",
  stock: "",
  status: "In Stock",
};

function AdminProducts() {
  const [products, setProducts] = useState(() => getProducts());
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const unsubscribe = subscribeToDataChanges(() => {
      setProducts(getProducts());
    });

    return unsubscribe;
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(products.map((product) => product.category)),
    ];

    return ["All", ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !searchTerm ||
        product.name?.toLowerCase().includes(searchTerm) ||
        product.id?.toLowerCase().includes(searchTerm) ||
        product.category?.toLowerCase().includes(searchTerm) ||
        product.origin?.toLowerCase().includes(searchTerm);

      const matchesCategory =
        categoryFilter === "All" ||
        product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingId(product.id);

    setForm({
      name: product.name || "",
      category: product.category || "Fresh Fish",
      origin: product.origin || "Kenya",
      unit: product.unit || "Kg",
      price: product.price ?? "",
      stock: product.stock ?? "",
      status: product.status || "In Stock",
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      window.alert("Please enter a product name.");
      return;
    }

    const price = Number(form.price);
    const stock = Number(form.stock);

    if (Number.isNaN(price) || price < 0) {
      window.alert("Please enter a valid product price.");
      return;
    }

    if (Number.isNaN(stock) || stock < 0) {
      window.alert("Please enter a valid stock quantity.");
      return;
    }

    if (editingId) {
      const updatedProducts = products.map((product) =>
        product.id === editingId
          ? {
              ...product,
              name: form.name.trim(),
              category: form.category,
              origin: form.origin.trim(),
              unit: form.unit.trim() || "Kg",
              price,
              stock,
              status: form.status,
            }
          : product
      );

      saveProducts(updatedProducts);
    } else {
      const newProduct = {
        id: nextId("PRD", products),
        name: form.name.trim(),
        category: form.category,
        origin: form.origin.trim(),
        unit: form.unit.trim() || "Kg",
        price,
        stock,
        status: form.status,
      };

      saveProducts([...products, newProduct]);
    }

    closeForm();
  };

  const handleDelete = (product) => {
    const confirmed = window.confirm(
      `Delete "${product.name}" from the catalogue?`
    );

    if (!confirmed) {
      return;
    }

    const updatedProducts = products.filter(
      (item) => item.id !== product.id
    );

    saveProducts(updatedProducts);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
    }).format(Number(price) || 0);
  };

  return (
    <main className="admin-layout">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-brand">
          MARVEL <span>GLOBAL FISH TRADING</span>
        </Link>

        <div className="admin-sidebar-label">
          ADMINISTRATION
        </div>

        <nav className="admin-navigation">
          <Link to="/admin" className="admin-nav-link">
            Dashboard
          </Link>

          <Link
            to="/admin/customers"
            className="admin-nav-link"
          >
            Customers
          </Link>

          <Link
            to="/admin/products"
            className="admin-nav-link active"
          >
            Products
          </Link>

          <Link
            to="/admin/orders"
            className="admin-nav-link"
          >
            Orders
          </Link>

          <Link
            to="/admin/invoices"
            className="admin-nav-link"
          >
            Invoices
          </Link>

          <Link
            to="/admin/payments"
            className="admin-nav-link"
          >
            Payments
          </Link>

          <Link
            to="/admin/shipments"
            className="admin-nav-link"
          >
            Shipments
          </Link>

          <Link
            to="/admin/reports"
            className="admin-nav-link"
          >
            Reports
          </Link>
        </nav>

        <div className="admin-sidebar-bottom">
          <Link
            to="/admin/settings"
            className="admin-nav-link"
          >
            Settings
          </Link>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-header">
          <div>
            <Link
              to="/admin"
              className="admin-back-link"
            >
              <ArrowLeft size={16} />
              Dashboard
            </Link>

            <span className="section-label">
              CATALOGUE MANAGEMENT
            </span>

            <h1>Products</h1>

            <p>
              Manage seafood products, pricing, stock
              and catalogue availability.
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
          <section className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <span className="section-label">
                  PRODUCT CATALOGUE
                </span>

                <h2>
                  {products.length}{" "}
                  {products.length === 1
                    ? "Product"
                    : "Products"}
                </h2>
              </div>

              <Package size={24} />
            </div>

            <div className="admin-toolbar">
              <div className="admin-search">
                <Search size={18} />

                <input
                  type="search"
                  placeholder="Search products..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(event.target.value)
                }
                className="admin-filter-select"
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="admin-empty-state">
                <Package size={42} />

                <h3>No products found</h3>

                <p>
                  {products.length === 0
                    ? "Your catalogue is empty. Add your first seafood product."
                    : "Try changing your search or category filter."}
                </p>

                {products.length === 0 && (
                  <button
                    type="button"
                    className="admin-primary-button"
                    onClick={openAddForm}
                  >
                    <Plus size={17} />
                    Add First Product
                  </button>
                )}
              </div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Origin</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div className="admin-product-name">
                            <strong>{product.name}</strong>

                            <small>{product.id}</small>
                          </div>
                        </td>

                        <td>{product.category}</td>

                        <td>{product.origin}</td>

                        <td>
                          {formatPrice(product.price)}
                          {" / "}
                          {product.unit}
                        </td>

                        <td>
                          {product.stock} {product.unit}
                        </td>

                        <td>
                          <span
                            className={`admin-status ${
                              String(
                                product.status || ""
                              )
                                .toLowerCase()
                                .replace(/\s+/g, "-")
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>

                        <td>
                          <div className="admin-table-actions">
                            <button
                              type="button"
                              className="admin-icon-button"
                              title="Edit product"
                              onClick={() =>
                                openEditForm(product)
                              }
                            >
                              <Edit3 size={16} />
                            </button>

                            <button
                              type="button"
                              className="admin-icon-button danger"
                              title="Delete product"
                              onClick={() =>
                                handleDelete(product)
                              }
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </section>

      {showForm && (
        <div
          className="admin-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeForm();
            }
          }}
        >
          <div className="admin-modal">
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
              </div>

              <button
                type="button"
                className="admin-icon-button"
                onClick={closeForm}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-form-grid">
                <div className="admin-form-group full">
                  <label htmlFor="name">
                    Product Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g. Fresh Nile Perch"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="category">
                    Category
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option value="Fresh Fish">
                      Fresh Fish
                    </option>

                    <option value="Frozen Fish">
                      Frozen Fish
                    </option>

                    <option value="Fish Fillets">
                      Fish Fillets
                    </option>

                    <option value="Fish Products">
                      Fish Products
                    </option>

                    <option value="Other Seafood">
                      Other Seafood
                    </option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label htmlFor="origin">
                    Origin
                  </label>

                  <input
                    id="origin"
                    name="origin"
                    type="text"
                    placeholder="Kenya"
                    value={form.origin}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="price">
                    Price (KES)
                  </label>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="650"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="stock">
                    Stock Quantity
                  </label>

                  <input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="250"
                    value={form.stock}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="unit">
                    Unit
                  </label>

                  <select
                    id="unit"
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                  >
                    <option value="Kg">Kg</option>
                    <option value="Box">Box</option>
                    <option value="Piece">Piece</option>
                    <option value="Carton">Carton</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label htmlFor="status">
                    Status
                  </label>

                  <select
                    id="status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="In Stock">
                      In Stock
                    </option>

                    <option value="Low Stock">
                      Low Stock
                    </option>

                    <option value="Out of Stock">
                      Out of Stock
                    </option>

                    <option value="Unavailable">
                      Unavailable
                    </option>
                  </select>
                </div>
              </div>

              <div className="admin-form-actions">
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
                  <SaveIcon />
                  {editingId
                    ? "Update Product"
                    : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function SaveIcon() {
  return <span>✓</span>;
}

export default AdminProducts;
```
