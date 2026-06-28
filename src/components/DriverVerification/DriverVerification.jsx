import { useMemo, useState } from "react";
import {
  Check,
  Eye,
  Loader2,
  Send,
  ShieldCheck,
  ShieldX,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetAdminDriverDetailsQuery,
  useGetAdminDriversQuery,
  useSendDriverEmailMutation,
  useUpdateDriverKycMutation,
} from "../../Api/dashboardApi";
import userAvatar from "../../assets/images/userAvatar.png";

const TABS = ["All", "Pending", "Approved", "Rejected"];
const ITEMS_PER_PAGE = 20;

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
  none: {
    label: "not submitted",
    className: "bg-gray-100 text-gray-600 border border-gray-200",
  },
};

const normalizeDriver = (driver) => {
  const vehicle = driver.vehicle || {};
  const profile = driver.driver_profile || {};
  const kycStatus = driver.kyc_status || profile.kyc_status || "none";

  return {
    id: driver.id,
    name: driver.name || "N/A",
    email: driver.email || "",
    phone: driver.phone_number || "",
    avatar: profile.driver_photo || null,
    status: kycStatus,
    isActive: driver.is_active,
    isOnline: profile.is_online,
    submittedDate: driver.date_joined
      ? new Date(driver.date_joined).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "N/A",
    carModel:
      vehicle.make || vehicle.model
        ? [vehicle.make, vehicle.model].filter(Boolean).join(" ")
        : "No vehicle",
    carType: vehicle.car_type || "-",
    carPlate: vehicle.plate_number || "-",
    year: vehicle.year || "-",
    color: vehicle.color || "-",
    driverImage: profile.driver_photo || null,
    numberPlate: vehicle.plate_photo || null,
    carPhoto: vehicle.car_photo || null,
    licenseFront: profile.license_front || null,
    licenseBack: profile.license_back || null,
  };
};

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
          <span className="text-gray-400 text-xs">No image</span>
        )}
      </div>
    </div>
  );
}

function ReasonModal({ driver, onClose }) {
  const [subject, setSubject] = useState("Driver verification rejected");
  const [message, setMessage] = useState("");
  const [sendDriverEmail, { isLoading: sendingEmail }] =
    useSendDriverEmailMutation();
  const [updateDriverKyc, { isLoading: updatingKyc }] =
    useUpdateDriverKycMutation();

  const isSubmitting = sendingEmail || updatingKyc;

  const handleReject = async () => {
    if (!subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter a rejection reason");
      return;
    }

    try {
      await updateDriverKyc({
        driverId: driver.id,
        kyc_status: "rejected",
        rejection_reason: message,
      }).unwrap();

      if (driver.email) {
        await sendDriverEmail({
          driverId: driver.id,
          email: driver.email,
          subject,
          message,
        }).unwrap();
      }

      toast.success("Driver rejected successfully");
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to reject driver");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-fadeIn">
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
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              To:
            </label>
            <input
              readOnly
              value={driver.email || "-"}
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
              Rejection reason:
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="The profile is not complete."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 text-gray-800 text-sm outline-none transition-all resize-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 px-6 py-4 border-t border-gray/50">
          <button
            onClick={handleReject}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#DC2626] text-white rounded-xl text-sm font-semibold hover:bg-[#B91C1C] transition-colors disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Reject Driver
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

function DetailsModal({ driver, onClose, onApprove, onReject, approving }) {
  const {
    data: details,
    isLoading,
    isError,
  } = useGetAdminDriverDetailsQuery(driver.id, { skip: !driver?.id });

  const displayDriver = normalizeDriver(details || driver);
  const st = statusConfig[displayDriver.status] || statusConfig.none;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto animate-fadeIn">
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

        {isLoading && (
          <div className="px-6 py-4 flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading driver details...
          </div>
        )}
        {isError && (
          <div className="mx-6 mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            Failed to load latest driver details. Showing list data.
          </div>
        )}

        <div className="px-6 py-4 flex items-center gap-3">
          <img
            src={displayDriver.avatar || userAvatar}
            alt={displayDriver.name}
            className="w-12 h-12 rounded-full object-cover"
            onError={(e) => {
              e.target.src = userAvatar;
            }}
          />
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {displayDriver.name}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {displayDriver.email || "-"}
            </p>
            <p className="text-xs text-gray-500">{displayDriver.phone || "-"}</p>
          </div>
          <span
            className={`ml-auto inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${st.className}`}
          >
            {st.label}
          </span>
        </div>

        <div className="px-6 pb-4 grid grid-cols-2 gap-4">
          <DocImage src={displayDriver.driverImage} label="Driver Photo" />
          <DocImage src={displayDriver.numberPlate} label="Plate Photo" />
          <DocImage src={displayDriver.carPhoto} label="Car Photo" />
          <DocImage src={displayDriver.licenseFront} label="License Front" />
          <div className="col-span-2">
            <DocImage src={displayDriver.licenseBack} label="License Back" />
          </div>
        </div>

        <div className="mx-6 mb-4 rounded-xl border border-gray/50 bg-gray-50 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Car Details
          </p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Car Model", value: displayDriver.carModel },
              { label: "Type", value: displayDriver.carType },
              { label: "Year", value: displayDriver.year },
              { label: "Color", value: displayDriver.color },
              { label: "Plate", value: displayDriver.carPlate },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] text-[#364153] mb-0.5">{label}</p>
                <p className="text-xs font-medium text-gray-800">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 pb-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => onApprove(displayDriver)}
            disabled={approving}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1B2A5E] text-white text-sm font-semibold hover:bg-[#162347] transition-colors cursor-pointer disabled:opacity-60"
          >
            {approving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            Approve Driver
          </button>
          <button
            onClick={() => onReject(displayDriver)}
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

export default function DriverVerification() {
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);

  const {
    data: driversResponse,
    isLoading,
    isFetching,
    isError,
  } = useGetAdminDriversQuery({ page: currentPage, limit: ITEMS_PER_PAGE });
  const [updateDriverKyc, { isLoading: approving }] =
    useUpdateDriverKycMutation();

  const drivers = useMemo(() => {
    const raw = Array.isArray(driversResponse?.data) ? driversResponse.data : [];
    return raw.map(normalizeDriver);
  }, [driversResponse]);

  const filtered =
    activeTab === "All"
      ? drivers
      : drivers.filter((driver) => driver.status === activeTab.toLowerCase());

  const pagination = driversResponse?.pagination || {};
  const totalDrivers = pagination.total ?? drivers.length;
  const pageLimit = pagination.limit ?? ITEMS_PER_PAGE;
  const totalPages = Math.max(1, Math.ceil(totalDrivers / pageLimit));
  const startIndex = (currentPage - 1) * pageLimit;

  const handleApprove = async (driver) => {
    try {
      await updateDriverKyc({
        driverId: driver.id,
        kyc_status: "approved",
      }).unwrap();
      toast.success(`${driver.name} approved successfully`);
      setSelectedDriver(null);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to approve driver");
    }
  };

  const handleOpenReject = (driver) => {
    setRejectTarget(driver);
    setSelectedDriver(null);
  };

  return (
    <>
      {selectedDriver && (
        <DetailsModal
          driver={selectedDriver}
          onClose={() => setSelectedDriver(null)}
          onApprove={handleApprove}
          onReject={handleOpenReject}
          approving={approving}
        />
      )}

      {rejectTarget && (
        <ReasonModal
          driver={rejectTarget}
          onClose={() => setRejectTarget(null)}
        />
      )}

      <div className="p-8 min-h-screen bg-[#F8FAFC]">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#1E293B]">
            Driver Verification
          </h1>
          <p className="text-sm text-[#6A7282] mt-1">
            Review and approve driver documents
          </p>
        </div>

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

        <div className="bg-white rounded-2xl border border-gray/50 shadow-sm overflow-hidden">
          {isLoading || isFetching ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-9 h-9 text-blue-500 animate-spin" />
              <p className="text-sm text-gray-500 font-medium">
                Loading drivers...
              </p>
            </div>
          ) : isError ? (
            <div className="px-6 py-16 text-center text-red-500 text-sm">
              Failed to load drivers.
            </div>
          ) : (
            <>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray/50">
                    {[
                      "DRIVER",
                      "CONTACT",
                      "CAR DETAILS",
                      "SUBMITTED DATE",
                      "STATUS",
                      "ACTIONS",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-xs font-semibold text-[#364153] uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
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
                      const st = statusConfig[driver.status] || statusConfig.none;
                      const isPending = driver.status === "pending";

                      return (
                        <tr
                          key={driver.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
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

                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-700">
                              {driver.email || "-"}
                            </div>
                            <div className="text-xs text-[#364153] mt-0.5">
                              {driver.phone || "-"}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-700">
                              {driver.carModel}
                            </div>
                            <div className="text-xs text-[#364153] mt-0.5">
                              {driver.carPlate}
                            </div>
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-700">
                            {driver.submittedDate}
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${st.className}`}
                            >
                              {st.label}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setSelectedDriver(driver)}
                                title="View Details"
                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {isPending && (
                                <button
                                  onClick={() => handleApprove(driver)}
                                  disabled={approving}
                                  title="Approve"
                                  className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  {approving ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Check className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                              {isPending && (
                                <button
                                  onClick={() => handleOpenReject(driver)}
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

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray/50 bg-gray-50">
                  <p className="text-xs text-gray-500">
                    Showing{" "}
                    <span className="font-semibold text-gray-700">
                      {totalDrivers > 0 ? startIndex + 1 : 0}-
                      {Math.min(startIndex + pageLimit, totalDrivers)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-700">
                      {totalDrivers}
                    </span>{" "}
                    drivers
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-lg border border-gray/50 text-xs font-medium text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                            currentPage === page
                              ? "bg-[#1B2A5E] text-white shadow"
                              : "text-gray-500 hover:bg-white border border-gray/50"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 rounded-lg border border-gray/50 text-xs font-medium text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
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
