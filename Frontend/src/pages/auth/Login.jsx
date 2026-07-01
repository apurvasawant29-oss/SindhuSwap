import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiShield, FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { toast } from "react-toastify";
import PageShell from "../../components/common/PageShell";

export default function Login() {
  const [activeTab, setActiveTab] = useState("user"); // 'user' or 'admin'
  const navigate = useNavigate();

  // User form states
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  // Admin form states
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle standard user mock login
  const handleUserLogin = (e) => {
    e.preventDefault();
    if (userEmail && userPassword) {
      toast.success("Logged in successfully as user!");
      localStorage.setItem("userAuth", "true");
      navigate("/profile");
    } else {
      toast.error("Please fill in all user login credentials.");
    }
  };

  // Handle temporary Admin login validation
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminUsername === "admin" && adminPassword === "12345") {
      setIsLoading(true);
      toast.success("Welcome back, Administrator!");
      localStorage.setItem("adminAuth", "true");
      setTimeout(() => {
        navigate("/admin");
        setIsLoading(false);
      }, 800);
    } else {
      toast.error("Invalid administrator credentials. Access Denied.");
    }
  };

  return (
    <PageShell>
      <div className="min-h-[580px] flex items-center justify-center p-6 bg-slate-50/50 relative overflow-hidden select-none">
        {/* Background graphic spheres */}
        <div className="absolute top-1/4 left-1/4 h-80 w-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xl relative z-10 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-1.5">
              Sign In to Sindhu<span>Swap</span>
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Choose your portal type and enter credentials to continue.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl relative border border-slate-200">
            {/* Animated Tab highlight */}
            <motion.div
              layoutId="activeTabBg"
              className="absolute top-1.5 bottom-1.5 bg-white rounded-xl shadow-sm z-10 border border-slate-200/30"
              style={{
                left: activeTab === "user" ? "6px" : "calc(50% + 2px)",
                width: "calc(50% - 8px)"
              }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />

            <button
              onClick={() => setActiveTab("user")}
              className={`flex-1 py-2.5 text-xs font-bold transition-all relative z-20 flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "user" ? "text-slate-800" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <FiUser className="text-sm" /> User Portal
            </button>
            <button
              onClick={() => setActiveTab("admin")}
              className={`flex-1 py-2.5 text-xs font-bold transition-all relative z-20 flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "admin" ? "text-slate-800" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <FiShield className="text-sm" /> Admin Panel
            </button>
          </div>

          {/* Animate form wrapper */}
          <div className="min-h-56 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === "user" ? (
                <motion.form
                  key="userForm"
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleUserLogin}
                  className="space-y-4 text-xs text-slate-500"
                >
                  <div className="space-y-1">
                    <label className="font-semibold">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl pl-9 pr-4 py-2.5 outline-none font-medium text-slate-700"
                      />
                      <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="font-semibold">Password</label>
                      <a href="/login" className="text-[10px] text-primary hover:underline font-bold">Forgot?</a>
                    </div>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl pl-9 pr-4 py-2.5 outline-none font-medium text-slate-700 font-mono"
                      />
                      <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-primary hover:bg-teal-800 text-white font-bold rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5 mt-2"
                  >
                    Login User <FiArrowRight />
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="adminForm"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleAdminLogin}
                  className="space-y-4 text-xs text-slate-500"
                >
                  <div className="space-y-1">
                    <label className="font-semibold">Admin Username</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Username credentials"
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl pl-9 pr-4 py-2.5 outline-none font-medium text-slate-700"
                      />
                      <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold">Admin Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        placeholder="Password keys"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl pl-9 pr-4 py-2.5 outline-none font-medium text-slate-700 font-mono"
                      />
                      <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5 mt-2"
                  >
                    {isLoading ? "Validating Admin..." : "Access Administrator Dashboard"} <FiArrowRight />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <div className="text-center pt-2">
            <span className="text-[10px] text-slate-400 font-medium">
              Don't have a user account? <a href="/signup" className="text-primary font-bold hover:underline">Sign up now</a>
            </span>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
