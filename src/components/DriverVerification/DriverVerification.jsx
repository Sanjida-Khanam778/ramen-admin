import { useState } from "react";
import { X, Eye, Check, Send, Loader2, ShieldCheck, ShieldX } from "lucide-react";
import toast from "react-hot-toast";
import userAvatar from "../../assets/images/userAvatar.png";
// ─── Mock Data ───────────────────────────────────────────────────────────────
const MOCK_DRIVERS = [
  {
    id: "D001",
    name: "John Parker",
    email: "john.parker@email.com",
    phone: "+1 234-567-9001",
    avatar: null,
    carModel: "Toyota Camry 2021",
    carPlate: "ABC-1234",
    year: "2021",
    color: "Black",
    seats: 4,
    submittedDate: "2026-03-08",
    status: "pending",
    driverImage: null,
    numberPlate: null,
    carPhoto: null,
    drivingLicense: null,
    carInsurance: null,
  },
  {
    id: "D002",
    name: "Maria Garcia",
    email: "maria.garcia@email.com",
    phone: "+1 234-567-9002",
    avatar: null,
    carModel: "Honda Accord 2022",
    carPlate: "XYZ-5678",
    year: "2022",
    color: "White",
    seats: 5,
    submittedDate: "2026-03-05",
    status: "approved",
    driverImage: null,
    numberPlate: null,
    carPhoto: null,
    drivingLicense: null,
    carInsurance: null,
  },
  {
    id: "D003",
    name: "Kevin Lee",
    email: "kevin.lee@email.com",
    phone: "+1 234-567-9003",
    avatar: null,
    carModel: "Nissan Altima 2020",
    carPlate: "DEF-9012",
    year: "2020",
    color: "Silver",
    seats: 5,
    submittedDate: "2026-03-04",
    status: "rejected",
    driverImage: null,
    numberPlate: null,
    carPhoto: null,
    drivingLicense: null,
    carInsurance: null,
  },
  {
    id: "D004",
    name: "Sophie Turner",
    email: "sophie.turner@email.com",
    phone: "+1 234-567-9004",
    avatar: null,
    carModel: "Mazda 6 2021",
    carPlate: "GHI-3456",
    year: "2021",
    color: "Blue",
    seats: 5,
    submittedDate: "2026-03-07",
    status: "pending",
    driverImage: null,
    numberPlate: null,
    carPhoto: null,
    drivingLicense: null,
    carInsurance: null,
  },
  {
    id: "D005",
    name: "Liam Johnson",
    email: "liam.johnson@email.com",
    phone: "+1 234-567-9005",
    avatar: null,
    carModel: "Ford Fusion 2022",
    carPlate: "JKL-7890",
    year: "2022",
    color: "Red",
    seats: 5,
    submittedDate: "2026-03-10",
    status: "pending",
    driverImage: null,
    numberPlate: null,
    carPhoto: null,
    drivingLicense: null,
    carInsurance: null,
  },
];
// ─── Status Config ───────────────────────────────────────────────────────────
const statusConfig = {
  pending: {
    label: "pending",
    className: "bg-amber-100 text-amber-700 border border-amber-200",
  },
  approved: {
    label: "approved",
    className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  },
  rejected: {
    label: "rejected",
    className: "bg-red-100 text-red-600 border border-red-200",
  },
};
// ─── Doc Preview Placeholder ─────────────────────────────────────────────────
function DocImage({ src, label }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <div className="rounded-xl overflow-hidden bg-[#0D1B3E] aspect-[4/3] flex items-center justify-center">
        {src ? (
          <img
            src={src}
            alt={label}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <span className="text-gray-600 text-xs">No image</span>
        )}
      </div>
    </div>
  );
}
// ─── Reason For Rejection Modal ──────────────────────────────────────────────
function ReasonModal({ driver, onClose, onSent }) {
  const [subject, setSubject] = useState("Car pictures are unclear");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const handleSend = async () => {
    if (!subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 900));
    setSending(false);
    toast.success(`Rejection email sent to ${driver.email}`);
    onSent();
    onClose();
  };
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray/50">
          <h2 className="text-base font-semibold text-gray-900">
            Reason for rejection
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#364153] hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              To:
            </label>
            <input
              readOnly
              value={driver.email}
              className="w-full px-4 py-2.5 rounded-xl border border-gray/50 bg-gray-50 text-gray-700 text-sm outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Subject:
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 text-gray-800 text-sm outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Message:
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 text-gray-800 text-sm outline-none transition-all resize-none"
            />
          </div>
        </div>
        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-gray/50">
          <button
            onClick={handleSend}
            disabled={sending}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1B2A5E] text-white rounded-xl text-sm font-semibold hover:bg-[#162347] transition-colors disabled:opacity-60 cursor-pointer"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Send Email
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
// ─── Driver Details Modal ─────────────────────────────────────────────────────
function DetailsModal({ driver, onClose, onApprove, onReject }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 sticky top-0 bg-white border-b border-gray/50 z-10">
          <h2 className="text-base font-semibold text-gray-900">
            Driver Verification Details
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#364153] hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Driver info */}
        <div className="px-6 py-4 flex items-center gap-3">
          <img
            src={driver.avatar || userAvatar}
            alt={driver.name}
            className="w-12 h-12 rounded-full object-cover"
            onError={(e) => {
              e.target.src = userAvatar;
            }}
          />
          <div>
            <p className="text-sm font-semibold text-gray-900">{driver.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{driver.email}</p>
            <p className="text-xs text-gray-500">{driver.phone}</p>
          </div>
        </div>
        {/* Document images */}
        <div className="px-6 pb-4 grid grid-cols-2 gap-4">
          <DocImage src={driver.driverImage} label="Driver Image" />
          <DocImage src={driver.numberPlate} label="Number Plate" />
          <DocImage src={driver.carPhoto} label="Car Photo" />
          <DocImage src={driver.drivingLicense} label="Driving License" />
          <div className="col-span-2">
            <DocImage src={driver.carInsurance} label="Car Insurance" />
          </div>
        </div>
        {/* Car details */}
        <div className="mx-6 mb-4 rounded-xl border border-gray/50 bg-gray-50 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Car Details
          </p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Car Model", value: driver.carModel },
              { label: "Year", value: driver.year },
              { label: "Color", value: driver.color },
              { label: "Number of seat", value: driver.seats },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] text-[#364153] mb-0.5">{label}</p>
                <p className="text-xs font-medium text-gray-800">{value}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Action buttons */}
        <div className="px-6 pb-6 grid grid-cols-2 gap-3">
          <button
            onClick={onApprove}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1B2A5E] text-white text-sm font-semibold hover:bg-[#162347] transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            Approve Driver
          </button>
          <button
            onClick={onReject}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#DC2626] text-white text-sm font-semibold hover:bg-[#B91C1C] transition-colors cursor-pointer"
          >
            <ShieldX className="w-4 h-4" />
            Reject Driver
          </button>
        </div>
      </div>
    </div>
  );
}
// ─── Main Driver Verification Component ──────────────────────────────────────
const TABS = ["All", "Pending", "Approved", "Rejected"];
export default function DriverVerification() {
  const [activeTab, setActiveTab] = useState("All");
  const [drivers, setDrivers] = useState(MOCK_DRIVERS);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [rejectTarget, setRejectTarget] = useState(null);
  const filtered =
    activeTab === "All"
      ? drivers
      : drivers.filter(
          (d) => d.status === activeTab.toLowerCase()
        );
  const handleApprove = (driver) => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === driver.id ? { ...d, status: "approved" } : d))
    );
    toast.success(`${driver.name} approved successfully`);
    setSelectedDriver(null);
  };
  const handleOpenReject = (driver) => {
    setRejectTarget(driver);
    setSelectedDriver(null);
    setShowReasonModal(true);
  };
  const handleRejectSent = () => {
    if (rejectTarget) {
      setDrivers((prev) =>
        prev.map((d) =>
          d.id === rejectTarget.id ? { ...d, status: "rejected" } : d
        )
      );
    }
  };
  // Quick-action approve/reject from table (without modal)
  const quickApprove = (driver) => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === driver.id ? { ...d, status: "approved" } : d))
    );
    toast.success(`${driver.name} approved`);
  };
  const quickReject = (driver) => {
    setRejectTarget(driver);
    setShowReasonModal(true);
  };
  return (
    <>
      {/* Details Modal */}
      {selectedDriver && (
        <DetailsModal
          driver={selectedDriver}
          onClose={() => setSelectedDriver(null)}
          onApprove={() => handleApprove(selectedDriver)}
          onReject={() => handleOpenReject(selectedDriver)}
        />
      )}
      {/* Reason Modal */}
      {showReasonModal && rejectTarget && (
        <ReasonModal
          driver={rejectTarget}
          onClose={() => {
            setShowReasonModal(false);
            setRejectTarget(null);
          }}
          onSent={handleRejectSent}
        />
      )}
      <div className="p-8 min-h-screen bg-[#F8FAFC]">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#1E293B]">
            Driver Verification
          </h1>
          <p className="text-sm text-[#6A7282] mt-1">
            Review and approve driver documents
          </p>
        </div>
        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl border border-gray/50 shadow-sm p-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-[#1B2A5E] text-white shadow"
                    : "text-gray-600 hover:bg-gray-100 border border-gray/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray/50 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray/50">
                {["DRIVER", "CONTACT", "CAR DETAILS", "SUBMITTED DATE", "STATUS", "ACTIONS"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-xs font-semibold text-[#364153] uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray/50">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center text-[#364153] text-sm"
                  >
                    No drivers found.
                  </td>
                </tr>
              ) : (
                filtered.map((driver) => {
                  const st = statusConfig[driver.status] || statusConfig.pending;
                  const isPending = driver.status === "pending";
                  return (
                    <tr
                      key={driver.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* DRIVER */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={driver.avatar || userAvatar}
                            alt={driver.name}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                              e.target.src = userAvatar;
                            }}
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {driver.name}
                            </div>
                            <div className="text-xs text-[#364153] mt-0.5">
                              {driver.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* CONTACT */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">
                          {driver.email}
                        </div>
                        <div className="text-xs text-[#364153] mt-0.5">
                          {driver.phone}
                        </div>
                      </td>
                      {/* CAR DETAILS */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">
                          {driver.carModel}
                        </div>
                        <div className="text-xs text-[#364153] mt-0.5">
                          {driver.carPlate}
                        </div>
                      </td>
                      {/* SUBMITTED DATE */}
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {driver.submittedDate}
                      </td>
                      {/* STATUS */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${st.className}`}
                        >
                          {st.label}
                        </span>
                      </td>
                      {/* ACTIONS */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {/* View */}
                          <button
                            onClick={() => setSelectedDriver(driver)}
                            title="View Details"
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {/* Approve (only pending) */}
                          {isPending && (
                            <button
                              onClick={() => quickApprove(driver)}
                              title="Approve"
                              className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          {/* Reject (only pending) */}
                          {isPending && (
                            <button
                              onClick={() => quickReject(driver)}
                              title="Reject"
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </>
  );
}