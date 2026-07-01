import { useState } from "react";
import { FiFileText, FiPlus, FiTrash2, FiEdit, FiX, FiCheck } from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";
import { toast } from "react-toastify";

export default function Blogs() {
  const { blogs, addBlog, editBlog, deleteBlog } = useAdmin();
  const [newTitle, setNewTitle] = useState("");
  const [newCat, setNewCat] = useState("Tips");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editPost, setEditPost] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTitle.trim()) {
      addBlog({
        title: newTitle.trim(),
        category: newCat,
        author: "Admin",
        status: "Published"
      });
      setNewTitle("");
      setShowAddModal(false);
      toast.success("Community blog post published!");
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    editBlog(editPost.id, editPost);
    setEditPost(null);
    toast.success("Blog post modifications saved!");
  };

  return (
    <div className="space-y-6">
      <div className="admin-glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 className="text-sm font-bold text-slate-800">Community Safety Tips & Blog Posts</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 bg-primary text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer shadow-sm"
          >
            <FiPlus /> Write Article
          </button>
        </div>

        <div className="space-y-3.5">
          {blogs.map((b) => (
            <div
              key={b.id}
              className="p-4 border border-slate-200/60 rounded-2xl bg-white hover:shadow-md transition-all flex items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FiFileText className="text-teal-600 text-lg shrink-0" />
                <div className="truncate">
                  <span className="bg-slate-100 border text-slate-500 rounded-lg px-2 py-0.5 font-bold uppercase text-[9px] mr-2">
                    {b.category}
                  </span>
                  <span className="font-bold text-slate-800 leading-normal hover:underline cursor-pointer">
                    {b.title}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">
                    By: <strong className="text-slate-500">{b.author}</strong> • Published on: {b.date} • Status:{" "}
                    <strong className="text-teal-600 font-bold">{b.status}</strong>
                  </p>
                </div>
              </div>

              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => setEditPost(b)}
                  className="p-1.5 text-blue-500 hover:bg-blue-50 border rounded-lg cursor-pointer"
                >
                  <FiEdit />
                </button>
                <button
                  onClick={() => deleteBlog(b.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 border rounded-lg cursor-pointer"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Blog Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40" onClick={() => setShowAddModal(false)} />
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-6 relative z-10 w-full max-w-md space-y-4 shadow-xl text-xs"
          >
            <button type="button" onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-slate-400">
              <FiX />
            </button>
            <h3 className="text-sm font-bold text-slate-800">Publish Community Article</h3>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="font-semibold text-slate-500">Article Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5 steps to verify book quality"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-500">Category Tag</label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-semibold text-slate-600"
                >
                  <option value="Tips">Safety Tips</option>
                  <option value="Community">Community Spotlights</option>
                  <option value="Updates">Software Updates</option>
                  <option value="Others">General Blog</option>
                </select>
              </div>

              <div className="p-12 border-2 border-dashed border-slate-200 rounded-xl text-center cursor-pointer hover:bg-slate-50/50">
                <span className="font-bold text-slate-500">Open Rich Markdown Content Writer</span>
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
                Publish Post
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Blog Modal */}
      {editPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40" onClick={() => setEditPost(null)} />
          <form
            onSubmit={handleEditSubmit}
            className="bg-white rounded-2xl p-6 relative z-10 w-full max-w-md space-y-4 shadow-xl text-xs"
          >
            <button type="button" onClick={() => setEditPost(null)} className="absolute top-4 right-4 text-slate-400">
              <FiX />
            </button>
            <h3 className="text-sm font-bold text-slate-800">Edit Published Article</h3>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="font-semibold text-slate-500">Article Title</label>
                <input
                  type="text"
                  required
                  value={editPost.title}
                  onChange={(e) => setEditPost({ ...editPost, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-500">Category Tag</label>
                <select
                  value={editPost.category}
                  onChange={(e) => setEditPost({ ...editPost, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-semibold"
                >
                  <option value="Tips">Safety Tips</option>
                  <option value="Community">Community Spotlights</option>
                  <option value="Updates">Software Updates</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-500">Publish Status</label>
                <select
                  value={editPost.status}
                  onChange={(e) => setEditPost({ ...editPost, status: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-semibold"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t">
              <button
                type="button"
                onClick={() => setEditPost(null)}
                className="px-4 py-2 border rounded-xl text-slate-500 font-semibold"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-primary text-white font-bold rounded-xl shadow-sm">
                Save Modifications
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
