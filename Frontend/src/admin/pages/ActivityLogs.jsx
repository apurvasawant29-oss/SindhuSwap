import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FiList, FiClock, FiShield } from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";

export default function ActivityLogs() {
  const { searchQuery } = useOutletContext();
  const { activityLogs } = useAdmin();

  // Search evaluation
  const filteredLogs = activityLogs.filter(
    (log) =>
      searchQuery === "" ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="admin-glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5"><FiList className="text-teal-600" /> Platform Security Audit Trail</h3>
          <span className="text-xs font-semibold text-slate-400">Total Entries: {activityLogs.length}</span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">No audit logs matched search criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Admin Agent</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Affected Resource</th>
                  <th className="p-4">Operational Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 border-b border-slate-50 text-[11px] leading-relaxed">
                    <td className="p-4 text-slate-400 font-mono flex items-center gap-1 mt-1.5">
                      <FiClock /> {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 font-semibold text-slate-700 flex items-center gap-1 mt-1.5">
                      <FiShield className="text-slate-400 text-xs shrink-0" /> {log.admin}
                    </td>
                    <td className="p-4">
                      <span className="bg-teal-50 text-teal-800 border border-teal-100/50 rounded-lg px-2.5 py-0.5 font-bold uppercase text-[9px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-slate-800 font-bold">{log.target}</td>
                    <td className="p-4 text-slate-400 font-medium italic">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
