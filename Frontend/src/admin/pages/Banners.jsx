import { useState } from "react";
import { FiImage, FiPlus, FiTrash2, FiPower, FiX } from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";
import { toast } from "react-toastify";

export default function Banners() {
  const { banners, addBanner, toggleBannerStatus, deleteBanner } = useAdmin();
  const [newTitle, setNewTitle] = useState("");
  const [newLink, setNewLink] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTitle.trim()) {
      addBanner({
        title: newTitle.trim(),
        link: newLink.trim() || "/categories",
        image: "" // fallback handled
      });
      setNewTitle("");
      setNewLink("");
      setShowAddModal(false);
      toast.success("Home promotion banner added!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="admin-glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 className="text-sm font-bold text-slate-800">Home Promotion Sliders</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 bg-primary text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer shadow-sm"
          >
            <FiPlus /> Add Slider Banner
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {banners.map((b) => (
            <div
              key={b.id}
              className={`border border-slate-200/60 rounded-2xl overflow-hidden bg-white hover:shadow-md transition-all flex flex-col justify-between ${
                b.status !== "Active" ? "opacity-60" : ""
              }`}
            >
              {/* Banner visual cover */}
              <div className="aspect-video w-full bg-slate-100 relative overflow-hidden flex items-center justify-center border-b">
                {b.image ? (
                  <img src={b.image} className="w-full h-full object-cover animate-fade-in" alt="" />
                ) : (
                  <FiImage className="text-slate-300 text-3xl animate-pulse" />
                )}
                <span className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg border font-bold text-[9px] ${
                  b.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200"
                }`}>
                  {b.status}
                </span>
              </div>

              {/* Specs */}
              <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 leading-normal line-clamp-1">{b.title}</h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">Redirect: {b.link}</p>
                </div>

                <div className="flex gap-2 border-t pt-3">
                  <button
                    onClick={() => toggleBannerStatus(b.id)}
                    className="flex-1 py-1.5 bg-slate-50 border hover:bg-slate-100 rounded-lg text-[10px] font-bold text-slate-600 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <FiPower className={b.status === "Active" ? "text-emerald-500" : "text-slate-400"} /> Toggle Status
                  </button>
                  <button
                    onClick={() => deleteBanner(b.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 border rounded-lg cursor-pointer"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Slider Banner Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40" onClick={() => setShowAddModal(false)} />
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-6 relative z-10 w-full max-w-sm space-y-4 shadow-xl text-xs"
          >
            <button type="button" onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-slate-400">
              <FiX />
            </button>
            <h3 className="text-sm font-bold text-slate-800">Add Slider Banner</h3>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="font-semibold text-slate-500">Banner Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monsoon Book swapping"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-500">Target Redirect Link</label>
                <input
                  type="text"
                  placeholder="e.g. /bookswap or /categories"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none font-mono"
                />
              </div>

              <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50/50">
                <FiImage className="text-slate-400 text-lg mb-1 animate-pulse" />
                <span className="font-bold text-slate-500">Upload Banner Image File</span>
                <span className="text-[9px] text-slate-400 mt-0.5">Supports PNG, JPG (1200x400 suggested)</span>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border rounded-xl text-slate-500 font-semibold"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-primary text-white font-bold rounded-xl shadow-sm">
                Add Slider
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
