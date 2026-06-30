import { FiHeart, FiMapPin, FiStar } from "react-icons/fi";
import { motion } from "framer-motion";

function ProductCard({ item }) {
  return (
    <motion.article
      className="product-card"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.24 }}
    >
      <div className="product-card__image">
        <img src={item.image} alt={item.name} />
        <button aria-label={`Save ${item.name}`}>
          <FiHeart />
        </button>
      </div>
      <div className="product-card__body">
        <div>
          <h3>{item.name}</h3>
          <span className="product-card__price">{item.price}</span>
        </div>
        <p>{item.condition} • {item.seller}</p>
        <div className="product-card__meta">
          <span>
            <FiMapPin /> {item.location}
          </span>
          <span>
            <FiStar /> {item.rating}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export default ProductCard;
