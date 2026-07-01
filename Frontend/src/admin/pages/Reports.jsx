import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiAlertTriangle,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiFlag,
  FiUser,
  FiFileText,
  FiClock,
  FiX,
  FiCheck
} from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";
import Skeleton from "../components/common/Skeleton";
import ConfirmationModal from "../components/common/ConfirmationModal";

export default function Reports() {
  const { searchQuery } = useOutletContext(); // Header search
  const { reports, resolveReport, dismissReport } = useAdmin();

  const [isLocalLoading, setIsLocalLoading] = useState(false);

  // Tabs: Product, User, Book
  const [activeTab, setActiveTab] = useState("Product");

  // Selection states
  const [viewReport, setViewReport] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // { reportId, type: 'resolve'|'dismiss' }

  // Trigger search loader
  useEffect(() => {
    setIsLocalLoading(true);
    const timer = setTimeout(() => setIsLocalLoading(false), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, activeTab]);

  // Filter evaluation
  const filteredReports = reports.filter((r) => {
    const matchesTab = r.type === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      r.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reporterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Action execute
  const executeReportAction = () => {
    const { reportId, type } = confirmAction;
    if (type === "resolve") resolveReport(reportId);
    else if (type === "dismiss") dismissReport(reportId);

    // Sync modal overlay
    if (viewReport && viewReport.id === reportId) {
      setViewReport({
        ...viewReport,
        status: type === "resolve" ? "Resolved" : "Dismissed"
      });
    }

    setConfirmAction(null);
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    const styles = {
      Pending: "bg-amber-50 text-amber-700 border-amber-100/80 animate-pulse",
      Resolved: "bg-emerald-50 text-emerald-700 border-emerald-100/80",
      Dismissed: "bg-slate-100 text-slate-500 border-slate-200/80"
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

  // Count helper
  const getTabCount = (type) => {
    return reports.filter((r) => r.type === type && r.status === "Pending").length;
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP TAB SELECTION ROWS */}
      <div className="admin-glass-card rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 self-start sm:self-center">
          {["Product", "User", "Book"].map((tab) => {
            const count = getTabCount(tab);
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all flex items-center gap-2 ${
                  activeTab === tab
                    ? "bg-primary border-primary text-white shadow-sm font-bold"
                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                <span>Reported {tab}s</span>
                {count > 0 && (
                  <span className={`h-5 w-5 rounded-full text-[9px] font-black flex items-center justify-center ${
                    activeTab === tab ? "bg-white text-primary" : "bg-red-500 text-white"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <span className="text-xs font-semibold text-slate-400">
          Showing <span className="font-bold text-slate-600">{filteredReports.length}</span> reports
        </span>
      </div>

      {/* 2. REPORTS DATA LIST TABLE */}
      {isLocalLoading ? (
        <Skeleton type="table" />
      ) : filteredReports.length === 0 ? (
        <div className="admin-glass-card rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <FiAlertTriangle className="text-slate-300 text-4xl mb-3 animate-pulse" />
          <h3 className="text-sm font-bold text-slate-700">No Reports Logged</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            We couldn't find any pending or completed reports for reported {activeTab.toLowerCase()}s.
          </p>
        </div>
      ) : (
        <div className="admin-glass-card rounded-2xl overflow-hidden border border-slate-200/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="admin-table-hdr text-slate-500 border-b border-slate-100 font-extrabold uppercase tracking-wider">
                  <th className="p-4">Report ID</th>
                  <th className="p-4">Reported Target</th>
                  <th className="p-4">Reporter</th>
                  <th className="p-4">Reason / Violation</th>
                  <th className="p-4">Reported Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Moderator Decisions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-700">{rep.id}</td>
                    <td className="p-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-rose-50 border border-rose-100/50 flex items-center justify-center text-rose-600 text-sm font-bold shrink-0">
                        <FiFlag />
                      </div>
                      <div>
                        <span
                          className="font-bold text-slate-800 hover:text-primary cursor-pointer hover:underline"
                          onClick={() => setViewReport(rep)}
                        >
                          {rep.targetName}
                        </span>
                        <span className="text-[9px] text-slate-400 block font-mono">
                          ID: {rep.targetId}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 font-semibold">{rep.reporterName}</td>
                    <td className="p-4 text-slate-500 font-medium">
                      <span className="bg-rose-50 text-rose-700 px-2 py-0.5 border border-rose-100/50 rounded-lg font-bold text-[9px] block w-fit">
                        {rep.reason}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 font-mono">
                      {rep.createdAt ? new Date(rep.createdAt).toLocaleDateString() : "2026-06-30"}
                    </td>
                    <td className="p-4">{renderStatusBadge(rep.status)}</td>
                    <td className="p-4 text-right space-x-1">
                      <button
                        onClick={() => setViewReport(rep)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer animate-fade-in"
                        title="View Report Evidence"
                      >
                        <FiEye className="text-sm" />
                      </button>

                      {rep.status === "Pending" && (
                        <>
                          <button
                            onClick={() => setConfirmAction({ reportId: rep.id, type: "resolve" })}
                            className="p-1.5 text-emerald-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg cursor-pointer"
                            title="Resolve Violation (Take Action)"
                          >
                            <FiCheckCircle className="text-sm" />
                          </button>
                          <button
                            onClick={() => setConfirmAction({ reportId: rep.id, type: "dismiss" })}
                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                            title="Dismiss Report (No Violation)"
                          >
                            <FiXCircle className="text-sm" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. MODAL: DETAILED EVIDENCE CARD */}
      <AnimatePresence>
        {viewReport && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewReport(null)}
              className="fixed inset-0 bg-slate-900"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="bg-white rounded-3xl shadow-xl border border-slate-200 w-full max-w-md p-6 relative z-10 space-y-4"
            >
              <button
                onClick={() => setViewReport(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <FiX />
              </button>

              <h3 className="text-base font-black text-slate-800 tracking-tight">Violation Review Center</h3>

              <div className="space-y-3.5 text-xs">
                {/* Target */}
                <div>
                  <h4 className="text-slate-400 font-medium">Reported {viewReport.type} Details</h4>
                  <p className="font-bold text-slate-800 mt-1 bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FiFlag className="text-rose-500" /> {viewReport.targetName}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">ID: {viewReport.targetId}</span>
                  </p>
                </div>

                {/* Reporter / Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-slate-400 font-medium">Reporter Name</h4>
                    <p className="font-bold text-slate-700 mt-0.5 flex items-center gap-1">
                      <FiUser className="text-slate-400" /> {viewReport.reporterName}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-slate-400 font-medium">Date reported</h4>
                    <p className="font-bold text-slate-700 mt-0.5 flex items-center gap-1">
                      <FiClock className="text-slate-400" /> {viewReport.createdAt ? new Date(viewReport.createdAt).toLocaleDateString() : "2026-06-30"}
                    </p>
                  </div>
                </div>

                {/* Violation Code */}
                <div>
                  <h4 className="text-slate-400 font-medium">Reported Category</h4>
                  <p className="mt-1 font-bold text-rose-700 bg-rose-50 border border-rose-100/50 rounded-lg px-2.5 py-1 w-fit">
                    {viewReport.reason}
                  </p>
                </div>

                {/* Evidence text */}
                <div>
                  <h4 className="text-slate-400 font-medium flex items-center gap-1">
                    <FiFileText /> Evidence details description
                  </h4>
                  <p className="mt-1.5 p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 leading-relaxed italic text-[11px]">
                    "{viewReport.evidence}"
                  </p>
                </div>

                {/* Resolution Status */}
                <div>
                  <h4 className="text-slate-400 font-medium mb-1">Status standing</h4>
                  {renderStatusBadge(viewReport.status)}
                </div>
              </div>

              {/* Action buttons */}
              {viewReport.status === "Pending" && (
                <div className="flex gap-2 pt-4 border-t border-slate-100 justify-end">
                  <button
                    onClick={() => setConfirmAction({ reportId: viewReport.id, type: "resolve" })}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Resolve Report
                  </button>
                  <button
                    onClick={() => setConfirmAction({ reportId: viewReport.id, type: "dismiss" })}
                    className="px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Dismiss Report
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. REUSABLE CONFIRMATION MODAL */}
      {confirmAction && (() => {
        const { type } = confirmAction;
        let title = "";
        let message = "";
        let confirmText = "Confirm";
        let modalType = "warning";

        if (type === "resolve") {
          title = "Resolve reported violation";
          message = "Mark this violation report as resolved? This confirms that administrative action has been taken (e.g. suspension, listing deletion, or warn notices issued).";
          confirmText = "Mark Resolved";
          modalType = "info";
        } else if (type === "dismiss") {
          title = "Dismiss reported violation";
          message = "Dismiss this violation ticket? This indicates that upon investigation, no platform terms were found to be violated, and the listing/profile remains in good standing.";
          confirmText = "Dismiss Ticket";
          modalType = "warning";
        }

        return (
          <ConfirmationModal
            isOpen={confirmAction !== null}
            onClose={() => setConfirmAction(null)}
            onConfirm={executeReportAction}
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
