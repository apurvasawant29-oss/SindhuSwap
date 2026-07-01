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
import SearchBar from "./SearchBar";

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

        <SearchBar />

        <nav className="navbar__links" aria-label="Primary navigation">
  {navLinks.map((link) => (
    <NavLink
      key={link.label}
      to={link.to}
      className={({ isActive }) =>
        `relative flex items-center gap-1 px-1 py-2 text-sm font-medium
        transition-all duration-300 ease-in-out
        ${
          isActive
            ? "text-emerald-600"
            : "text-slate-700 hover:text-emerald-600"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span>{link.label}</span>

          {link.hasChevron && (
            <FiChevronDown
              className={`transition-transform duration-300 ${
                isActive ? "rotate-180 text-emerald-600" : ""
              }`}
            />
          )}

          <span
            className={`absolute -bottom-1 left-0 h-[3px] rounded-full bg-emerald-500
            transition-all duration-300 ease-out
            ${
              isActive
                ? "w-full opacity-100"
                : "w-0 opacity-0"
            }`}
          />
        </>
      )}
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
          <Link to="/messages" aria-label="Messages">
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
  <NavLink
    key={link.label}
    to={link.to}
    onClick={() => setIsOpen(false)}
    className={({ isActive }) =>
      `block rounded-xl px-4 py-3 text-sm font-medium
      transition-all duration-300
      ${
        isActive
          ? "bg-emerald-50 text-emerald-600"
          : "text-slate-700 hover:bg-slate-50 hover:text-emerald-600"
      }`
    }
  >
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
