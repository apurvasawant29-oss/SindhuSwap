import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FiStar, FiTrash2, FiUser } from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";
import Swal from "sweetalert2";

export default function Reviews() {
  const { searchQuery } = useOutletContext();
  const { reviews, setReviews, logActivity } = useAdmin();

  // Filter evaluations
  const filteredReviews = reviews.filter(
    (r) =>
      searchQuery === "" ||
      r.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.targetUser.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id) => {
    Swal.fire({
      title: "Remove this review?",
      text: "Are you sure you want to delete this rating feedback?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        logActivity("Review Deleted", `Review ID: ${id}`, "Moderated and removed feedback review.");
        Swal.fire("Deleted!", "The review was deleted.", "success");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="admin-glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 className="text-sm font-bold text-slate-800">User Rating Feedback Reviews</h3>
          <span className="text-xs font-semibold text-slate-400">Total Reviews: {reviews.length}</span>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">No review ratings listed.</div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((r) => (
              <div
                key={r.id}
                className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl flex justify-between items-start gap-4 text-xs"
              >
                <div className="space-y-1.5 flex-grow">
                  <div className="flex items-center gap-2">
                    <FiUser className="text-slate-400" />
                    <span className="font-bold text-slate-700">{r.user}</span>
                    <span className="text-slate-400 font-medium">reviewed</span>
                    <span className="font-bold text-slate-700">{r.targetUser}</span>
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold ml-3 font-mono">
                      <FiStar className="fill-amber-500" /> {r.rating}/5
                    </span>
                  </div>
                  <p className="text-slate-500 italic leading-relaxed font-medium">"{r.comment}"</p>
                </div>

                <button
                  onClick={() => handleDelete(r.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg shrink-0 cursor-pointer"
                >
                  <FiTrash2 className="text-sm" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
