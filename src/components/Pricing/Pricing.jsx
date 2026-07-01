import { useState } from "react";
import {
    useGetPricingRulesQuery,
    useCreatePricingRuleMutation,
    useUpdatePricingRuleMutation,
    useDeletePricingRuleMutation,
} from "../../Api/couponApi";
import { toast } from "react-hot-toast";

// ─── Constants ───
const CAR_TYPES = ["economy", "premium", "comfort", "sub", "moto"];
const RIDE_MODES = ["solo", "shared", "shuttle", "women_safe", "airport"];

const BLANK_FORM = {
    car_type: "economy",
    ride_mode: "solo",
    base_fare: "",
    per_km_rate: "",
    is_active: true,
};

// ─── Small helpers ────────────────────────────────────────────────────────────
function Spinner({ cls = "w-4 h-4 text-white" }) {
    return (
        <svg className={`animate-spin ${cls}`} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
    );
}

function Badge({ active }) {
    return active ? (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Active
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block" />
            Inactive
        </span>
    );
}

function CarIcon() {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M8 17a2 2 0 104 0m4 0a2 2 0 104 0M3 11l1.5-4.5A2 2 0 016.4 5h11.2a2 2 0 011.9 1.5L21 11M3 11h18M3 11v5a1 1 0 001 1h1m14-6v5a1 1 0 01-1 1h-1" />
        </svg>
    );
}

// ─── Confirm-delete modal ─────────────────────────────────────────────────────
function ConfirmModal({ rule, onConfirm, onCancel, isDeleting }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">Delete Pricing Rule?</h3>
                <p className="text-sm text-slate-500 mb-6">
                    This will permanently delete the <span className="font-semibold capitalize">{rule.car_type}</span> /{" "}
                    <span className="font-semibold capitalize">{rule.ride_mode}</span> rule.
                </p>
                <div className="flex gap-3">
                    <button onClick={onCancel} disabled={isDeleting}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-60 text-slate-700 text-sm font-semibold py-2.5 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={isDeleting}
                        className="flex-1 flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
                        {isDeleting ? <Spinner /> : null}
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Row form inputs (used both for new-row and edit-row) ─────────────────────
function RowForm({ form, onChange, onSave, onCancel, isSaving, isNew = false }) {
    return (
        <tr className={`${isNew ? "bg-blue-50/60" : "bg-amber-50/40"} border-b border-slate-100`}>
            {/* Car Type */}
            <td className="px-4 py-3">
                <select value={form.car_type} onChange={(e) => onChange("car_type", e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 bg-white capitalize">
                    {CAR_TYPES.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
                </select>
            </td>
            {/* Ride Mode */}
            <td className="px-4 py-3">
                <select value={form.ride_mode} onChange={(e) => onChange("ride_mode", e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 bg-white capitalize">
                    {RIDE_MODES.map((m) => <option key={m} value={m} className="capitalize">{m}</option>)}
                </select>
            </td>
            {/* Base Fare */}
            <td className="px-4 py-3">
                <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                    <input type="number" value={form.base_fare} min="0" step="0.01"
                        onChange={(e) => onChange("base_fare", e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-6 pr-2 border border-slate-200 rounded-lg py-1.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                </div>
            </td>
            {/* Per KM Rate */}
            <td className="px-4 py-3">
                <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                    <input type="number" value={form.per_km_rate} min="0" step="0.01"
                        onChange={(e) => onChange("per_km_rate", e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-6 pr-2 border border-slate-200 rounded-lg py-1.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                </div>
            </td>
            {/* Active toggle */}
            <td className="px-4 py-3">
                <button type="button" onClick={() => onChange("is_active", !form.is_active)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${form.is_active ? "bg-emerald-500" : "bg-slate-300"}`}>
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${form.is_active ? "translate-x-4" : "translate-x-1"}`} />
                </button>
            </td>
            {/* Actions */}
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <button onClick={onSave} disabled={isSaving}
                        className="flex items-center gap-1 bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                        {isSaving ? <Spinner cls="w-3 h-3 text-white" /> : null}
                        {isNew ? "Add" : "Save"}
                    </button>
                    <button onClick={onCancel} disabled={isSaving}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-700 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                        Cancel
                    </button>
                </div>
            </td>
        </tr>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function PricingManagement() {
    const { data, isLoading, isError } = useGetPricingRulesQuery();
    const [createRule, { isLoading: isCreating }] = useCreatePricingRuleMutation();
    const [updateRule, { isLoading: isUpdating }] = useUpdatePricingRuleMutation();
    const [deleteRule, { isLoading: isDeleting }] = useDeletePricingRuleMutation();

    const rules = data?.data ?? [];

    // New row state
    const [showNew, setShowNew] = useState(false);
    const [newForm, setNewForm] = useState({ ...BLANK_FORM });

    // Edit row state
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState({});

    // Delete confirm
    const [deleteTarget, setDeleteTarget] = useState(null);



    // ── New row helpers ──
    const handleNewChange = (field, val) => setNewForm((p) => ({ ...p, [field]: val }));
    const handleNewSave = async () => {
        if (!newForm.base_fare || !newForm.per_km_rate) return;
        try {
            await createRule({
                car_type: newForm.car_type,
                ride_mode: newForm.ride_mode,
                base_fare: String(newForm.base_fare),
                per_km_rate: String(newForm.per_km_rate),
                is_active: newForm.is_active,
            }).unwrap();
            setShowNew(false);
            setNewForm({ ...BLANK_FORM });
            toast.success("Pricing rule created.");
        } catch (err) {
            toast.error(err?.data?.detail || "Failed to create rule.");
        }
    };

    // ── Edit row helpers ──
    const startEdit = (rule) => {
        setEditId(rule.id);
        setEditForm({
            car_type: rule.car_type,
            ride_mode: rule.ride_mode,
            base_fare: rule.base_fare,
            per_km_rate: rule.per_km_rate,
            is_active: rule.is_active,
        });
    };
    const handleEditChange = (field, val) => setEditForm((p) => ({ ...p, [field]: val }));
    const handleEditSave = async () => {
        try {
            await updateRule({
                id: editId,
                car_type: editForm.car_type,
                ride_mode: editForm.ride_mode,
                base_fare: String(editForm.base_fare),
                per_km_rate: String(editForm.per_km_rate),
                is_active: editForm.is_active,
            }).unwrap();
            setEditId(null);
            toast.success("Pricing rule updated.");
        } catch (err) {
            toast.error(err?.data?.detail || "Failed to update rule.");
        }
    };

    // ── Delete helpers ──
    const confirmDelete = async () => {
        try {
            await deleteRule(deleteTarget.id).unwrap();
            setDeleteTarget(null);
            toast.success("Pricing rule deleted.");
        } catch (err) {
            toast.error(err?.data?.detail || "Failed to delete rule.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans">


            {/* Header */}
            <div className="flex items-start justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Pricing Rules</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Manage per car-type and ride-mode pricing</p>
                </div>
                {!showNew && (
                    <button onClick={() => { setShowNew(true); setEditId(null); }}
                        className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Rule
                    </button>
                )}
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-800">All Pricing Rules</h2>
                    <span className="text-xs text-slate-400">{rules.length} rule{rules.length !== 1 ? "s" : ""}</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/60">
                                {["Car Type", "Ride Mode", "Base Fare", "Per KM Rate", "Status", "Actions"].map((h) => (
                                    <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-50">
                            {/* New row form */}
                            {showNew && (
                                <RowForm
                                    form={newForm}
                                    onChange={handleNewChange}
                                    onSave={handleNewSave}
                                    onCancel={() => { setShowNew(false); setNewForm({ ...BLANK_FORM }); }}
                                    isSaving={isCreating}
                                    isNew
                                />
                            )}

                            {/* Loading */}
                            {isLoading && (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center text-slate-400 text-sm">
                                        <div className="flex items-center justify-center gap-2">
                                            <Spinner cls="w-4 h-4 text-blue-500" />
                                            Loading pricing rules…
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {/* Error */}
                            {isError && (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-rose-500 text-sm">
                                        Failed to load pricing rules.
                                    </td>
                                </tr>
                            )}

                            {/* Empty */}
                            {!isLoading && !isError && rules.length === 0 && !showNew && (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center text-slate-400 text-sm">
                                        No pricing rules yet. Click <span className="font-semibold text-blue-700">Add Rule</span> to create one.
                                    </td>
                                </tr>
                            )}

                            {/* Data rows */}
                            {rules.map((rule) =>
                                editId === rule.id ? (
                                    <RowForm
                                        key={rule.id}
                                        form={editForm}
                                        onChange={handleEditChange}
                                        onSave={handleEditSave}
                                        onCancel={() => setEditId(null)}
                                        isSaving={isUpdating}
                                    />
                                ) : (
                                    <tr key={rule.id} className="hover:bg-slate-50/70 transition-colors group">
                                        {/* Car Type */}
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                                    <CarIcon />
                                                </div>
                                                <span className="font-semibold text-slate-800 capitalize">{rule.car_type}</span>
                                            </div>
                                        </td>
                                        {/* Ride Mode */}
                                        <td className="px-4 py-4">
                                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 capitalize">
                                                {rule.ride_mode}
                                            </span>
                                        </td>
                                        {/* Base Fare */}
                                        <td className="px-4 py-4">
                                            <span className="font-semibold text-slate-800">${parseFloat(rule.base_fare).toFixed(2)}</span>
                                        </td>
                                        {/* Per KM Rate */}
                                        <td className="px-4 py-4">
                                            <span className="font-semibold text-slate-800">${parseFloat(rule.per_km_rate).toFixed(2)}<span className="text-slate-400 font-normal text-xs">/km</span></span>
                                        </td>
                                        {/* Status */}
                                        <td className="px-4 py-4"><Badge active={rule.is_active} /></td>
                                        {/* Actions */}
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => { startEdit(rule); setShowNew(false); }}
                                                    title="Edit"
                                                    className="text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button onClick={() => setDeleteTarget(rule)}
                                                    title="Delete"
                                                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination info */}
                {data?.pagination && (
                    <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400">
                        Showing {rules.length} of {data.pagination.total} rule{data.pagination.total !== 1 ? "s" : ""}
                    </div>
                )}
            </div>

            {/* Delete confirm modal */}
            {deleteTarget && (
                <ConfirmModal
                    rule={deleteTarget}
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteTarget(null)}
                    isDeleting={isDeleting}
                />
            )}
        </div>
    );
}
