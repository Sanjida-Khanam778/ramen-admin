import { useState } from "react";

const initialComplaints = [
  { id: "COMP001", date: "2026-03-08", userName: "Michael Chen", userRole: "passenger", type: "Driver Behavior", message: "Driver was very rude and took a longer route than necessary.", status: "open", adminResponse: "" },
  { id: "COMP002", date: "2026-03-07", userName: "Sarah Johnson", userRole: "driver", type: "Payment Issue", message: "Payment for ride RIDE12289 has not been credited to my account.", status: "in review", adminResponse: "" },
  { id: "COMP003", date: "2026-03-06", userName: "Anna Thompson", userRole: "passenger", type: "Cancellation", message: "Unable to cancel ride after driver accepted. App kept showing error.", status: "resolved", adminResponse: "We have resolved this issue and refunded your cancellation fee." },
  { id: "COMP004", date: "2026-03-05", userName: "David Martinez", userRole: "driver", type: "No Show", message: "Passenger did not show up after I waited for 10 minutes at the pickup location.", status: "resolved", adminResponse: "Compensation has been added to your account for the wait time." },
  { id: "COMP005", date: "2026-03-09", userName: "James Wilson", userRole: "passenger", type: "Safety Concern", message: "Driver was driving too fast and made me feel unsafe during the entire trip.", status: "open", adminResponse: "" },
];

function RoleBadge({ role }) {
  const map = {
    passenger: "bg-purple-50 text-purple-600 border border-purple-200",
    driver: "bg-sky-50 text-sky-600 border border-sky-200",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${map[role] || map.passenger}`}>
      {role}
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    open: "bg-rose-50 text-rose-600 border border-rose-200",
    "in review": "bg-amber-50 text-amber-600 border border-amber-200",
    resolved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${map[status] || map.open}`}>
      {status}
    </span>
  );
}

function ComplaintModal({ complaint, onClose, onResolve, onSendReply }) {
  const [response, setResponse] = useState(complaint.adminResponse || "");

  const handleSend = () => {
    if (!response.trim()) return;
    onSendReply(complaint.id, response);
    onClose();
  };

  const handleResolve = () => {
    onResolve(complaint.id, response);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Complaint Details</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Complaint ID</p>
              <p className="font-semibold text-slate-800">{complaint.id}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Date Submitted</p>
              <p className="font-semibold text-slate-800">{complaint.date}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">User Name</p>
              <p className="font-semibold text-slate-800">{complaint.userName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">User Role</p>
              <RoleBadge role={complaint.userRole} />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Complaint Type</p>
              <p className="font-semibold text-slate-800">{complaint.type}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Status</p>
              <StatusBadge status={complaint.status} />
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-400 mb-1.5">Complaint Message</p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-700 leading-relaxed">
              {complaint.message}
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-400 mb-1.5">Admin Response</p>
            <textarea
              rows={4}
              placeholder="Type your response to the complaint..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              disabled={complaint.status === "resolved"}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>

          {complaint.status !== "resolved" && (
            <div className="flex gap-3 pt-1">
              <button
                onClick={handleSend}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                </svg>
                Send Reply
              </button>
              <button
                onClick={handleResolve}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/>
                </svg>
                Mark as Resolved
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ComplaintManagement() {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const handleResolve = (id, response) => {
    setComplaints((prev) =>
      prev.map((c) => c.id === id ? { ...c, status: "resolved", adminResponse: response } : c)
    );
  };

  const handleSendReply = (id, response) => {
    setComplaints((prev) =>
      prev.map((c) => c.id === id ? { ...c, status: "in review", adminResponse: response } : c)
    );
  };

  const filtered = complaints.filter((c) => {
    if (filter === "All") return true;
    if (filter === "In Review") return c.status === "in review";
    return c.status === filter.toLowerCase();
  });

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
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {["Complaint ID", "User", "Message", "Date", "Status", "Actions"].map((h) => (
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
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-4 font-semibold text-slate-800 whitespace-nowrap">{c.id}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">{c.userName}</p>
                    <div className="mt-1"><RoleBadge role={c.userRole} /></div>
                  </td>
                  <td className="px-5 py-4 text-slate-500 max-w-[260px]">
                    <span className="line-clamp-1">{c.message}</span>
                  </td>
                  <td className="px-5 py-4 text-slate-600 whitespace-nowrap">{c.date}</td>
                  <td className="px-5 py-4"><StatusBadge status={c.status} /></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelected(c)}
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
                          onClick={() => { handleResolve(c.id, c.adminResponse); }}
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
        </div>
      </div>

      {selected && (
        <ComplaintModal
          complaint={selected}
          onClose={() => setSelected(null)}
          onResolve={(id, resp) => { handleResolve(id, resp); setSelected(null); }}
          onSendReply={(id, resp) => { handleSendReply(id, resp); setSelected(null); }}
        />
      )}
    </div>
  );
}