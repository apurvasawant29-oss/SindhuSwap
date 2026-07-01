import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSettings,
  FiShield,
  FiBell,
  FiDatabase,
  FiCheck,
  FiUploadCloud,
  FiDownloadCloud,
  FiRefreshCw,
  FiAlertCircle
} from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function Settings() {
  const { settings, updateSettings } = useAdmin();

  // Tabs: general, security, notifications, backup
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [isBackupLoading, setIsBackupLoading] = useState(false);

  // Form states matching context fields
  const [generalForm, setGeneralForm] = useState({ ...settings.general });
  const [securityForm, setSecurityForm] = useState({ ...settings.security });
  const [notificationsForm, setNotificationsForm] = useState({ ...settings.notifications });

  // Handle configuration saves
  const handleSave = (section, formData) => {
    setIsSaving(true);
    setTimeout(() => {
      updateSettings(section, formData);
      setIsSaving(false);
      
      // Sweetalert success feedback
      Swal.fire({
        title: "Configuration Saved!",
        text: `The system's ${section.toUpperCase()} settings were updated successfully and broadcasted.`,
        icon: "success",
        confirmButtonColor: "#0f766e",
        timer: 2000
      });
    }, 600);
  };

  // Simulate backup generation and download
  const handleCreateBackup = () => {
    setIsBackupLoading(true);
    setTimeout(() => {
      setIsBackupLoading(false);
      
      // Simulate file download
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `sindhuswap_backup_${new Date().toISOString().split("T")[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      toast.success("Database JSON snapshot created and downloaded!");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Tab selectors */}
      <div className="admin-glass-card rounded-2xl p-4 flex gap-2 overflow-x-auto admin-scrollbar">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all flex items-center gap-2 ${
            activeTab === "general"
              ? "bg-primary border-primary text-white shadow-sm"
              : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
          }`}
        >
          <FiSettings /> General Configuration
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all flex items-center gap-2 ${
            activeTab === "security"
              ? "bg-primary border-primary text-white shadow-sm"
              : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
          }`}
        >
          <FiShield /> Security Credentials
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all flex items-center gap-2 ${
            activeTab === "notifications"
              ? "bg-primary border-primary text-white shadow-sm"
              : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
          }`}
        >
          <FiBell /> Notification Triggers
        </button>
        <button
          onClick={() => setActiveTab("backup")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all flex items-center gap-2 ${
            activeTab === "backup"
              ? "bg-primary border-primary text-white shadow-sm"
              : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
          }`}
        >
          <FiDatabase /> Backup & Restore
        </button>
      </div>

      {/* Tab Body Contents */}
      <div className="min-h-96">
        <AnimatePresence mode="wait">
          {/* GENERAL SECTION */}
          {activeTab === "general" && (
            <motion.div
              key="general"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="admin-glass-card rounded-2xl p-6 space-y-5"
            >
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800">General Portal Settings</h3>
                <p className="text-[11px] text-slate-400">Configure global metadata variables, support info, and platform status.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-500 font-semibold">Website Portal Name</label>
                  <input
                    type="text"
                    value={generalForm.siteName}
                    onChange={(e) => setGeneralForm({ ...generalForm, siteName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2.5 outline-none text-slate-700"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-slate-500 font-semibold">System Support Email Address</label>
                  <input
                    type="email"
                    value={generalForm.supportEmail}
                    onChange={(e) => setGeneralForm({ ...generalForm, supportEmail: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2.5 outline-none text-slate-700 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 font-semibold">Support Helpline Phone</label>
                  <input
                    type="text"
                    value={generalForm.supportPhone}
                    onChange={(e) => setGeneralForm({ ...generalForm, supportPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2.5 outline-none text-slate-700 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 font-semibold">System Theme Layout</label>
                  <select
                    value={generalForm.theme}
                    onChange={(e) => setGeneralForm({ ...generalForm, theme: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2.5 outline-none text-slate-600 font-semibold"
                  >
                    <option value="light">Light Mode Theme</option>
                    <option value="dark">Dark Mode Theme (Glassmorphic)</option>
                    <option value="system">System Default Configuration</option>
                  </select>
                </div>
              </div>

              {/* Maintenance Toggle */}
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-between text-xs">
                <div className="space-y-0.5 flex gap-2">
                  <FiAlertCircle className="text-amber-500 text-lg mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-amber-800">System Maintenance Mode</h4>
                    <p className="text-[10px] text-amber-600/90 leading-relaxed">
                      If active, the customer-facing website will display a maintenance message. Administrators can still access the dashboard.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={generalForm.maintenanceMode}
                  onChange={(e) => setGeneralForm({ ...generalForm, maintenanceMode: e.target.checked })}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleSave("general", generalForm)}
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-primary text-white hover:bg-teal-800 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  {isSaving ? "Saving..." : "Save Configuration"}
                </button>
              </div>
            </motion.div>
          )}

          {/* SECURITY SECTION */}
          {activeTab === "security" && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="admin-glass-card rounded-2xl p-6 space-y-5"
            >
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800">Security Credentials & Thresholds</h3>
                <p className="text-[11px] text-slate-400">Manage admin timeouts, password constraints, and login rules.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-500 font-semibold">Min Password Length</label>
                  <input
                    type="number"
                    min="6"
                    max="16"
                    value={securityForm.minPasswordLength}
                    onChange={(e) => setSecurityForm({ ...securityForm, minPasswordLength: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2.5 outline-none text-slate-700 font-bold"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-slate-500 font-semibold">Auto Logout Timer (Minutes)</label>
                  <input
                    type="number"
                    min="10"
                    max="480"
                    value={securityForm.sessionTimeout}
                    onChange={(e) => setSecurityForm({ ...securityForm, sessionTimeout: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2.5 outline-none text-slate-700 font-bold"
                  />
                </div>
              </div>

              <div className="p-4 bg-teal-50/30 border border-teal-100/50 rounded-2xl flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-teal-800">Enforce Multi-Factor Authentication (MFA)</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Require OTP verification alongside password credentials for all Moderator and Admin login requests.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={securityForm.twoFactorAuth}
                  onChange={(e) => setSecurityForm({ ...securityForm, twoFactorAuth: e.target.checked })}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleSave("security", securityForm)}
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-primary text-white hover:bg-teal-800 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  {isSaving ? "Saving..." : "Save Credentials Configuration"}
                </button>
              </div>
            </motion.div>
          )}

          {/* NOTIFICATION TRIGGERS SECTION */}
          {activeTab === "notifications" && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="admin-glass-card rounded-2xl p-6 space-y-5"
            >
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800">System Notification Triggers</h3>
                <p className="text-[11px] text-slate-400">Toggle push messaging and auto emails dispatched to community users.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3.5 hover:bg-slate-50/50 border border-slate-100 rounded-xl">
                  <div>
                    <h4 className="font-bold text-slate-700">Registration Welcome Email</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Send setup instructions when a user registers.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationsForm.emailOnRegistration}
                    onChange={(e) => setNotificationsForm({ ...notificationsForm, emailOnRegistration: e.target.checked })}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 hover:bg-slate-50/50 border border-slate-100 rounded-xl">
                  <div>
                    <h4 className="font-bold text-slate-700">Product approval alert notifications</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Dispatches emails when a moderator approves listings.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationsForm.emailOnProductApproval}
                    onChange={(e) => setNotificationsForm({ ...notificationsForm, emailOnProductApproval: e.target.checked })}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 hover:bg-slate-50/50 border border-slate-100 rounded-xl">
                  <div>
                    <h4 className="font-bold text-slate-700">Book Swap proposal notification</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Warn users about incoming swaps requests.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationsForm.emailOnSwapRequest}
                    onChange={(e) => setNotificationsForm({ ...notificationsForm, emailOnSwapRequest: e.target.checked })}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 hover:bg-slate-50/50 border border-slate-100 rounded-xl">
                  <div>
                    <h4 className="font-bold text-slate-700">Real-time push notifications</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Toggle browser socket notifications for chats.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationsForm.pushOnMessages}
                    onChange={(e) => setNotificationsForm({ ...notificationsForm, pushOnMessages: e.target.checked })}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleSave("notifications", notificationsForm)}
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-primary text-white hover:bg-teal-800 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  {isSaving ? "Saving..." : "Save Notification triggers"}
                </button>
              </div>
            </motion.div>
          )}

          {/* BACKUP & RESTORE SECTION */}
          {activeTab === "backup" && (
            <motion.div
              key="backup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="admin-glass-card rounded-2xl p-6 space-y-5"
            >
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800">Database Snapshots and Backup Center</h3>
                <p className="text-[11px] text-slate-400">Download system data snapshots or upload prior states.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                {/* Create backup panel */}
                <div className="p-5 border border-slate-200 rounded-2xl flex flex-col justify-between h-44 bg-slate-50/50">
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-slate-700 flex items-center gap-1.5"><FiDownloadCloud className="text-teal-600" /> Create Backup</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Download a complete database JSON representation (users, swaps, listings, activity logs, etc.). Useful for manual migrations.
                    </p>
                  </div>
                  <button
                    onClick={handleCreateBackup}
                    disabled={isBackupLoading}
                    className="w-full py-2.5 bg-primary hover:bg-teal-800 text-white text-xs font-bold rounded-xl border border-transparent transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isBackupLoading ? <FiRefreshCw className="animate-spin" /> : <FiDownloadCloud />} Generate & Download Backup
                  </button>
                </div>

                {/* Restore backup panel */}
                <div className="p-5 border border-slate-200 rounded-2xl flex flex-col justify-between h-44 bg-slate-50/50">
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-slate-700 flex items-center gap-1.5"><FiUploadCloud className="text-teal-600" /> Restore Snapshot</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Upload a previously downloaded JSON schema backup to restore the platform state. Warning: This overwrites current state.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      toast.info("Database restore service requires a manual file selection. (Mock interface trigger)");
                    }}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <FiUploadCloud /> Upload & Restore Data
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
