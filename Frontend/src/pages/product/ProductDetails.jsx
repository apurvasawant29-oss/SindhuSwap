import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FiHeart, FiMapPin, FiMessageCircle, FiRefreshCw, FiShield, FiShoppingBag, FiStar } from "react-icons/fi";
import PageShell from "../../components/common/PageShell";
import ProductCard from "../../components/cards/ProductCard";
import { productApi } from "../../api/productApi";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import productImage from "../../assets/images/book-cover.jpg";
import sellerImage from "../../assets/images/team-member.jpg";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isUserAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await productApi.details(id);
        const nextProduct = response.data.product;
        setProduct(nextProduct);
        setSelectedImage(nextProduct.images?.[0] || nextProduct.image || productImage);

        const similarResponse = await productApi.list({
          category: nextProduct.category,
          limit: 4,
          status: "Available",
        });
        setSimilarProducts(
          (similarResponse.data.products || []).filter((item) => item.id !== nextProduct.id).slice(0, 3)
        );
      } catch (err) {
        setError(err.message || "Unable to load product details.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const gallery = useMemo(() => {
    const images = product?.images?.length ? product.images : [product?.image || productImage];
    return images.filter(Boolean);
  }, [product]);

  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const handleWishlist = async () => {
    if (!isUserAuthenticated) {
      toast.info("Please login to save products.");
      navigate("/login");
      return;
    }

    if (isInWishlist(product.id || product._id)) {
      await removeFromWishlist(product.id || product._id);
    } else {
      await addToWishlist(product);
    }
  };

  const handleSwap = async () => {
    if (!isUserAuthenticated) {
      toast.info("Please login to request an exchange.");
      navigate("/login");
      return;
    }

    try {
      await productApi.requestSwap(product.id, { message: "I am interested in this product." });
      toast.success("Swap request submitted.");
    } catch (err) {
      toast.error(err.message || "Unable to submit swap request.");
    }
  };

  if (loading) {
    return (
      <PageShell>
        <section className="section container"><p className="text-sm text-slate-500 font-semibold">Loading product details...</p></section>
      </PageShell>
    );
  }

  if (error || !product) {
    return (
      <PageShell>
        <section className="empty-state container">
          <h2>Product not found</h2>
          <p>{error || "This listing is unavailable."}</p>
          <a className="btn btn--primary" href="/categories">Browse Products</a>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="product-detail container">
        <div className="product-gallery">
          <motion.img className="product-gallery__main" src={selectedImage || productImage} alt={product.name} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} />
          <div className="product-thumbs">
            {gallery.map((image, index) => (
              <img src={image} alt={`${product.name} ${index + 1}`} key={`${image}-${index}`} onClick={() => setSelectedImage(image)} />
            ))}
          </div>
        </div>

        <motion.aside className="product-info-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="eyebrow">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="product-price">{product.productType === "Swap" ? "Swap Only" : `Rs. ${Number(product.price || 0).toLocaleString("en-IN")}`}</p>
          <div className="product-tags">
            <span><FiMapPin /> {product.taluka}</span>
            <span>{product.condition} Condition</span>
            <span><FiStar /> {product.rating || 4.5} Rating</span>
          </div>
          <p>{product.description}</p>
          {product.exchangePreference && <p><strong>Exchange Preference:</strong> {product.exchangePreference}</p>}
          <div className="product-actions-main">
            <button className="btn btn--primary" type="button" onClick={handleSwap}><FiRefreshCw /> Request Exchange</button>
            <button 
              className={`btn btn--border ${isInWishlist(product.id || product._id) ? 'btn--primary bg-teal-50 text-teal-700 border-teal-200' : 'btn--light'}`} 
              type="button" 
              onClick={handleWishlist}
            >
              <FiHeart className={isInWishlist(product.id || product._id) ? "fill-current" : ""} /> 
              {isInWishlist(product.id || product._id) ? "Saved" : "Save"}
            </button>
          </div>

          <div className="seller-card">
            <img src={product.sellerInfo?.profileImage || sellerImage} alt={product.seller} />
            <div>
              <strong>{product.seller}</strong>
              <span>Verified seller - {product.sellerInfo?.taluka || product.taluka}</span>
              <small><FiShield /> Trusted community member</small>
            </div>
            <button type="button"><FiMessageCircle /> Chat</button>
          </div>
        </motion.aside>
      </section>

      <section className="section container">
        <div className="section-header"><h2>Similar Products</h2></div>
        {similarProducts.length ? (
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProducts.map((item) => <ProductCard key={item.id} item={item} />)}
          </div>
        ) : (
          <div className="similar-grid">
            <motion.article className="similar-card" whileHover={{ y: -7 }}>
              <img src={product.image || productImage} alt={product.name} />
              <h3>{product.name}</h3>
              <strong>{product.productType === "Swap" ? "Swap Only" : `Rs. ${Number(product.price || 0).toLocaleString("en-IN")}`}</strong>
              <a href="/categories"><FiShoppingBag /> Browse More</a>
            </motion.article>
          </div>
        )}
      </section>
    </PageShell>
  );
}

export default ProductDetails;
