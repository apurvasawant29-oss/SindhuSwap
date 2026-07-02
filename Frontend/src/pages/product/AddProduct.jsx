import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiCheck,
  FiEye,
  FiHeart,
  FiImage,
  FiInbox,
  FiMapPin,
  FiPlus,
  FiRefreshCw,
  FiSettings,
  FiShoppingBag,
  FiTag,
  FiUploadCloud,
  FiUser,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PageShell from "../../components/common/PageShell";
import profileImage from "../../assets/images/team-member.jpg";
import communityImage from "../../assets/images/community.jpg";
import { productApi } from "../../api/productApi";
import { adminApi } from "../../api/adminApi";
import { useAuth } from "../../context/AuthContext";

const sidebarLinks = [
  ["My Profile", FiUser],
  ["Edit Profile", FiUser],
  ["My Listings", FiShoppingBag],
  ["Add Product", FiPlus],
  ["My Purchases", FiShoppingBag],
  ["Book Swaps", FiRefreshCw],
  ["Wishlist", FiHeart],
  ["Inbox", FiInbox],
  ["Settings", FiSettings],
];

const defaultForm = {
  title: "",
  description: "",
  category: "Books",
  condition: "Good",
  productType: "Swap",
  price: "",
  taluka: "",
  address: "",
  exchangePreference: "",
};

function AddProduct() {
  const [form, setForm] = useState(defaultForm);
  const [categories, setCategories] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await adminApi.categories();
        setCategories((response.data.categories || []).map((category) => category.name || category));
      } catch {
        setCategories(["Books", "Electronics", "Furniture", "Mobiles", "Fashion", "Sports", "Vehicles", "Others"]);
      }
    };

    loadCategories();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files.slice(0, 6));
  };

  const previewSummary = useMemo(() => ({
    title: form.title || "Product Title",
    category: form.category || "Category",
    price: form.price ? `Rs. ${Number(form.price).toLocaleString("en-IN")}` : form.productType === "Swap" ? "Swap Only" : "Rs. 0",
    condition: form.condition || "Like New",
    location: form.taluka || "Your Taluka",
  }), [form]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("description", form.description);
      payload.append("category", form.category);
      payload.append("condition", form.condition);
      payload.append("productType", form.productType);
      payload.append("price", form.price || "0");
      payload.append("taluka", form.taluka);
      payload.append("address", form.address);
      payload.append("exchangePreference", form.exchangePreference);
      selectedFiles.forEach((file) => payload.append("images", file));

      await productApi.create(payload);
      toast.success("Product listed successfully.");
      navigate("/my-products");
    } catch (error) {
      toast.error(error.message || "Unable to create product.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(defaultForm);
    setSelectedFiles([]);
  };

  return (
    <PageShell>
      <section className="add-product-layout">
        <aside className="seller-sidebar">
          <img src={user?.profileImage || user?.avatar || profileImage} alt={user?.name || "Seller"} />
          <h3>{user?.name || user?.fullName || "Seller"}</h3>
          <p>{user?.taluka || "Sindhudurg"}</p>
          <span>Verified Member</span>
          <nav>
            {sidebarLinks.map(([label, Icon]) => (
              <a className={label === "Add Product" ? "is-active" : ""} href="/" key={label}>
                <Icon /> {label}
              </a>
            ))}
          </nav>
          <div className="seller-sidebar__promo">
            <img src={communityImage} alt="Book swap community" />
            <strong>Swap more, save more!</strong>
            <p>List items and start exchanging with your community.</p>
            <a className="btn btn--primary" href="/bookswap">Explore Now <FiArrowRight /></a>
          </div>
        </aside>

        <main className="add-product-main">
          <div className="breadcrumb">Home <span>›</span> My Listings <span>›</span> Add Product</div>
          <h1>Add New Product</h1>
          <p>Fill in the details below to list your item and reach the right people.</p>

          <div className="add-product-grid">
            <motion.form className="product-form-panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit}>
              <h2><FiTag /> Product Details</h2>
              <div className="form-row">
                <FormField label="Product Title *" name="title" value={form.title} onChange={handleChange} placeholder="Enter product title" />
                <FormSelect label="Category *" name="category" value={form.category} onChange={handleChange} options={categories.length ? categories : ["Books", "Electronics", "Furniture", "Mobiles"]} />
              </div>
              <label className="form-field form-field--full">
                <span>Description *</span>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe your product, its condition, features, etc." />
              </label>
              <div className="form-row form-row--thirds">
                <FormSelect label="Condition *" name="condition" value={form.condition} onChange={handleChange} options={["Like New", "Good", "Excellent", "Fair"]} />
                <div className="form-field">
                  <span>Product Type *</span>
                  <div className="price-toggle">
                    <button className={form.productType === "Sale" ? "is-active" : ""} type="button" onClick={() => setForm((current) => ({ ...current, productType: "Sale" }))}><FiTag /> For Sale</button>
                    <button className={form.productType === "Swap" ? "is-active" : ""} type="button" onClick={() => setForm((current) => ({ ...current, productType: "Swap" }))}><FiRefreshCw /> For Swap</button>
                  </div>
                </div>
                <FormField label="Price (₹)" name="price" value={form.price} onChange={handleChange} placeholder="Enter price" suffix="₹" />
              </div>
              <div className="form-row">
                <FormField label="Location (Taluka) *" name="taluka" value={form.taluka} onChange={handleChange} placeholder="e.g. Sawantwadi" />
                <FormField label="Address" name="address" value={form.address} onChange={handleChange} placeholder="Enter address" />
              </div>
              <FormField label="Exchange Preference" name="exchangePreference" value={form.exchangePreference} onChange={handleChange} placeholder="e.g. Exchange for books" />

              <div className="upload-section">
                <h3>Upload Images *</h3>
                <p>Add clear images of your product (Max 6 images)</p>
                <div className="upload-grid">
                  <label className="upload-tile upload-tile--main" htmlFor="product-images">
                    <FiUploadCloud />
                    <strong>Upload Images</strong>
                    <span>Click to upload PNG, JPG up to 5MB</span>
                  </label>
                  <input id="product-images" type="file" accept="image/*" multiple onChange={handleFileChange} hidden />
                  {selectedFiles.length > 0 ? selectedFiles.map((file) => <div className="upload-tile" key={file.name}><FiImage /> {file.name}</div>) : [1, 2, 3, 4, 5].map((item) => <div className="upload-tile" key={item}><FiImage /></div>)}
                </div>
              </div>

              <div className="form-actions">
                <button className="btn btn--light btn--border" type="button" onClick={resetForm}>Clear All</button>
                <button className="btn btn--primary" type="submit" disabled={loading}>{loading ? "Listing..." : "List Product"} <FiArrowRight /></button>
              </div>
            </motion.form>

            <aside className="preview-column">
              <div className="live-preview">
                <h2><FiEye /> Live Preview</h2>
                <p>See how your product will appear to others.</p>
                <article className="preview-card">
                  <div className="preview-card__image"><FiImage /><button><FiHeart /></button></div>
                  <div>
                    <span>{form.productType === "Swap" ? "For Swap" : "For Sale"}</span>
                    <h3>{previewSummary.title}</h3>
                    <p>{previewSummary.category}</p>
                    <strong>{previewSummary.price}</strong>
                    <small><FiMapPin /> {previewSummary.location}</small>
                    <em>{previewSummary.condition}</em>
                  </div>
                </article>
              </div>
              <div className="tips-card">
                <h3>Tips for a great listing</h3>
                {["Use clear, well-lit photos", "Write a detailed description", "Choose the right category", "Set a fair price", "Respond to chats quickly"].map((tip) => (
                  <span key={tip}><FiCheck /> {tip}</span>
                ))}
              </div>
            </aside>
          </div>
        </main>
      </section>
    </PageShell>
  );
}

function FormField({ label, name, value, onChange, placeholder, suffix }) {
  return (
    <label className="form-field">
      <span>{label}</span>
      <div>
        <input name={name} value={value} onChange={onChange} placeholder={placeholder} />
        {suffix && <b>{suffix}</b>}
      </div>
    </label>
  );
}

function FormSelect({ label, name, value, onChange, options }) {
  return (
    <label className="form-field">
      <span>{label}</span>
      <select name={name} value={value} onChange={onChange}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

export default AddProduct;
