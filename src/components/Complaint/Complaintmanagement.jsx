import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetComplaintsQuery,
  useRespondToComplaintMutation,
} from "../../Api/couponApi"; // adjust path as needed

function RoleBadge({ role }) {
  const map = {
    passenger: "bg-purple-50 text-purple-600 border border-purple-200",
    driver: "bg-sky-50 text-sky-600 border border-sky-200",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${map[role] || map.passenger}`}>
      {role || "user"}
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    open: "bg-rose-50 text-rose-600 border border-rose-200",
    in_progress: "bg-amber-50 text-amber-600 border border-amber-200",
    "in review": "bg-amber-50 text-amber-600 border border-amber-200",
    resolved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    closed: "bg-slate-50 text-slate-600 border border-slate-200",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize whitespace-nowrap ${map[status] || map.open}`}>
      {(status || "open").replace("_", " ")}
    </span>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

// Map API ticket → display shape
function mapComplaint(t) {
  return {
    id: t.id,
    date: t.created_at?.slice(0, 10),
    userId: t.user?.id,
    userName: t.user?.name || t.user?.email || "Unknown",
    userEmail: t.user?.email,
    userPhone: t.user?.phone_number,
    type: t.category,
    subject: t.subject,
    message: t.message,
    status: t.status, // open | in_review | resolved (API uses whatever the backend sends)
    adminResponse: t.response_message || "",
  };
}

export default function ComplaintManagement() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");

  const { data, isLoading, isError } = useGetComplaintsQuery();
  const [respondToComplaint] = useRespondToComplaintMutation();
  const complaints = (data?.data ?? []).map(mapComplaint);
  const filtered = complaints.filter((c) => {
    if (filter === "All") return true;
    if (filter === "In Review") return c.status === "in review" || c.status === "in_review" || c.status === "in_progress";
    if (filter === "Resolved") return c.status === "resolved" || c.status === "closed";
    return c.status === filter.toLowerCase();
  });

  // Quick resolve straight from the row — no message change, just flips status
  const quickResolve = async (c, e) => {
    e.stopPropagation();
    try {
      await respondToComplaint({
        supportId: c.id,
        status: "resolved",
        response_message: c.adminResponse || "Marked as resolved.",
      }).unwrap();
    } catch {
      // errors are surfaced on the detail page; row action fails silently here
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Complaint Management</h1>
        <p className="text-sm text-slate-500 mt-0.5">Handle driver and passenger complaints</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 mb-4 flex gap-1.5">
        {["All", "Open", "In Review", "Resolved"].map((f) => (
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
          {isLoading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
              <Spinner /> <span className="text-sm">Loading complaints…</span>
            </div>
          ) : isError ? (
            <p className="text-center py-16 text-rose-500 text-sm">Failed to load complaints.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {["User", "Subject", "Message", "Date", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-slate-400 text-sm">No complaints found.</td>
                  </tr>
                )}
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                    onClick={() => navigate(`/complaints/${c.id}`)}
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">{c.userName}</p>
                      <p className="text-xs text-slate-400">{c.userEmail}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-700 whitespace-nowrap">{c.subject}</td>
                    <td className="px-5 py-4 text-slate-500 max-w-[260px]">
                      <span className="line-clamp-1">{c.message}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-600 whitespace-nowrap">{c.date}</td>
                    <td className="px-5 py-4"><StatusBadge status={c.status} /></td>
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/complaints/${c.id}`)}
                          className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded"
                          title="View Details"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                        </button>
                        {c.status !== "resolved" && (
                          <button
                            onClick={(e) => quickResolve(c, e)}
                            className="text-slate-400 hover:text-emerald-600 transition-colors p-1 rounded"
                            title="Mark as Resolved"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}