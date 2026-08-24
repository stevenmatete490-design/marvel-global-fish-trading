import {
  Anchor,
  Boxes,
  FileCheck2,
  Globe2,
  Ship,
} from "lucide-react";

const tradeSteps = [
  {
    number: "01",
    title: "Sourcing",
    description:
      "We identify seafood supply according to buyer requirements, specifications and market needs.",
    icon: Globe2,
  },
  {
    number: "02",
    title: "Commercial Terms",
    description:
      "Product quantities, specifications, pricing, packaging and destination requirements are confirmed.",
    icon: FileCheck2,
  },
  {
    number: "03",
    title: "Preparation",
    description:
      "Products are prepared and packaged according to the agreed commercial requirements.",
    icon: Boxes,
  },
  {
    number: "04",
    title: "Logistics",
    description:
      "Shipping and transportation arrangements are coordinated for the destination market.",
    icon: Ship,
  },
  {
    number: "05",
    title: "Delivery",
    description:
      "The shipment proceeds through the agreed delivery and receiving process.",
    icon: Anchor,
  },
];

function GlobalTrade() {
  return (
    <main className="corporate-page">
      <section className="corporate-hero trade-hero">
        <div className="corporate-hero-content">
          <span className="section-label">GLOBAL TRADE</span>

          <h1>
            From source
            <br />
            <span>to destination.</span>
          </h1>

          <p>
            A coordinated seafood trading process designed to connect
            supply, buyers and international markets.
          </p>
        </div>
      </section>

      <section className="trade-intro">
        <div className="corporate-container trade-intro-grid">
          <div>
            <span className="section-label">INTERNATIONAL COMMERCE</span>

            <h2>
              Sourcing. Trading.
              <br />
              Logistics. Distribution.
            </h2>
          </div>

          <p>
            International seafood trading requires more than moving
            products from one location to another. It requires
            coordination between suppliers, buyers, documentation,
            packaging, logistics and delivery.
          </p>
        </div>
      </section>

      <section className="trade-process">
        <div className="corporate-container">
          <div className="section-heading">
            <span className="section-label">THE PROCESS</span>

            <h2>
              A clear path from
              <br />
              enquiry to delivery.
            </h2>
          </div>

          <div className="trade-timeline">
            {tradeSteps.map((step) => {
              const Icon = step.icon;

              return (
                <div className="trade-step" key={step.number}>
                  <div className="trade-step-number">
                    {step.number}
                  </div>

                  <Icon size={26} />

                  <h3>{step.title}</h3>

                  <p>{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="corporate-dark-section">
        <div className="corporate-container corporate-dark-grid">
          <div>
            <span className="section-label">READY TO TRADE?</span>

            <h2>
              Tell us what your market needs.
            </h2>
          </div>

          <div>
            <p>
              Share your product, quantity, packaging and destination
              requirements with our trading team.
            </p>

            <a href="/request-quote" className="primary-button">
              Request a Quote
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default GlobalTrade;