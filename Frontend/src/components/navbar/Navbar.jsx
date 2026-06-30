import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiBell,
  FiChevronDown,
  FiHeart,
  FiMenu,
  FiMessageCircle,
  FiSearch,
  FiX,
} from "react-icons/fi";
import Logo from "../common/Logo";

const navLinks = [
  { label: "Categories", to: "/categories", hasChevron: true },
  { label: "Book Swap", to: "/bookswap" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Help Center", to: "/help-center" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      className="navbar"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="navbar__inner">
        <Logo />

        <form className="navbar__search" role="search">
          <input
            aria-label="Search products, books, and categories"
            placeholder="Search for products, books, categories..."
            type="search"
          />
          <button type="submit" aria-label="Search">
            <FiSearch />
          </button>
        </form>

        <nav className="navbar__links" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <NavLink key={link.label} to={link.to}>
              {link.label}
              {link.hasChevron && <FiChevronDown aria-hidden="true" />}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
          <Link to="/wishlist" aria-label="Wishlist">
            <FiHeart />
          </Link>
          <Link to="/notifications" aria-label="Notifications">
            <FiBell />
          </Link>
          <Link to="/inbox" aria-label="Inbox">
            <FiMessageCircle />
          </Link>
          <Link className="avatar" to="/profile" aria-label="Profile">
            S
          </Link>
        </div>

        <button
          className="navbar__menu"
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {isOpen && (
        <motion.div
          className="mobile-menu"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
        >
          {navLinks.map((link) => (
            <NavLink key={link.label} to={link.to} onClick={() => setIsOpen(false)}>
              {link.label}
            </NavLink>
          ))}
          <Link to="/wishlist" onClick={() => setIsOpen(false)}>
            Wishlist
          </Link>
          <Link to="/profile" onClick={() => setIsOpen(false)}>
            Profile
          </Link>
        </motion.div>
      )}
    </motion.header>
  );
}

export default Navbar;
