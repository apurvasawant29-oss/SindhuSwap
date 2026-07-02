import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiMail, FiPhone, FiLock, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import PageShell from "../../components/common/PageShell";
import { useAuth } from "../../context/AuthContext";

const TALUKAS = [
  "Select Taluka",
  "Sawantwadi",
  "Kudal",
  "Kankavli",
  "Malvan",
  "Vengurla",
  "Dodamarg",
  "Devgad",
  "Vaibhavwadi",
];

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [taluka, setTaluka] = useState("Select Taluka");
  const [terms, setTerms] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { registerUser } = useAuth();

  // Password strength meter calculation
  const calculatePasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: "Empty", color: "bg-slate-200" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 33, label: "Weak", color: "bg-rose-500", text: "text-rose-500" };
    if (score <= 3) return { score: 66, label: "Medium", color: "bg-amber-500", text: "text-amber-500" };
    return { score: 100, label: "Strong", color: "bg-emerald-500", text: "text-emerald-500" };
  };

  const strength = calculatePasswordStrength(password);

  const validate = () => {
    const errs = {};
    if (!fullName.trim()) errs.fullName = "Full name is required";
    if (!email) {
      errs.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = "Please enter a valid email address";
    }
    if (!mobile) {
      errs.mobile = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(mobile)) {
      errs.mobile = "Mobile number must be a 10-digit number";
    }
    if (!password) {
      errs.password = "Password is required";
    } else if (password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    if (password !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }
    if (taluka === "Select Taluka") {
      errs.taluka = "Please select your local Taluka";
    }
    if (!terms) {
      errs.terms = "You must agree to the Terms and Conditions";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await registerUser({ name: fullName, email, mobile, password, taluka });
      setLoading(false);
      setSuccess(true);
      toast.success("Account created successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setLoading(false);
      toast.error(error.message || "Unable to create account.");
    }
  };

  return (
    <PageShell>
      <div className="min-h-[calc(100vh-72px)] flex items-stretch bg-slate-50/40 select-none">
        
        {/* LEFT PANEL - Branding/Community (Desktop only) */}
        <div className="hidden lg:flex w-[45%] bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-800 text-white p-12 flex-col justify-between relative overflow-hidden">
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
            <span className="rounded-full bg-amber-500/20 text-amber-300 text-[10px] uppercase font-bold tracking-wider px-3 py-1 border border-amber-500/10">
              Taluka Swap Circles
            </span>
            <h2 className="text-2xl font-black text-white mt-4 leading-tight">
              Swapping is the new way of sharing resources.
            </h2>
            <p className="text-xs.5 text-slate-200 mt-2.5 leading-relaxed font-medium">
              Swap textbooks after semesters, sell furniture before moving, and connect with people near you.
            </p>
            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-white/15">
              <div>
                <div className="text-xs font-bold text-slate-350">BOOK SWAPS</div>
                <div className="text-lg font-black mt-0.5">200+</div>
              </div>
              <div className="border-l border-white/15 h-8" />
              <div>
                <div className="text-xs font-bold text-slate-350">ACTIVE TALUKAS</div>
                <div className="text-lg font-black mt-0.5">8</div>
              </div>
            </div>
          </motion.div>

          <div className="text-slate-300 text-xs font-medium z-10 shrink-0">
            © 2026 SindhuSwap. All rights reserved.
          </div>
        </div>

        {/* RIGHT PANEL - Signup Form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto my-4">
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="signup-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-[460px] bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-100/50"
              >
                {/* Form Header */}
                <div className="text-center mb-5">
                  <div className="lg:hidden flex items-center justify-center gap-1.5 mb-4 text-slate-900 font-extrabold text-xl">
                    <span className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                      S
                    </span>
                    <span>Sindhu<span className="text-teal-600">Swap</span></span>
                  </div>
                  <h2 className="text-xl font-black text-slate-850">Create Account</h2>
                  <p className="text-xs text-slate-450 mt-1 font-medium">
                    Register now and connect with buyers & sellers in Sindhudurg.
                  </p>
                </div>

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block">Full Name</label>
                    <div className="relative flex items-center h-9.5 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-50 transition-all duration-200">
                      <FiUser className="text-slate-400 mr-2 h-4 w-4 shrink-0" />
                      <input
                        type="text"
                        placeholder="Enter full name"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: null }));
                        }}
                        className="w-full h-full border-0 outline-0 text-xs text-slate-800 bg-transparent"
                      />
                    </div>
                    {errors.fullName && (
                      <span className="text-[10px] text-rose-500 font-bold block pl-1">{errors.fullName}</span>
                    )}
                  </div>

                  {/* Email & Mobile Side-by-Side (Desktop only, stacked on mobile) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block">Email</label>
                      <div className="relative flex items-center h-9.5 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-50 transition-all duration-200">
                        <FiMail className="text-slate-400 mr-2 h-4 w-4 shrink-0" />
                        <input
                          type="text"
                          placeholder="Email address"
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

                    {/* Mobile */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block">Mobile Number</label>
                      <div className="relative flex items-center h-9.5 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-50 transition-all duration-200">
                        <FiPhone className="text-slate-400 mr-2 h-4 w-4 shrink-0" />
                        <input
                          type="text"
                          placeholder="10-digit number"
                          value={mobile}
                          onChange={(e) => {
                            setMobile(e.target.value);
                            if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: null }));
                          }}
                          className="w-full h-full border-0 outline-0 text-xs text-slate-800 bg-transparent"
                        />
                      </div>
                      {errors.mobile && (
                        <span className="text-[10px] text-rose-500 font-bold block pl-1">{errors.mobile}</span>
                      )}
                    </div>
                  </div>

                  {/* Password Strength Meter */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block">Password</label>
                    <div className="relative flex items-center h-9.5 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-50 transition-all duration-200">
                      <FiLock className="text-slate-400 mr-2 h-4 w-4 shrink-0" />
                      <input
                        type="password"
                        placeholder="Create password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                        }}
                        className="w-full h-full border-0 outline-0 text-xs text-slate-800 bg-transparent"
                      />
                    </div>
                    {/* Strength Bar */}
                    {password && (
                      <div className="space-y-1 mt-1.5 px-0.5">
                        <div className="flex justify-between text-[9px] font-bold">
                          <span className="text-slate-400">Password strength:</span>
                          <span className={strength.text}>{strength.label}</span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${strength.score}%` }}
                            className={`h-full ${strength.color}`}
                          />
                        </div>
                      </div>
                    )}
                    {errors.password && (
                      <span className="text-[10px] text-rose-500 font-bold block pl-1">{errors.password}</span>
                    )}
                  </div>

                  {/* Confirm Password & Taluka Selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Confirm Password */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block">Confirm Password</label>
                      <div className="relative flex items-center h-9.5 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-50 transition-all duration-200">
                        <FiLock className="text-slate-400 mr-2 h-4 w-4 shrink-0" />
                        <input
                          type="password"
                          placeholder="Re-enter password"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
                          }}
                          className="w-full h-full border-0 outline-0 text-xs text-slate-800 bg-transparent"
                        />
                      </div>
                      {errors.confirmPassword && (
                        <span className="text-[10px] text-rose-500 font-bold block pl-1">{errors.confirmPassword}</span>
                      )}
                    </div>

                    {/* Taluka */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block">Local Taluka</label>
                      <select
                        value={taluka}
                        onChange={(e) => {
                          setTaluka(e.target.value);
                          if (errors.taluka) setErrors((prev) => ({ ...prev, taluka: null }));
                        }}
                        className="w-full text-xs h-9.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 text-slate-700 outline-0 focus:border-teal-500 focus:bg-white cursor-pointer"
                      >
                        {TALUKAS.map((tal) => (
                          <option key={tal} value={tal}>
                            {tal}
                          </option>
                        ))}
                      </select>
                      {errors.taluka && (
                        <span className="text-[10px] text-rose-500 font-bold block pl-1">{errors.taluka}</span>
                      )}
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="space-y-1 mt-2.5">
                    <label className="flex items-start gap-2.5 text-xs text-slate-600 font-medium cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={terms}
                        onChange={() => {
                          setTerms((p) => !p);
                          if (errors.terms) setErrors((prev) => ({ ...prev, terms: null }));
                        }}
                        className="rounded border-slate-350 text-teal-600 focus:ring-teal-500 h-3.75 w-3.75 mt-0.5 shrink-0"
                      />
                      <span className="group-hover:text-slate-900 transition-colors leading-tight font-medium">
                        I agree to the{" "}
                        <Link to="/help-center" className="text-teal-650 font-bold hover:underline">
                          Terms & Conditions
                        </Link>{" "}
                        and privacy regulations.
                      </span>
                    </label>
                    {errors.terms && (
                      <span className="text-[10px] text-rose-500 font-bold block pl-1">{errors.terms}</span>
                    )}
                  </div>

                  {/* Sign Up Submit */}
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
                        <span>Create Account</span>
                        <FiArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Login Redirect */}
                <div className="text-center text-xs text-slate-500 font-medium mt-6 border-t border-slate-100 pt-4">
                  Already have an account?{" "}
              <Link to="/login" className="text-teal-650 font-bold hover:text-teal-800 hover:underline">
                Sign In
              </Link>
                </div>
              </motion.div>
            ) : (
              /* Success Anim State */
              <motion.div
                key="signup-success"
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
                <h3 className="text-lg font-black text-slate-800">Account Created!</h3>
                <p className="text-xs text-slate-450 mt-1 leading-relaxed max-w-xs font-semibold">
                  Your SindhuSwap account has been set up successfully. Redirecting you to sign in...
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
