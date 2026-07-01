import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiCalendar,
  FiUser,
  FiBookOpen,
  FiMessageSquare,
  FiClock,
  FiX,
  FiCornerDownRight,
  FiCheck
} from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";
import Skeleton from "../components/common/Skeleton";
import ConfirmationModal from "../components/common/ConfirmationModal";

export default function Swaps() {
  const { searchQuery } = useOutletContext(); // Quick header search
  const { bookSwaps, approveSwap, rejectSwap, completeSwap } = useAdmin();

  const [isLocalLoading, setIsLocalLoading] = useState(false);

  // Filters
  const [filterStatus, setFilterStatus] = useState("All");

  // Selection states
  const [viewSwap, setViewSwap] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // { swapId, type: 'approve'|'reject'|'complete' }

  // Trigger search loader
  useEffect(() => {
    setIsLocalLoading(true);
    const timer = setTimeout(() => setIsLocalLoading(false), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, filterStatus]);

  // Filter evaluation
  const filteredSwaps = bookSwaps.filter((s) => {
    const matchesSearch =
      searchQuery === "" ||
      s.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.requesterName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "All" || s.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Action execute
  const executeSwapAction = () => {
    const { swapId, type } = confirmAction;
    if (type === "approve") approveSwap(swapId);
    else if (type === "reject") rejectSwap(swapId);
    else if (type === "complete") completeSwap(swapId);

    // Sync view overlay
    if (viewSwap && viewSwap.id === swapId) {
      setViewSwap({
        ...viewSwap,
        status: type === "approve" ? "Accepted" : type === "reject" ? "Rejected" : "Completed"
      });
    }

    setConfirmAction(null);
  };

  // Status badging
  const renderStatusBadge = (status) => {
    const styles = {
      Pending: "bg-amber-50 text-amber-700 border-amber-100/80",
      Accepted: "bg-blue-50 text-blue-700 border-blue-100/80",
      Completed: "bg-emerald-50 text-emerald-700 border-emerald-100/80",
      Rejected: "bg-rose-50 text-rose-700 border-rose-100/80"
    };
    return (
      <span
        className={`inline-flex items-center text-[10px] font-bold border rounded-lg px-2.5 py-0.5 ${
          styles[status] || styles.Pending
        }`}
      >
        {status}
      </span>
    );
  };

  // Metric counts
  const totalCount = bookSwaps.length;
  const pendingCount = bookSwaps.filter((s) => s.status === "Pending").length;
  const acceptedCount = bookSwaps.filter((s) => s.status === "Accepted").length;
  const completedCount = bookSwaps.filter((s) => s.status === "Completed").length;

  return (
    <div className="space-y-6">
      {/* 1. TOP SUMMARY ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="admin-glass-card rounded-2xl p-4 flex flex-col justify-between h-24">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Swap Deals</span>
          <span className="text-xl font-black text-slate-800 tracking-tight block mt-1">{totalCount}</span>
        </div>
        <div className="admin-glass-card rounded-2xl p-4 flex flex-col justify-between h-24">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending Swaps</span>
          <span className="text-xl font-black text-amber-600 tracking-tight block mt-1">{pendingCount}</span>
        </div>
        <div className="admin-glass-card rounded-2xl p-4 flex flex-col justify-between h-24">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Accepted Swaps</span>
          <span className="text-xl font-black text-blue-600 tracking-tight block mt-1">{acceptedCount}</span>
        </div>
        <div className="admin-glass-card rounded-2xl p-4 flex flex-col justify-between h-24">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Completed Swaps</span>
          <span className="text-xl font-black text-emerald-600 tracking-tight block mt-1">{completedCount}</span>
        </div>
      </div>

      {/* 2. FILTER ACTION BAR */}
      <div className="admin-glass-card rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 self-start sm:self-center">
          {["All", "Pending", "Accepted", "Rejected", "Completed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                filterStatus === status
                  ? "bg-primary border-primary text-white shadow-sm font-bold"
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        
        <span className="text-xs font-semibold text-slate-400">
          Showing <span className="font-bold text-slate-600">{filteredSwaps.length}</span> swaps
        </span>
      </div>

      {/* 3. SWAP TRANSACTIONS TABLE */}
      {isLocalLoading ? (
        <Skeleton type="table" />
      ) : filteredSwaps.length === 0 ? (
        <div className="admin-glass-card rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <FiBookOpen className="text-slate-300 text-4xl mb-3 animate-pulse" />
          <h3 className="text-sm font-bold text-slate-700">No Swap Records Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            We couldn't find any swap transactions matching the filters or query.
          </p>
        </div>
      ) : (
        <div className="admin-glass-card rounded-2xl overflow-hidden border border-slate-200/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="admin-table-hdr text-slate-500 border-b border-slate-100 font-extrabold uppercase tracking-wider">
                  <th className="p-4">Swap ID</th>
                  <th className="p-4">Book Title</th>
                  <th className="p-4">Book Owner</th>
                  <th className="p-4">Requester</th>
                  <th className="p-4">Requested Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Moderator Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSwaps.map((swap) => (
                  <tr key={swap.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-700">{swap.id}</td>
                    <td className="p-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-teal-50 border border-teal-100/50 flex items-center justify-center text-primary text-sm font-bold shrink-0">
                        <FiBookOpen />
                      </div>
                      <span className="font-bold text-slate-800">{swap.bookTitle}</span>
                    </td>
                    <td className="p-4 text-slate-600 font-semibold">{swap.ownerName}</td>
                    <td className="p-4 text-slate-600 font-semibold">{swap.requesterName}</td>
                    <td className="p-4 text-slate-400 font-mono">
                      {swap.createdAt ? new Date(swap.createdAt).toLocaleDateString() : "2026-06-30"}
                    </td>
                    <td className="p-4">{renderStatusBadge(swap.status)}</td>
                    <td className="p-4 text-right space-x-1">
                      <button
                        onClick={() => setViewSwap(swap)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
                        title="Open Details & Chat"
                      >
                        <FiEye className="text-sm" />
                      </button>

                      {swap.status === "Pending" && (
                        <>
                          <button
                            onClick={() => setConfirmAction({ swapId: swap.id, type: "approve" })}
                            className="p-1.5 text-emerald-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg cursor-pointer"
                            title="Accept Swap Request"
                          >
                            <FiCheckCircle className="text-sm" />
                          </button>
                          <button
                            onClick={() => setConfirmAction({ swapId: swap.id, type: "reject" })}
                            className="p-1.5 text-rose-500 hover:text-rose-800 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="Reject Swap Request"
                          >
                            <FiXCircle className="text-sm" />
                          </button>
                        </>
                      )}

                      {swap.status === "Accepted" && (
                        <button
                          onClick={() => setConfirmAction({ swapId: swap.id, type: "complete" })}
                          className="p-1.5 text-teal-600 hover:text-teal-900 hover:bg-teal-50 rounded-lg cursor-pointer animate-pulse"
                          title="Complete Swap Deal"
                        >
                          <FiCheckCircle className="text-sm" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. MODAL: DETAILED VIEW WITH TIMELINE & CHAT */}
      <AnimatePresence>
        {viewSwap && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewSwap(null)}
              className="fixed inset-0 bg-slate-900"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="bg-white rounded-3xl shadow-xl border border-slate-200 w-full max-w-xl p-6 relative z-10 space-y-5"
            >
              {/* Close Icon */}
              <button
                onClick={() => setViewSwap(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <FiX />
              </button>

              <h3 className="text-base font-black text-slate-800 tracking-tight">Swap Transaction Audit</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Book specs */}
                <div className="space-y-3.5 text-xs">
                  <div>
                    <h4 className="text-slate-400 font-medium">Book specifications</h4>
                    <p className="font-bold text-slate-800 flex items-center gap-1.5 mt-1 bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                      <FiBookOpen className="text-primary text-sm shrink-0" /> {viewSwap.bookTitle}
                    </p>
                  </div>
                  
                  <div className="flex gap-4">
                    <div>
                      <h4 className="text-slate-400 font-medium">Owner (Seller)</h4>
                      <p className="font-bold text-slate-700 mt-0.5 flex items-center gap-1">
                        <FiUser className="text-slate-400" /> {viewSwap.ownerName}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-slate-400 font-medium">Requester (Buyer)</h4>
                      <p className="font-bold text-slate-700 mt-0.5 flex items-center gap-1">
                        <FiUser className="text-slate-400" /> {viewSwap.requesterName}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-slate-400 font-medium">Swap standing</h4>
                    <div className="mt-1.5">{renderStatusBadge(viewSwap.status)}</div>
                  </div>
                </div>

                {/* Progress Timeline view */}
                <div className="space-y-3 text-xs bg-slate-50 border border-slate-100 rounded-2xl p-4">
                  <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <FiClock /> Swap milestones
                  </h4>
                  <div className="space-y-3 relative pr-1">
                    {/* Line path */}
                    <div className="absolute left-[5.5px] top-1.5 bottom-1.5 w-0.5 bg-slate-200" />

                    <div className="flex gap-2 relative">
                      <span className="h-3 w-3 rounded-full bg-emerald-500 border border-white z-10 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-700">Request Submitted</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Initial proposal dispatched by {viewSwap.requesterName}</p>
                      </div>
                    </div>

                    {(viewSwap.status === "Accepted" || viewSwap.status === "Completed") && (
                      <div className="flex gap-2 relative animate-fade-in">
                        <span className="h-3 w-3 rounded-full bg-emerald-500 border border-white z-10 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-700">Swap Accepted</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Accepted by {viewSwap.ownerName}. Swap location aligned.</p>
                        </div>
                      </div>
                    )}

                    {viewSwap.status === "Completed" && (
                      <div className="flex gap-2 relative animate-fade-in">
                        <span className="h-3 w-3 rounded-full bg-emerald-500 border border-white z-10 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-700">Swap Deal Complete</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Physical swap exchange validated and completed.</p>
                        </div>
                      </div>
                    )}

                    {viewSwap.status === "Rejected" && (
                      <div className="flex gap-2 relative text-rose-700 animate-fade-in">
                        <span className="h-3 w-3 rounded-full bg-rose-500 border border-white z-10 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Proposal Rejected</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Disallowed by owner or closed by system admins.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Chat preview box */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <FiMessageSquare /> Negotiation chat logs
                </h4>
                
                <div className="h-36 bg-slate-900 rounded-2xl p-4 overflow-y-auto admin-scrollbar flex flex-col gap-3 border border-slate-800">
                  {viewSwap.messages && viewSwap.messages.length > 0 ? (
                    viewSwap.messages.map((msg, idx) => {
                      const isOwner = msg.sender === viewSwap.ownerName;
                      return (
                        <div
                          key={idx}
                          className={`max-w-[80%] rounded-2xl p-2.5 text-[10px] font-mono leading-relaxed ${
                            isOwner
                              ? "bg-teal-500/10 text-teal-300 border border-teal-500/20 align-self-end self-end ml-auto"
                              : "bg-slate-800 text-slate-200 border border-slate-700 self-start"
                          }`}
                        >
                          <p className="font-bold text-[9px] text-slate-400 mb-0.5">
                            {msg.sender} <span className="text-[8px] font-normal font-sans ml-1 text-slate-500">{msg.time}</span>
                          </p>
                          <p className="font-medium">{msg.text}</p>
                        </div>
                      );
                    })
                  ) : (
                    <div className="m-auto text-slate-500 text-[10px] font-medium text-center">
                      No chat messages logs recorded for this swap proposal yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Action options */}
              {(viewSwap.status === "Pending" || viewSwap.status === "Accepted") && (
                <div className="flex gap-2 pt-4 border-t border-slate-100 justify-end">
                  {viewSwap.status === "Pending" && (
                    <>
                      <button
                        onClick={() => setConfirmAction({ swapId: viewSwap.id, type: "approve" })}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Accept Swap
                      </button>
                      <button
                        onClick={() => setConfirmAction({ swapId: viewSwap.id, type: "reject" })}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Reject Swap
                      </button>
                    </>
                  )}
                  {viewSwap.status === "Accepted" && (
                    <button
                      onClick={() => setConfirmAction({ swapId: viewSwap.id, type: "complete" })}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm animate-pulse"
                    >
                      Complete Swap Exchange
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. REUSABLE CONFIRMATION MODAL */}
      {confirmAction && (() => {
        const { type } = confirmAction;
        let title = "";
        let message = "";
        let confirmText = "Confirm";
        let modalType = "warning";

        if (type === "approve") {
          title = "Accept Book Swap proposal";
          message = "Confirm approval of this book swap proposal? The transaction state will transition to 'Accepted', aligning the swap locations for meetup.";
          confirmText = "Accept Proposal";
          modalType = "info";
        } else if (type === "reject") {
          title = "Reject Book Swap proposal";
          message = "Reject this book swap proposal? The transaction state will be marked 'Rejected' and negotiation chats will lock.";
          confirmText = "Reject Proposal";
          modalType = "danger";
        } else if (type === "complete") {
          title = "Complete Book Swap exchange";
          message = "Mark the physical swap exchange complete? This indicates both students met, exchanged their books, and closed the ticket successfully.";
          confirmText = "Complete Exchange";
          modalType = "info";
        }

        return (
          <ConfirmationModal
            isOpen={confirmAction !== null}
            onClose={() => setConfirmAction(null)}
            onConfirm={executeSwapAction}
            title={title}
            message={message}
            confirmText={confirmText}
            type={modalType}
          />
        );
      })()}
    </div>
  );
}
