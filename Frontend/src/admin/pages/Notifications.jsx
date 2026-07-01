import { useState } from "react";
import { FiBell, FiPlus, FiTrash2, FiSend } from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";
import { toast } from "react-toastify";

export default function Notifications() {
  const { adminNotifications, sendPushNotification, clearNotification } = useAdmin();
  const [notifyMsg, setNotifyMsg] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (notifyMsg.trim()) {
      sendPushNotification(notifyMsg.trim());
      setNotifyMsg("");
      toast.success("Push notification broadcasted successfully!");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Broadcast Alert */}
      <div className="admin-glass-card rounded-2xl p-5 h-fit space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5"><FiBell className="text-teal-600 animate-bounce" /> Broadcast System Alert</h3>
        <form onSubmit={handleSend} className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-500">Alert Message</label>
            <textarea
              required
              rows="3"
              placeholder="Broadcast alert message to all moderator channels..."
              value={notifyMsg}
              onChange={(e) => setNotifyMsg(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2.5 outline-none text-slate-700"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-primary hover:bg-teal-800 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <FiSend /> Dispatch Broadcast
          </button>
        </form>
      </div>

      {/* Dispatch logs */}
      <div className="md:col-span-2 admin-glass-card rounded-2xl p-5">
        <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Dispatched System Alerts</h3>
        
        <div className="space-y-2.5 pr-1 max-h-[380px] overflow-y-auto admin-scrollbar">
          {adminNotifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">No system alerts dispatched yet.</div>
          ) : (
            adminNotifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 border rounded-xl flex items-center justify-between gap-3 text-xs ${
                  n.read ? "bg-slate-50/50 border-slate-150 text-slate-500" : "bg-teal-50/20 border-teal-100/50 text-slate-700 font-medium"
                }`}
              >
                <div>
                  <p className="leading-relaxed">{n.text}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                </div>
                <button
                  onClick={() => clearNotification(n.id)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
