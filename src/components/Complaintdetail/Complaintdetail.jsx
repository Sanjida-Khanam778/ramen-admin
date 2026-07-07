import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetComplaintsQuery,
  useGetUserComplaintHistoryQuery,
  useRespondToComplaintMutation,
} from "../../Api/couponApi"; // adjust path as needed

function StatusBadge({ status, size = "md" }) {
  const { t } = useTranslation();
  const map = {
    open: "bg-rose-50 text-rose-600 border border-rose-200",
    in_progress: "bg-amber-50 text-amber-600 border border-amber-200",
    in_review: "bg-amber-50 text-amber-600 border border-amber-200",
    "in review": "bg-amber-50 text-amber-600 border border-amber-200",
    resolved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    closed: "bg-slate-50 text-slate-600 border border-slate-200",
  };
  const sizeCls =
    size === "sm" ? "text-[11px] px-2 py-0.5" : "text-xs px-2.5 py-1";
  const statusKey =
    status === "in_progress" || status === "in review" || status === "in_review"
      ? "inProgress"
      : status || "open";
  return (
    <span
      className={`${sizeCls} font-semibold rounded-full capitalize whitespace-nowrap ${map[status] || map.open}`}
    >
      {t(`complaint.status.${statusKey}`, (status || "open").replace("_", " "))}
    </span>
  );
}

function CategoryTag({ category }) {
  return (
    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 capitalize">
      {category || "general"}
    </span>
  );
}

function Spinner({ className = "w-5 h-5 text-blue-600" }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  );
}

function formatDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function initials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return parts.length === 1
    ? parts[0].slice(0, 2).toUpperCase()
    : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function ComplaintDetail() {
  const { t } = useTranslation();
  const { complaintId } = useParams();
  const navigate = useNavigate();

  // getComplaints (GET /admin/support/) returns an object containing the tickets array.
  // We use it once, just to discover which user this ticket belongs to.
  const {
    data: allComplaints,
    isLoading: isListLoading,
    isError: isListError,
  } = useGetComplaintsQuery();

  const complaintsList = Array.isArray(allComplaints)
    ? allComplaints
    : allComplaints?.data || allComplaints?.tickets || [];
  const ticketFromList = complaintsList.find((t) => t.id === complaintId);

  // The history endpoint takes the USER id, not the ticket id — only call it once we know the user.
  const userId = ticketFromList?.user?.id;
  const { data: historyData, isLoading: isHistoryLoading } =
    useGetUserComplaintHistoryQuery(userId, { skip: !userId });

  // History is the richer/fresher source (always has response_message + latest status),
  // so prefer the copy found there; fall back to the list copy while history is loading.
  const ticketFromHistory = historyData?.tickets?.find(
    (t) => t.id === complaintId,
  );
  const ticket = ticketFromHistory
    ? { ...ticketFromHistory, user: historyData?.user ?? ticketFromList?.user }
    : ticketFromList;

  const [respondToComplaint, { isLoading: isResponding }] =
    useRespondToComplaintMutation();

  const [response, setResponse] = useState("");
  const [actionError, setActionError] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [hasReplied, setHasReplied] = useState(false);

  useEffect(() => {
    if (ticket) setResponse(ticket.response_message || "");
  }, [ticket?.id, ticket?.response_message]);

  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(""), 2600);
    return () => clearTimeout(t);
  }, [toastMsg]);

  // Reset local reply state when switching tickets
  useEffect(() => {
    setHasReplied(false);
  }, [ticket?.id]);

  const submit = async (status) => {
    if (!ticket) return;
    if (status !== "resolved" && !response.trim()) {
      setActionError(t("complaint.detail.errorEmptyResponse"));
      return;
    }
    setActionError("");
    try {
      await respondToComplaint({
        supportId: ticket.id,
        status,
        response_message: response.trim() || ticket.response_message || "",
      }).unwrap();
      setToastMsg(
        status === "resolved"
          ? t("complaint.detail.toastResolved")
          : t("complaint.detail.toastReply"),
      );
      if (status === "resolved") setHasReplied(true);
    } catch (err) {
      const errorMsg =
        err?.data?.detail ||
        (err?.data && typeof err.data === "object"
          ? Object.values(err.data).flat().join(" ")
          : "") ||
        t("complaint.detail.errorSubmit");
      setActionError(errorMsg);
    }
  };

  // ── Loading / not-found states ──

  // Still resolving who this ticket belongs to, or (once we know) still loading their history.
  const isLoading =
    isListLoading || (!!userId && isHistoryLoading && !ticketFromHistory);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 font-sans flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <Spinner /> <span className="text-sm">{t("complaint.detail.loading")}</span>
        </div>
      </div>
    );
  }

  if (isListError || !ticket) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 font-sans">
        <button
          onClick={() => navigate("/complaints")}
          className="text-sm text-blue-700 font-semibold mb-6 inline-flex items-center gap-1.5 hover:text-blue-900"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {t("complaint.detail.backBtn")}
        </button>
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
          <p className="text-slate-500 text-sm">
            {t("complaint.detail.failed")}
          </p>
        </div>
      </div>
    );
  }

  const user = ticket.user || {};
  const history = historyData?.tickets ?? [];
  const otherTickets = history.filter((h) => h.id !== ticket.id);
  const isResolved = ticket.status === "resolved" || ticket.status === "closed";

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 bg-slate-800 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-toast-in">
          <svg
            className="w-4 h-4 text-emerald-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M5 13l4 4L19 7"
            />
          </svg>
          {toastMsg}
        </div>
      )}
      <style>{`
        @keyframes toast-in { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        .animate-toast-in { animation: toast-in 0.2s ease-out; }
      `}</style>

      {/* Back link */}
      <button
        onClick={() => navigate("/complaints")}
        className="text-sm text-blue-700 font-semibold mb-5 inline-flex items-center gap-1.5 hover:text-blue-900 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        {t("complaint.detail.backBtn")}
      </button>

      {/* Page header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              {ticket.subject}
            </h1>
            <StatusBadge status={ticket.status} />
          </div>
          <p className="text-sm text-slate-500">
            {t("complaint.detail.ticketLabel")}{" "}
            <span className="font-mono text-slate-600">
              {ticket.id.slice(0, 8)}
            </span>{" "}
            · {t("complaint.detail.submitted", { date: formatDateTime(ticket.created_at) })}
          </p>
        </div>
        <CategoryTag category={ticket.category} />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 items-start">
        {/* ── Main column ── */}
        <div className="space-y-5">
          {/* Original message */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              {t("complaint.detail.messageTitle")}
            </p>
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                {initials(user.name)}
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl rounded-tl-sm px-4 py-3 text-sm text-slate-700 leading-relaxed flex-1">
                {ticket.message}
              </div>
            </div>
          </div>

          {/* Admin response composer */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              {isResolved
                ? t("complaint.detail.responseTitleResolved")
                : t("complaint.detail.responseTitleAdmin")}
            </p>

            {ticket.response_message && isResolved && (
              <div className="flex gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white shrink-0 flex items-center justify-center">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl rounded-tl-sm px-4 py-3 text-sm text-emerald-800 leading-relaxed flex-1">
                  {ticket.response_message || response}
                </div>
              </div>
            )}

            {/* show composer only when ticket is not resolved and local reply hasn't been sent */}
            {!isResolved && !hasReplied && (
              <>
                <textarea
                  rows={5}
                  placeholder={t("complaint.detail.responsePlaceholder")}
                  value={response}
                  onChange={(e) => {
                    setResponse(e.target.value);
                    setActionError("");
                  }}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition"
                />
                {actionError && (
                  <p className="text-xs text-rose-500 mt-2">{actionError}</p>
                )}

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => submit("resolved")}
                    disabled={isResponding}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                  >
                    {isResponding ? (
                      <Spinner className="w-4 h-4 text-white" />
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                    )}
                    {t("complaint.detail.sendReply")}
                  </button>
                  {/* <button
                    onClick={() => submit("resolved")}
                    disabled={isResponding}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                  >
                    {isResponding ? <Spinner className="w-4 h-4 text-white" /> : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                    )}
                    Mark as Resolved
                  </button> */}
                </div>
              </>
            )}

            {isResolved && (
              <p className="text-xs text-slate-400">
                {t("complaint.detail.resolvedLabel")}
              </p>
            )}
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-5">
          {/* User card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              {t("complaint.detail.sidebarTitle")}
            </p>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center shrink-0">
                {initials(user.name)}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 truncate">
                  {user.name || t("complaint.detail.unnamed")}
                </p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-400">{t("complaint.detail.phone")}</span>
                <span className="text-slate-700 font-medium">
                  {user.phone_number || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t("complaint.detail.totalTickets")}</span>
                <span className="text-slate-700 font-medium">
                  {isHistoryLoading ? "…" : (historyData?.total_tickets ?? "—")}
                </span>
              </div>
            </div>
          </div>

         
        </div>
      </div>
    </div>
  );
}