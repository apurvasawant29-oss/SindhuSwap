import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FiTrendingUp, FiEye, FiX, FiClock } from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";

export default function Orders() {
  const { searchQuery } = useOutletContext();
  const { orders } = useAdmin();
  const [viewOrder, setViewOrder] = useState(null);

  const filteredOrders = orders.filter(
    (o) =>
      searchQuery === "" ||
      o.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.seller.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="admin-glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 className="text-sm font-bold text-slate-800">Product Sales Orders</h3>
          <span className="text-xs font-semibold text-slate-400">Total Transactions: {orders.length}</span>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">No orders logged.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Seller</th>
                  <th className="p-4">Buyer</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50 border-b border-slate-50">
                    <td className="p-4 font-mono font-bold text-slate-700">{o.id}</td>
                    <td className="p-4 font-semibold text-slate-800">{o.productName}</td>
                    <td className="p-4 text-slate-600">{o.seller}</td>
                    <td className="p-4 text-slate-600">{o.buyer}</td>
                    <td className="p-4 font-extrabold text-teal-600">Rs. {o.price.toLocaleString()}</td>
                    <td className="p-4 text-slate-400 font-mono">{o.paymentMethod}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-lg border font-bold text-[10px] ${
                        o.status === "Completed" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setViewOrder(o)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                      >
                        <FiEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Order Modal */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40" onClick={() => setViewOrder(null)} />
          <div className="bg-white rounded-2xl p-6 relative z-10 w-full max-w-md space-y-4 shadow-xl">
            <button type="button" onClick={() => setViewOrder(null)} className="absolute top-4 right-4 text-slate-400">
              <FiX />
            </button>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5"><FiTrendingUp className="text-teal-600" /> Order Specifications</h3>
            
            <div className="space-y-3.5 text-xs">
              <div>
                <h4 className="text-slate-400 font-medium">Order ID</h4>
                <p className="font-mono font-bold text-slate-700 mt-0.5">{viewOrder.id}</p>
              </div>
              <div>
                <h4 className="text-slate-400 font-medium">Product Item</h4>
                <p className="font-bold text-slate-800 mt-0.5">{viewOrder.productName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-slate-400 font-medium">Seller</h4>
                  <p className="font-semibold text-slate-700 mt-0.5">{viewOrder.seller}</p>
                </div>
                <div>
                  <h4 className="text-slate-400 font-medium">Buyer</h4>
                  <p className="font-semibold text-slate-700 mt-0.5">{viewOrder.buyer}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-slate-400 font-medium">Price Paid</h4>
                  <p className="font-extrabold text-teal-600 mt-0.5">Rs. {viewOrder.price.toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-slate-400 font-medium">Transaction Date</h4>
                  <p className="font-semibold text-slate-700 mt-0.5 flex items-center gap-1"><FiClock /> {viewOrder.date}</p>
                </div>
              </div>
              <div>
                <h4 className="text-slate-400 font-medium">Payment processor</h4>
                <p className="font-mono font-bold text-slate-700 mt-0.5">{viewOrder.paymentMethod}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
