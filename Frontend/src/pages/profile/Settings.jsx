import { useState } from "react";
import { FiBell, FiLock, FiMapPin, FiSave, FiShield, FiUser } from "react-icons/fi";
import { toast } from "react-toastify";
import PageShell from "../../components/common/PageShell";
import { useAuth } from "../../context/AuthContext";

function Settings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    name: user?.name || "",
    email: user?.email || "",
    mobile: "",
    taluka: "Sawantwadi",
    notifications: true,
    messages: true,
    wishlist: true,
  });

  const update = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    toast.success("Settings saved successfully.");
  };

  return (
    <PageShell>
      <section className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6">
          <aside className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_12px_34px_rgba(15,23,42,0.04)] h-fit">
            <span className="eyebrow"><FiShield /> Account</span>
            <h1 className="mt-4 text-2xl font-black text-slate-900">Settings</h1>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Keep your marketplace profile, privacy, and alert preferences current.
            </p>
            <div className="mt-5 grid gap-2 text-sm font-bold text-slate-600">
              <span className="flex items-center gap-2 rounded-xl bg-teal-50 text-teal-700 px-3 py-2"><FiUser /> Profile</span>
              <span className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2"><FiBell /> Notifications</span>
              <span className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2"><FiLock /> Security</span>
            </div>
          </aside>

          <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_12px_34px_rgba(15,23,42,0.04)]">
            <h2 className="text-xl font-black text-slate-900">Profile Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <label className="form-field">
                Full Name
                <input value={settings.name} onChange={(event) => update("name", event.target.value)} />
              </label>
              <label className="form-field">
                Email
                <input type="email" value={settings.email} onChange={(event) => update("email", event.target.value)} />
              </label>
              <label className="form-field">
                Mobile Number
                <input value={settings.mobile} onChange={(event) => update("mobile", event.target.value)} placeholder="10-digit mobile number" />
              </label>
              <label className="form-field">
                Taluka
                <select value={settings.taluka} onChange={(event) => update("taluka", event.target.value)}>
                  {["Sawantwadi", "Kudal", "Kankavli", "Malvan", "Vengurla", "Dodamarg", "Devgad", "Vaibhavwadi"].map((taluka) => (
                    <option key={taluka} value={taluka}>{taluka}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-black text-slate-900">Alerts</h2>
              <div className="grid gap-3 mt-4">
                {[
                  { key: "notifications", label: "Notifications", text: "Swap requests, product approvals, and admin announcements." },
                  { key: "messages", label: "Messages", text: "New chat messages and seen status updates." },
                  { key: "wishlist", label: "Wishlist Updates", text: "Price drops and availability updates for saved items." },
                ].map((item) => (
                  <label key={item.key} className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <span>
                      <strong className="block text-sm text-slate-900">{item.label}</strong>
                      <small className="block text-xs text-slate-500 mt-1">{item.text}</small>
                    </span>
                    <input
                      type="checkbox"
                      checked={settings[item.key]}
                      onChange={(event) => update(item.key, event.target.checked)}
                      className="h-4 w-4 accent-teal-600"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-amber-100 bg-amber-50/70 p-4 text-sm text-amber-800 font-medium flex gap-2">
              <FiMapPin className="mt-0.5 shrink-0" />
              Location settings help SindhuSwap show listings and swap requests closer to your taluka.
            </div>

            <button type="submit" className="btn btn--primary mt-6"><FiSave /> Save Settings</button>
          </form>
        </div>
      </section>
    </PageShell>
  );
}

export default Settings;
