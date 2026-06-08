import { useState, useRef } from "react";

export default function Settings() {
  const [appName, setAppName] = useState("RideShare App");
  const [email, setEmail] = useState("support@rideshare.com");
  const [phone, setPhone] = useState("+1-800-RIDESHARE");
  const [privacy, setPrivacy] = useState("");
  const [terms, setTerms] = useState("");
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    driverReg: false,
    complaints: false,
    dailySummary: false,
  });
  const fileRef = useRef();

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogo(file);
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const toggleNotif = (key) =>
    setNotifications((n) => ({ ...n, [key]: !n[key] }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const initials = appName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="p-8 font-sans pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage application settings and configurations</p>
      </div>

      <div className="e-full space-y-5">
        {/* App Configuration */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-slate-800 mb-5">App Configuration</h2>
          <div className="space-y-4">
            {/* App Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">App Name</label>
              <input
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {/* App Logo */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">App Logo</label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                  {logoPreview ? (
                    <img src={logoPreview} alt="logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-slate-500">{initials}</span>
                  )}
                </div>
                <button
                  onClick={() => fileRef.current.click()}
                  className="flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                  </svg>
                  Upload Logo
                </button>
                <input ref={fileRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleLogo} />
              </div>
              <p className="text-xs text-slate-400 mt-1.5">Recommended size: 512×512px, PNG or JPG</p>
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Contact Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {/* Support Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Support Phone Number</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>
        </section>

        {/* Legal Documents */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-slate-800 mb-5">Legal Documents</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Privacy Policy</label>
              <textarea
                rows={5}
                placeholder="Enter your privacy policy..."
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Terms and Conditions</label>
              <textarea
                rows={5}
                placeholder="Enter your terms and conditions..."
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition"
              />
            </div>
          </div>
        </section>

        {/* Notification Settings */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-slate-800 mb-5">Notification Settings</h2>
          <div className="space-y-4">
            {[
              { key: "driverReg", label: "Email notifications for new driver registrations", sub: "Receive an email when a new driver submits their documents" },
              { key: "complaints", label: "Email notifications for new complaints", sub: "Receive an email when a user submits a complaint" },
              { key: "dailySummary", label: "Daily summary reports", sub: "Receive a daily email with platform statistics" },
            ].map(({ key, label, sub }) => (
              <button
                key={key}
                onClick={() => toggleNotif(key)}
                className="w-full flex items-start gap-3 text-left group"
              >
                <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                  notifications[key]
                    ? "bg-blue-900 border-blue-900"
                    : "border-slate-300 bg-white group-hover:border-blue-400"
                }`}>
                  {notifications[key] && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Save Button — fixed bottom right */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-lg transition-all ${
            saved ? "bg-emerald-600" : "bg-blue-900 hover:bg-blue-800"
          }`}
        >
          {saved ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/>
              </svg>
              Saved!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
              </svg>
              Save All Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
}