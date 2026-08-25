import {
  Award,
  Globe2,
  ShieldCheck,
  Users,
} from "lucide-react";

function About() {
  return (
    <main className="corporate-page">
      <section className="corporate-hero">
        <div className="corporate-hero-content">
          <span className="section-label">ABOUT MARVEL</span>

          <h1>
            Seafood trading
            <br />
            <span>without borders.</span>
          </h1>

          <p>
            MARVEL GLOBAL FISH TRADING SARL is positioned to connect
            quality seafood supply with buyers across international
            markets.
          </p>
        </div>
      </section>

      <section className="about-intro">
        <div className="corporate-container about-intro-grid">
          <div>
            <span className="section-label">WHO WE ARE</span>
            <h2>
              Connecting seafood supply with global demand.
            </h2>
          </div>

          <div>
            <p>
              We focus on seafood sourcing, trading, import, export and
              distribution, working with buyers and supply partners to
              facilitate reliable international trade.
            </p>

            <p>
              Our approach is built around product quality, clear
              communication, dependable logistics and long-term commercial
              relationships.
            </p>
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="corporate-container">
          <div className="section-heading">
            <span className="section-label">OUR APPROACH</span>
            <h2>Built around trust.</h2>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <Globe2 size={28} />
              <h3>Global Reach</h3>
              <p>
                Connecting suppliers, buyers and markets across borders.
              </p>
            </div>

            <div className="value-card">
              <ShieldCheck size={28} />
              <h3>Reliability</h3>
              <p>
                Clear commercial processes designed to make seafood
                transactions straightforward.
              </p>
            </div>

            <div className="value-card">
              <Award size={28} />
              <h3>Quality Focus</h3>
              <p>
                Attention to product specifications, handling and
                presentation.
              </p>
            </div>

            <div className="value-card">
              <Users size={28} />
              <h3>Partnership</h3>
              <p>
                Building long-term relationships with customers and
                suppliers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="corporate-dark-section">
        <div className="corporate-container corporate-dark-grid">
          <div>
            <span className="section-label">OUR MISSION</span>

            <h2>
              Making international seafood trade simpler.
            </h2>
          </div>

          <p>
            Our goal is to create a dependable bridge between seafood
            supply and commercial demand by combining sourcing,
            documentation, logistics and customer service into one
            coordinated trading experience.
          </p>
        </div>
      </section>
    </main>
  );
}

export default About;