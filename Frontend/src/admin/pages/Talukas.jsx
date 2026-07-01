import { useState } from "react";
import { FiMapPin, FiPlus, FiTrash2, FiEdit, FiCheck, FiX } from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";

export default function Talukas() {
  const { talukas, addTaluka, editTaluka, deleteTaluka } = useAdmin();
  const [newTalukaName, setNewTalukaName] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (newTalukaName.trim()) {
      addTaluka(newTalukaName.trim());
      setNewTalukaName("");
    }
  };

  const handleSaveRename = (oldName) => {
    if (editingValue.trim() && editingValue.trim() !== oldName) {
      editTaluka(oldName, editingValue.trim());
    }
    setEditingIndex(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Add taluka card */}
      <div className="admin-glass-card rounded-2xl p-5 h-fit space-y-4">
        <h3 className="text-sm font-bold text-slate-800">Add New Taluka</h3>
        <form onSubmit={handleAdd} className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-500">Taluka Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Malvan, Devgad"
              value={newTalukaName}
              onChange={(e) => setNewTalukaName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2.5 outline-none text-slate-700"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-primary hover:bg-teal-800 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <FiPlus /> Register Taluka
          </button>
        </form>
      </div>

      {/* Talukas list */}
      <div className="md:col-span-2 admin-glass-card rounded-2xl p-5">
        <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Registered Taluka Boundaries</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {talukas.map((tal, idx) => (
            <div
              key={tal}
              className="flex items-center justify-between p-3 border border-slate-100 bg-slate-50/50 hover:bg-slate-50 rounded-xl transition-all text-xs"
            >
              <div className="flex items-center gap-2 flex-grow mr-2 min-w-0">
                <FiMapPin className="text-teal-600 shrink-0" />
                {editingIndex === idx ? (
                  <input
                    type="text"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    className="w-full bg-white border border-slate-300 focus:border-teal-500 rounded-lg px-2 py-1 outline-none text-slate-700 font-semibold"
                    autoFocus
                  />
                ) : (
                  <span className="font-bold text-slate-700 truncate">{tal}</span>
                )}
              </div>

              <div className="flex gap-1 shrink-0">
                {editingIndex === idx ? (
                  <>
                    <button
                      onClick={() => handleSaveRename(tal)}
                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                    >
                      <FiCheck />
                    </button>
                    <button
                      onClick={() => setEditingIndex(null)}
                      className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg"
                    >
                      <FiX />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingIndex(idx);
                        setEditingValue(tal);
                      }}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => deleteTaluka(tal)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <FiTrash2 />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
