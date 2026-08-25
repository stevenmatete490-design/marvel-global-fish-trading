import { ArrowRight, Package, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-image-wrapper">
        <img src={product.image} alt={product.name} />

        {product.featured && (
          <span className="product-badge">Featured</span>
        )}
      </div>

      <div className="product-card-content">
        <span className="product-category">
          {product.category}
        </span>

        <h3>{product.name}</h3>

        <p>{product.description}</p>

        <div className="product-meta">
          <div>
            <MapPin size={15} />
            <span>{product.origin}</span>
          </div>

          <div>
            <Package size={15} />
            <span>{product.packaging}</span>
          </div>
        </div>

        <Link
          to={`/request-quote?product=${encodeURIComponent(product.name)}`}
          className="product-quote-button"
        >
          Request Quote
          <ArrowRight size={17} />
        </Link>
      </div>
    </article>
  );
}

export default ProductCard;