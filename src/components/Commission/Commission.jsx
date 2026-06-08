"use client";

import { useState, useEffect } from "react";
import { Search, Eye, Trash2, ChevronLeft, ChevronRight, X, Loader2, DollarSign, Calculator, Settings2 } from "lucide-react";
import { useGetCommisionRateQuery, useUpdateCommissionMutation } from "../../Api/dashboardApi";
import { toast } from "react-hot-toast";

const Commission = () => {
    const { data: commissionRateData = [] } = useGetCommisionRateQuery();
    const [commissionRate, setCommissionRate] = useState(null);
    const [rideAmount, setRideAmount] = useState(50);

    const [updateCommission, { isLoading: isUpdating }] = useUpdateCommissionMutation();

    useEffect(() => {
        if (commissionRateData && commissionRateData.length > 0) {
            const currentRate = commissionRateData[0]?.platform_commission;
            if (currentRate !== undefined) {
                setCommissionRate(Number(currentRate));
            }
        }
    }, [commissionRateData]);

    const driverPercentage = 100 - commissionRate;
    const platformCommission = (rideAmount * commissionRate) / 100;
    const driverEarnings = rideAmount - platformCommission;

    const handleSave = async () => {
        try {
            await updateCommission({ commision: commissionRate }).unwrap();
            toast.success("Commission settings updated successfully!");
        } catch (err) {
            toast.error(err?.data?.message || "Failed to update commission");
        }
    };

    return (
        <div className="space-y-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500 px-10 bg-[#F8FAFC] min-h-screen">
            <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <DollarSign className="w-6 h-6 text-secondary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Payment Settings</h1>
                    <p className="text-slate-500 text-sm font-medium">Adjust commission percentages for each ride type</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Commission Settings Card */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-slate-200/50 border border-white relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 mb-1">Standard Rides</h2>
                                <p className="text-slate-400 text-sm font-medium">Regular ride commission rate</p>
                            </div>
                            <Settings2 className="w-6 h-6 text-slate-200" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            <div className="space-y-3">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                                    Commission Percentage
                                </label>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        value={commissionRate}
                                        onChange={(e) => setCommissionRate(Math.min(100, Math.max(0, Number(e.target.value))))}
                                        className="w-full px-6 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-secondary focus:bg-white transition-all text-lg font-bold outline-none"
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">%</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                                    Driver Receives
                                </label>
                                <div className="w-full px-6 py-5 bg-slate-100 rounded-2xl border-2 border-transparent text-lg font-bold text-slate-400 cursor-not-allowed flex items-center justify-between">
                                    <span>{driverPercentage.toFixed(1)}%</span>
                                    <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-500 tracking-tighter">AUTO-SYNC</span>
                                </div>
                            </div>
                        </div>

                        {/* Split Progress Bar */}
                        <div className="space-y-4">
                            <div className="h-3 w-full bg-slate-100 rounded-full flex overflow-hidden shadow-inner">
                                <div
                                    className="bg-secondary transition-all duration-500 ease-out relative group"
                                    style={{ width: `${commissionRate}%` }}
                                >
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        Platform Split: {commissionRate}%
                                    </div>
                                </div>
                                <div
                                    className="bg-emerald-400 transition-all duration-500 ease-out relative group"
                                    style={{ width: `${driverPercentage}%` }}
                                >
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        Driver Split: {driverPercentage}%
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
                                <span className="text-secondary">Platform: {commissionRate}%</span>
                                <span className="text-emerald-500">Driver: {driverPercentage.toFixed(1)}%</span>
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={isUpdating}
                            className="w-full mt-10 bg-secondary text-white py-5 rounded-[24px] text-lg shadow-2xl shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {isUpdating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </div>

                {/* Test Calculator Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-[40px] shadow-xl shadow-slate-200/50 border border-white overflow-hidden flex flex-col h-full">
                        <div className="p-8 border-b border-slate-50 flex items-center gap-4 bg-slate-50/50">
                            <div className="p-2.5 bg-emerald-50 rounded-xl">
                                <Calculator className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Test Calculator</h3>
                                <p className="text-[12px] text-slate-400 font-medium">Preview commission calculations</p>
                            </div>
                        </div>

                        <div className="p-8 space-y-8 flex-1">
                            <div className="space-y-3">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                                    Ride Amount ($)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={rideAmount}
                                        onChange={(e) => setRideAmount(Number(e.target.value))}
                                        className="w-full px-6 py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-400 transition-all text-xl outline-none shadow-inner"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6 pt-4">
                                <div className="flex justify-between items-center px-2">
                                    <span className="text-slate-500 font-medium">Total Ride Amount:</span>
                                    <span className="text-slate-900 font-bold text-lg">${rideAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center px-2">
                                    <div className="flex flex-col">
                                        <span className="text-slate-500 font-medium tracking-tight">Commission ({commissionRate}%):</span>
                                        <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mt-0.5">PLATFORM FEE</span>
                                    </div>
                                    <span className="text-amber-500 font-bold text-lg">${platformCommission.toFixed(2)}</span>
                                </div>
                                <div className="h-px bg-slate-100" />
                                <div className="flex justify-between items-center px-2">
                                    <span className="text-slate-900 font-bold">Driver Earnings:</span>
                                    <span className="text-secondary text-2xl tracking-tighter">${driverEarnings.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mt-8 p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50 relative overflow-hidden group">

                                <p className="text-[13px] text-slate-600 leading-relaxed font-medium relative z-10">
                                    For a <span className="text-secondary font-bold">${rideAmount.toFixed(2)}</span> ride, the driver will earn <span className="text-emerald-500 font-bold">${driverEarnings.toFixed(2)}</span> and the platform will receive <span className="text-amber-500 font-bold">${platformCommission.toFixed(2)}</span> in commission.
                                </p>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 text-center">
                            <span className="text-[10px] font-bold text-grayText uppercase tracking-[0.2em]">Calculator V1.0 - Real-time Data</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Commission;
