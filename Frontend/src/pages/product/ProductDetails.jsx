import { motion } from "framer-motion";
import { FiHeart, FiMapPin, FiMessageCircle, FiRefreshCw, FiShield, FiShoppingBag, FiStar } from "react-icons/fi";
import PageShell from "../../components/common/PageShell";
import productImage from "../../assets/images/book-cover.jpg";
import altImage from "../../assets/images/community.jpg";
import sellerImage from "../../assets/images/team-member.jpg";

const similarProducts = [
  { name: "Atomic Habits", price: "Swap Only", image: productImage },
  { name: "Study Table", price: "₹2,800", image: altImage },
  { name: "Dell Laptop", price: "₹22,000", image: productImage },
];

function ProductDetails() {
  return (
    <PageShell>
      <section className="product-detail container">
        <div className="product-gallery">
          <motion.img className="product-gallery__main" src={productImage} alt="Let Us C Programming" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} />
          <div className="product-thumbs">
            {[productImage, altImage, sellerImage, productImage].map((image, index) => (
              <img src={image} alt="" key={`${image}-${index}`} />
            ))}
          </div>
        </div>

        <motion.aside className="product-info-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="eyebrow">Books</span>
          <h1>Let Us C Programming</h1>
          <p className="product-price">Swap Only</p>
          <div className="product-tags">
            <span><FiMapPin /> Kudal</span>
            <span>Good Condition</span>
            <span><FiStar /> 4.8 Rating</span>
          </div>
          <p>
            A clean, readable programming book for students. Perfect for diploma
            and beginner C language practice. Books on SindhuSwap are available
            only through swaps.
          </p>
          <div className="product-actions-main">
            <a className="btn btn--primary" href="/bookswap"><FiRefreshCw /> Request Book Swap</a>
            <button className="btn btn--light btn--border" type="button"><FiHeart /> Save</button>
          </div>

          <div className="seller-card">
            <img src={sellerImage} alt="Seller Apurva Patil" />
            <div>
              <strong>Apurva Patil</strong>
              <span>Verified seller • Sawantwadi</span>
              <small><FiShield /> Trusted community member</small>
            </div>
            <button type="button"><FiMessageCircle /> Chat</button>
          </div>
        </motion.aside>
      </section>

      <section className="section container">
        <div className="section-header"><h2>Similar Products</h2></div>
        <div className="similar-grid">
          {similarProducts.map((item) => (
            <motion.article className="similar-card" whileHover={{ y: -7 }} key={item.name}>
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <strong>{item.price}</strong>
              <a href="/product/1"><FiShoppingBag /> View Details</a>
            </motion.article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

export default ProductDetails;
