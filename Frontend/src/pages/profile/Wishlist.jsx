import { motion } from "framer-motion";
import { FiEye, FiHeart, FiMapPin, FiShoppingBag, FiStar, FiTrash2 } from "react-icons/fi";
import PageShell from "../../components/common/PageShell";
import heroImage from "../../assets/images/community.jpg";
import productImage from "../../assets/images/book-cover.jpg";
import altProductImage from "../../assets/images/sindhu-fort.jpg";
import profileImage from "../../assets/images/team-member.jpg";

const wishlistItems = [
  { name: "MacBook Air M1", seller: "Rohan Patil", taluka: "Kankavli", condition: "Excellent", price: "₹65,000", rating: "4.9", image: productImage },
  { name: "Hero Sprint Bicycle", seller: "Neha Naik", taluka: "Vengurla", condition: "Good", price: "₹6,500", rating: "4.7", image: altProductImage },
  { name: "The Alchemist", seller: "Paulo Coelho", taluka: "Sawantwadi", condition: "Swap Only", price: "Swap Only", rating: "4.8", image: productImage },
  { name: "iPhone 13", seller: "Amit Sawant", taluka: "Malvan", condition: "Like New", price: "₹38,000", rating: "4.8", image: heroImage },
  { name: "3 Seater Sofa", seller: "Priya More", taluka: "Kudal", condition: "Good", price: "₹12,000", rating: "4.6", image: altProductImage },
  { name: "Canon EOS 200D", seller: "Sahil Gaonkar", taluka: "Sawantwadi", condition: "Excellent", price: "₹28,000", rating: "4.9", image: profileImage },
  { name: "Study Table", seller: "Maya Patil", taluka: "Kankavli", condition: "Like New", price: "₹2,800", rating: "4.5", image: heroImage },
  { name: "Atomic Habits", seller: "James Clear", taluka: "Vengurla", condition: "Swap Only", price: "Swap Only", rating: "4.9", image: productImage },
];

const recommended = wishlistItems.slice(0, 4);

function Wishlist() {
  const hasItems = wishlistItems.length > 0;

  return (
    <PageShell>
      <section className="wishlist-hero container">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <span className="eyebrow"><FiHeart /> Wishlist</span>
          <h1>Items you love and want to buy or swap</h1>
          <p>Save products, compare options, and return to your favorite SindhuSwap finds whenever you are ready.</p>
        </motion.div>
        <motion.img src={heroImage} alt="Wishlist illustration placeholder" animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity }} />
      </section>

      {hasItems ? (
        <section className="section container">
          <div className="section-header">
            <div>
              <h2>My Wishlist</h2>
              <span className="book-count">{wishlistItems.length} Items</span>
            </div>
            <button className="share-button" type="button"><FiHeart /> Share Wishlist</button>
          </div>
          <div className="wishlist-grid">
            {wishlistItems.map((item) => <WishlistCard item={item} key={item.name} />)}
          </div>
        </section>
      ) : (
        <EmptyState />
      )}

      <section className="section container">
        <div className="section-header"><h2>Recommended Products</h2></div>
        <div className="wishlist-grid wishlist-grid--compact">
          {recommended.map((item) => <WishlistCard item={item} key={`recommended-${item.name}`} />)}
        </div>
      </section>
    </PageShell>
  );
}

function WishlistCard({ item }) {
  return (
    <motion.article className="wishlist-card" whileHover={{ y: -8 }}>
      <div className="wishlist-card__image">
        <img src={item.image} alt={item.name} />
        <button aria-label={`Remove ${item.name}`}><FiHeart /></button>
      </div>
      <div className="wishlist-card__body">
        <h3>{item.name}</h3>
        <p>{item.seller}</p>
        <div className="wishlist-card__meta">
          <span><FiMapPin /> {item.taluka}</span>
          <span><FiStar /> {item.rating}</span>
        </div>
        <small>{item.condition}</small>
        <strong>{item.price}</strong>
        <div className="wishlist-card__actions">
          <a href="/product/1"><FiEye /> View Details</a>
          <button type="button"><FiTrash2 /> Remove</button>
        </div>
      </div>
    </motion.article>
  );
}

function EmptyState() {
  return (
    <section className="empty-state container">
      <img src={heroImage} alt="Empty wishlist illustration placeholder" />
      <h2>Your Wishlist is Empty</h2>
      <p>Start browsing products and books to save items you want to revisit later.</p>
      <a className="btn btn--primary" href="/categories"><FiShoppingBag /> Browse Products</a>
    </section>
  );
}

export default Wishlist;
