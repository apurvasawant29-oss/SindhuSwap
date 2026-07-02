import { motion } from "framer-motion";
import { FiHeart, FiStar, FiMapPin, FiMessageCircle, FiEye } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";

function ProductCard({ item }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const navigate = useNavigate();
  const { isUserAuthenticated } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const productId = item.id || item._id;
  const wishlisted = isInWishlist(productId);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isUserAuthenticated) {
      toast.info("Please login to use wishlist.");
      navigate("/login");
      return;
    }

    if (wishlisted) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(item);
    }
  };

  const handleChatClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success(`Opening chat with ${item.seller}`);
    navigate(`/messages?seller=${encodeURIComponent(item.seller)}`);
  };

  const renderStars = (rating = 0) => {
    const fullStars = Math.floor(rating);
    return Array.from({ length: 5 }).map((_, index) => (
      <FiStar
        key={index}
        className={`h-3 w-3 ${
          index < fullStars ? "fill-amber-500 text-amber-500" : "text-slate-200"
        }`}
      />
    ));
  };

  const dummyImage = `https://picsum.photos/seed/${item.id || item.name}/420/320`;
  const imageSrc = item.image 
    ? (item.image.startsWith("http") || item.image.includes(".png") || item.image.includes(".jpg")
        ? (item.image.includes("/") ? item.image : `/src/assets/${item.image}`) 
        : dummyImage)
    : dummyImage;
  const isSwap = item.status === "Swap" || item.productType === "Swap" || item.price === undefined;

  return (
    <motion.article
      className="group relative flex flex-col h-full overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_20px_rgba(15,23,42,0.02)] hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)] transition-all duration-300 ease-out"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Link to={`/product/${item.id || item._id}`} className="flex flex-col h-full">
        {/* Image Section */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
          {!imgLoaded && (
            <div className="absolute inset-0 animate-pulse bg-slate-100/80" />
          )}

          <motion.img
            src={imageSrc}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = dummyImage;
            }}
            alt={item.name}
            onLoad={() => setImgLoaded(true)}
            loading="lazy"
            className={`h-full w-full object-cover transition-all duration-500 ${
              imgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.4 }}
          />

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-slate-900/0 to-slate-900/10 opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

          {/* Favorite button */}
          <button
            type="button"
            onClick={handleWishlist}
            aria-label="Add to wishlist"
            className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all duration-200 active:scale-90 ${
              wishlisted
                ? "bg-rose-500 text-white"
                : "bg-white/90 text-slate-500 hover:text-rose-500 hover:bg-white"
            }`}
          >
            <FiHeart className={`h-4.5 w-4.5 ${wishlisted ? "fill-white" : ""}`} />
          </button>

          {/* Category Badge */}
          <span className="absolute left-3 top-3 rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-700 shadow-sm">
            {item.category}
          </span>

          {/* Status Badge */}
          <span className={`absolute left-3 bottom-3 rounded-md px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm backdrop-blur-sm ${
            isSwap ? "bg-amber-500/90" : "bg-teal-600/90"
          }`}>
            {item.status || "Available"}
          </span>
        </div>

        {/* Card Body */}
        <div className="flex flex-col flex-1 p-4">
          
          {/* Seller profile bar */}
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6.5 h-6.5 rounded-full bg-gradient-to-br from-teal-600 to-amber-400 text-white flex items-center justify-center text-[10px] font-extrabold shadow-sm">
                {(item.seller || "S").charAt(0).toUpperCase()}
              </div>
              <span className="text-[11px] font-bold text-slate-700 truncate max-w-[80px]">
                {item.seller || "Seller"}
              </span>
            </div>
            
            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
              <FiMapPin className="h-3 w-3 text-teal-600" />
              <span>{item.location || "Sindhudurg"}</span>
            </div>
          </div>

          {/* Title & Rating */}
          <div className="space-y-1 mb-2.5">
            <h3 className="line-clamp-1 text-sm font-bold text-slate-800 group-hover:text-teal-700 transition-colors leading-tight">
              {item.name}
            </h3>

            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <div className="flex items-center gap-0.5">
                {renderStars(item.rating)}
              </div>
              <span>({item.rating || "4.5"})</span>
              {item.condition && (
                <>
                  <span>·</span>
                  <span className="text-[10px] text-teal-600 font-semibold uppercase">{item.condition}</span>
                </>
              )}
            </div>
          </div>

          {/* Footer & Actions */}
          <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
            {/* Price */}
            <div>
              {isSwap ? (
                <div className="flex items-center gap-1">
                  <span className="text-sm font-extrabold text-amber-600">Swap</span>
                  <span className="text-[10px] text-slate-400 font-medium">Item</span>
                </div>
              ) : (
                <div className="flex flex-col">
                  <span className="text-sm font-extrabold text-slate-900 leading-none">
                    Rs. {item.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Negotiable</span>
                </div>
              )}
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleChatClick}
                className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-600 transition-colors duration-200"
                title={`Chat with ${item.seller}`}
              >
                <FiMessageCircle className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="flex items-center gap-1 rounded-lg bg-slate-900 hover:bg-teal-600 text-white px-2.5 py-1 text-[11px] font-bold transition-all duration-300"
              >
                <span>View</span>
                <FiEye className="h-3 w-3" />
              </button>
            </div>
          </div>

        </div>
      </Link>
    </motion.article>
  );
}

export default ProductCard;
