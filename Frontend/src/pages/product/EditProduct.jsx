import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PageShell from "../../components/common/PageShell";
import { productApi } from "../../api/productApi";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    productType: "Sale",
    price: "",
    taluka: "",
    address: "",
    exchangePreference: "",
    status: "Available",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await productApi.details(id);
        const product = response.data.product;
        setForm({
          title: product.title || product.name || "",
          description: product.description || "",
          category: product.category || "",
          condition: product.condition || "",
          productType: product.productType || "Sale",
          price: product.price || "",
          taluka: product.taluka || "",
          address: product.address || "",
          exchangePreference: product.exchangePreference || "",
          status: product.status || "Available",
        });
      } catch (error) {
        toast.error(error.message || "Unable to load product.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      await productApi.update(id, form);
      toast.success("Product updated.");
      navigate("/my-products");
    } catch (error) {
      toast.error(error.message || "Unable to update product.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <PageShell><section className="section container">Loading product...</section></PageShell>;
  }

  return (
    <PageShell>
      <section className="container py-10">
        <form className="product-form-panel max-w-3xl mx-auto" onSubmit={handleSubmit}>
          <h1 className="text-2xl font-black text-slate-900 mb-5">Edit Product</h1>
          <label className="form-field"><span>Product Title *</span><div><input value={form.title} onChange={(event) => updateField("title", event.target.value)} /></div></label>
          <label className="form-field form-field--full"><span>Description *</span><textarea value={form.description} onChange={(event) => updateField("description", event.target.value)} /></label>
          <div className="form-row">
            <label className="form-field"><span>Category *</span><div><input value={form.category} onChange={(event) => updateField("category", event.target.value)} /></div></label>
            <label className="form-field"><span>Condition *</span><div><input value={form.condition} onChange={(event) => updateField("condition", event.target.value)} /></div></label>
          </div>
          <div className="form-row">
            <label className="form-field"><span>Price</span><div><input type="number" value={form.price} onChange={(event) => updateField("price", event.target.value)} /></div></label>
            <label className="form-field"><span>Taluka *</span><div><input value={form.taluka} onChange={(event) => updateField("taluka", event.target.value)} /></div></label>
          </div>
          <label className="form-field"><span>Address</span><div><input value={form.address} onChange={(event) => updateField("address", event.target.value)} /></div></label>
          <label className="form-field"><span>Exchange Preference</span><div><input value={form.exchangePreference} onChange={(event) => updateField("exchangePreference", event.target.value)} /></div></label>
          <div className="form-actions">
            <button className="btn btn--light btn--border" type="button" onClick={() => navigate("/my-products")}>Cancel</button>
            <button className="btn btn--primary" type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
          </div>
        </form>
      </section>
    </PageShell>
  );
}

export default EditProduct;
