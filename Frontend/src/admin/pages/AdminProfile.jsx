import { useState } from "react";
import { FiUser, FiMail, FiPhone, FiLock, FiCheckCircle } from "react-icons/fi";
import peopleImage from "../../assets/us.jpeg";
import { toast } from "react-toastify";

export default function AdminProfile() {
  const [profile, setProfile] = useState({
    name: "Super Admin",
    email: "admin@sindhuswap.com",
    phone: "+91 98765 43210",
    role: "Super Administrator"
  });

  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "" });

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    toast.success("Profile details updated successfully!");
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordForm({ oldPassword: "", newPassword: "" });
    toast.success("Security credentials updated successfully!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left side card preview */}
      <div className="admin-glass-card rounded-2xl overflow-hidden h-fit">
        <div className="h-24 bg-gradient-to-r from-teal-700 to-teal-500 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)]" />
        </div>
        <div className="px-5 pb-5 relative text-xs">
          <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-white bg-slate-100 shadow -translate-y-6 mb-1">
            <img src={peopleImage} className="w-full h-full object-cover" alt="" />
          </div>
          <div className="space-y-3 mt-1.5 leading-normal">
            <div>
              <h3 className="text-sm font-black text-slate-800 tracking-tight">{profile.name}</h3>
              <p className="text-[10px] text-slate-400 font-bold">{profile.role}</p>
            </div>
            <hr className="border-slate-100" />
            <div className="space-y-2 text-slate-500">
              <p className="flex items-center gap-2"><FiMail className="text-slate-400" /> {profile.email}</p>
              <p className="flex items-center gap-2"><FiPhone className="text-slate-400" /> {profile.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right forms panel */}
      <div className="lg:col-span-2 space-y-6">
        {/* Profile Specifications form */}
        <div className="admin-glass-card rounded-2xl p-5">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Profile Details</h3>
          <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-500">Full Name</label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2.5 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-500">Email Address</label>
              <input
                type="email"
                required
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2.5 outline-none font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-500">Helpline Phone</label>
              <input
                type="text"
                required
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2.5 outline-none font-mono"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 bg-primary hover:bg-teal-800 text-white font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                Save Details
              </button>
            </div>
          </form>
        </div>

        {/* Password config form */}
        <div className="admin-glass-card rounded-2xl p-5">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Credentials Management</h3>
          <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-500">Current Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2.5 outline-none font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-500">New Secure Password</label>
              <input
                type="password"
                required
                placeholder="Min 8 characters"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2.5 outline-none font-mono"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <FiLock /> Apply Password Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
