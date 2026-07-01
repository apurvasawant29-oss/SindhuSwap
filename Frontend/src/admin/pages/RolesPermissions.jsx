import { useState } from "react";
import { FiShield, FiSave, FiLock } from "react-icons/fi";
import Swal from "sweetalert2";

export default function RolesPermissions() {
  const [matrix, setMatrix] = useState({
    Admin: {
      viewDashboard: true,
      manageProducts: true,
      moderateUsers: true,
      configureSettings: true,
      backupDatabase: true,
      manageRoles: true
    },
    Moderator: {
      viewDashboard: true,
      manageProducts: true,
      moderateUsers: false,
      configureSettings: false,
      backupDatabase: false,
      manageRoles: false
    },
    User: {
      viewDashboard: false,
      manageProducts: false,
      moderateUsers: false,
      configureSettings: false,
      backupDatabase: false,
      manageRoles: false
    }
  });

  const [selectedRole, setSelectedRole] = useState("Admin");

  const handleToggle = (perm) => {
    setMatrix((prev) => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [perm]: !prev[selectedRole][perm]
      }
    }));
  };

  const handleSave = () => {
    Swal.fire({
      title: "Permissions matrix updated!",
      text: "New access rights broadcasted across all active roles.",
      icon: "success",
      confirmButtonColor: "#0f766e"
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Role Selection */}
      <div className="admin-glass-card rounded-2xl p-5 h-fit space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5"><FiShield className="text-teal-600 animate-pulse" /> Role Hierarchy</h3>
        <p className="text-[11px] text-slate-400">Select a role template to review or override permission matrices.</p>

        <div className="space-y-2">
          {["Admin", "Moderator", "User"].map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`w-full text-left px-4 py-3 text-xs font-bold border transition-all rounded-xl cursor-pointer ${
                selectedRole === role
                  ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {role} privileges
            </button>
          ))}
        </div>
      </div>

      {/* Permissions Checkbox Matrix */}
      <div className="md:col-span-2 admin-glass-card rounded-2xl p-5 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
          <h3 className="text-sm font-bold text-slate-800">
            Access Rights Matrix: <span className="text-teal-600 font-extrabold">{selectedRole}</span>
          </h3>
          <button
            onClick={handleSave}
            className="px-3.5 py-1.5 bg-primary text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <FiSave /> Apply Matrix
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3.5 border border-slate-100 rounded-xl hover:bg-slate-50/50">
            <div>
              <h4 className="font-bold text-slate-700">Access Admin Dashboard</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Allows logging in and viewing system statistics.</p>
            </div>
            <input
              type="checkbox"
              checked={matrix[selectedRole].viewDashboard}
              onChange={() => handleToggle("viewDashboard")}
              disabled={selectedRole === "User"}
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 border border-slate-100 rounded-xl hover:bg-slate-50/50">
            <div>
              <h4 className="font-bold text-slate-700">Manage Products & Swaps</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Edit, delete, approve listings and book swaps.</p>
            </div>
            <input
              type="checkbox"
              checked={matrix[selectedRole].manageProducts}
              onChange={() => handleToggle("manageProducts")}
              disabled={selectedRole === "User"}
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 border border-slate-100 rounded-xl hover:bg-slate-50/50">
            <div>
              <h4 className="font-bold text-slate-700">Moderate Users & Ban accounts</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Suspend or ban users violating marketplace rules.</p>
            </div>
            <input
              type="checkbox"
              checked={matrix[selectedRole].moderateUsers}
              onChange={() => handleToggle("moderateUsers")}
              disabled={selectedRole === "User"}
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 border border-slate-100 rounded-xl hover:bg-slate-50/50">
            <div>
              <h4 className="font-bold text-slate-700">Modify global system parameters</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Access general config, settings, and themes.</p>
            </div>
            <input
              type="checkbox"
              checked={matrix[selectedRole].configureSettings}
              onChange={() => handleToggle("configureSettings")}
              disabled={selectedRole === "User" || selectedRole === "Moderator"}
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 border border-slate-100 rounded-xl hover:bg-slate-50/50">
            <div>
              <h4 className="font-bold text-slate-700">Database Backup & Restores</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Create snapshots of platform databases.</p>
            </div>
            <input
              type="checkbox"
              checked={matrix[selectedRole].backupDatabase}
              onChange={() => handleToggle("backupDatabase")}
              disabled={selectedRole === "User" || selectedRole === "Moderator"}
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
