import { useState } from "react";
import { FiMail, FiTrash2, FiEye, FiX, FiCheck } from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";

export default function Messages() {
  const { messages, readMessage, deleteMessage } = useAdmin();
  const [viewMsg, setViewMsg] = useState(null);

  const handleOpen = (m) => {
    setViewMsg(m);
    readMessage(m.id);
  };

  return (
    <div className="space-y-6">
      <div className="admin-glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 className="text-sm font-bold text-slate-800">Support Inquiries</h3>
          <span className="text-xs font-semibold text-slate-400">Inbound Tickets: {messages.length}</span>
        </div>

        {messages.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">No support tickets recorded.</div>
        ) : (
          <div className="space-y-3.5">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-4 border rounded-xl flex items-center justify-between gap-4 transition-colors ${
                  m.status === "Unread"
                    ? "bg-teal-50/15 border-teal-100/60 text-slate-800"
                    : "bg-slate-50/50 border-slate-150 text-slate-500"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FiMail className={m.status === "Unread" ? "text-teal-600 shrink-0" : "text-slate-400 shrink-0"} />
                  <div className="truncate">
                    <span className="text-xs font-bold text-slate-700">{m.senderName}</span>
                    <span className="text-[10px] text-slate-400 font-mono ml-2">({m.senderEmail})</span>
                    <p className="text-[11px] font-medium text-slate-600 truncate mt-0.5">{m.subject}</p>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleOpen(m)}
                    className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <FiEye /> View Content
                  </button>
                  <button
                    onClick={() => deleteMessage(m.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Message Modal */}
      {viewMsg && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40" onClick={() => setViewMsg(null)} />
          <div className="bg-white rounded-2xl p-6 relative z-10 w-full max-w-md space-y-4 shadow-xl text-xs">
            <button type="button" onClick={() => setViewMsg(null)} className="absolute top-4 right-4 text-slate-400">
              <FiX />
            </button>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5"><FiMail className="text-teal-600" /> Message Specs</h3>
            
            <div className="space-y-3 leading-relaxed">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-slate-400 font-medium">Sender Name</h4>
                  <p className="font-semibold text-slate-800 mt-0.5">{viewMsg.senderName}</p>
                </div>
                <div>
                  <h4 className="text-slate-400 font-medium">Sender Email</h4>
                  <p className="font-semibold text-slate-800 mt-0.5 font-mono">{viewMsg.senderEmail}</p>
                </div>
              </div>
              <div>
                <h4 className="text-slate-400 font-medium">Subject Line</h4>
                <p className="font-bold text-slate-800 mt-0.5">{viewMsg.subject}</p>
              </div>
              <div>
                <h4 className="text-slate-400 font-medium">Message Body</h4>
                <p className="mt-1.5 p-3 bg-slate-50 border rounded-xl text-slate-600 italic">
                  "{viewMsg.message}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
