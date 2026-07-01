import { useState } from "react";
import { FiHelpCircle, FiPlus, FiTrash2, FiEye, FiEyeOff, FiX } from "react-icons/fi";
import Swal from "sweetalert2";

export default function HelpCenter() {
  const [faqs, setFaqs] = useState([
    { id: 1, category: "General", question: "How does SindhuSwap verify listings?", answer: "Our moderation system screens all newly listed products for price realism and location validity prior to publication.", visible: true },
    { id: 2, category: "Swapping", question: "Are book swaps free?", answer: "Yes, book swapping is direct student-to-student barter. You trade one of your books for another in person, completely free.", visible: true },
    { id: 3, category: "Security", question: "Is physical meeting safe?", answer: "Always schedule transactions during daylight hours in public, crowded spaces (such as Kudal ST Stand or local markets) and bring a companion.", visible: true }
  ]);

  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");
  const [newCat, setNewCat] = useState("General");
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (newQ.trim() && newA.trim()) {
      setFaqs((prev) => [
        ...prev,
        {
          id: Date.now(),
          category: newCat,
          question: newQ.trim(),
          answer: newA.trim(),
          visible: true
        }
      ]);
      setNewQ("");
      setNewA("");
      setShowAddModal(false);
      Swal.fire("FAQ Created!", "Your help center question has been added.", "success");
    }
  };

  const toggleVisibility = (id) => {
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, visible: !f.visible } : f))
    );
  };

  const handleDelete = (id) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="admin-glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5"><FiHelpCircle className="text-teal-600" /> Platform FAQ Center</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 bg-primary text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <FiPlus /> Write FAQ
          </button>
        </div>

        <div className="space-y-4">
          {faqs.map((f) => (
            <div
              key={f.id}
              className={`p-4 border rounded-2xl bg-slate-50/45 flex justify-between items-start gap-4 text-xs ${
                !f.visible ? "opacity-60 border-slate-100" : "border-slate-200/60"
              }`}
            >
              <div className="space-y-1.5 flex-grow">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-100 border text-slate-500 rounded-lg px-2 py-0.5 font-bold uppercase text-[9px] mr-2">
                    {f.category}
                  </span>
                  <span className="font-bold text-slate-800">{f.question}</span>
                </div>
                <p className="text-slate-500 leading-relaxed font-medium">{f.answer}</p>
              </div>

              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => toggleVisibility(f.id)}
                  className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded border"
                >
                  {f.visible ? <FiEye /> : <FiEyeOff />}
                </button>
                <button
                  onClick={() => handleDelete(f.id)}
                  className="p-1.5 text-red-500 hover:text-red-800 hover:bg-red-50 rounded border"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add FAQ Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40" onClick={() => setShowAddModal(false)} />
          <form
            onSubmit={handleAdd}
            className="bg-white rounded-2xl p-6 relative z-10 w-full max-w-md space-y-4 shadow-xl text-xs"
          >
            <button type="button" onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-slate-400">
              <FiX />
            </button>
            <h3 className="text-sm font-bold text-slate-800">Add FAQ Question</h3>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="font-semibold text-slate-500">Category Tag</label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-semibold text-slate-600"
                >
                  <option value="General">General</option>
                  <option value="Swapping">Swapping & Trades</option>
                  <option value="Security">Security & Verification</option>
                  <option value="Account">Account Settings</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-500">Question Text</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Can I cancel a swap request?"
                  value={newQ}
                  onChange={(e) => setNewQ(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-500">Answer Explanation</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Provide details explanation here..."
                  value={newA}
                  onChange={(e) => setNewA(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none"
                />
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
                Add FAQ
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
