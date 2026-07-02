import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { wishlistApi } from "../api/wishlistApi";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      return;
    }
    try {
      setIsLoading(true);
      const res = await wishlistApi.list();
      setWishlist(res.data?.items || []);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (product) => {
    if (!user) {
      toast.info("Please login to add to wishlist");
      return false;
    }
    try {
      const productId = product.id || product._id;
      await wishlistApi.add(productId);
      
      await fetchWishlist();
      toast.success("Added to wishlist!");
      return true;
    } catch (error) {
      toast.error("Failed to add to wishlist");
      return false;
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return false;
    try {
      await wishlistApi.remove(productId);
      
      setWishlist(prev => prev.filter(item => {
        const id = item.product?._id || item.product?.id || item.id || item.wishlistId;
        return id !== productId && item.id !== productId;
      }));
      toast.success("Removed from wishlist");
      return true;
    } catch (error) {
      toast.error("Failed to remove from wishlist");
      return false;
    }
  };

  const isInWishlist = (productId) => {
    if (!user || !productId) return false;
    return wishlist.some(item => {
      const id = item.product?._id || item.product?.id || item.id || item.wishlistId;
      return id === productId;
    });
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isLoading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
