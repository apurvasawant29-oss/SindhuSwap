const stripApiSuffix = (url) => url.replace(/\/api\/v1\/?$/, "").replace(/\/$/, "");

export const API_ORIGIN = stripApiSuffix(
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"
);

const resolvePath = (value) => {
  if (!value || typeof value !== "string") {
    return "";
  }

  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("blob:")) {
    return value;
  }

  if (value.startsWith("/")) {
    return `${API_ORIGIN}${value}`;
  }

  return value;
};

export const getProductImageSrc = (productOrImage) => {
  if (!productOrImage) {
    return "";
  }

  if (typeof productOrImage === "string") {
    return resolvePath(productOrImage);
  }

  const candidate = productOrImage.image ?? productOrImage.images?.[0];
  if (!candidate) {
    return "";
  }

  if (typeof candidate === "string") {
    return resolvePath(candidate);
  }

  return resolvePath(candidate.url || "");
};

export const getProductGallery = (product) => {
  if (!product) {
    return [];
  }

  const rawImages = Array.isArray(product.images) && product.images.length
    ? product.images
    : [product.image].filter(Boolean);

  return rawImages
    .map((entry) => {
      if (typeof entry === "string") {
        return resolvePath(entry);
      }
      return resolvePath(entry?.url || "");
    })
    .filter(Boolean);
};
