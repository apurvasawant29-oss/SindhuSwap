import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../cards/ProductCard";

// Slide transition variants with direction parameters
const variants = {
  enter: (dir) => ({
    x: dir > 0 ? "30%" : "-30%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir) => ({
    x: dir < 0 ? "30%" : "-30%",
    opacity: 0,
  }),
};

export default function ProductCarousel({
  items,
  page,
  setPage,
  visibleCards,
  maxPages,
  direction,
}) {
  // Page size matches columns count x 2 rows
  const pageSize = visibleCards * 2;
  const startIdx = page * pageSize;
  const endIdx = startIdx + pageSize;

  // Compute sliced products on the current page with dynamic layout-height padding
  const currentPageProducts = useMemo(() => {
    const currentItems = items.slice(startIdx, endIdx);
    
    // Pad with placeholders to prevent page height jumping
    if (currentItems.length > 0 && currentItems.length < pageSize) {
      const padCount = pageSize - currentItems.length;
      for (let i = 0; i < padCount; i++) {
        currentItems.push({
          id: `placeholder-${i}`,
          isPlaceholder: true,
        });
      }
    }
    return currentItems;
  }, [items, startIdx, endIdx, pageSize]);

  // Handle mobile and desktop swipe gestures
  const handleDragEnd = (event, info) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold && page < maxPages - 1) {
      setPage(page + 1, 1);
    } else if (info.offset.x > swipeThreshold && page > 0) {
      setPage(page - 1, -1);
    }
  };

  // Set the dynamic columns Tailwind class
  const gridColsClass = visibleCards === 4
    ? "grid-cols-4"
    : visibleCards === 3
      ? "grid-cols-3"
      : "grid-cols-1";

  return (
    <div className="relative w-full overflow-hidden py-6 -my-6">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 350, damping: 32 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.4}
          onDragEnd={handleDragEnd}
          className={`grid ${gridColsClass} gap-x-8 gap-y-6 w-full mx-auto px-4 md:px-6 lg:px-8 max-w-7xl cursor-grab active:cursor-grabbing will-change-transform`}
        >
          {currentPageProducts.map((item) => {
            if (item.isPlaceholder) {
              return (
                <div
                  key={item.id}
                  className="min-h-[420px] opacity-0 pointer-events-none select-none"
                  aria-hidden="true"
                />
              );
            }
            return <ProductCard key={item.id} item={item} />;
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
