import { useState } from "react";

const initialPayments = [
  { id: "PAY001", date: "2026-03-09", passenger: "Michael Chen", driver: "Sarah Johnson", rideId: "RIDE12345", amount: 45.50, commissionRate: 20, status: "pending" },
  { id: "PAY002", date: "2026-03-08", passenger: "James Wilson", driver: "Emily Rodriguez", rideId: "RIDE12346", amount: 32.00, commissionRate: 20, status: "approved" },
  { id: "PAY003", date: "2026-03-07", passenger: "Anna Thompson", driver: "David Martinez", rideId: "RIDE12347", amount: 58.75, commissionRate: 20, status: "approved" },
  { id: "PAY004", date: "2026-03-06", passenger: "Michael Chen", driver: "Robert Brown", rideId: "RIDE12348", amount: 28.50, commissionRate: 20, status: "rejected" },
  { id: "PAY005", date: "2026-03-09", passenger: "James Wilson", driver: "Lisa Anderson", rideId: "RIDE12349", amount: 41.20, commissionRate: 20, status: "pending" },
];

function commission(amount, rate) {
  return parseFloat((amount * rate / 100).toFixed(2));
}
function driverEarnings(amount, rate) {
  return parseFloat((amount - commission(amount, rate)).toFixed(2));
}

function StatusBadge({ status }) {
  const map = {
    pending:  "bg-amber-50 text-amber-700 border border-amber-200",
    approved: "bg-sky-50 text-sky-700 border border-sky-200",
    rejected: "bg-rose-50 text-rose-600 border border-rose-200",
    paid:     "bg-emerald-50 text-emerald-700 border border-emerald-200",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${map[status] || map.pending}`}>
      {status}
    </span>
  );
}

function TransactionModal({ payment, onClose, onConfirm, onReject }) {
  const comm = commission(payment.amount, payment.commissionRate);
  const earnings = driverEarnings(payment.amount, payment.commissionRate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Transaction Details</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Payment ID</p>
              <p className="font-semibold text-slate-800">{payment.id}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Date</p>
              <p className="font-semibold text-slate-800">{payment.date}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Ride ID</p>
              <p className="font-semibold text-slate-800">{payment.rideId}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Status</p>
              <StatusBadge status={payment.status} />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Passenger</p>
              <p className="font-semibold text-slate-800">{payment.passenger}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Driver</p>
              <p className="font-semibold text-slate-800">{payment.driver}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-slate-800 mb-3">Payment Breakdown</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total Payment Amount</span>
                <span className="text-slate-800 font-medium">${payment.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Platform Commission ({payment.commissionRate}%)</span>
                <span className="text-slate-800 font-medium">-${comm.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800">Driver Earnings</span>
                <span className="font-bold text-emerald-600">${earnings.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {payment.status === "pending" && (
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => { onConfirm(payment.id); onClose(); }}
                className="flex-1 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
              >
                Confirm Payment
              </button>
              <button
                onClick={() => { onReject(payment.id); onClose(); }}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
              >
                Reject Payment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentManagement() {
  const [payments, setPayments] = useState(initialPayments);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const confirm = (id) => setPayments((p) => p.map((x) => x.id === id ? { ...x, status: "approved" } : x));
  const reject  = (id) => setPayments((p) => p.map((x) => x.id === id ? { ...x, status: "rejected" } : x));

  const filtered = payments.filter((p) => {
    if (filter === "All") return true;
    return p.status === filter.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Payment Management</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage ride payments and driver earnings</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 mb-4 flex gap-1.5">
        {["All", "Pending", "Approved", "Paid"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              filter === f ? "bg-blue-900 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {["Payment ID", "Passenger", "Driver", "Ride ID", "Payment Amount", "Commission", "Driver Earnings", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-10 text-slate-400 text-sm">No payments found.</td>
                </tr>
              )}
              {filtered.map((p) => {
                const comm = commission(p.amount, p.commissionRate);
                const earn = driverEarnings(p.amount, p.commissionRate);
                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">{p.id}</p>
                      <p className="text-xs text-slate-400">{p.date}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-700">{p.passenger}</td>
                    <td className="px-5 py-4 text-slate-700">{p.driver}</td>
                    <td className="px-5 py-4 text-slate-700">{p.rideId}</td>
                    <td className="px-5 py-4 text-slate-800 font-medium">${p.amount.toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <p className="text-slate-800 font-medium">${comm.toFixed(2)}</p>
                      <p className="text-xs text-slate-400">{p.commissionRate}%</p>
                    </td>
                    <td className="px-5 py-4 text-emerald-600 font-semibold">${earn.toFixed(2)}</td>
                    <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {/* View */}
                        <button
                          onClick={() => setSelected(p)}
                          className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded"
                          title="View Details"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                        </button>

                        {/* Confirm (pending only) */}
                        {p.status === "pending" && (
                          <button
                            onClick={() => confirm(p.id)}
                            className="text-slate-400 hover:text-emerald-600 transition-colors p-1 rounded"
                            title="Confirm Payment"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/>
                            </svg>
                          </button>
                        )}

                        {/* Reject (pending only) */}
                        {p.status === "pending" && (
                          <button
                            onClick={() => reject(p.id)}
                            className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded"
                            title="Reject Payment"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <TransactionModal
          payment={selected}
          onClose={() => setSelected(null)}
          onConfirm={confirm}
          onReject={reject}
        />
      )}
    </div>
  );
}