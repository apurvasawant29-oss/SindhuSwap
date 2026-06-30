import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiBookOpen,
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
import PageShell from "../../components/common/PageShell";
import profileImage from "../../assets/images/team-member.jpg";
import communityImage from "../../assets/images/community.jpg";

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

function AddProduct() {
  return (
    <PageShell>
      <section className="add-product-layout">
        <aside className="seller-sidebar">
          <img src={profileImage} alt="Apurva Patil" />
          <h3>Apurva Patil</h3>
          <p>Sawantwadi, Sindhudurg</p>
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
            <motion.form className="product-form-panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
              <h2><FiTag /> Product Details</h2>
              <div className="form-row">
                <FormField label="Product Title *" placeholder="Enter product title (e.g. Python Programming Book)" />
                <FormSelect label="Category *" options={["Select category", "Electronics", "Furniture", "Books", "Mobiles"]} />
              </div>
              <label className="form-field form-field--full">
                <span>Description *</span>
                <textarea placeholder="Describe your product, its condition, features, etc." />
                <small>0/500</small>
              </label>
              <div className="form-row form-row--thirds">
                <FormSelect label="Condition *" options={["Select condition", "Like New", "Good", "Fair"]} />
                <div className="form-field">
                  <span>Price Type *</span>
                  <div className="price-toggle">
                    <button className="is-active" type="button"><FiTag /> For Sale</button>
                    <button type="button"><FiRefreshCw /> For Swap</button>
                  </div>
                </div>
                <FormField label="Price (₹) *" placeholder="Enter price" suffix="₹" />
              </div>
              <div className="form-row">
                <FormSelect label="Location (Taluka) *" options={["Select your taluka", "Sawantwadi", "Kudal", "Malvan", "Kankavli"]} />
                <FormSelect label="Availability *" options={["Select availability", "Available", "Reserved", "Sold"]} />
              </div>

              <div className="upload-section">
                <h3>Upload Images *</h3>
                <p>Add clear images of your product (Max 6 images)</p>
                <div className="upload-grid">
                  <button className="upload-tile upload-tile--main" type="button">
                    <FiUploadCloud />
                    <strong>Upload Images</strong>
                    <span>Click to upload or drag and drop PNG, JPG up to 5MB</span>
                  </button>
                  {[1, 2, 3, 4, 5].map((item) => <button className="upload-tile" type="button" key={item}><FiImage /></button>)}
                  <button className="upload-tile upload-tile--add" type="button"><FiPlus /><span>Add More</span></button>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn btn--light btn--border" type="reset">Clear All</button>
                <button className="btn btn--primary" type="submit">Preview Product <FiArrowRight /></button>
              </div>
            </motion.form>

            <aside className="preview-column">
              <div className="live-preview">
                <h2><FiEye /> Live Preview</h2>
                <p>See how your product will appear to others.</p>
                <article className="preview-card">
                  <div className="preview-card__image"><FiImage /><button><FiHeart /></button></div>
                  <div>
                    <span>For Sale</span>
                    <h3>Product Title</h3>
                    <p>Category Name</p>
                    <strong>₹0</strong>
                    <small><FiMapPin /> Your Taluka</small>
                    <em>Like New</em>
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

function FormField({ label, placeholder, suffix }) {
  return (
    <label className="form-field">
      <span>{label}</span>
      <div>
        <input placeholder={placeholder} />
        {suffix && <b>{suffix}</b>}
      </div>
    </label>
  );
}

function FormSelect({ label, options }) {
  return (
    <label className="form-field">
      <span>{label}</span>
      <select>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

export default AddProduct;
