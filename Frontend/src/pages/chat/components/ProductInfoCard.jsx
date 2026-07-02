import { Link } from "react-router-dom";
import { FiCheck, FiEye, FiX } from "react-icons/fi";

function ProductInfoCard({ product, onAcceptSwap, onRejectSwap }) {
  if (!product) return null;

  const statusClass =
    product.swapStatus === "Accepted"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : product.swapStatus === "Rejected"
        ? "border-rose-200 bg-rose-50 text-rose-700"
        : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <div className="mx-4 mt-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={product.image}
            alt={product.name}
            className="h-14 w-14 shrink-0 rounded-xl border border-slate-100 object-cover"
          />
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-slate-900">{product.name}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold text-slate-500">
              <span>
                Owner: <strong className="text-slate-700">{product.owner}</strong>
              </span>
              <span className="text-slate-300">•</span>
              <span>
                Condition: <strong className="text-teal-700">{product.condition}</strong>
              </span>
              <span className="text-slate-300">•</span>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusClass}`}>
                {product.swapStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={`/product/${product.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <FiEye className="h-3.5 w-3.5" />
            View Product
          </Link>
          {product.swapStatus === "Pending" && (
            <>
              <button
                type="button"
                onClick={onRejectSwap}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-100"
              >
                <FiX className="h-3.5 w-3.5" />
                Reject Swap
              </button>
              <button
                type="button"
                onClick={onAcceptSwap}
                className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-3 py-2 text-xs font-bold text-white shadow-sm shadow-teal-600/15 transition hover:bg-teal-700"
              >
                <FiCheck className="h-3.5 w-3.5" />
                Accept Swap
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductInfoCard;
