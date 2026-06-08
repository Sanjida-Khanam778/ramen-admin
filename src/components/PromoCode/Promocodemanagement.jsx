import { useState } from "react";

const initialCodes = [
  {
    id: "PROMO001",
    code: "SAVE10",
    description: "Get 10% off your next ride",
    discountType: "percentage",
    discountValue: 10,
    maxDiscount: null,
    minOrder: null,
    usageLimit: 100,
    used: 23,
    validFrom: "2026-03-01",
    validUntil: "2026-03-31",
    status: "active",
    createdDate: "2026-03-01",
  },
  {
    id: "PROMO002",
    code: "FREE5",
    description: "Get $5 off your next ride",
    discountType: "fixed",
    discountValue: 5,
    maxDiscount: null,
    minOrder: null,
    usageLimit: 50,
    used: 17,
    validFrom: "2026-03-01",
    validUntil: "2026-03-31",
    status: "active",
    createdDate: "2026-03-01",
  },
  {
    id: "PROMO003",
    code: "DISCOUNT20",
    description: "Get 20% off your next ride",
    discountType: "percentage",
    discountValue: 20,
    maxDiscount: null,
    minOrder: null,
    usageLimit: 75,
    used: 45,
    validFrom: "2026-03-01",
    validUntil: "2026-03-31",
    status: "active",
    createdDate: "2026-03-01",
  },
];

const emptyForm = {
  code: "",
  description: "",
  discountType: "percentage",
  discountValue: "",
  maxDiscount: "",
  minOrder: "",
  usageLimit: "",
  validFrom: "",
  validUntil: "",
};

function StatusBadge({ status }) {
  const styles = {
    active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    expired: "bg-amber-50 text-amber-700 border border-amber-200",
    disabled: "bg-slate-100 text-slate-500 border border-slate-200",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles[status] || styles.disabled}`}>
      {status}
    </span>
  );
}

function UsageBar({ used, limit }) {
  const pct = Math.min(100, Math.round((used / limit) * 100));
  const color = pct >= 80 ? "bg-rose-500" : pct >= 50 ? "bg-amber-400" : "bg-blue-600";
  return (
    <div>
      <span className="text-sm font-medium text-slate-700">{used} / {limit}</span>
      <div className="mt-1 h-1.5 w-24 rounded-full bg-slate-100">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, iconBg }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 px-5 py-4 flex items-center gap-4 shadow-sm">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-slate-800 leading-none">{value}</p>
      </div>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}

function CreateModal({ onClose, onCreate }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.code.trim()) e.code = "Required";
    if (!form.description.trim()) e.description = "Required";
    if (!form.discountValue) e.discountValue = "Required";
    if (!form.usageLimit) e.usageLimit = "Required";
    if (!form.validFrom) e.validFrom = "Required";
    if (!form.validUntil) e.validUntil = "Required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onCreate({
      id: `PROMO${String(Date.now()).slice(-4)}`,
      code: form.code.toUpperCase(),
      description: form.description,
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
      minOrder: form.minOrder ? Number(form.minOrder) : null,
      usageLimit: Number(form.usageLimit),
      used: 0,
      validFrom: form.validFrom,
      validUntil: form.validUntil,
      status: "active",
      createdDate: new Date().toISOString().slice(0, 10),
    });
  };

  const Field = ({ label, id, required, children }) => (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {errors[id] && <p className="text-xs text-rose-500 mt-1">{errors[id]}</p>}
    </div>
  );

  const inputCls = (id) =>
    `w-full border rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors[id] ? "border-rose-400" : "border-slate-200"}`;

  return (
    <Modal onClose={onClose}>
      <div className="p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-5">Create New Promo Code</h2>
        <div className="space-y-4">
          <Field label="Promo Code" id="code" required>
            <input className={inputCls("code")} placeholder="e.g., SAVE20" value={form.code}
              onChange={(e) => set("code", e.target.value)} />
          </Field>
          <Field label="Description" id="description" required>
            <input className={inputCls("description")} placeholder="e.g., Get 20% off your next ride" value={form.description}
              onChange={(e) => set("description", e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Discount Type" id="discountType" required>
              <select className={inputCls("discountType")} value={form.discountType}
                onChange={(e) => set("discountType", e.target.value)}>
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed ($)</option>
              </select>
            </Field>
            <Field label="Discount Value" id="discountValue" required>
              <input className={inputCls("discountValue")} type="number" placeholder="10" value={form.discountValue}
                onChange={(e) => set("discountValue", e.target.value)} />
            </Field>
          </div>
          <Field label="Max Discount Amount ($)" id="maxDiscount">
            <input className={inputCls("maxDiscount")} type="number" placeholder="10.00" value={form.maxDiscount}
              onChange={(e) => set("maxDiscount", e.target.value)} />
          </Field>
          <Field label="Minimum Order Amount ($)" id="minOrder">
            <input className={inputCls("minOrder")} type="number" placeholder="20.00" value={form.minOrder}
              onChange={(e) => set("minOrder", e.target.value)} />
          </Field>
          <Field label="Usage Limit" id="usageLimit" required>
            <input className={inputCls("usageLimit")} type="number" placeholder="100" value={form.usageLimit}
              onChange={(e) => set("usageLimit", e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Valid From" id="validFrom" required>
              <input className={inputCls("validFrom")} type="date" value={form.validFrom}
                onChange={(e) => set("validFrom", e.target.value)} />
            </Field>
            <Field label="Valid Until" id="validUntil" required>
              <input className={inputCls("validUntil")} type="date" value={form.validUntil}
                onChange={(e) => set("validUntil", e.target.value)} />
            </Field>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={handleSubmit}
            className="flex-1 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
            Create Promo Code
          </button>
          <button onClick={onClose}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold py-2.5 rounded-lg transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

function DetailModal({ promo, onClose, onExpire, onDisable }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(promo.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const pct = Math.round((promo.used / promo.usageLimit) * 100);

  return (
    <Modal onClose={onClose}>
      <div className="p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-5">Promo Code Details</h2>
        <div className="bg-blue-50 rounded-xl p-4 flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-blue-900 w-9 h-9 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 012-2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500">Promo Code</p>
              <p className="text-xl font-bold text-blue-900">{promo.code}</p>
            </div>
          </div>
          <button onClick={copy}
            className="flex items-center gap-1.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
            <CopyIcon />
            {copied ? "Copied!" : "Copy Code"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm mb-5">
          <div>
            <p className="text-xs text-slate-400 font-medium mb-0.5">Description</p>
            <p className="text-slate-700">{promo.description}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium mb-0.5">Status</p>
            <StatusBadge status={promo.status} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium mb-0.5">Discount</p>
            <p className="text-slate-700">
              {promo.discountType === "percentage" ? `${promo.discountValue}% off` : `$${promo.discountValue} off`}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium mb-0.5">Minimum Amount</p>
            <p className="text-slate-700">{promo.minOrder ? `$${promo.minOrder}` : "No minimum"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium mb-0.5">Usage</p>
            <p className="text-slate-700 mb-1">{promo.used} / {promo.usageLimit} used</p>
            <div className="h-1.5 w-40 rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-blue-600" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium mb-0.5">Usage Rate</p>
            <p className="text-slate-700">{pct}%</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium mb-0.5">Valid From</p>
            <p className="text-slate-700">{promo.validFrom}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium mb-0.5">Valid Until</p>
            <p className="text-slate-700">{promo.validUntil}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium mb-0.5">Created Date</p>
            <p className="text-slate-700">{promo.createdDate}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium mb-0.5">Promo ID</p>
            <p className="text-slate-700 font-mono text-xs">{promo.id}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => { onExpire(promo.id); onClose(); }}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
            Expired Code
          </button>
          <button onClick={() => { onDisable(promo.id); onClose(); }}
            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
            Disabled Code
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default function PromoCodeManagement() {
  const [codes, setCodes] = useState(initialCodes);
  const [filter, setFilter] = useState("All");
  const [showCreate, setShowCreate] = useState(false);
  const [detailPromo, setDetailPromo] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const filters = ["All", "Active", "Expired", "Disabled"];

  const filtered = codes.filter((c) => {
    if (filter === "All") return true;
    return c.status === filter.toLowerCase();
  });

  const stats = {
    total: codes.length,
    active: codes.filter((c) => c.status === "active").length,
    totalUsage: codes.reduce((a, c) => a + c.used, 0),
    avgRate: codes.length
      ? Math.round(codes.reduce((a, c) => a + (c.used / c.usageLimit) * 100, 0) / codes.length)
      : 0,
  };

  const handleCreate = (newCode) => {
    setCodes((prev) => [...prev, newCode]);
    setShowCreate(false);
  };

  const handleExpire = (id) => setCodes((prev) => prev.map((c) => c.id === id ? { ...c, status: "expired" } : c));
  const handleDisable = (id) => setCodes((prev) => prev.map((c) => c.id === id ? { ...c, status: "disabled" } : c));
  const handleDelete = (id) => setCodes((prev) => prev.filter((c) => c.id !== id));

  const copyCode = (code, id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <style>{`
        @keyframes fade-in { from { opacity:0; transform:scale(0.97) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
      `}</style>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Promo Code Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">Create and manage promotional codes for your ride-share app</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 5v14M5 12h14" />
          </svg>
          Create Promo Code
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Promo Codes" value={stats.total} iconBg="bg-blue-50"
          icon={<svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 012-2z" /></svg>} />
        <StatCard label="Active Codes" value={stats.active} iconBg="bg-emerald-50"
          icon={<svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>} />
        <StatCard label="Total Usage" value={stats.totalUsage} iconBg="bg-violet-50"
          icon={<svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
        <StatCard label="Avg Usage Rate" value={`${stats.avgRate}%`} iconBg="bg-amber-50"
          icon={<svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filter Tabs */}
        <div className="flex gap-1.5 p-4 border-b border-slate-100">
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                filter === f
                  ? "bg-blue-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}>
              {f}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {["Code", "Description", "Discount", "Usage", "Valid Period", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-400 text-sm">No promo codes found.</td>
                </tr>
              )}
              {filtered.map((promo) => (
                <tr key={promo.id} className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                  onClick={() => setDetailPromo(promo)}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-blue-700">{promo.code}</span>
                      <button onClick={(e) => copyCode(promo.code, promo.id, e)}
                        className="text-slate-400 hover:text-blue-600 transition-colors p-0.5 rounded">
                        {copiedId === promo.id
                          ? <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                          : <CopyIcon />
                        }
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600 max-w-[200px] truncate">{promo.description}</td>
                  <td className="px-5 py-4 text-slate-700 font-medium">
                    {promo.discountType === "percentage" ? `${promo.discountValue}%` : `$${promo.discountValue}`}
                  </td>
                  <td className="px-5 py-4">
                    <UsageBar used={promo.used} limit={promo.usageLimit} />
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs">{promo.validFrom} to {promo.validUntil}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={promo.status} />
                  </td>
                  <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setShowCreate(true)}
                        className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDisable(promo.id)}
                        className="text-slate-400 hover:text-amber-500 transition-colors p-1 rounded">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(promo.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && <CreateModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
      {detailPromo && (
        <DetailModal
          promo={detailPromo}
          onClose={() => setDetailPromo(null)}
          onExpire={handleExpire}
          onDisable={handleDisable}
        />
      )}
    </div>
  );
}