import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import PageShell from "../../components/common/PageShell";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!email) {
      errs.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = "Please enter a valid email address";
    }
    if (!password) {
      errs.password = "Password is required";
    } else if (password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      toast.success("Welcome back to SindhuSwap!");
      
      // Redirect after animations
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      toast.success("Signed in with Google successfully!");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }, 1000);
  };

  return (
    <PageShell>
      <div className="min-h-[calc(100vh-72px)] flex items-stretch bg-slate-50/40 select-none">
        
        {/* LEFT PANEL - Branding/Community (Desktop only) */}
        <div className="hidden lg:flex w-[45%] bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-800 text-white p-12 flex-col justify-between relative overflow-hidden">
          {/* Animated decorative shapes */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-teal-600/20 blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-emerald-600/20 blur-3xl -ml-20 -mb-20 pointer-events-none" />

          {/* Logo Mark */}
          <Link to="/" className="flex items-center gap-2.5 z-10 font-black text-xl shrink-0">
            <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400 font-extrabold text-2xl shadow-md border border-white/10">
              S
            </span>
            <span>Sindhu<span className="text-emerald-400">Swap</span></span>
          </Link>

          {/* Glass Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6.5 shadow-xl z-10 max-w-md my-auto"
          >
            <span className="rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-bold tracking-wider px-3 py-1 border border-emerald-500/10">
              Local Community First
            </span>
            <h2 className="text-2xl font-black text-white mt-4 leading-tight">
              Buy, Sell, and Swap items locally with neighbors.
            </h2>
            <p className="text-xs.5 text-slate-200 mt-2.5 leading-relaxed font-medium">
              Join students and residents from across Kudal, Sawantwadi, Kankavli, and all other talukas of Sindhudurg swapping books, gadgets, and furniture safely.
            </p>
            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-white/15">
              <div>
                <div className="text-xs font-bold text-slate-350">HAPPY USERS</div>
                <div className="text-lg font-black mt-0.5">1,200+</div>
              </div>
              <div className="border-l border-white/15 h-8" />
              <div>
                <div className="text-xs font-bold text-slate-350">ITEMS LISTED</div>
                <div className="text-lg font-black mt-0.5">5,000+</div>
              </div>
            </div>
          </motion.div>

          {/* Footer branding */}
          <div className="text-slate-300 text-xs font-medium z-10 shrink-0">
            © 2026 SindhuSwap. All rights reserved.
          </div>
        </div>

        {/* RIGHT PANEL - Login Form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-[420px] bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8.5 shadow-xl shadow-slate-100/50"
              >
                {/* Form Header */}
                <div className="text-center mb-6">
                  <div className="lg:hidden flex items-center justify-center gap-1.5 mb-4 text-slate-900 font-extrabold text-xl">
                    <span className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                      S
                    </span>
                    <span>Sindhu<span className="text-teal-600">Swap</span></span>
                  </div>
                  <h2 className="text-xl font-black text-slate-850">Welcome Back</h2>
                  <p className="text-xs text-slate-450 mt-1 font-medium">
                    Sign in to check messages, manage wishlist, or upload listings.
                  </p>
                </div>

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Email Address</label>
                    <div className="relative flex items-center h-10 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-50 transition-all duration-200">
                      <FiMail className="text-slate-400 mr-2.5 h-4 w-4 shrink-0" />
                      <input
                        type="text"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                        }}
                        className="w-full h-full border-0 outline-0 text-xs text-slate-800 bg-transparent"
                      />
                    </div>
                    {errors.email && (
                      <span className="text-[10px] text-rose-500 font-bold block pl-1">{errors.email}</span>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Password</label>
                      <Link
                        to="/forgot-password"
                        className="text-[11px] font-bold text-teal-650 hover:text-teal-800"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="relative flex items-center h-10 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-50 transition-all duration-200">
                      <FiLock className="text-slate-400 mr-2.5 h-4 w-4 shrink-0" />
                      <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                        }}
                        className="w-full h-full border-0 outline-0 text-xs text-slate-800 bg-transparent"
                      />
                    </div>
                    {errors.password && (
                      <span className="text-[10px] text-rose-500 font-bold block pl-1">{errors.password}</span>
                    )}
                  </div>

                  {/* Remember Me */}
                  <label className="flex items-center gap-2 text-xs text-slate-600 font-medium cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe((p) => !p)}
                      className="rounded border-slate-350 text-teal-600 focus:ring-teal-500 h-3.75 w-3.75"
                    />
                    <span className="group-hover:text-slate-900 transition-colors font-medium">Keep me signed in</span>
                  </label>

                  {/* Sign In Button */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    disabled={loading}
                    className="w-full h-10.5 flex items-center justify-center gap-2 bg-slate-900 hover:bg-teal-700 disabled:bg-slate-400 text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer mt-5"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Sign In</span>
                        <FiArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Google Sign In Divider */}
                <div className="relative flex py-4 items-center">
                  <div className="flex-grow border-t border-slate-100"></div>
                  <span className="flex-shrink mx-3 text-[10px] text-slate-400 uppercase tracking-widest font-bold">Or login with</span>
                  <div className="flex-grow border-t border-slate-100"></div>
                </div>

                {/* Google Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full h-10 flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl shadow-[0_2px_4px_rgba(15,23,42,0.02)] transition-colors cursor-pointer"
                >
                  <FcGoogle className="h-4.5 w-4.5" />
                  <span>Google Account</span>
                </button>

                {/* Sign Up Redirect */}
                <div className="text-center text-xs text-slate-500 font-medium mt-6.5 border-t border-slate-100 pt-4">
                  New to SindhuSwap?{" "}
                  <Link to="/signup" className="text-teal-650 font-bold hover:text-teal-800 hover:underline">
                    Create account
                  </Link>
                </div>
              </motion.div>
            ) : (
              /* Success Anim State */
              <motion.div
                key="login-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[360px] bg-white border border-slate-200/90 rounded-2xl p-8 text-center shadow-2xl flex flex-col items-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4"
                >
                  <FiCheckCircle className="h-8 w-8" />
                </motion.div>
                <h3 className="text-lg font-black text-slate-800">Signing In Successful</h3>
                <p className="text-xs text-slate-450 mt-1 leading-relaxed max-w-xs font-semibold">
                  Preparing your local marketplace feed. Redirecting you home...
                </p>
                <div className="mt-6 flex items-center gap-1.5 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </PageShell>
  );
}
