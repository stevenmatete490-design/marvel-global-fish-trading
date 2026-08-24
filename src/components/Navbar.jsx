import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <span className="logo-mark">M</span>

          <div className="logo-text">
            <strong>MARVEL</strong>
            <span>GLOBAL FISH TRADING</span>
          </div>
        </Link>

        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <NavLink to="/" end onClick={closeMenu}>
            Home
          </NavLink>

          <NavLink to="/products" onClick={closeMenu}>
            Products
          </NavLink>

          <NavLink to="/about" onClick={closeMenu}>
            About
          </NavLink>

          <NavLink to="/global-trade" onClick={closeMenu}>
            Global Trade
          </NavLink>

          <NavLink to="/contact" onClick={closeMenu}>
            Contact
          </NavLink>

          <Link
            to="/request-quote"
            className="quote-button"
            onClick={closeMenu}
          >
            Get a Quote
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;