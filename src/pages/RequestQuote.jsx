import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  MapPin,
  Package,
  Send,
} from "lucide-react";
import { products } from "../data/products";

function RequestQuote() {
  const [searchParams] = useSearchParams();
  const selectedProduct = searchParams.get("product") || "";

  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    product: selectedProduct,
    quantity: "",
    destination: "",
    packaging: "",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setSubmitted(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (submitted) {
    return (
      <main className="quote-page">
        <section className="quote-success">
          <div className="quote-success-card">
            <CheckCircle2 size={58} />

            <span className="section-label">
              REQUEST RECEIVED
            </span>

            <h1>Thank you for your enquiry.</h1>

            <p>
              Your quotation request has been recorded. Our trading team
              will review your requirements and get back to you with the
              appropriate pricing and availability.
            </p>

            <button
              className="primary-button"
              onClick={() => setSubmitted(false)}
            >
              Submit Another Request
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="quote-page">
      {/* HERO */}
      <section className="quote-hero">
        <div className="quote-hero-content">
          <span className="section-label">B2B ENQUIRIES</span>

          <h1>
            Request a
            <br />
            <span>quotation.</span>
          </h1>

          <p>
            Tell us what you need and our seafood trading team will prepare
            a quotation based on your product, quantity, destination and
            packaging requirements.
          </p>
        </div>
      </section>

      {/* FORM AREA */}
      <section className="quote-form-section">
        <div className="quote-layout">
          <aside className="quote-info">
            <span className="section-label">HOW IT WORKS</span>

            <h2>Tell us about your requirement.</h2>

            <p>
              The more information you provide, the easier it is for our
              team to prepare an accurate commercial quotation.
            </p>

            <div className="quote-info-item">
              <Package size={21} />

              <div>
                <strong>Product requirements</strong>
                <span>
                  Specify the seafood product and required quantity.
                </span>
              </div>
            </div>

            <div className="quote-info-item">
              <MapPin size={21} />

              <div>
                <strong>Destination</strong>
                <span>
                  Let us know where the shipment needs to go.
                </span>
              </div>
            </div>

            <div className="quote-info-item">
              <Mail size={21} />

              <div>
                <strong>Quotation</strong>
                <span>
                  Our team will review your enquiry and respond.
                </span>
              </div>
            </div>
          </aside>

          <div className="quote-form-wrapper">
            <form className="quote-form" onSubmit={handleSubmit}>
              <div className="form-heading">
                <span>01</span>
                <div>
                  <h3>Your details</h3>
                  <p>Tell us how we can reach you.</p>
                </div>
              </div>

              <div className="form-grid">
                <label>
                  Full Name
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </label>

                <label>
                  Company
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Company name"
                    required
                  />
                </label>

                <label>
                  Email Address
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    required
                  />
                </label>

                <label>
                  Phone Number
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+254 ..."
                    required
                  />
                </label>
              </div>

              <div className="form-heading">
                <span>02</span>
                <div>
                  <h3>Product requirements</h3>
                  <p>Tell us what you are looking for.</p>
                </div>
              </div>

              <div className="form-grid">
                <label>
                  Product
                  <select
                    name="product"
                    value={formData.product}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a product</option>

                    {products.map((product) => (
                      <option key={product.id} value={product.name}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Quantity
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="e.g. 2,000 KG"
                    required
                  />
                </label>

                <label>
                  Destination
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="Country / Port / City"
                    required
                  />
                </label>

                <label>
                  Preferred Packaging
                  <select
                    name="packaging"
                    value={formData.packaging}
                    onChange={handleChange}
                  >
                    <option value="">Select packaging</option>
                    <option value="10kg cartons">10kg cartons</option>
                    <option value="20kg cartons">20kg cartons</option>
                    <option value="1kg packs">1kg packs</option>
                    <option value="5kg packs">5kg packs</option>
                    <option value="Custom">Custom requirement</option>
                  </select>
                </label>
              </div>

              <div className="form-heading">
                <span>03</span>
                <div>
                  <h3>Additional information</h3>
                  <p>Anything else our team should know?</p>
                </div>
              </div>

              <label>
                Message
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your requirements, preferred delivery date, specifications or any other details..."
                  rows="6"
                />
              </label>

              <div className="form-submit">
                <div>
                  <strong>Ready to send?</strong>
                  <span>
                    Your information will be reviewed by our trading team.
                  </span>
                </div>

                <button type="submit" className="primary-button">
                  Send Quote Request
                  <Send size={17} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default RequestQuote;