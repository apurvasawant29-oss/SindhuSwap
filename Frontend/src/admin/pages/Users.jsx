import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEye,
  FiUserMinus,
  FiUserX,
  FiUserCheck,
  FiTrash2,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiStar,
  FiX,
  FiSettings,
  FiShield
} from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";
import Skeleton from "../components/common/Skeleton";
import ConfirmationModal from "../components/common/ConfirmationModal";

export default function Users() {
  const { searchQuery } = useOutletContext(); // header search
  const {
    users,
    products,
    bookSwaps,
    reviews,
    suspendUser,
    banUser,
    activateUser,
    deleteUser,
    updateUserRole
  } = useAdmin();

  const [isLocalLoading, setIsLocalLoading] = useState(false);

  // Filters
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterTaluka, setFilterTaluka] = useState("All");

  // Selection states for modalling
  const [viewUser, setViewUser] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // { userId, type: 'suspend'|'ban'|'activate'|'delete' }

  // Trigger search loader
  useEffect(() => {
    setIsLocalLoading(true);
    const timer = setTimeout(() => setIsLocalLoading(false), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, filterRole, filterStatus, filterTaluka]);

  // Filter evaluation
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      searchQuery === "" ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = filterRole === "All" || u.role === filterRole;
    const matchesStatus = filterStatus === "All" || u.status === filterStatus;
    const matchesTaluka = filterTaluka === "All" || u.taluka === filterTaluka;

    return matchesSearch && matchesRole && matchesStatus && matchesTaluka;
  });

  // Calculate listing stats for a user
  const getUserStats = (userId, userName) => {
    const userListingsCount = products.filter((p) => p.sellerId === userId || p.seller === userName).length;
    const userSwapsCount = bookSwaps.filter(
      (s) => s.ownerId === userId || s.ownerName === userName || s.requesterId === userId || s.requesterName === userName
    ).length;
    const userReviews = reviews.filter((r) => r.targetUser === userName);
    return {
      listingsCount: userListingsCount,
      swapsCount: userSwapsCount,
      reviews: userReviews
    };
  };

  // Status trigger submission
  const executeUserAction = () => {
    const { userId, type } = confirmAction;
    if (type === "suspend") suspendUser(userId);
    else if (type === "ban") banUser(userId);
    else if (type === "activate") activateUser(userId);
    else if (type === "delete") deleteUser(userId);

    // If viewing the updated user, sync view state
    if (viewUser && viewUser.id === userId) {
      // Find updated user data
      const updatedUser = users.find((u) => u.id === userId);
      if (type === "delete") setViewUser(null);
      else setViewUser({ ...viewUser, status: type === "suspend" ? "Suspended" : type === "ban" ? "Banned" : "Active" });
    }

    setConfirmAction(null);
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    const styles = {
      Active: "bg-emerald-50 text-emerald-700 border-emerald-100/80",
      Suspended: "bg-amber-50 text-amber-700 border-amber-100/80",
      Banned: "bg-rose-50 text-rose-700 border-rose-100/80"
    };
    return (
      <span
        className={`inline-flex items-center text-[10px] font-bold border rounded-lg px-2 py-0.5 ${
          styles[status] || styles.Active
        }`}
      >
        {status}
      </span>
    );
  };

  // Unique talukas list from users
  const uniqueTalukas = [...new Set(users.map((u) => u.taluka))];

  return (
    <div className="space-y-6">
      {/* 1. FILTER CONTROLS BAR */}
      <div className="admin-glass-card rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Role Filter */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">User Role</label>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2.5 outline-none font-medium text-slate-600"
          >
            <option value="All">All Roles</option>
            <option value="User">User</option>
            <option value="Moderator">Moderator</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Account Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2.5 outline-none font-medium text-slate-600"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Banned">Banned</option>
          </select>
        </div>

        {/* Taluka location filter */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Taluka Location</label>
          <select
            value={filterTaluka}
            onChange={(e) => setFilterTaluka(e.target.value)}
            className="w-full text-xs bg-white border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2.5 outline-none font-medium text-slate-600"
          >
            <option value="All">All Talukas</option>
            {uniqueTalukas.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Reset Buttons */}
        <div className="flex items-end">
          <button
            onClick={() => {
              setFilterRole("All");
              setFilterStatus("All");
              setFilterTaluka("All");
            }}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <FiX /> Reset Filters
          </button>
        </div>
      </div>

      {/* 2. USER DATABASE TABLE */}
      {isLocalLoading ? (
        <Skeleton type="table" />
      ) : filteredUsers.length === 0 ? (
        <div className="admin-glass-card rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <FiUserX className="text-slate-300 text-4xl mb-3 animate-pulse" />
          <h3 className="text-sm font-bold text-slate-700">No Users Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            We couldn't find any user profiles matching your query. Update filters and try again.
          </p>
        </div>
      ) : (
        <div className="admin-glass-card rounded-2xl overflow-hidden border border-slate-200/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="admin-table-hdr text-slate-500 border-b border-slate-100 font-extrabold uppercase tracking-wider">
                  <th className="p-4">User Details</th>
                  <th className="p-4">Taluka Location</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* User info card */}
                    <td className="p-4 flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-slate-200 cursor-pointer"
                        onClick={() => setViewUser(user)}
                      >
                        <img src={user.profileImage} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <span
                          className="font-bold text-slate-800 hover:text-primary cursor-pointer hover:underline"
                          onClick={() => setViewUser(user)}
                        >
                          {user.name}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{user.email}</span>
                      </div>
                    </td>

                    {/* Taluka */}
                    <td className="p-4 text-slate-500 font-medium">{user.taluka}</td>

                    {/* Verification Rating */}
                    <td className="p-4 font-mono font-bold text-amber-500 flex items-center gap-0.5 mt-2">
                      <FiStar className="fill-amber-500" /> {user.rating}
                    </td>

                    {/* Date Joined */}
                    <td className="p-4 text-slate-400 font-mono">{user.joinedDate}</td>

                    {/* Role selector selector */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <FiShield className="text-slate-400 text-xs shrink-0" />
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-600 rounded-lg px-2 py-1 outline-none focus:border-teal-500"
                        >
                          <option value="User">User</option>
                          <option value="Moderator">Mod</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </div>
                    </td>

                    {/* Account Status */}
                    <td className="p-4">{renderStatusBadge(user.status)}</td>

                    {/* Control options */}
                    <td className="p-4 text-right space-x-1">
                      <button
                        onClick={() => setViewUser(user)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
                        title="View Full Profile"
                      >
                        <FiEye className="text-sm" />
                      </button>

                      {user.status === "Active" ? (
                        <button
                          onClick={() => setConfirmAction({ userId: user.id, type: "suspend" })}
                          className="p-1.5 text-amber-500 hover:text-amber-800 hover:bg-amber-50 rounded-lg cursor-pointer"
                          title="Suspend Privileges"
                        >
                          <FiUserMinus className="text-sm" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setConfirmAction({ userId: user.id, type: "activate" })}
                          className="p-1.5 text-emerald-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg cursor-pointer"
                          title="Restore / Activate"
                        >
                          <FiUserCheck className="text-sm" />
                        </button>
                      )}

                      {user.status !== "Banned" && (
                        <button
                          onClick={() => setConfirmAction({ userId: user.id, type: "ban" })}
                          className="p-1.5 text-rose-500 hover:text-rose-800 hover:bg-rose-50 rounded-lg cursor-pointer"
                          title="Ban Credentials"
                        >
                          <FiUserX className="text-sm" />
                        </button>
                      )}

                      <button
                        onClick={() => setConfirmAction({ userId: user.id, type: "delete" })}
                        className="p-1.5 text-red-500 hover:text-red-800 hover:bg-red-50 rounded-lg cursor-pointer"
                        title="Delete Profile permanently"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. MODAL: PROFILE CARD DETAIL CARD */}
      <AnimatePresence>
        {viewUser && (() => {
          const stats = getUserStats(viewUser.id, viewUser.name);
          return (
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                onClick={() => setViewUser(null)}
                className="fixed inset-0 bg-slate-900"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden relative z-10"
              >
                {/* Close Button */}
                <button
                  onClick={() => setViewUser(null)}
                  className="absolute top-4 right-4 p-1.5 bg-slate-900/10 text-white hover:bg-slate-900/20 rounded-full z-20 cursor-pointer"
                >
                  <FiX />
                </button>

                {/* Profile Cover image */}
                <div className="h-28 bg-gradient-to-r from-teal-700 to-teal-500 relative shrink-0">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)]" />
                </div>

                {/* User avatar and identity info */}
                <div className="px-6 pb-6 relative">
                  <div className="flex justify-between items-end -translate-y-6 mb-2">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-4 border-white bg-slate-100 shadow-md">
                      <img src={viewUser.profileImage} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex gap-2">
                      {renderStatusBadge(viewUser.status)}
                      <span className="text-[10px] font-mono font-bold bg-slate-100 border border-slate-200 text-slate-500 rounded-lg px-2.5 py-0.5">
                        {viewUser.role}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-800 tracking-tight">{viewUser.name}</h3>
                    <p className="text-[10px] text-slate-400 font-medium">User Registration ID: {viewUser.id}</p>
                  </div>

                  {/* Summary Metric Counters */}
                  <div className="grid grid-cols-3 gap-3 border-y border-slate-100 py-3.5 my-4 text-center">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Listings</span>
                      <strong className="text-lg font-black text-slate-800 tracking-tight">{stats.listingsCount}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Swaps done</span>
                      <strong className="text-lg font-black text-slate-800 tracking-tight">{stats.swapsCount}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Reputation</span>
                      <strong className="text-lg font-black text-amber-500 tracking-tight flex items-center justify-center gap-0.5">
                        <FiStar className="fill-amber-500 text-sm" /> {viewUser.rating}
                      </strong>
                    </div>
                  </div>

                  {/* Context Info block */}
                  <div className="space-y-2.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <FiMail className="text-slate-400 text-sm" /> <span>{viewUser.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiPhone className="text-slate-400 text-sm" /> <span>{viewUser.phone || "+91 98XXX XXX00"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiMapPin className="text-slate-400 text-sm" /> <span>{viewUser.taluka} Taluka boundary</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-slate-400 text-sm" /> <span>Joined on: {viewUser.joinedDate}</span>
                    </div>
                  </div>

                  {/* Review feedback list preview */}
                  <div className="mt-5 space-y-2">
                    <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Recent User Reviews</h4>
                    {stats.reviews.length === 0 ? (
                      <div className="text-[10px] text-slate-400 py-3 bg-slate-50 border border-slate-100 rounded-xl text-center italic">
                        No community feedback reviews logged yet.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-24 overflow-y-auto admin-scrollbar">
                        {stats.reviews.map((rev) => (
                          <div key={rev.id} className="p-2 border border-slate-100 rounded-lg text-[10px]">
                            <div className="flex justify-between font-bold text-slate-600">
                              <span>By: {rev.user}</span>
                              <span className="text-amber-500">Rating: {rev.rating}/5</span>
                            </div>
                            <p className="text-slate-400 mt-0.5 italic">"{rev.comment}"</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action drawers in profile view */}
                  <div className="flex gap-2 mt-6 pt-4 border-t border-slate-100 justify-end">
                    {viewUser.status === "Active" ? (
                      <button
                        onClick={() => setConfirmAction({ userId: viewUser.id, type: "suspend" })}
                        className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => setConfirmAction({ userId: viewUser.id, type: "activate" })}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Activate
                      </button>
                    )}
                    {viewUser.status !== "Banned" && (
                      <button
                        onClick={() => setConfirmAction({ userId: viewUser.id, type: "ban" })}
                        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Ban Account
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* 4. REUSABLE CONFIRMATION MODAL */}
      {confirmAction && (() => {
        const user = users.find((u) => u.id === confirmAction.userId);
        const { type } = confirmAction;
        
        let title = "";
        let message = "";
        let confirmText = "Confirm";
        let modalType = "warning";

        if (type === "suspend") {
          title = `Suspend ${user?.name}`;
          message = `Are you sure you want to suspend this user's account? Suspended users will not be allowed to submit new products or requests, but their listings will remain archived.`;
          confirmText = "Suspend Account";
          modalType = "warning";
        } else if (type === "ban") {
          title = `Ban ${user?.name}`;
          message = `Are you sure you want to permanently BAN this user account? Banned accounts are locked from logging in, and all active listings are instantly hidden.`;
          confirmText = "Ban User permanently";
          modalType = "danger";
        } else if (type === "activate") {
          title = `Activate ${user?.name}`;
          message = `Restore user account privileges? The account will be reset to Active standing instantly.`;
          confirmText = "Activate Account";
          modalType = "info";
        } else if (type === "delete") {
          title = `Delete Profile: ${user?.name}`;
          message = `Confirm permanent deletion of this user profile? All products, books, orders, and listings belonging to this user will be deleted forever.`;
          confirmText = "Delete User permanently";
          modalType = "danger";
        }

        return (
          <ConfirmationModal
            isOpen={confirmAction !== null}
            onClose={() => setConfirmAction(null)}
            onConfirm={executeUserAction}
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
