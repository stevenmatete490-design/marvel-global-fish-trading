import {
  ArrowLeft,
  Download,
  FileCheck2,
  FileText,
  Package,
  Ship,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const documents = [
  {
    id: "DOC-001",
    name: "Commercial Invoice",
    type: "INVOICE",
    order: "ORD-MAR-001",
    date: "18 Aug 2026",
    status: "AVAILABLE",
  },
  {
    id: "DOC-002",
    name: "Packing List",
    type: "PACKING LIST",
    order: "ORD-MAR-001",
    date: "19 Aug 2026",
    status: "AVAILABLE",
  },
  {
    id: "DOC-003",
    name: "Bill of Lading",
    type: "SHIPPING",
    order: "ORD-MAR-001",
    date: "20 Aug 2026",
    status: "AVAILABLE",
  },
  {
    id: "DOC-004",
    name: "Certificate of Origin",
    type: "CERTIFICATE",
    order: "ORD-MAR-001",
    date: "20 Aug 2026",
    status: "AVAILABLE",
  },
  {
    id: "DOC-005",
    name: "Health Certificate",
    type: "CERTIFICATE",
    order: "ORD-MAR-002",
    date: "22 Aug 2026",
    status: "PROCESSING",
  },
];

function getDocumentIcon(type) {
  if (type === "SHIPPING") {
    return <Ship size={19} />;
  }

  if (type === "PACKING LIST") {
    return <Package size={19} />;
  }

  if (type === "CERTIFICATE") {
    return <FileCheck2 size={19} />;
  }

  return <FileText size={19} />;
}

function Documents() {
  const navigate = useNavigate();

  const [filter, setFilter] = useState("ALL");

  const filteredDocuments =
    filter === "ALL"
      ? documents
      : documents.filter(
          (document) => document.type === filter
        );

  const handleDownload = (document) => {
    alert(
      `${document.name} download will be connected to the secure document storage system.`
    );
  };

  return (
    <main className="customer-portal">

      {/* =========================
          SIDEBAR
      ========================= */}

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
            <Package size={18} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/customer/invoices"
            className="portal-nav-link"
          >
            <FileText size={18} />
            <span>Invoices</span>
          </Link>

          <Link
            to="/customer/payments"
            className="portal-nav-link"
          >
            <FileText size={18} />
            <span>Payments</span>
          </Link>

          <Link
            to="/customer/orders"
            className="portal-nav-link"
          >
            <Ship size={18} />
            <span>Orders</span>
          </Link>

          <Link
            to="/customer/documents"
            className="portal-nav-link active"
          >
            <FileCheck2 size={18} />
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

      {/* =========================
          MAIN
      ========================= */}

      <section className="customer-main">

        <header className="customer-header">

          <div>
            <span className="section-label">
              TRADE DOCUMENTATION
            </span>

            <h1>Documents</h1>
          </div>

        </header>

        <div className="customer-content">

          <div className="invoice-page-header">

            <div>

              <Link
                to="/customer"
                className="invoice-back"
              >
                <ArrowLeft size={15} />
                Back to Dashboard
              </Link>

              <h2>Trade documents</h2>

              <p>
                Access the documents associated with your
                seafood orders and shipments.
              </p>

            </div>

          </div>

          {/* =========================
              FILTERS
          ========================= */}

          <div className="document-filters">

            {[
              "ALL",
              "INVOICE",
              "PACKING LIST",
              "SHIPPING",
              "CERTIFICATE",
            ].map((item) => (

              <button
                key={item}
                className={
                  filter === item
                    ? "document-filter active"
                    : "document-filter"
                }
                onClick={() => setFilter(item)}
              >
                {item}
              </button>

            ))}

          </div>

          {/* =========================
              DOCUMENT LIST
          ========================= */}

          <section className="documents-list">

            <div className="documents-list-header">
              <span>DOCUMENT</span>
              <span>TYPE</span>
              <span>ORDER</span>
              <span>DATE</span>
              <span>STATUS</span>
              <span>ACTION</span>
            </div>

            {filteredDocuments.map((document) => (

              <div
                className="document-row"
                key={document.id}
              >

                <div className="document-name">

                  <div className="document-icon">
                    {getDocumentIcon(document.type)}
                  </div>

                  <div>
                    <strong>{document.name}</strong>
                    <span>{document.id}</span>
                  </div>

                </div>

                <span>
                  {document.type}
                </span>

                <strong>
                  {document.order}
                </strong>

                <span>
                  {document.date}
                </span>

                <span
                  className={
                    document.status === "AVAILABLE"
                      ? "document-status available"
                      : "document-status processing"
                  }
                >
                  {document.status}
                </span>

                <button
                  className="document-download"
                  disabled={
                    document.status !== "AVAILABLE"
                  }
                  onClick={() =>
                    handleDownload(document)
                  }
                >
                  <Download size={16} />

                  <span>
                    {document.status === "AVAILABLE"
                      ? "Download"
                      : "Processing"}
                  </span>
                </button>

              </div>

            ))}

            {filteredDocuments.length === 0 && (

              <div className="document-empty">

                <FileText size={35} />

                <h3>No documents found</h3>

                <p>
                  There are no documents in this category.
                </p>

              </div>

            )}

          </section>

        </div>

      </section>

    </main>
  );
}

export default Documents;