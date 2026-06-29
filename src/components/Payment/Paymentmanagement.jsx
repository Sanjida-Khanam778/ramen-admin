import { useState } from "react";
import {
  useGetWithdrawalsQuery,
  useApproveWithdrawalMutation,
  useCancelWithdrawalMutation,
} from "../../api/couponApi";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso) {
  if (!iso) return "—";
  return iso.slice(0, 10); // "2026-06-16"
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const map = {
    pending:    "bg-amber-50 text-amber-700 border border-amber-200",
    processing: "bg-violet-50 text-violet-700 border border-violet-200",
    paid:       "bg-emerald-50 text-emerald-700 border border-emerald-200",
    cancelled:  "bg-rose-50 text-rose-600 border border-rose-200",
  };
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
        map[status] || map.pending
      }`}
    >
      {status}
    </span>
  );
}

// ─── Transaction Modal ────────────────────────────────────────────────────────

function TransactionModal({ payment, onClose, onApprove, onCancel, loading }) {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  const handleCancel = () => {
    onCancel({ requestId: payment.id, rejection_reason: rejectReason });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">
            Withdrawal Details
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Withdrawal ID</p>
              <p className="font-semibold text-slate-800 text-xs break-all">{payment.id}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Date</p>
              <p className="font-semibold text-slate-800">{formatDate(payment.created_at)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Status</p>
              <StatusBadge status={payment.status} />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Driver</p>
              <p className="font-semibold text-slate-800">
                {payment.driver_name || payment.driver_email}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Total Amount</p>
              <p className="font-semibold text-slate-800">
                ${parseFloat(payment.amount).toFixed(2)}
              </p>
            </div>
            {payment.payout_method && (
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Payout Method</p>
                <p className="font-semibold text-slate-800 capitalize">
                  {payment.payout_method}
                </p>
              </div>
            )}
            {payment.description && (
              <div className="col-span-2">
                <p className="text-xs text-slate-400 mb-0.5">Description</p>
                <p className="text-slate-700 text-sm">{payment.description}</p>
              </div>
            )}
          </div>

          {/* Actions — pending only */}
          {payment.status === "pending" && (
            <div className="space-y-3 pt-1">
              {showRejectInput && (
                <input
                  type="text"
                  placeholder="Rejection reason (optional)"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              )}
              <div className="flex gap-3">
                <button
                  disabled={loading}
                  onClick={() => onApprove(payment.id)}
                  className="flex-1 bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                >
                  {loading ? "Processing…" : "Confirm Payment"}
                </button>
                {!showRejectInput ? (
                  <button
                    onClick={() => setShowRejectInput(true)}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                  >
                    Reject Payment
                  </button>
                ) : (
                  <button
                    disabled={loading}
                    onClick={handleCancel}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                  >
                    {loading ? "Processing…" : "Confirm Reject"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS = ["All", "Pending", "Processing", "Paid", "Cancelled"];

// Map tab label → API status param
const TAB_STATUS = {
  All:        undefined,
  Pending:    "pending",
  Processing: "processing",
  Paid:       "paid",
  Cancelled:  "cancelled",
};

export default function PaymentManagement() {
  const [activeTab, setActiveTab] = useState("Pending");
  const [selected, setSelected]   = useState(null);
  const [actionError, setActionError] = useState("");

  const queryStatus = TAB_STATUS[activeTab];

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useGetWithdrawalsQuery(
    queryStatus ? { status: queryStatus } : {},
  );

  const [approveWithdrawal, { isLoading: approving }] = useApproveWithdrawalMutation();
  const [cancelWithdrawal,  { isLoading: cancelling }] = useCancelWithdrawalMutation();

  const mutating = approving || cancelling;

  const withdrawals = data?.data ?? [];

  // If "All" tab, we get everything the API returns (defaults to pending server-side).
  // To truly show all statuses we'd need multiple calls — for now "All" hits default endpoint.

  const handleApprove = async (requestId) => {
    setActionError("");
    try {
      const res = await approveWithdrawal(requestId).unwrap();
      setSelected(null);
    } catch (err) {
      const msg =
        err?.data?.detail ||
        err?.data?.message ||
        "Failed to approve. Please try again.";
      setActionError(msg);
    }
  };

  const handleCancel = async ({ requestId, rejection_reason }) => {
    setActionError("");
    try {
      await cancelWithdrawal({ requestId, rejection_reason }).unwrap();
      setSelected(null);
    } catch (err) {
      const msg =
        err?.data?.detail ||
        err?.data?.message ||
        "Failed to cancel. Please try again.";
      setActionError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Withdraw Management
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage ride payments and driver earnings
        </p>
      </div>

      {/* Error Banner */}
      {actionError && (
        <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl flex items-center justify-between">
          <span>{actionError}</span>
          <button onClick={() => setActionError("")} className="ml-3 text-rose-400 hover:text-rose-600">✕</button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 mb-4 flex gap-1.5 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === tab
                ? "bg-blue-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {["Withdrawal ID", "Driver", "Payment Amount", "Payout Method", "Status", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {(isLoading || isFetching) && (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-400 text-sm">
                    Loading…
                  </td>
                </tr>
              )}

              {isError && !isLoading && (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-rose-400 text-sm">
                    Failed to load withdrawals.
                  </td>
                </tr>
              )}

              {!isLoading && !isFetching && !isError && withdrawals.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-400 text-sm">
                    No withdrawals found.
                  </td>
                </tr>
              )}

              {!isLoading && !isFetching && withdrawals.map((w) => (
                <tr key={w.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800 text-xs">{w.id}</p>
                    <p className="text-xs text-slate-400">{formatDate(w.created_at)}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-slate-800 font-medium">
                      {w.driver_name || <span className="text-slate-400 italic">N/A</span>}
                    </p>
                    <p className="text-xs text-slate-400">{w.driver_email}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-800 font-medium">
                    ${parseFloat(w.amount).toFixed(2)}
                  </td>
                  <td className="px-5 py-4 text-slate-600 capitalize">
                    {w.payout_method ?? <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={w.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {/* View */}
                      <button
                        onClick={() => { setActionError(""); setSelected(w); }}
                        className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded"
                        title="View Details"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>

                      {/* Quick Approve */}
                      {w.status === "pending" && (
                        <button
                          onClick={() => handleApprove(w.id)}
                          disabled={mutating}
                          className="text-slate-400 hover:text-emerald-600 disabled:opacity-40 transition-colors p-1 rounded"
                          title="Confirm Payment"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}

                      {/* Quick Reject */}
                      {w.status === "pending" && (
                        <button
                          onClick={() => handleCancel({ requestId: w.id, rejection_reason: "" })}
                          disabled={mutating}
                          className="text-slate-400 hover:text-rose-500 disabled:opacity-40 transition-colors p-1 rounded"
                          title="Reject Payment"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <TransactionModal
          payment={selected}
          onClose={() => { setSelected(null); setActionError(""); }}
          onApprove={handleApprove}
          onCancel={handleCancel}
          loading={mutating}
        />
      )}
    </div>
  );
}