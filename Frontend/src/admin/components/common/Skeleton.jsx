import { motion } from "framer-motion";

export default function Skeleton({ type = "dashboard" }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0.3, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, repeat: Infinity, repeatType: "reverse" } }
  };

  if (type === "dashboard") {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 w-full"
      >
        {/* Metric grids */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {Array.from({ length: 5 }).map((_, idx) => (
            <motion.div key={idx} variants={itemVariants} className="admin-glass-card rounded-2xl p-5 h-36 space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
                <div className="h-9 w-9 bg-slate-100 rounded-xl animate-pulse" />
              </div>
              <div className="h-6 w-16 bg-slate-200 rounded animate-pulse" />
              <div className="h-3 w-12 bg-slate-100/60 rounded animate-pulse" />
            </motion.div>
          ))}
        </div>

        {/* Chart row skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants} className="admin-glass-card rounded-2xl p-5 h-80 flex flex-col justify-between">
            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
            <div className="flex-1 w-full bg-slate-50 border border-dashed border-slate-100 rounded-xl my-4 animate-pulse flex items-center justify-center">
              <span className="text-[10px] text-slate-300 font-mono">Loading telemetry area...</span>
            </div>
            <div className="h-3 w-40 bg-slate-100 rounded animate-pulse" />
          </motion.div>
          
          <motion.div variants={itemVariants} className="admin-glass-card rounded-2xl p-5 h-80 flex flex-col justify-between">
            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
            <div className="flex-1 w-full bg-slate-50 border border-dashed border-slate-100 rounded-xl my-4 animate-pulse flex items-center justify-center">
              <span className="text-[10px] text-slate-300 font-mono">Loading data distribution...</span>
            </div>
            <div className="h-3 w-40 bg-slate-100 rounded animate-pulse" />
          </motion.div>
        </div>

        {/* Small listing grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <motion.div key={idx} variants={itemVariants} className="admin-glass-card rounded-2xl p-5 h-56 space-y-4">
              <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
              <div className="space-y-3">
                <div className="h-10 w-full bg-slate-50 border border-slate-100 rounded-xl animate-pulse" />
                <div className="h-10 w-full bg-slate-50 border border-slate-100 rounded-xl animate-pulse" />
                <div className="h-10 w-full bg-slate-50 border border-slate-100 rounded-xl animate-pulse" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (type === "table") {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="admin-glass-card rounded-2xl p-6 space-y-4 w-full"
      >
        {/* Table top search & filters placeholder */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="h-9 w-60 bg-slate-100 border border-slate-200/50 rounded-xl animate-pulse" />
          <div className="flex items-center gap-3">
            <div className="h-9 w-24 bg-slate-100 border border-slate-200/50 rounded-xl animate-pulse" />
            <div className="h-9 w-24 bg-slate-100 border border-slate-200/50 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Fake row lines */}
        <div className="space-y-3.5 py-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="flex items-center justify-between py-2 border-b border-slate-50"
            >
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 bg-slate-200 rounded animate-pulse shrink-0" />
                <div className="h-9 w-9 bg-slate-100 rounded-lg animate-pulse shrink-0" />
                <div className="space-y-1">
                  <div className="h-3 w-32 bg-slate-200 rounded animate-pulse" />
                  <div className="h-2 w-16 bg-slate-100 rounded animate-pulse" />
                </div>
              </div>
              
              <div className="h-3 w-20 bg-slate-200 rounded animate-pulse hidden sm:block" />
              <div className="h-3.5 w-16 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-3 w-16 bg-slate-200 rounded animate-pulse hidden md:block" />
              
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 bg-slate-100 rounded animate-pulse" />
                <div className="h-7 w-7 bg-slate-100 rounded animate-pulse" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Table footer placeholder */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-slate-100 rounded animate-pulse" />
            <div className="h-8 w-8 bg-slate-100 rounded animate-pulse" />
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
}
