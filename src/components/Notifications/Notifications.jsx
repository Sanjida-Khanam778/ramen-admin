"use client";

import {
  Search,
  UserPlus,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  Trash2,
} from "lucide-react";
import {
  useGetPlatformNotificationsQuery,
  useDeleteNotificationMutation
} from "../../Api/dashboardApi";
import toast from "react-hot-toast";

// Fetch notifications from API
const Notifications = () => {
  const {
    data: notifications = [],
    isLoading,
    error,
  } = useGetPlatformNotificationsQuery();

  const [deleteNotification] = useDeleteNotificationMutation();

  const handleNotificationDelete = async (e, id) => {
    e.stopPropagation(); // Prevent card click if there's a read logic
    try {
      await deleteNotification(id).unwrap();
      toast.success("Notification deleted");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete notification");
    }
  };

  if (isLoading) return <div className="p-8">Loading notifications...</div>;
  if (error)
    return <div className="p-8 text-red-500">Failed to load notifications</div>;
  return (
    <div className="py-8 animate-in fade-in slide-in-from-bottom-4 duration-500 px-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1A1C1E]">Notifications</h1>
        <p className="text-[#64748B] text-[15px] mt-1">
          Stay updated with all platform activities
        </p>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-grayText w-5 h-5" />
        <input
          type="text"
          placeholder="Search notifications..."
          className="w-full bg-[#F9FAFB] border border-gray rounded-xl py-4 pl-12 pr-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
        />
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No notifications</div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`group bg-white rounded-[32px] p-6 flex items-center gap-6 shadow-md transition-all cursor-pointer border border-transparent hover:border-gray-100 ${notification.is_read ? "opacity-80" : ""}`}
            >
              <div
                className={`w-14 h-14 ${notification.is_read ? "bg-gray-300" : "bg-[#0066FF]"} rounded-2xl flex items-center justify-center text-white`}
              >
                <AlertCircle className="w-6 h-6" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-[#1A1C1E] text-[17px]">
                    {notification.title}
                  </h3>
                  {!notification.is_read && (
                    <div className="w-2 h-2 rounded-full bg-[#0066FF]" />
                  )}
                </div>
                <p className="text-[#64748B] text-[15px] mt-0.5">
                  {notification.message}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[#94A3B8] text-[13px]">
                    {new Date(notification.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => handleNotificationDelete(e, notification.id)}
                className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                title="Delete Notification"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
