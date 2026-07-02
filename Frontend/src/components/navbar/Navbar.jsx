import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiBell,
  FiChevronDown,
  FiHeart,
  FiLogOut,
  FiMenu,
  FiMessageCircle,
  FiSettings,
  FiShoppingBag,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import Logo from "../common/Logo";
import SearchBar from "./SearchBar";

const navLinks = [
  { label: "Categories", to: "/categories", hasChevron: true },
  { label: "Book Swap", to: "/bookswap" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Help Center", to: "/help-center" },
];

const notificationPreview = [
  { id: 1, title: "New Swap Request", meta: "Priya wants to swap books" },
  { id: 2, title: "Wishlist Update", meta: "iPhone 12 price dropped" },
  { id: 3, title: "Product Approved", meta: "Your listing is now live" },
];

const messagePreview = [
  { id: 1, name: "Appu", text: "Can we meet near Sawantwadi Lake?", count: 1 },
  { id: 2, name: "Shweta", text: "Is the study table negotiable?", count: 0 },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { user, isUserAuthenticated, logoutUser } = useAuth();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const closeMenus = () => {
    setIsOpen(false);
    setActiveDropdown(null);
  };

  const handleLogout = () => {
    logoutUser();
    closeMenus();
    navigate("/");
  };

  const goTo = (path) => {
    closeMenus();
    navigate(path);
  };

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

        <div className={`navbar__actions ${!isUserAuthenticated ? "navbar__auth" : ""}`}>
          {!isUserAuthenticated ? (
            <>
              <Link className="navbar__auth-link" to="/login">Login</Link>
              <Link className="navbar__auth-link navbar__auth-link--primary" to="/signup">Signup</Link>
            </>
          ) : (
            <>
              <button className="navbar__icon-button" type="button" onClick={() => goTo("/wishlist")} aria-label="Wishlist">
                <FiHeart />
                <span className="navbar__badge">{wishlistCount}</span>
              </button>

              <div className="navbar__dropdown-wrap">
                <button
                  className="navbar__icon-button"
                  type="button"
                  onClick={() => setActiveDropdown((current) => (current === "notifications" ? null : "notifications"))}
                  aria-label="Notifications"
                >
                  <FiBell />
                  <span className="navbar__badge">3</span>
                </button>
                <AnimatePresence>
                  {activeDropdown === "notifications" && (
                    <PreviewDropdown
                      title="Notifications"
                      items={notificationPreview.map((item) => ({
                        ...item,
                        icon: <FiBell />,
                      }))}
                      actionLabel="View All Notifications"
                      onAction={() => goTo("/notifications")}
                    />
                  )}
                </AnimatePresence>
              </div>

              <div className="navbar__dropdown-wrap">
                <button
                  className="navbar__icon-button"
                  type="button"
                  onClick={() => setActiveDropdown((current) => (current === "messages" ? null : "messages"))}
                  aria-label="Messages"
                >
                  <FiMessageCircle />
                  <span className="navbar__badge">1</span>
                </button>
                <AnimatePresence>
                  {activeDropdown === "messages" && (
                    <PreviewDropdown
                      title="Messages"
                      items={messagePreview.map((item) => ({
                        id: item.id,
                        title: item.name,
                        meta: item.text,
                        icon: <FiMessageCircle />,
                      }))}
                      actionLabel="View All Messages"
                      onAction={() => goTo("/messages")}
                    />
                  )}
                </AnimatePresence>
              </div>

              <div className="navbar__dropdown-wrap">
                <button
                  className="avatar"
                  type="button"
                  onClick={() => setActiveDropdown((current) => (current === "profile" ? null : "profile"))}
                  aria-label="Open profile menu"
                >
                  {user?.avatar || user?.name?.charAt(0)?.toUpperCase() || "S"}
                </button>
                <AnimatePresence>
                  {activeDropdown === "profile" && (
                    <motion.div
                      className="navbar__profile-menu"
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.96 }}
                      transition={{ duration: 0.16 }}
                    >
                      <div className="navbar__profile-head">
                        <span>{user?.avatar || "S"}</span>
                        <div>
                          <strong>{user?.name || "SindhuSwap User"}</strong>
                          <small>{user?.email}</small>
                        </div>
                      </div>
                      <button type="button" onClick={() => goTo("/profile")}><FiUser /> My Profile</button>
                      <button type="button" onClick={() => goTo("/my-products")}><FiShoppingBag /> My Products</button>
                      <button type="button" onClick={() => goTo("/wishlist")}><FiHeart /> Wishlist</button>
                      <button type="button" onClick={() => goTo("/notifications")}><FiBell /> Notifications</button>
                      <button type="button" onClick={() => goTo("/messages")}><FiMessageCircle /> Messages</button>
                      <button type="button" onClick={() => goTo("/settings")}><FiSettings /> Settings</button>
                      <button className="navbar__logout" type="button" onClick={handleLogout}><FiLogOut /> Logout</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
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
          {!isUserAuthenticated ? (
            <>
              <Link to="/login" onClick={closeMenus}>Login</Link>
              <Link to="/signup" onClick={closeMenus}>Signup</Link>
            </>
          ) : (
            <>
              <Link to="/wishlist" onClick={closeMenus}>Wishlist</Link>
              <Link to="/notifications" onClick={closeMenus}>Notifications</Link>
              <Link to="/messages" onClick={closeMenus}>Messages</Link>
              <Link to="/profile" onClick={closeMenus}>Profile</Link>
              <button type="button" onClick={handleLogout}>Logout</button>
            </>
          )}
        </motion.div>
      )}
    </motion.header>
  );
}

function PreviewDropdown({ title, items, actionLabel, onAction }) {
  return (
    <motion.div
      className="navbar__preview"
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.96 }}
      transition={{ duration: 0.16 }}
    >
      <div className="navbar__preview-head">
        <strong>{title}</strong>
        <span>{items.length} new</span>
      </div>
      <div className="navbar__preview-list">
        {items.map((item) => (
          <button type="button" key={item.id} onClick={onAction}>
            <span>{item.icon}</span>
            <div>
              <strong>{item.title}</strong>
              <small>{item.meta}</small>
            </div>
          </button>
        ))}
      </div>
      <button className="navbar__preview-action" type="button" onClick={onAction}>
        {actionLabel}
      </button>
    </motion.div>
  );
}

export default Navbar;
