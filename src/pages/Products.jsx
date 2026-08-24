import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";

import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

const categories = [
  "All Products",
  "Fresh Fish",
  "Frozen Fish",
  "Shrimp",
  "Seafood",
];

function Products() {
  const [activeCategory, setActiveCategory] =
    useState("All Products");

  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();

    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "All Products" ||
        product.category === activeCategory;

      const matchesSearch =
        !searchTerm ||
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.origin.toLowerCase().includes(searchTerm);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const clearFilters = () => {
    setSearch("");
    setActiveCategory("All Products");
  };

  return (
    <main className="products-page">

      {/* =========================================
          PAGE HERO
      ========================================= */}

      <section className="products-page-hero">

        <div className="products-page-hero-content">

          <span className="section-label">
            OUR PRODUCTS
          </span>

          <h1>
            Premium seafood
            <br />
            <span>for global markets.</span>
          </h1>

          <p>
            Explore our seafood catalogue and tell us what
            you need. Availability, origin, packaging and
            pricing can be tailored to your requirements.
          </p>

        </div>

      </section>


      {/* =========================================
          PRODUCT CATALOGUE
      ========================================= */}

      <section className="catalogue-section">

        <div className="section-container">

          {/* SEARCH TOOLBAR */}

          <div className="catalogue-toolbar">

            <div className="product-search">

              <Search size={19} />

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

            <div className="catalogue-count">

              <SlidersHorizontal size={17} />

              <span>
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1
                  ? "product"
                  : "products"}
              </span>

            </div>

          </div>


          {/* CATEGORY FILTER */}

          <div className="category-filter">

            {categories.map((category) => (

              <button
                key={category}
                type="button"
                className={
                  activeCategory === category
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() =>
                  setActiveCategory(category)
                }
              >
                {category}
              </button>

            ))}

          </div>


          {/* PRODUCTS */}

          {filteredProducts.length > 0 ? (

            <div className="catalogue-grid">

              {filteredProducts.map((product) => (

                <ProductCard
                  key={product.id}
                  product={product}
                />

              ))}

            </div>

          ) : (

            <div className="empty-products">

              <h2>
                No products found
              </h2>

              <p>
                We couldn't find any products matching
                your search or selected category.
              </p>

              <button
                type="button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>

            </div>

          )}

        </div>

      </section>


      {/* =========================================
          B2B CTA
      ========================================= */}

      <section className="catalogue-cta">

        <div className="section-container catalogue-cta-inner">

          <div>

            <span className="section-label">
              B2B ENQUIRIES
            </span>

            <h2>
              Looking for something
              <br />
              specific?
            </h2>

          </div>


          <div>

            <p>
              Tell us the product, quantity, destination
              and preferred packaging. Our trading team
              can prepare a quotation based on your
              requirements.
            </p>

            <Link
              to="/request-quote"
              className="primary-button"
            >
              Request a Quote
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Products;