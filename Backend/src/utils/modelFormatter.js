const API_HOST = () => process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`;

const imageUrl = (image) => {
  if (!image) {
    return "";
  }

  if (typeof image === "string") {
    return image;
  }

  if (image.url?.startsWith("http")) {
    return image.url;
  }

  return image.url ? `${API_HOST()}${image.url}` : "";
};

const formatUser = (user) => {
  if (!user) {
    return null;
  }

  const source = user.toObject ? user.toObject() : user;
  return {
    id: source._id?.toString() || source.id,
    name: source.fullName || source.name || "SindhuSwap User",
    fullName: source.fullName || source.name || "SindhuSwap User",
    email: source.email,
    phone: source.phone || "",
    role: source.role === "ADMIN" ? "Admin" : "User",
    status:
      source.status === "BLOCKED"
        ? "Banned"
        : source.status === "INACTIVE"
          ? "Suspended"
          : "Active",
    taluka: source.taluka || "",
    avatar: source.avatar || (source.fullName || source.email || "S").charAt(0).toUpperCase(),
    profileImage: source.avatar || "",
    joinedDate: source.createdAt ? new Date(source.createdAt).toISOString().slice(0, 10) : "",
    rating: 4.8,
  };
};

const formatProduct = (product) => {
  if (!product) {
    return null;
  }

  const source = product.toObject ? product.toObject() : product;
  const owner = source.owner || {};
  const firstImage = source.images?.[0];

  return {
    id: source._id?.toString() || source.id,
    _id: source._id?.toString() || source.id,
    name: source.title,
    title: source.title,
    description: source.description,
    category: source.category,
    condition: source.condition,
    taluka: source.taluka,
    location: source.taluka,
    district: source.district,
    address: source.address,
    productType: source.productType,
    exchangePreference: source.exchangePreference,
    price: source.price || 0,
    status: source.status,
    seller: owner.fullName || owner.name || "SindhuSwap Seller",
    sellerId: owner._id?.toString() || owner.id || source.owner?.toString(),
    sellerInfo: formatUser(owner),
    image: imageUrl(firstImage),
    images: (source.images || []).map(imageUrl).filter(Boolean),
    rating: source.rating || 4.5,
    views: source.views || 0,
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
  };
};

module.exports = {
  formatProduct,
  formatUser,
};
