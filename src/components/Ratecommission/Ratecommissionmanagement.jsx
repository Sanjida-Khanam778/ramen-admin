import { useState } from "react";

const initialDrivers = [
  { id: 1, name: "John Parker", email: "john.parker@email.com", trips: 150, earnings: 5000, paid: 500, pending: 500, status: "paid", lastPayment: "2026-03-05" },
  { id: 2, name: "Maria Garcia", email: "maria.garcia@email.com", trips: 200, earnings: 7000, paid: 1000, pending: 400, status: "pending", lastPayment: "2026-02-20" },
  { id: 3, name: "Kevin Lee", email: "kevin.lee@email.com", trips: 100, earnings: 3000, paid: 300, pending: 300, status: "suspended", lastPayment: "2026-01-15" },
  { id: 4, name: "Sophie Turner", email: "sophie.turner@email.com", trips: 50, earnings: 1500, paid: 150, pending: 150, status: "paid", lastPayment: "2026-03-01" },
];

function calcCharge(earnings, rate) {
  return parseFloat((earnings * (rate / 100)).toFixed(2));
}

function StatusBadge({ status }) {
  const map = {
    paid: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border border-amber-200",
    suspended: "bg-rose-50 text-rose-600 border border-rose-200",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${map[status] || map.pending}`}>
      {status}
    </span>
  );
}

function Modal({ children, onClose, title }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function DriverDetailModal({ driver, serviceRate, onClose, onSuspend, onSendReminder }) {
  const charge = calcCharge(driver.earnings, serviceRate);
  return (
    <Modal title="Driver Earnings Details" onClose={onClose}>
      <div className="px-6 py-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><p className="text-xs text-slate-400 mb-0.5">Driver Name</p><p className="font-semibold text-slate-800">{driver.name}</p></div>
          <div><p className="text-xs text-slate-400 mb-0.5">Email</p><p className="font-semibold text-slate-800 text-sm">{driver.email}</p></div>
          <div><p className="text-xs text-slate-400 mb-0.5">Total Trips</p><p className="font-semibold text-slate-800">{driver.trips}</p></div>
          <div><p className="text-xs text-slate-400 mb-0.5">Total Earnings</p><p className="font-semibold text-slate-800">${driver.earnings.toFixed(2)}</p></div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Platform Charge ({serviceRate}%)</p>
            <p className="font-semibold text-slate-800">${charge.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Status</p>
            <div className="flex items-center gap-1.5">
              <StatusBadge status={driver.status} />
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold text-slate-800 mb-3">Payment Breakdown</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-slate-500">Platform Charge Paid</span><span className="text-emerald-600 font-semibold">${driver.paid.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Platform Charge Pending</span><span className="text-rose-500 font-semibold">${driver.pending.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Last Payment Date</span><span className="text-slate-700 font-medium">{driver.lastPayment}</span></div>
          </div>
        </div>

        {driver.pending > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
            <svg className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01"/>
            </svg>
            <div>
              <p className="text-sm font-semibold text-amber-700">Pending Payment Alert</p>
              <p className="text-xs text-amber-600 mt-0.5">This driver has ${driver.pending.toFixed(2)} in pending platform charges.</p>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <button onClick={() => { onSendReminder(driver); onClose(); }}
            className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            Send Message
          </button>
          <button onClick={() => { onSuspend(driver.id); onClose(); }}
            className="flex-1 flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
            Suspend Driver
          </button>
        </div>
      </div>
    </Modal>
  );
}

function EmailModal({ driver, onClose }) {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    setSent(true);
    setTimeout(onClose, 1200);
  };

  return (
    <Modal title="Send Email to Driver" onClose={onClose}>
      <div className="px-6 py-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">To:</label>
          <input readOnly value={driver.email}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-slate-50 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Subject:</label>
          <input readOnly value={`Platform Charge Payment Reminder - ${driver.name}`}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-slate-50 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Message:</label>
          <textarea rows={5} placeholder="Enter your message"
            value={message} onChange={(e) => setMessage(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition" />
        </div>
        <div className="flex gap-3">
          <button onClick={handleSend}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
            {sent
              ? <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg> Sent!</>
              : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> Send Email</>
            }
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

export default function RateCommissionManagement() {
  const [kmRate, setKmRate] = useState(1.5);
  const [serviceCharge, setServiceCharge] = useState(20);
  const [editingKm, setEditingKm] = useState("");
  const [editingService, setEditingService] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState("All");
  const [drivers, setDrivers] = useState(initialDrivers);
  const [detailDriver, setDetailDriver] = useState(null);
  const [emailDriver, setEmailDriver] = useState(null);

  const startEdit = () => {
    setEditingKm(String(kmRate));
    setEditingService(String(serviceCharge));
    setIsEditing(true);
  };

  const saveEdit = () => {
    const newKm = parseFloat(editingKm);
    const newSvc = parseFloat(editingService);
    if (!isNaN(newKm) && newKm > 0) setKmRate(newKm);
    if (!isNaN(newSvc) && newSvc > 0 && newSvc <= 100) setServiceCharge(newSvc);
    setIsEditing(false);
  };

  const cancelEdit = () => setIsEditing(false);

  const suspendDriver = (id) => setDrivers((prev) => prev.map((d) => d.id === id ? { ...d, status: "suspended" } : d));

  const filteredDrivers = drivers.filter((d) => {
    if (filter === "All") return true;
    return d.status === filter.toLowerCase();
  });

  const totalTrips = drivers.reduce((a, d) => a + d.trips, 0);
  const totalEarnings = drivers.reduce((a, d) => a + d.earnings, 0);
  const totalPlatformCharge = drivers.reduce((a, d) => a + calcCharge(d.earnings, serviceCharge), 0);
  const totalPending = drivers.reduce((a, d) => a + d.pending, 0);
  const pendingDriversCount = drivers.filter((d) => d.status === "pending" || d.status === "suspended").length;

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <style>{`
        @keyframes fade-in { from { opacity:0; transform:scale(0.97) translateY(6px); } to { opacity:1; transform:scale(1) translateY(0); } }
        .fade-in { animation: fade-in 0.18s ease-out; }
      `}</style>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Rate & Commission Management</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage platform rates, service charges, and driver earnings</p>
      </div>

      {/* Platform Settings Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800">Platform Settings</h2>
          {!isEditing ? (
            <button onClick={startEdit}
              className="bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors">
              Edit Settings
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={saveEdit}
                className="bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors">
                Save Changes
              </button>
              <button onClick={cancelEdit}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Per KM Rate */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-4">
            <div className="bg-blue-900 w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-1">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-blue-700 mb-1">Per Kilometer Rate</p>
              {isEditing ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={editingKm}
                    onChange={(e) => setEditingKm(e.target.value)}
                    className="w-28 border border-blue-300 bg-white rounded-lg px-3 py-1.5 text-xl font-bold text-blue-900 outline-none focus:ring-2 focus:ring-blue-500 transition"
                    step="0.1"
                    min="0"
                    autoFocus
                  />
                </div>
              ) : (
                <p className="text-2xl font-bold text-blue-900">${kmRate.toFixed(2)}/km</p>
              )}
              <p className="text-xs text-blue-600 mt-1">Base rate charged per kilometer of travel</p>
            </div>
          </div>

          {/* Service Charge */}
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-start gap-4">
            <div className="bg-purple-600 w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-1">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M17 17h.01M9.5 9.5l5 5M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 012-2z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-purple-700 mb-1">Platform Service Charge</p>
              {isEditing ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={editingService}
                    onChange={(e) => setEditingService(e.target.value)}
                    className="w-24 border border-purple-300 bg-white rounded-lg px-3 py-1.5 text-xl font-bold text-purple-700 outline-none focus:ring-2 focus:ring-purple-500 transition"
                    step="1"
                    min="0"
                    max="100"
                  />
                </div>
              ) : (
                <p className="text-2xl font-bold text-purple-700">{serviceCharge}%</p>
              )}
              <p className="text-xs text-purple-500 mt-1">Percentage charged on each ride as commission</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
        {[
          { label: "Total Trips", value: totalTrips.toLocaleString(), color: "text-slate-800", icon: <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>, iconBg: "bg-blue-50" },
          { label: "Driver Earnings", value: `$${totalEarnings.toLocaleString()}`, color: "text-slate-800", icon: <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>, iconBg: "bg-emerald-50" },
          { label: "Platform Charges", value: `$${totalPlatformCharge.toLocaleString()}`, color: "text-slate-800", icon: <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>, iconBg: "bg-violet-50" },
          { label: "Pending Charges", value: `$${totalPending.toLocaleString()}`, color: "text-rose-600", icon: <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01"/></svg>, iconBg: "bg-rose-50" },
          { label: "Pending Drivers", value: pendingDriversCount, color: "text-orange-500", icon: <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>, iconBg: "bg-orange-50" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center gap-3 shadow-sm">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${s.iconBg}`}>{s.icon}</div>
            <div>
              <p className="text-xs text-slate-400 font-medium">{s.label}</p>
              <p className={`text-lg font-bold leading-tight ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 mb-4 flex gap-1.5">
        {["All", "Paid", "Pending", "Suspended"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${filter === f ? "bg-blue-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Driver Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-800">Driver Platform Charges</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {["Driver", "Total Trips", "Total Earnings", "Platform Charge", "Paid", "Pending", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredDrivers.map((driver) => {
                const charge = calcCharge(driver.earnings, serviceCharge);
                return (
                  <tr key={driver.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">{driver.name}</p>
                      <p className="text-xs text-slate-400">{driver.email}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-700">{driver.trips}</td>
                    <td className="px-5 py-4 text-slate-700">${driver.earnings.toFixed(2)}</td>
                    <td className="px-5 py-4 text-slate-700">${charge.toFixed(2)}</td>
                    <td className="px-5 py-4 text-emerald-600 font-semibold">${driver.paid.toFixed(2)}</td>
                    <td className="px-5 py-4 text-rose-500 font-semibold">${driver.pending.toFixed(2)}</td>
                    <td className="px-5 py-4"><StatusBadge status={driver.status} /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setDetailDriver(driver)}
                          className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded" title="View Details">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                        </button>
                        <button onClick={() => setEmailDriver(driver)}
                          className="text-slate-400 hover:text-amber-500 transition-colors p-1 rounded" title="Send Email">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                          </svg>
                        </button>
                        <button onClick={() => suspendDriver(driver.id)}
                          className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded" title="Suspend Driver">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {detailDriver && (
        <DriverDetailModal
          driver={detailDriver}
          serviceRate={serviceCharge}
          onClose={() => setDetailDriver(null)}
          onSuspend={suspendDriver}
          onSendReminder={setEmailDriver}
        />
      )}
      {emailDriver && (
        <EmailModal driver={emailDriver} onClose={() => setEmailDriver(null)} />
      )}
    </div>
  );
}