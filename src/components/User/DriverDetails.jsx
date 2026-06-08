"use client";
import {
  ArrowLeft,
  Mail,
  Send,
  Calendar,
  MapPin,
  DollarSign,
  Phone,
  Car,
} from "lucide-react";

import {
  useGetPlatformDriverByIdQuery,
  useGetPlatformDriverTripsQuery,
} from "../../Api/dashboardApi";
import driverAvatar from "../../assets/images/driverAvatar.png";
import { useMemo, useState } from "react";

const DriverDetails = ({ driverId, onBack }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const {
    data: driver,
    isLoading: isDriverLoading,
    error: driverError,
  } = useGetPlatformDriverByIdQuery(driverId, { skip: !driverId });

  const {
    data: driverTripsRes,
    isLoading: isTripsLoading,
    error: tripsError,
  } = useGetPlatformDriverTripsQuery(driverId, { skip: !driverId });

  // Normalize driver object: backend may return { data: {...} } or the object directly
  const driverData = driver?.data ?? driver ?? {};
  const allTrips = useMemo(() => {
    return Array.isArray(driverTripsRes) ? driverTripsRes : driverTripsRes?.data ?? [];
  }, [driverTripsRes]);

  const totalPages = Math.ceil(allTrips.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTrips = allTrips.slice(startIndex, startIndex + itemsPerPage);

  if (isDriverLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-grayText font-medium">Loading driver details...</p>
      </div>
    );
  }

  if (driverError) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 flex flex-col items-center gap-2">
          <p className="font-bold text-xl">Failed to load driver</p>
          <p className="text-sm opacity-80">{driverError?.data?.message || "Please check your connection."}</p>
          <button onClick={onBack} className="mt-4 px-6 py-2 bg-white border border-red-200 rounded-xl hover:bg-red-50 transition-colors">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 bg-white rounded-2xl text-grayText/50 transition-all shadow-sm border border-gray-50 cursor-pointer hover:bg-gray-50 active:scale-95"
          >
            <ArrowLeft className="w-6 h-6 border-none outline-none" />
          </button>
          <div>
            <div className="text-[13px] font-medium text-gray-400 uppercase tracking-widest">
              Driver Details
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {driverData.name || driverData.full_name || driverData.driver_name || "Driver Profile"}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[48px] p-12 shadow-2xl shadow-gray-200 border border-grayText/50 text-center relative overflow-hidden mb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-block relative">
            <img
              src={driverData.profile_picture || driverData.avatar || driverAvatar}
              className="w-40 h-40 rounded-[48px] object-cover border-4 border-white shadow-xl"
              alt=""
              onError={(e) => { e.target.src = driverAvatar; }}
            />
          </div>

          <div>
            <h2 className="text-3xl font-medium text-gray-900 mb-2">
              {driverData.full_name || driverData.name || driverData.driver_name}
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-6 text-grayText font-medium mt-4">
              <span className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
                <Mail className="w-4 h-4 text-secondary" /> {driverData.email || "No Email"}
              </span>
              <span className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
                <Phone className="w-4 h-4 text-secondary" /> {driverData.phone_number || driverData.phone || "No Phone"}
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-500 text-white rounded-full mt-6 shadow-lg shadow-emerald-100">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />{" "}
              {driverData.status || driverData.user_status || "Active User"}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="bg-[#7C3AED] rounded-[32px] p-8 text-white shadow-xl shadow-purple-200 group hover:scale-[1.02] transition-transform">
                <div className="text-5xl font-bold mb-2">
                  {driverData.driver_total_trip_count ?? allTrips.length ?? 0}
                </div>
                <div className="text-purple-100 font-medium">Total Trips</div>
              </div>
              <div className="bg-[#0EA5E9] rounded-[32px] p-8 text-white shadow-xl shadow-sky-200 group hover:scale-[1.02] transition-transform">
                <div className="text-5xl font-bold mb-2">
                  {driverData.driver_ratings ?? "0.0"}
                </div>
                <div className="text-sky-100 font-medium">Driver Rating</div>
              </div>
            </div>
          </div>

          <div className="bg-[#F8FAFC] rounded-[32px] p-8 border border-slate-100">
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="text-left space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      Vehicle Information
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {driverData.vehicle_type ? `${driverData.vehicle_type} • ${driverData.vehicle_plate || driverData.vehicle_number || ""}` : "Vehicle Info Pending"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      Member Since
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {driverData.date_joined ? new Date(driverData.date_joined).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) : "Recently Joined"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                {driverData.registration_photo ? (
                  <div className="relative">
                    <img
                      src={driverData.registration_photo}
                      className="w-48 h-32 rounded-2xl object-cover shadow-lg border-2 border-white transition-transform group-hover:scale-105"
                      alt="vehicle registration"
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                      Vehicle Document
                    </div>
                  </div>
                ) : (
                  <div className="w-48 h-32 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 gap-2">
                    <div className="p-2 bg-gray-50 rounded-full">📄</div>
                    <span className="text-xs">No registration photo</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6">
            <a
              href={`mailto:${driverData.email}`}
              className="inline-flex items-center justify-center gap-4 bg-[#10B981] text-white px-12 py-6 rounded-[32px] text-xl font-semibold shadow-2xl shadow-emerald-200 hover:-translate-y-1 hover:shadow-emerald-300 transition-all active:scale-95"
            >
              <Send className="w-6 h-6" /> Send Official Mail
            </a>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="px-4">
          <h3 className="text-2xl font-bold text-gray-900">Trip History</h3>
          <p className="text-gray-500 font-medium">
            Recent activity and financial records
          </p>
        </div>

        <div className="bg-white rounded-[40px] overflow-hidden border border-grayText/50 shadow-xl shadow-gray-50">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-grayText/50">
                  <th className="px-10 py-6 font-bold text-[13px] text-slate-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-10 py-6 font-bold text-[13px] text-slate-500 uppercase tracking-wider">
                    Route Experience
                  </th>
                  <th className="px-10 py-6 font-bold text-[13px] text-slate-500 uppercase tracking-wider">
                    Rider
                  </th>
                  <th className="px-10 py-6 font-bold text-[13px] text-slate-500 uppercase tracking-wider">
                    Distance
                  </th>
                  <th className="px-10 py-6 font-bold text-[13px] text-slate-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-10 py-6 font-bold text-[13px] text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-grayText/50">
                {isTripsLoading && (
                  <tr>
                    <td colSpan={6} className="px-10 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                        <span className="text-gray-400 font-medium">Fetching trip records...</span>
                      </div>
                    </td>
                  </tr>
                )}

                {tripsError && (
                  <tr>
                    <td colSpan={6} className="px-10 py-20 text-center">
                      <div className="text-rose-500 font-medium">
                        Unable to load trip history
                      </div>
                    </td>
                  </tr>
                )}

                {!isTripsLoading && !tripsError && allTrips.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-10 py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl text-gray-200">🚕</span>
                        <span className="text-gray-400 font-medium">No trip history available yet</span>
                      </div>
                    </td>
                  </tr>
                )}

                {!isTripsLoading && !tripsError && paginatedTrips.map((trip) => (
                  <tr
                    key={trip.id || trip.trip_id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-900 font-semibold">
                            {trip.created_at ? new Date(trip.created_at).toLocaleDateString("en-GB", { day: '2-digit', month: 'short' }) : "N/A"}
                          </span>
                          <span className="text-gray-400 text-xs">
                            {trip.created_at ? new Date(trip.created_at).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' }) : ""}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="space-y-4 relative pl-6 min-w-[300px]">
                        <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-slate-100 rounded-full">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-4 ring-emerald-50" />
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-secondary rounded-full ring-4 ring-blue-50" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">
                            Pickup Point
                          </div>
                          <div className="text-[14px] font-medium text-gray-700 line-clamp-1">
                            {trip.pickup_address || "Pick-up location"}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">
                            Destination
                          </div>
                          <div className="text-[14px] font-medium text-gray-700 line-clamp-1">
                            {trip.dropoff_address || "Drop-off location"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs text-slate-500 font-bold">
                          {(trip.rider_name || "R")?.[0]}
                        </div>
                        <span className="text-gray-700 font-medium">{trip.rider_name || "Guest Rider"}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <MapPin className="w-4 h-4 text-slate-300" />
                        {typeof trip.distance === 'number' ? trip.distance.toFixed(2) : trip.distance || "0.00"} km
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-4 h-4" />
                        </div>
                        <span className="text-lg text-slate-900 font-bold">
                          ${parseFloat(trip.estimated_price || trip.price || 0).toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`inline-flex px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wider ${trip.status === 'Completed' || trip.status === 'finished'
                        ? 'bg-emerald-50 text-emerald-600'
                        : trip.status === 'Cancelled'
                          ? 'bg-rose-50 text-rose-600'
                          : 'bg-slate-100 text-slate-600'
                        }`}>
                        {trip.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {allTrips.length > itemsPerPage && (
          <div className="flex items-center justify-between pt-6 px-4 pb-12">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-6 py-3 bg-white rounded-2xl text-slate-600 border border-slate-200 transition-all font-semibold ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 active:scale-95'}`}
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-12 h-12 rounded-2xl text-sm font-bold transition-all ${currentPage === page ? "bg-secondary text-white shadow-xl shadow-blue-100" : "text-slate-400 hover:bg-slate-50"}`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-6 py-3 bg-white rounded-2xl text-slate-600 border border-slate-200 transition-all font-semibold ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 active:scale-95'}`}
            >
              Next <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDetails;
