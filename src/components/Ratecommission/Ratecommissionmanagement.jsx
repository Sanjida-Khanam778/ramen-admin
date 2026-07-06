import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  useGetSettingsQuery,
  useGetTransactionStatsQuery,
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,
  useUpdateSettingMutation,
} from "../../Api/couponApi";

function calcCharge(earnings, rate) {
  return parseFloat((earnings * (rate / 100)).toFixed(2));
}

// ─── Transaction status badge ─────────────────────────────────────────────────
function StatusBadge({ status }) {
  const { t } = useTranslation();
  const map = {
    paid: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border border-amber-200",
    failed: "bg-rose-50 text-rose-600 border border-rose-200",
    suspended: "bg-rose-50 text-rose-600 border border-rose-200",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${map[status] || map.pending}`}>
      {t(`commission.table.${status}`, status)}
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

// ─── Transaction Detail Modal ─────────────────────────────────────────────────
function TransactionDetailModal({ transactionId, onClose, formatMoney }) {
  const { t } = useTranslation();
  const { data: tx, isLoading } = useGetTransactionByIdQuery(transactionId, {
    skip: !transactionId,
  });

  return (
    <Modal title={t("commission.detailModal.title")} onClose={onClose}>
      <div className="px-6 py-5 space-y-4">
        {isLoading ? (
          <p className="text-slate-500 text-sm text-center py-4">
            {t("commission.detailModal.loading")}
          </p>
        ) : tx ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">{t("commission.detailModal.txId")}</p>
                <p className="font-semibold text-slate-800 text-xs font-mono truncate">{tx.id}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">{t("commission.detailModal.rideId")}</p>
                <p className="font-semibold text-slate-800 text-xs font-mono truncate">{tx.ride_id || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">{t("commission.detailModal.driver")}</p>
                <p className="font-semibold text-slate-800">{tx.driver_name}</p>
                <p className="text-xs text-slate-400">{tx.driver_phone}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">{t("commission.detailModal.passenger")}</p>
                <p className="font-semibold text-slate-800">{tx.passenger_name}</p>
                <p className="text-xs text-slate-400">{tx.passenger_phone}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">{t("commission.detailModal.method")}</p>
                <p className="font-semibold text-slate-800 capitalize">{tx.payment_method || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">{t("commission.detailModal.status")}</p>
                <StatusBadge status={tx.payment_status} />
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">{t("commission.detailModal.mode")}</p>
                <p className="font-semibold text-slate-800 capitalize">{tx.ride_mode || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">{t("commission.detailModal.rideStatus")}</p>
                <p className="font-semibold text-slate-800 capitalize">{tx.ride_status || "—"}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-slate-800 mb-3">{t("commission.detailModal.breakdown")}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{t("commission.detailModal.total")}</span>
                  <span className="font-semibold text-slate-800">{formatMoney(tx.total_amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{t("commission.detailModal.fee")}</span>
                  <span className="font-semibold text-rose-500">{formatMoney(tx.platform_fee)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{t("commission.detailModal.earnings")}</span>
                  <span className="font-semibold text-emerald-600">{formatMoney(tx.driver_earnings)}</span>
                </div>
              </div>
            </div>

            {(tx.payment_initiated_at || tx.payment_confirmed_at) && (
              <div className="space-y-2 border-t border-slate-100 pt-3">
                {tx.payment_initiated_at && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">{t("commission.detailModal.initiated")}</span>
                    <span className="text-slate-700 font-medium">{tx.payment_initiated_at}</span>
                  </div>
                )}
                {tx.payment_confirmed_at && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">{t("commission.detailModal.confirmed")}</span>
                    <span className="text-slate-700 font-medium">{tx.payment_confirmed_at}</span>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <p className="text-slate-500 text-sm text-center py-4">{t("commission.detailModal.noDetails")}</p>
        )}
      </div>
    </Modal>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner({ color = "text-white" }) {
  return (
    <svg className={`animate-spin w-4 h-4 ${color}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function RateCommissionManagement() {
  const { t } = useTranslation();
  const [kmRate, setKmRate] = useState(1.5);
  const [serviceCharge, setServiceCharge] = useState(20);
  const [baseFare, setBaseFare] = useState(100);
  const [editingKm, setEditingKm] = useState("");
  const [editingService, setEditingService] = useState("");
  const [editingBaseFare, setEditingBaseFare] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [settingsError, setSettingsError] = useState("");

  const [transactionPage, setTransactionPage] = useState(1);
  const [transactionPaymentStatus, setTransactionPaymentStatus] = useState("all");
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);

  const [updateSetting, { isLoading: isSaving }] = useUpdateSettingMutation();

  const { data: settingsData, isLoading: isSettingsLoading } = useGetSettingsQuery();
  const { data: transactionStatsData, isLoading: isStatsLoading } = useGetTransactionStatsQuery();
  const {
    data: transactionListData,
    isLoading: isTransactionsLoading,
    isError: isTransactionsError,
  } = useGetTransactionsQuery({
    payment_status: transactionPaymentStatus !== "all" ? transactionPaymentStatus : undefined,
    page: transactionPage,
    limit: 10,
  });

  const overview = transactionStatsData?.overview || {};
  const transactionList = transactionListData?.data || transactionListData || [];
  const transactionCount =
    transactionListData?.count ??
    (Array.isArray(transactionListData) ? transactionListData.length : 0);

  useEffect(() => {
    if (!settingsData) return;
    const km = parseFloat(settingsData?.per_kilo_driver_rate?.value);
    const svc = parseFloat(settingsData?.platform_rate_percent?.value);
    const base = parseFloat(settingsData?.base_fare?.value);
    if (!isNaN(km)) setKmRate(km);
    if (!isNaN(svc)) setServiceCharge(svc);
    if (!isNaN(base)) setBaseFare(base);
  }, [settingsData]);

  const startEdit = () => {
    setEditingKm(String(kmRate));
    setEditingService(String(serviceCharge));
    setEditingBaseFare(String(baseFare));
    setSettingsError("");
    setIsEditing(true);
  };

  const cancelEdit = () => { setIsEditing(false); setSettingsError(""); };

  const saveEdit = async () => {
    const newKm = parseFloat(editingKm);
    const newSvc = parseFloat(editingService);
    const newBase = parseFloat(editingBaseFare);
    if (isNaN(newKm) || newKm <= 0) { setSettingsError(t("commission.settingsCard.errorKm")); return; }
    if (isNaN(newSvc) || newSvc <= 0 || newSvc > 100) { setSettingsError(t("commission.settingsCard.errorSvc")); return; }
    if (isNaN(newBase) || newBase <= 0) { setSettingsError(t("commission.settingsCard.errorBase")); return; }
    setSettingsError("");
    try {
      await Promise.all([
        updateSetting({ key: "per_kilo_driver_rate", value: String(newKm), description: "Per kilo rent" }).unwrap(),
        updateSetting({ key: "platform_rate_percent", value: String(newSvc), description: "Platform value" }).unwrap(),
        updateSetting({ key: "base_fare", value: String(newBase), description: "A minimum price for car" }).unwrap(),
      ]);
      setKmRate(newKm);
      setServiceCharge(newSvc);
      setBaseFare(newBase);
      setIsEditing(false);
    } catch (err) {
      setSettingsError(err?.data?.detail || t("commission.settingsCard.failedSave"));
    }
  };

  const formatMoney = (value) => {
    const number = Number(value);
    if (Number.isNaN(number)) return "—";
    return `$${number.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatPercent = (value) => {
    const number = Number(value);
    if (Number.isNaN(number)) return "—";
    return `${number.toFixed(2)}%`;
  };

  const statsCards = [
    {
      label: t("commission.stats.totalRides"),
      value: overview.total_rides != null ? overview.total_rides.toLocaleString() : "—",
      color: "text-slate-800",
      icon: <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
      iconBg: "bg-blue-50",
    },
    {
      label: t("commission.stats.totalRevenue"),
      value: overview.total_revenue != null ? formatMoney(overview.total_revenue) : "—",
      color: "text-slate-800",
      icon: <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      iconBg: "bg-emerald-50",
    },
    {
      label: t("commission.stats.platformEarnings"),
      value: overview.total_platform_earnings != null ? formatMoney(overview.total_platform_earnings) : "—",
      color: "text-slate-800",
      icon: <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
      iconBg: "bg-violet-50",
    },
    {
      label: t("commission.stats.driverEarnings"),
      value: overview.total_driver_earnings != null ? formatMoney(overview.total_driver_earnings) : "—",
      color: "text-slate-800",
      icon: <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      iconBg: "bg-cyan-50",
    },
    {
      label: t("commission.stats.averageFare"),
      value: overview.average_fare != null ? formatMoney(overview.average_fare) : "—",
      color: "text-slate-800",
      icon: <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      iconBg: "bg-amber-50",
    },
    {
      label: t("commission.stats.successRate"),
      value: overview.success_rate_percentage != null ? formatPercent(overview.success_rate_percentage) : "—",
      color: "text-emerald-600",
      icon: <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
      iconBg: "bg-emerald-50",
    },
  ];

  const filterTabs = [
    ["all", t("commission.table.all")],
    ["paid", t("commission.table.paid")],
    ["pending", t("commission.table.pending")],
    ["failed", t("commission.table.failed")],
  ];

  const tableHeaders = [
    t("commission.detailModal.driver"),
    t("commission.table.cols.amount"),
    t("commission.table.cols.commission"),
    t("commission.table.cols.driverEarnings"),
    t("commission.detailModal.method"),
    t("commission.table.cols.status"),
    t("commission.table.cols.actions"),
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <style>{`
        @keyframes fade-in { from { opacity:0; transform:scale(0.97) translateY(6px); } to { opacity:1; transform:scale(1) translateY(0); } }
        .fade-in { animation: fade-in 0.18s ease-out; }
      `}</style>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{t("commission.title")}</h1>
        <p className="text-sm text-slate-500 mt-0.5">{t("commission.subtitle")}</p>
      </div>

      {/* Platform Settings Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800">{t("commission.settingsCard.title")}</h2>
          {!isEditing ? (
            <button onClick={startEdit} className="bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors">
              {t("commission.settingsCard.editBtn")}
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={saveEdit} disabled={isSaving} className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors">
                {isSaving && <Spinner />}
                {isSaving ? t("common.processing") : t("commission.settingsCard.saveBtn")}
              </button>
              <button onClick={cancelEdit} disabled={isSaving} className="bg-slate-100 hover:bg-slate-200 disabled:opacity-60 text-slate-700 text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                {t("commission.settingsCard.cancelBtn")}
              </button>
            </div>
          )}
        </div>

        {settingsError && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-lg flex items-center justify-between">
            <span>{settingsError}</span>
            <button onClick={() => setSettingsError("")} className="ml-4 text-rose-400 hover:text-rose-600">✕</button>
          </div>
        )}

        {isSettingsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["blue", "purple", "emerald"].map((c) => (
              <div key={c} className={`bg-${c}-50 border border-${c}-100 rounded-xl p-4 flex items-start gap-4 animate-pulse`}>
                <div className={`bg-${c}-200 w-10 h-10 rounded-lg shrink-0`} />
                <div className="flex-1 space-y-2 pt-1">
                  <div className={`h-2.5 bg-${c}-200 rounded w-28`} />
                  <div className={`h-7 bg-${c}-200 rounded w-20`} />
                  <div className={`h-2 bg-${c}-100 rounded w-40`} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Per KM Rate */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-4">
              <div className="bg-blue-900 w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-1">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-blue-700 mb-1">{t("commission.settingsCard.perKm")}</p>
                {isEditing ? (
                  <input type="number" value={editingKm} onChange={(e) => setEditingKm(e.target.value)}
                    className="w-28 border border-blue-300 bg-white rounded-lg px-3 py-1.5 text-xl font-bold text-blue-900 outline-none focus:ring-2 focus:ring-blue-500 transition" step="0.1" min="0" autoFocus />
                ) : (
                  <p className="text-2xl font-bold text-blue-900">${kmRate.toFixed(2)}/km</p>
                )}
              </div>
            </div>

            {/* Service Charge */}
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-start gap-4">
              <div className="bg-purple-600 w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-1">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M17 17h.01M9.5 9.5l5 5M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 012-2z" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-purple-700 mb-1">{t("commission.settingsCard.serviceCharge")}</p>
                {isEditing ? (
                  <input type="number" value={editingService} onChange={(e) => setEditingService(e.target.value)}
                    className="w-24 border border-purple-300 bg-white rounded-lg px-3 py-1.5 text-xl font-bold text-purple-700 outline-none focus:ring-2 focus:ring-purple-500 transition" step="1" min="0" max="100" />
                ) : (
                  <p className="text-2xl font-bold text-purple-700">{serviceCharge}%</p>
                )}
              </div>
            </div>

            {/* Base Fare */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-4">
              <div className="bg-emerald-600 w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-1">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-emerald-700 mb-1">{t("commission.settingsCard.baseFare")}</p>
                {isEditing ? (
                  <input type="number" value={editingBaseFare} onChange={(e) => setEditingBaseFare(e.target.value)}
                    className="w-28 border border-emerald-300 bg-white rounded-lg px-3 py-1.5 text-xl font-bold text-emerald-700 outline-none focus:ring-2 focus:ring-emerald-500 transition" step="1" min="0" />
                ) : (
                  <p className="text-2xl font-bold text-emerald-700">${baseFare.toFixed(2)}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mb-5">
        {statsCards.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center gap-3 shadow-sm">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${s.iconBg}`}>{s.icon}</div>
            <div>
              <p className="text-xs text-slate-400 font-medium">{s.label}</p>
              <p className={`text-lg font-bold leading-tight ${s.color}`}>
                {isStatsLoading ? t("common.loading") : s.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Transaction Table — same design as old driver table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-base font-bold text-slate-800">{t("commission.table.title")}</h3>
          {/* Filter tabs — same style as old driver filter */}
          <div className="flex gap-1.5">
            {filterTabs.map(([value, label]) => (
              <button
                key={value}
                onClick={() => { setTransactionPaymentStatus(value); setTransactionPage(1); }}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  transactionPaymentStatus === value ? "bg-blue-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {tableHeaders.map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isTransactionsLoading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">{t("commission.table.loading")}</td></tr>
              ) : isTransactionsError ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-rose-600">{t("commission.table.failedLoad")}</td></tr>
              ) : transactionList.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">{t("commission.table.noTx")}</td></tr>
              ) : (
                transactionList.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Driver — same layout as old driver name+email cell */}
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">{tx.driver_name}</p>
                      <p className="text-xs text-slate-400">{tx.driver_phone}</p>
                    </td>
                    {/* Total — maps to old "Total Earnings" */}
                    <td className="px-5 py-4 text-slate-700">{formatMoney(tx.total_amount)}</td>
                    {/* Platform fee — maps to old "Platform Charge" */}
                    <td className="px-5 py-4 text-rose-500 font-semibold">{formatMoney(tx.platform_fee)}</td>
                    {/* Driver earnings — maps to old "Paid" */}
                    <td className="px-5 py-4 text-emerald-600 font-semibold">{formatMoney(tx.driver_earnings)}</td>
                    {/* Payment method */}
                    <td className="px-5 py-4 text-slate-700 capitalize">{tx.payment_method || "—"}</td>
                    {/* Status badge */}
                    <td className="px-5 py-4"><StatusBadge status={tx.payment_status} /></td>
                    {/* Actions — eye icon opens modal, same as old driver table */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedTransactionId(tx.id)}
                          className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded"
                          title={t("commission.detailModal.title")}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-4 border-t border-slate-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            {t("commission.table.showing", { count: transactionList.length, total: transactionCount })}
          </p>
          <div className="inline-flex items-center gap-2">
            <button
              onClick={() => setTransactionPage((p) => Math.max(1, p - 1))}
              disabled={transactionPage === 1}
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 bg-white disabled:opacity-50"
            >
              {t("common.prev")}
            </button>
            <span className="text-sm text-slate-600">{transactionPage}</span>
            <button
              onClick={() => setTransactionPage((p) => p + 1)}
              disabled={transactionList.length < 10}
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 bg-white disabled:opacity-50"
            >
              {t("common.next")}
            </button>
          </div>
        </div>
      </div>

      {/* Transaction detail modal — opens when eye icon is clicked */}
      {selectedTransactionId && (
        <TransactionDetailModal
          transactionId={selectedTransactionId}
          onClose={() => setSelectedTransactionId(null)}
          formatMoney={formatMoney}
        />
      )}
    </div>
  );
}