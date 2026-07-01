import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FiCreditCard, FiPrinter, FiX, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";

export default function Transactions() {
  const { searchQuery } = useOutletContext();
  const { transactions } = useAdmin();
  const [viewTx, setViewTx] = useState(null);

  const filteredTx = transactions.filter(
    (t) =>
      searchQuery === "" ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.receiver.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="admin-glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 className="text-sm font-bold text-slate-800">Payment Gateway Logs</h3>
          <span className="text-xs font-semibold text-slate-400">Total: {transactions.length} records</span>
        </div>

        {filteredTx.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">No payment logs found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold">
                  <th className="p-4">Transaction Ref</th>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Sender</th>
                  <th className="p-4">Receiver</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTx.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 border-b border-slate-50">
                    <td className="p-4 font-mono font-bold text-slate-700">{t.id}</td>
                    <td className="p-4 font-mono text-slate-500">{t.orderId}</td>
                    <td className="p-4 text-slate-600 font-semibold">{t.sender}</td>
                    <td className="p-4 text-slate-600 font-semibold">{t.receiver}</td>
                    <td className="p-4 font-extrabold text-teal-600">Rs. {t.amount.toLocaleString()}</td>
                    <td className="p-4 text-slate-400">{t.method}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-lg border font-bold text-[10px] flex items-center gap-1 w-fit ${
                        t.status === "Success" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"
                      }`}>
                        {t.status === "Success" ? <FiCheckCircle /> : <FiXCircle />} {t.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setViewTx(t)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                      >
                        <FiPrinter />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice receipt print popup */}
      {viewTx && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40" onClick={() => setViewTx(null)} />
          <div className="bg-white rounded-2xl p-6 relative z-10 w-full max-w-sm space-y-4 shadow-xl text-xs">
            <button type="button" onClick={() => setViewTx(null)} className="absolute top-4 right-4 text-slate-400">
              <FiX />
            </button>
            
            {/* Header branding */}
            <div className="text-center pb-3 border-b border-dashed border-slate-200">
              <span className="font-extrabold text-sm text-slate-800">SindhuSwap Invoice</span>
              <p className="text-[10px] text-slate-400 mt-1">Payment Reference Receipt</p>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Gateway Ref</span>
                <span className="font-mono font-bold text-slate-700">{viewTx.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Order ID Reference</span>
                <span className="font-mono text-slate-700">{viewTx.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sender (Debited)</span>
                <span className="font-semibold text-slate-700">{viewTx.sender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Receiver (Credited)</span>
                <span className="font-semibold text-slate-700">{viewTx.receiver}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Method</span>
                <span className="text-slate-700">{viewTx.method}</span>
              </div>
              <hr className="border-dashed border-slate-100" />
              <div className="flex justify-between text-sm">
                <span className="font-bold text-slate-800">Grand Total</span>
                <span className="font-extrabold text-teal-600">Rs. {viewTx.amount.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full mt-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 flex items-center justify-center gap-1.5"
            >
              <FiPrinter /> Print Invoice Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
