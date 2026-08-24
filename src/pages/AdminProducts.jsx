import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Edit3,
  Package,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

const initialProducts = [
  {
    id: "PRD-001",
    name: "Fresh Nile Perch",
    category: "Fresh Fish",
    origin: "Kenya",
    packaging: "10 KG Carton",
    price: "$8.50 / KG",
    status: "AVAILABLE",
  },
  {
    id: "PRD-002",
    name: "Frozen Tilapia",
    category: "Frozen Fish",
    origin: "East Africa",
    packaging: "20 KG Carton",
    price: "$5.80 / KG",
    status: "AVAILABLE",
  },
  {
    id: "PRD-003",
    name: "Premium Shrimp",
    category: "Shrimp",
    origin: "Indian Ocean",
    packaging: "5 KG Carton",
    price: "$12.40 / KG",
    status: "AVAILABLE",
  },
  {
    id: "PRD-004",
    name: "Frozen Mackerel",
    category: "Frozen Fish",
    origin: "Atlantic Ocean",
    packaging: "25 KG Carton",
    price: "$4.90 / KG",
    status: "LOW STOCK",
  },
  {
    id: "PRD-005",
    name: "Fresh Red Snapper",
    category: "Fresh Fish",
    origin: "Indian Ocean",
    packaging: "10 KG Carton",
    price: "$10.20 / KG",
    status: "AVAILABLE",
  },
  {
    id: "PRD-006",
    name: "Mixed Seafood",
    category: "Seafood",
    origin: "East Africa",
    packaging: "10 KG Carton",
    price: "$9.50 / KG",
    status: "AVAILABLE",
  },
];

const categories = [
  "All Categories",
  "Fresh Fish",
  "Frozen Fish",
  "Shrimp",
  "Seafood",
];

function AdminProducts() {
  const [productList, setProductList] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");

  const filteredProducts = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return productList.filter((product) => {
      const matchesCategory =
        category === "All Categories" ||
        product.category === category;

      const matchesSearch =
        !searchTerm ||
        product.name.toLowerCase().includes(searchTerm) ||
        product.id.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.origin.toLowerCase().includes(searchTerm);

      return matchesCategory && matchesSearch;
    });
  }, [productList, search, category]);

  const handleDelete = (id) => {
    const product = productList.find(
      (item) => item.id === id
    );

    if (!product) {
      return;
    }

    const confirmed = window.confirm(
      `Delete ${product.name} from the catalogue?`
    );

    if (!confirmed) {
      return;
    }

    setProductList((currentProducts) =>
      currentProducts.filter(
        (item) => item.id !== id
      )
    );
  };

  const handleEdit = (product) => {
    window.alert(
      `Product editing for ${product.name} will be connected to the product form next.`
    );
  };

  const handleAddProduct = () => {
    window.alert(
      "The Add Product form will be connected next."
    );
  };

  const availableCount = productList.filter(
    (product) => product.status === "AVAILABLE"
  ).length;

  const lowStockCount = productList.filter(
    (product) => product.status === "LOW STOCK"
  ).length;

  return (
    <main className="admin-layout">

      {/* =========================================
          SIDEBAR
      ========================================= */}

      <aside className="admin-sidebar">

        <Link to="/" className="admin-brand">
          MARVEL
          <span>GLOBAL FISH TRADING</span>
        </Link>

        <div className="admin-sidebar-label">
          ADMINISTRATION
        </div>

        <nav className="admin-navigation">

          <Link
            to="/admin"
            className="admin-nav-link"
          >
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
            <Package size={17} />
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

      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <section className="admin-main">

        {/* HEADER */}

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
              PRODUCT MANAGEMENT
            </span>

            <h1>Products</h1>

            <p>
              Manage the MARVEL seafood catalogue,
              availability and product information.
            </p>

          </div>

          <button
            type="button"
            className="primary-button"
            onClick={handleAddProduct}
          >
            <Plus size={17} />
            Add Product
          </button>

        </header>

        <div className="admin-content">

          {/* =========================================
              PRODUCT SUMMARY
          ========================================= */}

          <section className="admin-kpis">

            <article className="admin-kpi">

              <div className="admin-kpi-icon">
                <Package size={20} />
              </div>

              <div>
                <span>Total Products</span>

                <strong>
                  {productList.length}
                </strong>

                <small>
                  Catalogue products
                </small>
              </div>

            </article>

            <article className="admin-kpi">

              <div className="admin-kpi-icon">
                <Package size={20} />
              </div>

              <div>
                <span>Available</span>

                <strong>
                  {availableCount}
                </strong>

                <small>
                  Ready for quotation
                </small>
              </div>

            </article>

            <article className="admin-kpi">

              <div className="admin-kpi-icon">
                <Package size={20} />
              </div>

              <div>
                <span>Low Stock</span>

                <strong>
                  {lowStockCount}
                </strong>

                <small>
                  Requires attention
                </small>
              </div>

            </article>

          </section>

          {/* =========================================
              PRODUCT MANAGEMENT
          ========================================= */}

          <section className="admin-panel">

            <div className="admin-panel-header">

              <div>

                <span className="section-label">
                  SEAFOOD CATALOGUE
                </span>

                <h2>
                  Manage products
                </h2>

              </div>

              <Link to="/products">
                View public catalogue
              </Link>

            </div>

            {/* FILTERS */}

            <div className="catalogue-toolbar">

              <div className="product-search">

                <Search size={18} />

                <input
                  type="search"
                  placeholder="Search products..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  aria-label="Search products"
                />

              </div>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                className="admin-select"
                aria-label="Filter products by category"
              >

                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}

              </select>

            </div>

            {/* PRODUCT TABLE */}

            <div className="admin-table">

              <div className="admin-table-head">

                <span>PRODUCT</span>
                <span>CATEGORY</span>
                <span>ORIGIN</span>
                <span>PACKAGING</span>
                <span>PRICE</span>
                <span>STATUS</span>
                <span>ACTIONS</span>

              </div>

              {filteredProducts.length > 0 ? (

                filteredProducts.map((product) => (

                  <div
                    className="admin-table-row admin-product-row"
                    key={product.id}
                  >

                    {/* PRODUCT */}

                    <div className="admin-product-name">

                      <div className="admin-order-icon">
                        <Package size={16} />
                      </div>

                      <div>

                        <strong>
                          {product.name}
                        </strong>

                        <span>
                          {product.id}
                        </span>

                      </div>

                    </div>

                    {/* CATEGORY */}

                    <span>
                      {product.category}
                    </span>

                    {/* ORIGIN */}

                    <span>
                      {product.origin}
                    </span>

                    {/* PACKAGING */}

                    <span>
                      {product.packaging}
                    </span>

                    {/* PRICE */}

                    <strong>
                      {product.price}
                    </strong>

                    {/* STATUS */}

                    <span
                      className={
                        product.status === "AVAILABLE"
                          ? "admin-status paid"
                          : "admin-status pending"
                      }
                    >
                      {product.status}
                    </span>

                    {/* ACTIONS */}

                    <div className="admin-row-actions">

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(product)
                        }
                        aria-label={`Edit ${product.name}`}
                        title="Edit product"
                      >
                        <Edit3 size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(product.id)
                        }
                        aria-label={`Delete ${product.name}`}
                        title="Delete product"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </div>

                ))

              ) : (

                <div className="empty-products">

                  <h2>
                    No products found
                  </h2>

                  <p>
                    Try changing your search or
                    category filter.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setCategory("All Categories");
                    }}
                  >
                    Clear Filters
                  </button>

                </div>

              )}

            </div>

          </section>

        </div>

      </section>

    </main>
  );
}

export default AdminProducts;