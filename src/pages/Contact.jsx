import {
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { useState } from "react";

function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="corporate-page">
      <section className="corporate-hero contact-hero">
        <div className="corporate-hero-content">
          <span className="section-label">CONTACT MARVEL</span>

          <h1>
            Let's talk
            <br />
            <span>business.</span>
          </h1>

          <p>
            Whether you are sourcing seafood, looking for a supply
            partner or exploring an international trading opportunity,
            we'd like to hear from you.
          </p>
        </div>
      </section>

      <section className="contact-section">
        <div className="corporate-container contact-grid">

          {/* CONTACT INFORMATION */}
          <div className="contact-details">
            <span className="section-label">GET IN TOUCH</span>

            <h2>Start a conversation.</h2>

            <p>
              Send us your requirements and our team can follow up with
              the appropriate information.
            </p>

            {/* EMAIL */}
            <div className="contact-detail">
              <div className="contact-icon">
                <Mail size={20} />
              </div>

              <div>
                <span>Email</span>

                <a href="mailto:marvelglobal2020@gmail.com">
                  marvelglobal2020@gmail.com
                </a>
              </div>
            </div>

            {/* PHONE / WHATSAPP */}
            <div className="contact-detail">
              <div className="contact-icon">
                <Phone size={20} />
              </div>

              <div>
                <span>Phone / WhatsApp</span>

                <a href="tel:+254793609252">
                  +254 793 609252
                </a>
              </div>
            </div>

            {/* OFFICE */}
            <div className="contact-detail">
              <div className="contact-icon">
                <MapPin size={20} />
              </div>

              <div>
                <span>Trading Office</span>

                <strong>Global Offices</strong>
              </div>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="contact-form-wrapper">
            {submitted ? (
              <div className="contact-success">
                <Send size={45} />

                <h3>Message received.</h3>

                <p>
                  Thank you for contacting MARVEL GLOBAL FISH TRADING.
                  Our team will review your enquiry.
                </p>

                <button
                  onClick={() => setSubmitted(false)}
                  className="primary-button"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form
                className="contact-form"
                onSubmit={handleSubmit}
              >
                <div className="form-grid">
                  <label>
                    Full Name

                    <input
                      type="text"
                      placeholder="Your full name"
                      required
                    />
                  </label>

                  <label>
                    Company

                    <input
                      type="text"
                      placeholder="Company name"
                    />
                  </label>
                </div>

                <label>
                  Email Address

                  <input
                    type="email"
                    placeholder="you@company.com"
                    required
                  />
                </label>

                <label>
                  Subject

                  <input
                    type="text"
                    placeholder="How can we help?"
                    required
                  />
                </label>

                <label>
                  Message

                  <textarea
                    rows="7"
                    placeholder="Tell us about your enquiry..."
                    required
                  />
                </label>

                <button
                  type="submit"
                  className="primary-button"
                >
                  Send Message
                  <Send size={17} />
                </button>
              </form>
            )}
          </div>

        </div>
      </section>
    </main>
  );
}

export default Contact;