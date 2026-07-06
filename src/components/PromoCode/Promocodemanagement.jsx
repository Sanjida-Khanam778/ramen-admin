import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  useGetCouponsQuery,
  useGetCouponByIdQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDisableCouponMutation,
  useDeleteCouponMutation,
} from "../../Api/couponApi";
import toast from "react-hot-toast";

// ─── helpers ──────────────────────────────────────────────────────────────────

function mapCoupon(c) {
  const now = new Date();
  const until = new Date(c.valid_until);
  let status = "active";
  if (!c.is_active) status = "disabled";
  else if (until < now) status = "expired";

  return {
    id: c.id,
    code: c.code,
    description: c.description || c.title || "—",
    discountType: c.discount_type,
    discountValue: parseFloat(c.discount_value) || 0,
    maxDiscount: c.max_discount ? parseFloat(c.max_discount) : null,
    minOrder: c.min_order_value ? parseFloat(c.min_order_value) : null,
    usageLimit: c.max_uses ?? "∞",
    usageLimitRaw: c.max_uses,
    used: c.current_uses ?? 0,
    maxUsesPerUser: c.max_uses_per_user ?? 1,
    validFrom: c.valid_from?.slice(0, 10),
    validUntil: c.valid_until?.slice(0, 10),
    status,
    isActive: c.is_active,
    title: c.title || "",
  };
}

function toApiBody(form) {
  return {
    code: form.code.toUpperCase(),
    discount_type: form.discountType,
    discount_value: String(form.discountValue),
    max_discount: form.maxDiscount ? String(form.maxDiscount) : null,
    min_order_value: form.minOrder ? String(form.minOrder) : null,
    valid_from: form.validFrom ? `${form.validFrom}T00:00:00Z` : null,
    valid_until: form.validUntil ? `${form.validUntil}T23:59:59Z` : null,
    max_uses: form.usageLimit ? Number(form.usageLimit) : null,
    max_uses_per_user: form.maxUsesPerUser ? Number(form.maxUsesPerUser) : 1,
    is_active: true,
    title: form.title || "",
    description: form.description || "",
  };
}

const emptyForm = {
  code: "",
  title: "",
  description: "",
  discountType: "percentage",
  discountValue: "",
  maxDiscount: "",
  minOrder: "",
  usageLimit: "",
  maxUsesPerUser: "1",
  validFrom: "",
  validUntil: "",
};

// ─── small UI pieces ───────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const { t } = useTranslation();
  const styles = {
    active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    expired: "bg-amber-50 text-amber-700 border border-amber-200",
    disabled: "bg-slate-100 text-slate-500 border border-slate-200",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles[status] || styles.disabled}`}>
      {t(`promo.badge.${status}`)}
    </span>
  );
}

function UsageBar({ used, limit }) {
  if (!limit || limit === "∞") {
    return <span className="text-sm font-medium text-slate-700">{used} / ∞</span>;
  }
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
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>{icon}</div>
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
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-fade-in max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors z-10">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}

// ─── Field & inputCls defined at module level so they never re-create on render ──

function Field({ label, id, required, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </div>
  );
}

function inputCls(hasError) {
  return `w-full border rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${hasError ? "border-rose-400" : "border-slate-200"}`;
}

// ─── Create / Edit Modal ───────────────────────────────────────────────────────

function CouponFormModal({ onClose, onSubmit, initialData, isLoading, mode = "create" }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(
    initialData
      ? {
          code: initialData.code,
          title: initialData.title || "",
          description: initialData.description === "—" ? "" : initialData.description,
          discountType: initialData.discountType,
          discountValue: initialData.discountValue,
          maxDiscount: initialData.maxDiscount ?? "",
          minOrder: initialData.minOrder ?? "",
          usageLimit: initialData.usageLimitRaw ?? "",
          maxUsesPerUser: initialData.maxUsesPerUser ?? 1,
          validFrom: initialData.validFrom ?? "",
          validUntil: initialData.validUntil ?? "",
        }
      : emptyForm,
  );
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.code.trim()) e.code = t("promo.formModal.errorRequired");
    if (!form.discountValue) e.discountValue = t("promo.formModal.errorRequired");
    if (!form.validFrom) e.validFrom = t("promo.formModal.errorRequired");
    if (!form.validUntil) e.validUntil = t("promo.formModal.errorRequired");
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSubmit(toApiBody(form));
  };

  return (
    <Modal onClose={onClose}>
      <div className="p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-5">
          {mode === "edit" ? t("promo.formModal.titleEdit") : t("promo.formModal.titleCreate")}
        </h2>
        <div className="space-y-4">
          <Field label={t("promo.formModal.code")} id="code" required error={errors.code}>
            <input
              className={inputCls(!!errors.code)}
              placeholder={t("promo.formModal.codePlaceholder")}
              value={form.code}
              disabled={mode === "edit"}
              onChange={(e) => set("code", e.target.value)}
            />
          </Field>

          <Field label={t("promo.formModal.title")} id="title" error={errors.title}>
            <input className={inputCls(false)} placeholder={t("promo.formModal.titlePlaceholder")} value={form.title}
              onChange={(e) => set("title", e.target.value)} />
          </Field>

          <Field label={t("promo.formModal.description")} id="description" error={errors.description}>
            <input className={inputCls(false)} placeholder={t("promo.formModal.descriptionPlaceholder")} value={form.description}
              onChange={(e) => set("description", e.target.value)} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t("promo.formModal.discountType")} id="discountType" required error={errors.discountType}>
              <select className={inputCls(false)} value={form.discountType}
                onChange={(e) => set("discountType", e.target.value)}>
                <option value="percentage">{t("promo.formModal.percentage")}</option>
                <option value="fixed">{t("promo.formModal.fixed")}</option>
              </select>
            </Field>
            <Field label={t("promo.formModal.discountValue")} id="discountValue" required error={errors.discountValue}>
              <input className={inputCls(!!errors.discountValue)} type="number" placeholder="10" value={form.discountValue}
                onChange={(e) => set("discountValue", e.target.value)} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t("promo.formModal.maxDiscount")} id="maxDiscount" error={errors.maxDiscount}>
              <input className={inputCls(false)} type="number" placeholder="15.00" value={form.maxDiscount}
                onChange={(e) => set("maxDiscount", e.target.value)} />
            </Field>
            <Field label={t("promo.formModal.minOrder")} id="minOrder" error={errors.minOrder}>
              <input className={inputCls(false)} type="number" placeholder="50.00" value={form.minOrder}
                onChange={(e) => set("minOrder", e.target.value)} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t("promo.formModal.usageLimit")} id="usageLimit" error={errors.usageLimit}>
              <input className={inputCls(false)} type="number" placeholder={t("promo.formModal.usageLimitPlaceholder")} value={form.usageLimit}
                onChange={(e) => set("usageLimit", e.target.value)} />
            </Field>
            <Field label={t("promo.formModal.maxUsesPerUser")} id="maxUsesPerUser" error={errors.maxUsesPerUser}>
              <input className={inputCls(false)} type="number" placeholder="1" value={form.maxUsesPerUser}
                onChange={(e) => set("maxUsesPerUser", e.target.value)} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t("promo.formModal.validFrom")} id="validFrom" required error={errors.validFrom}>
              <input className={inputCls(!!errors.validFrom)} type="date" value={form.validFrom}
                onChange={(e) => set("validFrom", e.target.value)} />
            </Field>
            <Field label={t("promo.formModal.validUntil")} id="validUntil" required error={errors.validUntil}>
              <input className={inputCls(!!errors.validUntil)} type="date" value={form.validUntil}
                onChange={(e) => set("validUntil", e.target.value)} />
            </Field>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading && <Spinner />}
            {mode === "edit" ? t("promo.formModal.save") : t("promo.formModal.create")}
          </button>
          <button onClick={onClose}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold py-2.5 rounded-lg transition-colors">
            {t("promo.formModal.cancel")}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Detail Modal ──────────────────────────────────────────────────────────────

function DetailModal({ couponId, onClose, onDisable, onEdit, isDisabling }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  // Fetch fresh detail data from API
  const { data: rawDetail, isLoading: isDetailLoading } = useGetCouponByIdQuery(couponId);
  const promo = rawDetail ? mapCoupon(rawDetail) : null;

  const copy = () => {
    if (!promo) return;
    navigator.clipboard.writeText(promo.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const pct = promo?.usageLimitRaw
    ? Math.round((promo.used / promo.usageLimitRaw) * 100)
    : 0;

  return (
    <Modal onClose={onClose}>
      <div className="p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-5">{t("promo.detailModal.title")}</h2>

        {isDetailLoading || !promo ? (
          <div className="flex items-center justify-center py-12 gap-3 text-slate-400">
            <Spinner /> <span className="text-sm">{t("promo.detailModal.loading")}</span>
          </div>
        ) : (
          <>
            <div className="bg-blue-50 rounded-xl p-4 flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="bg-blue-900 w-9 h-9 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 012-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-500">{t("promo.detailModal.codeLabel")}</p>
                  <p className="text-xl font-bold text-blue-900">{promo.code}</p>
                </div>
              </div>
              <button onClick={copy}
                className="flex items-center gap-1.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
                <CopyIcon />
                {copied ? t("promo.detailModal.copied") : t("promo.detailModal.copyCode")}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm mb-5">
              {promo.title && (
                <div>
                  <p className="text-xs text-slate-400 font-medium mb-0.5">{t("promo.formModal.title")}</p>
                  <p className="text-slate-700">{promo.title}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-slate-400 font-medium mb-0.5">{t("promo.detailModal.description")}</p>
                <p className="text-slate-700">{promo.description}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium mb-0.5">{t("promo.detailModal.status")}</p>
                <StatusBadge status={promo.status} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium mb-0.5">{t("promo.detailModal.discount")}</p>
                <p className="text-slate-700">
                  {promo.discountType === "percentage"
                    ? t("promo.detailModal.percentageOff", { value: promo.discountValue })
                    : t("promo.detailModal.fixedOff", { value: promo.discountValue })}
                </p>
              </div>
              {promo.maxDiscount && (
                <div>
                  <p className="text-xs text-slate-400 font-medium mb-0.5">{t("promo.detailModal.maxDiscount")}</p>
                  <p className="text-slate-700">${promo.maxDiscount}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-slate-400 font-medium mb-0.5">{t("promo.detailModal.minOrder")}</p>
                <p className="text-slate-700">{promo.minOrder ? `$${promo.minOrder}` : t("promo.detailModal.noMinimum")}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium mb-0.5">{t("promo.detailModal.maxUsesPerUser")}</p>
                <p className="text-slate-700">{promo.maxUsesPerUser}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium mb-0.5">{t("promo.detailModal.usage")}</p>
                <p className="text-slate-700 mb-1">
                  {t("promo.detailModal.usedLabel", { used: promo.used, limit: promo.usageLimit })}
                </p>
                {promo.usageLimitRaw && (
                  <div className="h-1.5 w-40 rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-blue-600" style={{ width: `${pct}%` }} />
                  </div>
                )}
              </div>
              {promo.usageLimitRaw && (
                <div>
                  <p className="text-xs text-slate-400 font-medium mb-0.5">{t("promo.detailModal.usageRate")}</p>
                  <p className="text-slate-700">{pct}%</p>
                </div>
              )}
              <div>
                <p className="text-xs text-slate-400 font-medium mb-0.5">{t("promo.detailModal.validFrom")}</p>
                <p className="text-slate-700">{promo.validFrom}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium mb-0.5">{t("promo.detailModal.validUntil")}</p>
                <p className="text-slate-700">{promo.validUntil}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium mb-0.5">{t("promo.detailModal.couponId")}</p>
                <p className="text-slate-700 font-mono text-xs truncate">{promo.id}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { onEdit(promo); onClose(); }}
                className="flex-1 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
              >
                {t("promo.detailModal.edit")}
              </button>
              {promo.status !== "disabled" && (
                <button
                  onClick={() => onDisable(promo.id)}
                  disabled={isDisabling}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isDisabling && <Spinner />}
                  {t("promo.detailModal.disable")}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function PromoCodeManagement() {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editPromo, setEditPromo] = useState(null);
  const [detailCouponId, setDetailCouponId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // ── RTK hooks ──
  const { data, isLoading, isError } = useGetCouponsQuery(statusFilter);
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
  const [disableCoupon, { isLoading: isDisabling }] = useDisableCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

  const rawCoupons = data?.data ?? [];
  const coupons = rawCoupons.map(mapCoupon);

  const filters = [
    { label: t("promo.tabs.all"), value: "" },
    { label: t("promo.tabs.active"), value: "active" },
    { label: t("promo.tabs.expired"), value: "expired" },
    { label: t("promo.tabs.disabled"), value: "disabled" },
  ];

  const stats = {
    total: coupons.length,
    active: coupons.filter((c) => c.status === "active").length,
    totalUsage: coupons.reduce((a, c) => a + c.used, 0),
    avgRate:
      coupons.length && coupons.some((c) => c.usageLimitRaw)
        ? Math.round(
            coupons
              .filter((c) => c.usageLimitRaw)
              .reduce((a, c) => a + (c.used / c.usageLimitRaw) * 100, 0) /
              coupons.filter((c) => c.usageLimitRaw).length,
          )
        : 0,
  };

  // ── handlers ──

  const handleCreate = async (body) => {
    try {
      await createCoupon(body).unwrap();
      setShowCreate(false);
      toast.success(t("promo.formModal.toastCreateSuccess"));
    } catch (err) {
      toast.error(err?.data?.detail || err?.data?.code?.[0] || t("promo.formModal.toastCreateFailed"));
    }
  };

  const handleUpdate = async (body) => {
    try {
      await updateCoupon({ couponId: editPromo.id, ...body }).unwrap();
      setEditPromo(null);
      toast.success(t("promo.formModal.toastUpdateSuccess"));
    } catch (err) {
      toast.error(err?.data?.detail || t("promo.formModal.toastUpdateFailed"));
    }
  };

  const handleDisable = async (couponId) => {
    try {
      await disableCoupon(couponId).unwrap();
      setDetailCouponId(null);
      toast.success(t("promo.detailModal.toastDisableSuccess"));
    } catch (err) {
      toast.error(err?.data?.detail || t("promo.detailModal.toastDisableFailed"));
    }
  };

  const handleDelete = async (couponId, e) => {
    e.stopPropagation();
    try {
      await deleteCoupon(couponId).unwrap();
      toast.success(t("promo.detailModal.toastDeleteSuccess"));
    } catch (err) {
      toast.error(err?.data?.detail || t("promo.detailModal.toastDeleteFailed"));
    }
  };

  const handleDisableRow = async (couponId, e) => {
    e.stopPropagation();
    try {
      await disableCoupon(couponId).unwrap();
      toast.success(t("promo.detailModal.toastDisableSuccess"));
    } catch (err) {
      toast.error(err?.data?.detail || t("promo.detailModal.toastDisableFailed"));
    }
  };

  const copyCode = (code, id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
    toast.info(t("promo.table.copiedToast", { code }));
  };

  // ── render ──

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">



      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{t("promo.title")}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{t("promo.subtitle")}</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 5v14M5 12h14" />
          </svg>
          {t("promo.createBtn")}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label={t("promo.stats.total")} value={stats.total} iconBg="bg-blue-50"
          icon={<svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 012-2z" /></svg>} />
        <StatCard label={t("promo.stats.active")} value={stats.active} iconBg="bg-emerald-50"
          icon={<svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>} />
        <StatCard label={t("promo.stats.usage")} value={stats.totalUsage} iconBg="bg-violet-50"
          icon={<svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
        <StatCard label={t("promo.stats.avgRate")} value={`${stats.avgRate}%`} iconBg="bg-amber-50"
          icon={<svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filter Tabs */}
        <div className="flex gap-1.5 p-4 border-b border-slate-100">
          {filters.map((f) => (
            <button key={f.value} onClick={() => setStatusFilter(f.value)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                statusFilter === f.value ? "bg-blue-900 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
              <Spinner /> <span className="text-sm">{t("promo.table.loading")}</span>
            </div>
          ) : isError ? (
            <p className="text-center py-16 text-rose-500 text-sm">{t("promo.table.failed")}</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {[
                    t("promo.table.code"),
                    t("promo.table.description"),
                    t("promo.table.discount"),
                    t("promo.table.usage"),
                    t("promo.table.validPeriod"),
                    t("promo.table.status"),
                    t("promo.table.actions"),
                  ].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {coupons.length === 0 && (
                  <tr><td colSpan="7" className="text-center py-10 text-slate-400 text-sm">{t("promo.table.noPromo")}</td></tr>
                )}
                {coupons.map((promo) => (
                  <tr key={promo.id} className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                    onClick={() => setDetailCouponId(promo.id)}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-blue-700">{promo.code}</span>
                        <button onClick={(e) => copyCode(promo.code, promo.id, e)}
                          className="text-slate-400 hover:text-blue-600 transition-colors p-0.5 rounded">
                          {copiedId === promo.id
                            ? <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                            : <CopyIcon />}
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600 max-w-[200px] truncate">{promo.description}</td>
                    <td className="px-5 py-4 text-slate-700 font-medium">
                      {promo.discountType === "percentage" ? `${promo.discountValue}%` : `$${promo.discountValue}`}
                      {promo.maxDiscount && <span className="text-xs text-slate-400 ml-1">(max ${promo.maxDiscount})</span>}
                    </td>
                    <td className="px-5 py-4"><UsageBar used={promo.used} limit={promo.usageLimit} /></td>
                    <td className="px-5 py-4 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs">{promo.validFrom} → {promo.validUntil}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={promo.status} /></td>
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditPromo(promo)}
                          className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded" title={t("promo.detailModal.edit")}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        {promo.status !== "disabled" && (
                          <button onClick={(e) => handleDisableRow(promo.id, e)}
                            className="text-slate-400 hover:text-amber-500 transition-colors p-1 rounded" title={t("promo.detailModal.disable")}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          </button>
                        )}
                        <button onClick={(e) => handleDelete(promo.id, e)}
                          className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded" title={t("common.delete")}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {data?.pagination && (
          <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400">
            {t("promo.table.showing", {
              count: rawCoupons.length,
              total: data.pagination.total,
              page: data.pagination.page,
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreate && (
        <CouponFormModal
          mode="create"
          isLoading={isCreating}
          onClose={() => setShowCreate(false)}
          onSubmit={handleCreate}
        />
      )}

      {editPromo && (
        <CouponFormModal
          mode="edit"
          initialData={editPromo}
          isLoading={isUpdating}
          onClose={() => setEditPromo(null)}
          onSubmit={handleUpdate}
        />
      )}

      {detailCouponId && (
        <DetailModal
          couponId={detailCouponId}
          isDisabling={isDisabling}
          onClose={() => setDetailCouponId(null)}
          onDisable={handleDisable}
          onEdit={(promo) => { setEditPromo(promo); setDetailCouponId(null); }}
        />
      )}
    </div>
  );
}