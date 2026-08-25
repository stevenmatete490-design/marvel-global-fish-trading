import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { getProducts, subscribeToDataChanges } from "../data/store";

const categories = ["All Products", "Fresh Fish", "Frozen Fish", "Shrimp", "Seafood"];

function Products() {
  const [productList, setProductList] = useState(getProducts);
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [search, setSearch] = useState("");
  useEffect(() => subscribeToDataChanges(() => setProductList(getProducts())), []);
  const filteredProducts = useMemo(() => { const term = search.trim().toLowerCase(); return productList.filter((product) => (activeCategory === "All Products" || product.category === activeCategory) && (!term || Object.values(product).join(" ").toLowerCase().includes(term))); }, [productList, activeCategory, search]);
  const clearFilters = () => { setSearch(""); setActiveCategory("All Products"); };
  return <main className="products-page"><section className="products-page-hero"><div className="products-page-hero-content"><span className="section-label">OUR PRODUCTS</span><h1>Premium seafood<br /><span>for global markets.</span></h1><p>Explore our live seafood catalogue. Availability, origin, packaging and pricing can be tailored to your requirements.</p></div></section><section className="catalogue-section"><div className="section-container"><div className="catalogue-toolbar"><div className="product-search"><Search size={19} /><input type="search" placeholder="Search products..." value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search products" /></div><div className="catalogue-count"><SlidersHorizontal size={17} /><span>{filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}</span></div></div><div className="category-filter">{categories.map((category) => <button key={category} type="button" className={activeCategory === category ? "filter-button active" : "filter-button"} onClick={() => setActiveCategory(category)}>{category}</button>)}</div>{filteredProducts.length ? <div className="catalogue-grid">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-products"><h2>No products found</h2><p>We couldn't find any products matching your filters.</p><button type="button" onClick={clearFilters}>Clear Filters</button></div>}</div></section><section className="catalogue-cta"><div className="section-container catalogue-cta-inner"><div><span className="section-label">B2B ENQUIRIES</span><h2>Looking for something<br />specific?</h2></div><div><p>Tell us the product, quantity, destination and preferred packaging. Our trading team can prepare a quotation based on your requirements.</p><Link to="/request-quote" className="primary-button">Request a Quote</Link></div></div></section></main>;
}

export default Products;
