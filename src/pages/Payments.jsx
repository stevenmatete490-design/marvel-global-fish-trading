import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Payments() {
  const navigate = useNavigate();

  const [method, setMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);

  const handlePayment = (event) => {
    event.preventDefault();

    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      setPaid(true);
    }, 1200);
  };

  if (paid) {
    return (
      <main className="payment-success-page">
        <div className="payment-success-card">
          <CheckCircle2 size={55} />

          <span className="section-label">
            PAYMENT CONFIRMED
          </span>

          <h1>Payment successful.</h1>

          <p>
            Your payment for invoice MAR-002 has been
            received successfully.
          </p>

          <div className="payment-confirmation">
            <span>Invoice</span>
            <strong>MAR-002</strong>

            <span>Amount Paid</span>
            <strong>$7,200 USD</strong>

            <span>Status</span>
            <strong>PAID</strong>
          </div>

          <div className="payment-success-actions">
            <Link
              to="/customer/invoices"
              className="primary-button"
            >
              View Invoices
            </Link>

            <Link
              to="/customer"
              className="secondary-button"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="customer-portal">

      <aside className="customer-sidebar">
        <Link to="/" className="portal-brand">
          MARVEL
          <span>GLOBAL FISH TRADING</span>
        </Link>

        <nav className="portal-navigation">
          <div className="portal-nav-label">
            CUSTOMER PORTAL
          </div>

          <Link
            to="/customer"
            className="portal-nav-link"
          >
            <CreditCard size={18} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/customer/invoices"
            className="portal-nav-link"
          >
            <CreditCard size={18} />
            <span>Invoices</span>
          </Link>

          <Link
            to="/customer/payments"
            className="portal-nav-link active"
          >
            <CreditCard size={18} />
            <span>Payments</span>
          </Link>

          <Link
            to="/customer/orders"
            className="portal-nav-link"
          >
            <CreditCard size={18} />
            <span>Orders</span>
          </Link>

          <Link
            to="/customer/documents"
            className="portal-nav-link"
          >
            <CreditCard size={18} />
            <span>Documents</span>
          </Link>
        </nav>

        <button
          className="portal-logout"
          onClick={() => navigate("/login")}
        >
          ← Sign Out
        </button>
      </aside>

      <section className="customer-main">

        <header className="customer-header">
          <div>
            <span className="section-label">
              SECURE PAYMENT
            </span>

            <h1>Payment Portal</h1>
          </div>

          <div className="secure-payment-label">
            <ShieldCheck size={18} />
            Secure Checkout
          </div>
        </header>

        <div className="payment-content">

          <Link
            to="/customer/invoices"
            className="invoice-back"
          >
            <ArrowLeft size={15} />
            Back to Invoices
          </Link>

          <div className="payment-layout">

            {/* =========================
                INVOICE SUMMARY
            ========================= */}

            <section className="payment-invoice">

              <span className="section-label">
                INVOICE
              </span>

              <div className="payment-invoice-title">
                <div>
                  <h2>MAR-002</h2>
                  <p>Issued 21 Aug 2026</p>
                </div>

                <span className="invoice-status pending">
                  PENDING
                </span>
              </div>

              <div className="payment-customer">
                <span>Customer</span>
                <strong>Customer Company Ltd.</strong>
              </div>

              <div className="payment-product">
                <div>
                  <span>Product</span>
                  <strong>Premium Shrimp</strong>
                </div>

                <div>
                  <span>Quantity</span>
                  <strong>1,500 KG</strong>
                </div>
              </div>

              <div className="payment-breakdown">

                <div>
                  <span>Product Subtotal</span>
                  <strong>$6,700</strong>
                </div>

                <div>
                  <span>Shipping</span>
                  <strong>$500</strong>
                </div>

                <div>
                  <span>Other Charges</span>
                  <strong>$0</strong>
                </div>

                <div className="payment-total">
                  <span>Total</span>
                  <strong>$7,200 USD</strong>
                </div>

              </div>

            </section>

            {/* =========================
                PAYMENT METHOD
            ========================= */}

            <section className="payment-method">

              <span className="section-label">
                PAYMENT METHOD
              </span>

              <h2>Choose how to pay.</h2>

              <div className="payment-method-options">

                <button
                  type="button"
                  className={`payment-method-option ${
                    method === "card" ? "selected" : ""
                  }`}
                  onClick={() => setMethod("card")}
                >
                  <CreditCard size={21} />

                  <div>
                    <strong>Card Payment</strong>
                    <span>Credit or debit card</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`payment-method-option ${
                    method === "bank" ? "selected" : ""
                  }`}
                  onClick={() => setMethod("bank")}
                >
                  <Building2 size={21} />

                  <div>
                    <strong>Bank Transfer</strong>
                    <span>International bank transfer</span>
                  </div>
                </button>

              </div>

              {method === "card" ? (
                <form
                  className="payment-form"
                  onSubmit={handlePayment}
                >

                  <div className="payment-provider-note">
                    <LockKeyhole size={16} />

                    <span>
                      Your card details will be handled
                      securely by the payment provider.
                    </span>
                  </div>

                  <label>
                    Cardholder Name
                    <input
                      type="text"
                      placeholder="Name on card"
                      required
                    />
                  </label>

                  <label>
                    Card Number
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="•••• •••• •••• ••••"
                      maxLength="19"
                      required
                    />
                  </label>

                  <div className="payment-form-grid">

                    <label>
                      Expiry Date
                      <input
                        type="text"
                        placeholder="MM / YY"
                        required
                      />
                    </label>

                    <label>
                      CVV
                      <input
                        type="password"
                        inputMode="numeric"
                        placeholder="•••"
                        maxLength="4"
                        required
                      />
                    </label>

                  </div>

                  <button
                    type="submit"
                    className="payment-submit"
                    disabled={processing}
                  >
                    {processing
                      ? "Processing..."
                      : "Proceed to Payment"}

                    {!processing && (
                      <CreditCard size={17} />
                    )}
                  </button>

                </form>
              ) : (
                <div className="bank-transfer-box">

                  <Building2 size={30} />

                  <h3>Bank Transfer</h3>

                  <p>
                    Transfer the invoice amount using
                    MARVEL GLOBAL FISH TRADING's official
                    banking details.
                  </p>

                  <div className="bank-details">
                    <div>
                      <span>Bank</span>
                      <strong>MARVEL Business Bank</strong>
                    </div>

                    <div>
                      <span>Account Name</span>
                      <strong>
                        MARVEL GLOBAL FISH TRADING SARL
                      </strong>
                    </div>

                    <div>
                      <span>Reference</span>
                      <strong>MAR-002</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="payment-submit"
                    onClick={() =>
                      alert(
                        "Bank transfer confirmation will be connected to the backend."
                      )
                    }
                  >
                    Confirm Bank Transfer
                    <Building2 size={17} />
                  </button>

                </div>
              )}

              <div className="payment-security">

                <ShieldCheck size={17} />

                <span>
                  Secure payment processing. MARVEL does
                  not store your complete card information.
                </span>

              </div>

            </section>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Payments;