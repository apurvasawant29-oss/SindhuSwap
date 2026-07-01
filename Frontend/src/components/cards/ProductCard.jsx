import { motion } from "framer-motion";
import { FiHeart, FiStar, FiMapPin, FiEye } from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";

function ProductCard({ item }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setWishlisted((prev) => {
      const next = !prev;
      toast(next ? "Wishlist Added" : "Product Removed");
      return next;
    });
  };

  const renderStars = (rating = 0) => {
    const fullStars = Math.floor(rating);
    return Array.from({ length: 5 }).map((_, index) => (
      <FiStar
        key={index}
        className={`h-3.5 w-3.5 ${
          index < fullStars ? "fill-[#D4A017] text-[#D4A017]" : "text-[#E9DFCC]"
        }`}
      />
    ));
  };

  // Dummy fallback image for testing when item.image is missing/broken
  const dummyImage = `https://picsum.photos/seed/${item.id || item.name}/420/320`;
  const imageSrc = item.image || dummyImage;
  const isSwap = item.status === "Swap" || item.price === undefined;

  return (
    <motion.article
      className="group relative overflow-hidden rounded-[18px] bg-white ring-1 ring-[#E9DFCC] transition-all duration-300"
      style={{ boxShadow: "0 1px 3px rgba(43,36,32,0.06)" }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Link to={`/product/${item.id}`} className="block">
        {/* Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EFE6D3]">
          {!imgLoaded && (
            <div className="absolute inset-0 animate-pulse bg-[#EFE6D3]" />
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
            className={`h-full w-full object-cover transition-opacity duration-500 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
            whileHover={{ scale: 1.07 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />

          {/* Bottom gradient, only visible on hover */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Wishlist button */}
          <button
            type="button"
            onClick={handleWishlist}
            aria-label="Add to wishlist"
            className={`absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full backdrop-blur transition-colors duration-200 ${
              wishlisted
                ? "bg-[#C1502E] text-white"
                : "bg-white/95 text-[#8a7a5c] hover:text-[#C1502E]"
            }`}
          >
            <FiHeart className={wishlisted ? "fill-white" : ""} />
          </button>

          {/* Featured / Swap badge */}
          {item.featured && !isSwap && (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-[#0F6E56] px-2.5 py-1 text-[10px] font-medium tracking-wide text-white shadow-sm">
              Featured
            </span>
          )}
          {isSwap && (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-[#D4A017] px-2.5 py-1 text-[10px] font-medium tracking-wide text-white shadow-sm">
              Swap only
            </span>
          )}

          {/* Posted time, revealed on hover */}
          {item.postedAt && (
            <span className="absolute bottom-2.5 left-2.5 rounded-md bg-black/45 px-2 py-0.5 text-[10px] font-medium text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
              {item.postedAt}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2 p-3.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="rounded-full bg-[#C1502E]/10 px-2 py-0.5 font-medium text-[#8f3a1f]">
              {item.category}
            </span>
            <span className="flex items-center gap-1 font-medium text-[#0F6E56]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0F6E56]" />
              {item.status || "Available"}
            </span>
          </div>

          <h3 className="line-clamp-1 text-[15px] font-semibold leading-snug text-[#2b2420]">
            {item.name}
          </h3>

          <div className="flex items-center gap-1 text-[11px] text-[#9c8f76]">
            <FiMapPin className="h-3 w-3" />
            {item.location || item.taluka}
            {item.distance && <span>&nbsp;· {item.distance} away</span>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5 text-[#D4A017] text-xs">
              {renderStars(item.rating)}
              <small className="ml-1 text-[10px] text-[#9c8f76]">
                {item.rating}
                {item.reviewCount ? ` (${item.reviewCount})` : ""}
              </small>
            </div>
            {item.condition && (
              <span className="rounded bg-[#EFE6D3] px-1.5 py-0.5 text-[10px] font-medium text-[#6b5f4a]">
                {item.condition}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-[#EFE6D3] pt-2.5">
            <div>
              {isSwap ? (
                <strong className="text-[17px] font-bold text-[#0F6E56]">Swap</strong>
              ) : (
                <>
                  <strong className="text-[17px] font-bold text-[#2b2420]">
                    Rs. {item.price}
                  </strong>
                  {item.negotiable && (
                    <span className="ml-1 text-[10px] text-[#9c8f76]">negotiable</span>
                  )}
                </>
              )}
            </div>
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1 rounded-full bg-[#2b2420] px-3 py-1.5 text-[11px] font-medium text-white transition-colors duration-200 group-hover:bg-[#C1502E]"
            >
              View <FiEye className="h-3.5 w-3.5" />
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default ProductCard;