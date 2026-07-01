import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FiBookOpen, FiTrash2, FiEdit, FiEye, FiX, FiCheckCircle } from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";
import ConfirmationModal from "../components/common/ConfirmationModal";

export default function Books() {
  const { searchQuery } = useOutletContext();
  const { products, updateProduct, deleteProduct } = useAdmin();

  // Books filter (category is "Books")
  const books = products.filter(
    (p) =>
      p.category.toLowerCase() === "books" &&
      (searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.seller.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const [editBook, setEditBook] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", price: 0, condition: "", status: "" });

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateProduct(editBook.id, editForm);
    setEditBook(null);
  };

  return (
    <div className="space-y-6">
      <div className="admin-glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 className="text-sm font-bold text-slate-800">Physical Books Inventory</h3>
          <span className="text-xs font-semibold text-slate-400">Total: {books.length} books</span>
        </div>

        {books.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">No books found in database.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold">
                  <th className="p-4">Book Title</th>
                  <th className="p-4">Owner</th>
                  <th className="p-4">Condition</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 border-b border-slate-50">
                    <td className="p-4 font-bold text-slate-800 flex items-center gap-2">
                      <FiBookOpen className="text-teal-600 shrink-0" /> {b.name}
                    </td>
                    <td className="p-4 text-slate-600 font-semibold">{b.seller}</td>
                    <td className="p-4 text-slate-500">{b.condition}</td>
                    <td className="p-4 text-slate-800 font-black">
                      {b.price === 0 || b.price === "Swap Now" ? "Swap" : `Rs. ${b.price}`}
                    </td>
                    <td className="p-4 text-slate-500">{b.taluka}</td>
                    <td className="p-4">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-100/50 rounded-lg px-2 py-0.5 font-bold">
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1.5">
                      <button
                        onClick={() => {
                          setEditBook(b);
                          setEditForm({ name: b.name, price: b.price, condition: b.condition, status: b.status });
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <FiEdit />
                      </button>
                      <button onClick={() => setDeleteId(b.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Book Modal */}
      {editBook && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40" onClick={() => setEditBook(null)} />
          <form
            onSubmit={handleEditSubmit}
            className="bg-white rounded-2xl p-6 relative z-10 w-full max-w-md space-y-4 shadow-xl"
          >
            <button type="button" onClick={() => setEditBook(null)} className="absolute top-4 right-4 text-slate-400">
              <FiX />
            </button>
            <h3 className="text-sm font-bold text-slate-800">Edit Book Specifications</h3>
            
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-500">Book Title</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-500">Price (0 for Swap)</label>
                <input
                  type="number"
                  required
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-500">Condition</label>
                <select
                  value={editForm.condition}
                  onChange={(e) => setEditForm({ ...editForm, condition: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Like New">Like New</option>
                  <option value="Fair">Fair</option>
                  <option value="Readable">Readable</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-500">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                >
                  <option value="Available">Available</option>
                  <option value="Exchanged">Exchanged</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t">
              <button
                type="button"
                onClick={() => setEditBook(null)}
                className="px-4 py-2 border rounded-xl text-slate-500 text-xs font-semibold"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl">
                Save Book Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          deleteProduct(deleteId);
          setDeleteId(null);
        }}
        title="Remove Book listing"
        message="Are you sure you want to permanently delete this book listing?"
        confirmText="Delete Book"
        type="danger"
      />
    </div>
  );
}
