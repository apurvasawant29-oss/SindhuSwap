import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiFilter,
  FiCheckCircle,
  FiXCircle,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiX,
  FiCamera,
  FiMapPin,
  FiGrid
} from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";
import Skeleton from "../components/common/Skeleton";
import ConfirmationModal from "../components/common/ConfirmationModal";
import { getProductImageSrc } from "../../utils/productImage";

export default function Products() {
  const { searchQuery } = useOutletContext(); // Quick search from header
  const {
    products,
    categories,
    talukas,
    approveProduct,
    rejectProduct,
    deleteProduct,
    updateProduct,
    bulkDeleteProducts,
    bulkApproveProducts,
    bulkRejectProducts
  } = useAdmin();

  // Loading indicator for searches/actions
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  // Filter states
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterTaluka, setFilterTaluka] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Selection states
  const [selectedIds, setSelectedIds] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal control states
  const [viewProduct, setViewProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [bulkActionType, setBulkActionType] = useState(null); // 'approve', 'reject', 'delete'

  // Form edit fields
  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    price: 0,
    condition: "",
    taluka: "",
    status: ""
  });

  // Trigger search/filter loader animation
  useEffect(() => {
    setIsLocalLoading(true);
    const timer = setTimeout(() => setIsLocalLoading(false), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, filterCategory, filterTaluka, filterStatus]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [searchQuery, filterCategory, filterTaluka, filterStatus]);

  // --- FILTERS EVALUATION ---
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === "All" || p.category === filterCategory;
    const matchesTaluka = filterTaluka === "All" || p.taluka === filterTaluka;
    const matchesStatus = filterStatus === "All" || p.status === filterStatus;

    return matchesSearch && matchesCategory && matchesTaluka && matchesStatus;
  });

  // --- PAGINATION COMPILATION ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Select handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const pageIds = currentItems.map((item) => item.id);
      setSelectedIds((prev) => [...new Set([...prev, ...pageIds])]);
    } else {
      const pageIds = currentItems.map((item) => item.id);
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    }
  };

  const handleSelectItem = (id, checked) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  // Bulk execution
  const executeBulkAction = () => {
    if (bulkActionType === "approve") {
      bulkApproveProducts(selectedIds);
    } else if (bulkActionType === "reject") {
      bulkRejectProducts(selectedIds);
    } else if (bulkActionType === "delete") {
      bulkDeleteProducts(selectedIds);
    }
    setSelectedIds([]);
    setBulkActionType(null);
  };

  // Single edit submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateProduct(editProduct.id, editForm);
    setEditProduct(null);
  };

  // Fill edit form
  const openEditModal = (p) => {
    setEditProduct(p);
    setEditForm({
      name: p.name,
      category: p.category,
      price: p.price,
      condition: p.condition,
      taluka: p.taluka,
      status: p.status
    });
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    const config = {
      Available: "bg-emerald-50 text-emerald-700 border-emerald-100/80",
      Exchanged: "bg-blue-50 text-blue-700 border-blue-100/80",
      Sold: "bg-slate-100 text-slate-600 border-slate-200/80",
      "Pending Approval": "bg-amber-50 text-amber-700 border-amber-100/80",
      Rejected: "bg-rose-50 text-rose-700 border-rose-100/80"
    };
    return (
      <span
        className={`inline-flex items-center text-[10px] font-bold border rounded-lg px-2.5 py-0.5 whitespace-nowrap ${
          config[status] || config.Available
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. FILTER CONTROLS BAR */}
      <div className="admin-glass-card rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Category</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2.5 outline-none font-medium text-slate-600"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Taluka Filter */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Taluka Location</label>
          <select
            value={filterTaluka}
            onChange={(e) => setFilterTaluka(e.target.value)}
            className="w-full text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2.5 outline-none font-medium text-slate-600"
          >
            <option value="All">All Talukas</option>
            {talukas.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Listing Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2.5 outline-none font-medium text-slate-600"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Exchanged">Exchanged</option>
            <option value="Sold">Sold</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className="flex items-end">
          <button
            onClick={() => {
              setFilterCategory("All");
              setFilterTaluka("All");
              setFilterStatus("All");
            }}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <FiX /> Reset Filters
          </button>
        </div>
      </div>

      {/* 2. BULK ACTION BAR */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="p-4 rounded-xl border border-teal-100 bg-teal-50/45 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm"
          >
            <span className="text-xs font-bold text-teal-800">
              Selected: <span className="underline font-black">{selectedIds.length}</span> items
            </span>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => setBulkActionType("approve")}
                className="flex-1 sm:flex-none px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <FiCheckCircle className="text-sm" /> Bulk Approve
              </button>
              <button
                onClick={() => setBulkActionType("reject")}
                className="flex-1 sm:flex-none px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <FiXCircle className="text-sm" /> Bulk Reject
              </button>
              <button
                onClick={() => setBulkActionType("delete")}
                className="flex-1 sm:flex-none px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <FiTrash2 className="text-sm" /> Bulk Delete
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="p-1.5 bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-lg cursor-pointer shadow-sm text-xs"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. PRODUCT LIST TABLE */}
      {isLocalLoading ? (
        <Skeleton type="table" />
      ) : filteredProducts.length === 0 ? (
        <div className="admin-glass-card rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <FiGrid className="text-slate-300 text-4xl mb-3 animate-pulse" />
          <h3 className="text-sm font-bold text-slate-700">No Listings Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            We couldn't find any products matching your search criteria. Try removing some filters or updating query.
          </p>
        </div>
      ) : (
        <div className="admin-glass-card rounded-2xl overflow-hidden border border-slate-200/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="admin-table-hdr text-slate-500 border-b border-slate-100 font-extrabold uppercase tracking-wider">
                  <th className="p-4 w-12 text-center">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-3.5 h-3.5 cursor-pointer"
                      checked={currentItems.every((item) => selectedIds.includes(item.id))}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="p-4">Product details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Taluka</th>
                  <th className="p-4">Seller</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentItems.map((item) => {
                  const isChecked = selectedIds.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/50 transition-colors ${
                        isChecked ? "bg-teal-50/15" : ""
                      }`}
                    >
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-3.5 h-3.5 cursor-pointer"
                          checked={isChecked}
                          onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                        />
                      </td>
                      <td className="p-4 flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg border border-slate-200/80 overflow-hidden shrink-0 bg-slate-50 cursor-zoom-in"
                          onClick={() => setViewProduct(item)}
                        >
                          <img src={getProductImageSrc(item)} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div>
                          <span
                            className="font-bold text-slate-800 hover:text-primary cursor-pointer hover:underline"
                            onClick={() => setViewProduct(item)}
                          >
                            {item.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono mt-0.5">
                            ID: {item.id}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-500 font-medium">{item.category}</td>
                      <td className="p-4 text-slate-500 font-medium">{item.taluka}</td>
                      <td className="p-4 text-slate-600 font-bold">{item.seller}</td>
                      <td className="p-4 text-slate-800 font-black">Rs. {item.price.toLocaleString()}</td>
                      <td className="p-4">{renderStatusBadge(item.status)}</td>
                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => setViewProduct(item)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                          title="View Details"
                        >
                          <FiEye className="text-sm" />
                        </button>
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-blue-500 hover:text-blue-800 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                          title="Edit Details"
                        >
                          <FiEdit className="text-sm" />
                        </button>
                        <button
                          onClick={() => setDeleteId(item.id)}
                          className="p-1.5 text-red-500 hover:text-red-800 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                          title="Delete Listing"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* TABLE FOOTER / PAGINATION */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              Showing <span className="font-bold text-slate-700">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-bold text-slate-700">
                {Math.min(indexOfLastItem, filteredProducts.length)}
              </span>{" "}
              of <span className="font-bold text-slate-700">{filteredProducts.length}</span> entries
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 rounded-xl disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed text-xs font-semibold"
              >
                <FiChevronLeft />
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 rounded-xl disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed text-xs font-semibold"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL: VIEW DETAILS */}
      <AnimatePresence>
        {viewProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewProduct(null)}
              className="fixed inset-0 bg-slate-900"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-6 relative z-10 space-y-4"
            >
              <button
                onClick={() => setViewProduct(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <FiX />
              </button>

              <h3 className="text-base font-bold text-slate-800 tracking-tight">Listing Specifications</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="aspect-video rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                  <img src={getProductImageSrc(viewProduct)} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <h4 className="text-slate-400 font-medium">Product Name</h4>
                    <p className="font-bold text-slate-800 mt-0.5">{viewProduct.name}</p>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <h4 className="text-slate-400 font-medium">Category</h4>
                      <p className="font-bold text-slate-700 mt-0.5">{viewProduct.category}</p>
                    </div>
                    <div>
                      <h4 className="text-slate-400 font-medium">Condition</h4>
                      <p className="font-bold text-slate-700 mt-0.5">{viewProduct.condition}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <h4 className="text-slate-400 font-medium">Price</h4>
                      <p className="font-extrabold text-teal-600 mt-0.5">Rs. {viewProduct.price.toLocaleString()}</p>
                    </div>
                    <div>
                      <h4 className="text-slate-400 font-medium">Status</h4>
                      <p className="mt-0.5">{renderStatusBadge(viewProduct.status)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <h4 className="text-slate-400 font-medium">Seller details</h4>
                  <p className="font-bold text-slate-700 mt-0.5">{viewProduct.seller} (ID: {viewProduct.sellerId})</p>
                </div>
                <div>
                  <h4 className="text-slate-400 font-medium">Location Taluka</h4>
                  <p className="font-bold text-slate-700 mt-0.5 flex items-center gap-1">
                    <FiMapPin /> {viewProduct.taluka}
                  </p>
                </div>
              </div>

              {viewProduct.status === "Pending Approval" && (
                <div className="flex gap-2 pt-4 border-t border-slate-100 justify-end">
                  <button
                    onClick={() => {
                      approveProduct(viewProduct.id);
                      setViewProduct(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Approve Listing
                  </button>
                  <button
                    onClick={() => {
                      rejectProduct(viewProduct.id);
                      setViewProduct(null);
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Reject Listing
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. MODAL: EDIT PRODUCT */}
      <AnimatePresence>
        {editProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditProduct(null)}
              className="fixed inset-0 bg-slate-900"
            />
            <motion.form
              onSubmit={handleEditSubmit}
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 relative z-10 space-y-4"
            >
              <button
                type="button"
                onClick={() => setEditProduct(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <FiX />
              </button>

              <h3 className="text-base font-bold text-slate-800 tracking-tight">Edit Product Specifications</h3>

              {/* Form inputs */}
              <div className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-500 font-semibold">Product Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2.5 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-slate-500 font-semibold">Category</label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2.5 outline-none font-medium"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-500 font-semibold">Condition</label>
                    <select
                      value={editForm.condition}
                      onChange={(e) => setEditForm({ ...editForm, condition: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2.5 outline-none font-medium"
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Like New">Like New</option>
                      <option value="Fair">Fair</option>
                      <option value="Readable">Readable</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-slate-500 font-semibold">Price (Rs.)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2.5 outline-none font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-500 font-semibold">Taluka Location</label>
                    <select
                      value={editForm.taluka}
                      onChange={(e) => setEditForm({ ...editForm, taluka: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2.5 outline-none font-medium"
                    >
                      {talukas.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 font-semibold">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2.5 outline-none font-medium"
                  >
                    <option value="Available">Available</option>
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Exchanged">Exchanged</option>
                    <option value="Sold">Sold</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2 pt-4 border-t border-slate-100 justify-end">
                <button
                  type="button"
                  onClick={() => setEditProduct(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-teal-800 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm"
                >
                  Save Modifications
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* 6. CONFIRMATION DIALOG: SINGLE DELETE */}
      <ConfirmationModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          deleteProduct(deleteId);
          setDeleteId(null);
        }}
        title="Delete Listing permanently"
        message="Are you sure you want to remove this product listing from the database? This action is irreversible and the listing will immediately disappear from the consumer marketplace."
        confirmText="Permanently Delete"
        type="danger"
      />

      {/* 7. CONFIRMATION DIALOG: BULK ACTION */}
      <ConfirmationModal
        isOpen={bulkActionType !== null}
        onClose={() => setBulkActionType(null)}
        onConfirm={executeBulkAction}
        title={`Execute Bulk ${bulkActionType === "approve" ? "Approval" : bulkActionType === "reject" ? "Rejection" : "Deletion"}`}
        message={`Are you sure you want to perform bulk ${bulkActionType} on the ${selectedIds.length} selected listings?`}
        confirmText={`Execute Bulk ${bulkActionType}`}
        type={bulkActionType === "delete" ? "danger" : "warning"}
      />
    </div>
  );
}
