import { motion } from "framer-motion";

export default function SkeletonCard() {
  return (
    <div className="flex flex-col h-full overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-[0_2px_8px_rgba(15,23,42,0.02)] p-0">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 animate-pulse" />

      {/* Card Content Skeleton */}
      <div className="flex flex-col flex-1 p-4 space-y-3.5">
        {/* Seller Info line */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6.5 h-6.5 rounded-full bg-slate-100 animate-pulse shrink-0" />
            <div className="w-12 h-3 bg-slate-100 rounded-md animate-pulse" />
          </div>
          <div className="w-14 h-3 bg-slate-100 rounded-md animate-pulse" />
        </div>

        {/* Title and details */}
        <div className="space-y-2">
          <div className="w-3/4 h-4 bg-slate-100 rounded-md animate-pulse" />
          <div className="flex gap-1.5 items-center">
            <div className="w-16 h-3 bg-slate-100 rounded-md animate-pulse" />
            <div className="w-8 h-3 bg-slate-100 rounded-md animate-pulse" />
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div className="space-y-1">
            <div className="w-16 h-4 bg-slate-100 rounded-md animate-pulse" />
            <div className="w-8 h-2 bg-slate-100 rounded-md animate-pulse" />
          </div>
          <div className="flex gap-1.5 items-center">
            <div className="w-7.5 h-7.5 bg-slate-100 rounded-lg animate-pulse" />
            <div className="w-14 h-7.5 bg-slate-100 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
