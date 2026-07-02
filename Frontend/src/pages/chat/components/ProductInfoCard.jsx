import { Link } from "react-router-dom";
import { FiCheck, FiX, FiEye } from "react-icons/fi";

function ProductInfoCard({ product, onAcceptSwap, onRejectSwap }) {
  if (!product) return null;

  const { name, owner, condition, swapStatus, id, image } = product;

  const getStatusBadgeClass = () => {
    switch (swapStatus?.toLowerCase()) {
      case "accepted":
        return "bg-emerald-50 text-emerald-750 border border-emerald-250";
      case "rejected":
        return "bg-rose-50 text-rose-700 border border-rose-200";
      case "pending":
      default:
        return "bg-amber-50 text-amber-700 border border-amber-200";
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-[0_2px_8px_rgba(15,23,42,0.01)] mx-4 my-3 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 shrink-0">
      <div className="flex items-center gap-3">
        {/* Product Image Thumbnail */}
        <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
          {image ? (
            <img src={image} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl">📚</span>
          )}
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800 leading-snug">{name}</h4>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500 mt-1 font-semibold">
            <span>Owner: <strong className="text-slate-700">{owner}</strong></span>
            <span className="text-slate-300">•</span>
            <span>Condition: <span className="text-emerald-600 font-bold">{condition}</span></span>
            <span className="text-slate-300">•</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass()}`}>
              {swapStatus || "Pending"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Link
          to={`/product/${id || 1}`}
          className="flex items-center gap-1 px-3 py-2 border border-slate-200 hover:border-slate-300 text-slate-650 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all"
        >
          <FiEye className="h-3.5 w-3.5" />
          <span>View Listing</span>
        </Link>
        
        {swapStatus?.toLowerCase() === "pending" && (
          <>
            <button
              onClick={onRejectSwap}
              className="flex items-center gap-1 px-3 py-2 bg-rose-50 hover:bg-rose-100/80 text-rose-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <FiX className="h-3.5 w-3.5" />
              <span>Reject</span>
            </button>
            <button
              onClick={onAcceptSwap}
              className="flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-600/10 cursor-pointer"
            >
              <FiCheck className="h-3.5 w-3.5" />
              <span>Accept</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductInfoCard;
