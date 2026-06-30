import { FiFacebook, FiInstagram, FiMail, FiMapPin, FiPhone, FiTwitter } from "react-icons/fi";
import Logo from "../common/Logo";

const quickLinks = ["Home", "Categories", "Book Swap", "How It Works", "Contact"];
const categories = ["Electronics", "Furniture", "Books", "Mobiles", "Bikes", "Fashion"];
const support = ["Help Center", "Safety Tips", "Terms & Conditions", "Privacy Policy", "Report an Issue"];

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__grid container">
        <div className="footer__brand">
          <Logo />
          <p>Buy, sell, and swap second-hand items or books in your Sindhudurg community.</p>
          <div className="footer__socials">
            <a href="/" aria-label="Facebook">
              <FiFacebook />
            </a>
            <a href="/" aria-label="Instagram">
              <FiInstagram />
            </a>
            <a href="/" aria-label="Twitter">
              <FiTwitter />
            </a>
          </div>
        </div>

        <FooterList title="Quick Links" items={quickLinks} />
        <FooterList title="Categories" items={categories} />
        <FooterList title="Support" items={support} />

        <div className="footer__newsletter">
          <h3>Subscribe to Newsletter</h3>
          <p>Get the latest listings, swaps, and community updates.</p>
          <form>
            <input aria-label="Email address" placeholder="Enter your email" type="email" />
            <button type="submit">Subscribe</button>
          </form>
          <div className="footer__contact">
            <span>
              <FiMapPin /> Sindhudurg, Maharashtra
            </span>
            <span>
              <FiPhone /> +91 98765 43210
            </span>
            <span>
              <FiMail /> hello@sindhuswap.com
            </span>
          </div>
        </div>
      </div>
      <div className="footer__bottom container">
        <span>© 2026 SindhuSwap. All rights reserved.</span>
        <span>Made with care for our community</span>
      </div>
    </footer>
  );
}

function FooterList({ title, items }) {
  return (
    <div className="footer__list">
      <h3>{title}</h3>
      {items.map((item) => (
        <a href="/" key={item}>
          {item}
        </a>
      ))}
    </div>
  );
}

export default Footer;
