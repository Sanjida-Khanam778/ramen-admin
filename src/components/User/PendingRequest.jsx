import {
  Clock,
  Phone,
  Mail,
  Copy,
  Check,
  X,
  IdCard,
  CarFront,
} from "lucide-react";
import {
  useGetPlatformDriverByIdQuery,
  useApprovePlatformDriverMutation,
} from "../../Api/dashboardApi";
import { useState } from "react";

const PendingRequest = ({ driverId, onBack }) => {
  const {
    data: driver,
    isLoading,
    error,
  } = useGetPlatformDriverByIdQuery(driverId, { skip: !driverId });
  const [approveDriver] = useApprovePlatformDriverMutation();
  const [processing, setProcessing] = useState(null);
  const [status, setStatus] = useState(null);

  const handleAction = async (action) => {
    if (!driver?.user_id) return;
    setProcessing(action);
    setStatus(null);
    try {
      const res = await approveDriver({ driverId: driver.user_id, action }).unwrap();
      setStatus({
        type: "success",
        message:
          res?.message || (action === "approve" ? "Approved" : "Rejected"),
      });
      // Give a short delay then go back to the list
      setTimeout(() => {
        setProcessing(null);
        if (onBack) onBack();
      }, 700);
    } catch (err) {
      setProcessing(null);
      const msg = err?.data?.message || err?.error || "Failed to update status";
      setStatus({ type: "error", message: msg });
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8">Failed to load request</div>;

  return (
    <div className="p-8">
      <div className="bg-[#418FDE] p-8 flex items-center justify-between text-white shadow-2xl shadow-blue-300 relative overflow-hidden mb-12">
        <div className="flex items-center gap-8">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <div className="text-white mb-1">Application Status</div>
            <div className="text-2xl">{driver.status}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-white mb-1">Submitted</div>
          <div className="text-xl">
            {new Date(driver.created_at).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-2xl shadow-gray text-center max-w-5xl mx-auto">
        <div className="relative inline-block mb-10">
          <img
            src={driver.profile_picture || "/placeholder.svg"}
            className="w-44 h-44 rounded-full object-cover ring-8 ring-white shadow-2xl"
            alt=""
          />
        </div>

        <h2 className="text-3xl text-gray-900 font-medium mb-2">
          {driver.full_name}
        </h2>
        <div className="flex items-center justify-center gap-2 text-grayText text-lg mb-8">
          <Mail size={20} className=" text-grayText" /> {driver.email}
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-[#FAF5FF] rounded-xl p-6 text-left border border-blue-50 relative group">
            <div className="w-10 h-10 bg-blue-100 text-[#0066FF] rounded-xl flex items-center justify-center mb-6">
              <Phone className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-grayText mb-2">Phone Number</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {driver.phone_number}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#FAF5FF] rounded-xl relative p-6 text-left border border-purple-50 flex items-center justify-between group">
            <div className="relative">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <IdCard />
              </div>
              <div className="flex items-center w-full gap-8 justify-between">
                <div>
                  <div className="text-grayText mb-2">Driving License</div>
                  <div className="text-2xl font-semibold text-gray-900">
                    {driver.driver_license_number || "-"}
                  </div>
                </div>
                {/* <button className=" p-3 text-blue-500 bg-white rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <Copy className="w-4 h-4" />
                </button> */}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {driver.nid_front && (
                <img
                  src={driver.license_front}
                  className="w-20"
                  alt="nid front"
                />
              )}
              {driver.nid_back && (
                <img
                  src={driver.license_back}
                  className="w-20"
                  alt="nid back"
                />
              )}
            </div>
          </div>
          <div className="bg-[#FAF5FF] rounded-xl relative p-6 text-left border border-purple-50 flex items-center justify-between group">
            <div className="relative">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <IdCard />
              </div>
              <div className="flex items-center w-full gap-8 justify-between">
                <div>
                  <div className="text-grayText mb-2">NID</div>
                  <div className="text-2xl font-semibold text-gray-900">
                    {driver.nid_number || "-"}
                  </div>
                </div>
                {/* <button className=" p-3 text-blue-500 bg-white rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <Copy className="w-4 h-4" />
                </button> */}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {driver.nid_front && (
                <img src={driver.nid_front} className="w-20" alt="nid front" />
              )}
              {driver.nid_back && (
                <img src={driver.nid_back} className="w-20" alt="nid back" />
              )}
            </div>
          </div>
        </div>

        <div className="bg-[#ECFDF5] rounded-xl p-6 text-left border border-emerald-50 flex items-center justify-between group relative">
          <div>
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <CarFront />
            </div>
            <div className="flex items-center w-full gap-8 justify-between">
              <div>
                <div className="text-xl mb-1 font-semibold">
                  Vehicle Information
                </div>
                <div className="text-grayText">Type: {driver.vehicle_type}</div>
                <div className="text-grayText">
                  Brand: {driver.vehicle_brand}
                </div>
                <div className="text-grayText">
                  Model: {driver.vehicle_model}
                </div>
                <div className="text-grayText">
                  Plate: {driver.vehicle_plate}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {driver.registration_photo && (
              <img
                src={driver.registration_photo}
                className="w-24"
                alt="vehicle"
              />
            )}
          </div>
        </div>

        <div className="mt-6">
          {status && (
            <div
              className={`mb-4 px-4 py-3 rounded ${status.type === "success" ? "bg-green-50 text-green-700" : "bg-rose-50 text-rose-700"}`}
            >
              {status.message}
            </div>
          )}

          <div className="grid grid-cols-2 gap-8 mt-8">
            <button
              onClick={() => handleAction("reject")}
              disabled={processing}
              className="bg-rose-500 disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-2xl flex items-center justify-center gap-4 shadow-2xl shadow-rose-200 hover:-translate-y-1 transition-all cursor-pointer"
            >
              {processing === "reject" ? (
                "Rejecting..."
              ) : (
                <>
                  <X className="" /> Decline
                </>
              )}
            </button>

            <button
              onClick={() => handleAction("approve")}
              disabled={processing}
              className="bg-[#0066FF] disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-2xl flex items-center justify-center gap-4 shadow-2xl shadow-blue-200 hover:-translate-y-1 transition-all cursor-pointer"
            >
              {processing === "approve" ? (
                "Approving..."
              ) : (
                <>
                  <Check className="" /> Approve Application
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingRequest;
