import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiEye, FiHeart, FiMapPin, FiShoppingBag, FiStar, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import PageShell from "../../components/common/PageShell";
import { wishlistApi } from "../../api/wishlistApi";
import heroImage from "../../assets/images/community.jpg";
import productImage from "../../assets/images/book-cover.jpg";

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWishlist = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await wishlistApi.list();
      setWishlistItems(response.data.items || []);
    } catch (err) {
      setError(err.message || "Unable to load wishlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const removeItem = async (productId) => {
    try {
      await wishlistApi.remove(productId);
      toast.info("Removed from Wishlist");
      window.dispatchEvent(new Event("wishlist:changed"));
      loadWishlist();
    } catch (err) {
      toast.error(err.message || "Unable to remove item.");
    }
  };

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

      {loading && (
        <section className="section container">
          <p className="text-sm text-slate-500 font-semibold">Loading wishlist...</p>
        </section>
      )}

      {!loading && error && (
        <section className="empty-state container">
          <h2>Wishlist unavailable</h2>
          <p>{error}</p>
          <button className="btn btn--primary" type="button" onClick={loadWishlist}>Try Again</button>
        </section>
      )}

      {!loading && !error && hasItems ? (
        <section className="section container">
          <div className="section-header">
            <div>
              <h2>My Wishlist</h2>
              <span className="book-count">{wishlistItems.length} Items</span>
            </div>
            <button className="share-button" type="button"><FiHeart /> Share Wishlist</button>
          </div>
          <div className="wishlist-grid">
            {wishlistItems.map((item) => <WishlistCard item={item} onRemove={removeItem} key={item.id || item.product?.id} />)}
          </div>
        </section>
      ) : null}

      {!loading && !error && !hasItems && <EmptyState />}
    </PageShell>
  );
}

function WishlistCard({ item, onRemove }) {
  const product = item.product || item;
  return (
    <motion.article className="wishlist-card" whileHover={{ y: -8 }}>
      <div className="wishlist-card__image">
        <img src={product.image || productImage} alt={product.name} />
        <button aria-label={`Remove ${product.name}`} onClick={() => onRemove(product.id)}><FiHeart /></button>
      </div>
      <div className="wishlist-card__body">
        <h3>{product.name}</h3>
        <p>{product.seller}</p>
        <div className="wishlist-card__meta">
          <span><FiMapPin /> {product.taluka}</span>
          <span><FiStar /> {product.rating || 4.5}</span>
        </div>
        <small>{product.condition}</small>
        <strong>{product.productType === "Swap" ? "Swap Only" : `Rs. ${Number(product.price || 0).toLocaleString("en-IN")}`}</strong>
        <div className="wishlist-card__actions">
          <a href={`/product/${product.id}`}><FiEye /> View Details</a>
          <button type="button" onClick={() => onRemove(product.id)}><FiTrash2 /> Remove</button>
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
