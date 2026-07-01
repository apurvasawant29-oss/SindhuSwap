import { useState } from "react";
import { FiCpu, FiPlus, FiTrash2, FiPower, FiX, FiActivity } from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";
import { toast } from "react-toastify";

export default function Advertisements() {
  const { ads, addAd, toggleAdStatus, deleteAd } = useAdmin();
  const [newAdvertiser, setNewAdvertiser] = useState("");
  const [newPosition, setNewPosition] = useState("Sidebar Banner");
  const [showAddModal, setShowAddModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newAdvertiser.trim()) {
      addAd({
        advertiser: newAdvertiser.trim(),
        position: newPosition
      });
      setNewAdvertiser("");
      setShowAddModal(false);
      toast.success("Sponsorship campaign added!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="admin-glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 className="text-sm font-bold text-slate-800">Sponsorship Ads Campaigns</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 bg-primary text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer shadow-sm"
          >
            <FiPlus /> Create Sponsored Ad
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className={`p-5 border border-slate-200/60 rounded-2xl bg-white hover:shadow-md transition-all flex flex-col justify-between h-44 ${
                ad.status !== "Active" ? "opacity-60" : ""
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{ad.position}</span>
                  <h4 className="text-sm font-bold text-slate-800 leading-normal">{ad.advertiser}</h4>
                </div>
                <span className={`px-2 py-0.5 rounded-lg border font-bold text-[9px] ${
                  ad.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200"
                }`}>
                  {ad.status}
                </span>
              </div>

              {/* CTR metrics */}
              <div className="flex items-center gap-6 text-xs border-y py-2 border-slate-50 my-2 font-mono">
                <div className="flex items-center gap-1">
                  <span className="text-slate-400">Impressions:</span>
                  <strong className="text-slate-700">{ad.impressions.toLocaleString()}</strong>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-400">Clicks:</span>
                  <strong className="text-slate-700">{ad.clicks}</strong>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-400">CTR:</span>
                  <strong className="text-teal-600 font-black">
                    {ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : 0}%
                  </strong>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleAdStatus(ad.id)}
                  className="flex-grow py-1.5 bg-slate-50 border hover:bg-slate-100 rounded-lg text-[10px] font-bold text-slate-600 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <FiPower className={ad.status === "Active" ? "text-emerald-500" : "text-slate-400"} /> Toggle Status
                </button>
                <button
                  onClick={() => deleteAd(ad.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 border rounded-lg cursor-pointer"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Ad Modal */}
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
            <h3 className="text-sm font-bold text-slate-800">Create Sponsorship Campaign</h3>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="font-semibold text-slate-500">Advertiser / Brand Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Malvan Watersports"
                  value={newAdvertiser}
                  onChange={(e) => setNewAdvertiser(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-500">Ad Placement Location</label>
                <select
                  value={newPosition}
                  onChange={(e) => setNewPosition(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none font-semibold text-slate-600"
                >
                  <option value="Sidebar Banner">Sidebar Vertical Banner</option>
                  <option value="Bottom Footer Ad">Bottom Footer Horizontal Ad</option>
                  <option value="Top Leaderboard">Top Header Leaderboard</option>
                  <option value="Categories Strip">Mid-Categories Banner</option>
                </select>
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
                Register Ad Campaign
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
