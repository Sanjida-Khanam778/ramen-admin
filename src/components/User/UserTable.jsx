import { useMemo, useState } from "react";
import { Eye, Loader2, Mail, Search, Send, X } from "lucide-react";
import {
  useGetUsersQuery,
  useSendUserEmailMutation,
} from "../../Api/dashboardApi";
import userAvatar from "../../assets/images/userAvatar.png";
import driverAvatar from "../../assets/images/driverAvatar.png";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";

function SendEmailModal({ user, onClose }) {
  const [subject, setSubject] = useState(`Platform update - ${user.full_name}`);
  const [message, setMessage] = useState("");
  const [sendUserEmail, { isLoading: sending }] = useSendUserEmailMutation();

  const handleSend = async () => {
    if (!subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    try {
      const result = await sendUserEmail({
        userId: user.id,
        email: user.email,
        subject,
        message,
      }).unwrap();
      toast.success(result?.message || `Email sent to ${user.email}`);
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send email");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray/50">
          <h2 className="text-lg font-semibold text-gray-900">Send Email</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              To:
            </label>
            <input
              readOnly
              value={user.email}
              className="w-full px-4 py-2.5 rounded-xl border border-gray/50 bg-gray-50 text-gray-700 text-sm outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
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
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Message:
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-gray/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 text-gray-800 text-sm outline-none transition-all resize-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-t border-gray/50">
          <button
            onClick={handleSend}
            disabled={sending}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1B2A5E] text-white rounded-xl text-sm font-semibold hover:bg-[#162347] transition-colors disabled:opacity-60 cursor-pointer"
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
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const TABS = [
  { id: "all", label: "All Users" },
  { id: "driver", label: "Drivers" },
  { id: "passenger", label: "Passengers" },
];

const ITEMS_PER_PAGE = 8;

const normalizeUser = (u, idx) => ({
  profile_picture: u.profile_picture || u.avatar || null,
  id: u.id,
  user_id: u.user_id || u.id || `U${String(idx + 1).padStart(3, "0")}`,
  full_name: u.full_name || u.name || "N/A",
  email: u.email || "",
  phone_number: u.phone_number || u.phone || "",
  status: u.status || u.user_status || (u.is_active ? "Active" : "Suspended"),
  is_active: u.is_active,
  is_email_verified: u.is_email_verified,
  is_phone_verified: u.is_phone_verified,
  is_driver: u.user_type === "driver" || u.role === "Driver" || u.is_driver === true,
  user_type: u.user_type,
  preferred_language: u.preferred_language,
  date_joined: u.date_joined || u.created_at || null,
  completed_trips: u.completed_trips ?? null,
  total_trips: u.total_trips ?? u.driver_total_trip_count ?? null,
  rating: u.average_rating ?? u.rating ?? u.driver_ratings ?? null,
  total_earnings: u.total_earnings ?? null,
});

const UserTable = ({ onViewUser }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [emailTarget, setEmailTarget] = useState(null);

  const queryParams = useMemo(
    () => ({
      user_type: activeTab === "all" ? undefined : activeTab,
      search: searchQuery.trim() || undefined,
      ordering: "name,-date_joined",
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    }),
    [activeTab, searchQuery, currentPage]
  );

  const {
    data: usersResponse,
    isLoading,
    isFetching,
    isError,
  } = useGetUsersQuery(queryParams);

  const usersData = useMemo(() => {
    const raw = Array.isArray(usersResponse?.data) ? usersResponse.data : [];
    return raw.map(normalizeUser);
  }, [usersResponse]);

  const pagination = usersResponse?.pagination || {};
  const totalUsers = pagination.total ?? usersData.length;
  const pageLimit = pagination.limit ?? ITEMS_PER_PAGE;
  const totalPages = Math.max(1, Math.ceil(totalUsers / pageLimit));
  const startIndex = (currentPage - 1) * pageLimit;

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
    setSearchQuery("");
  };

  const getStatusStyle = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "active" || s === "verified") return "bg-[#DCFCE7] text-[#15803D]";
    if (s === "suspended" || s === "blocked" || s === "banned") return "bg-[#FEE2E2] text-[#DC2626]";
    if (s === "pending verification") return "bg-[#FEF9C3] text-[#A16207]";
    return "bg-gray-100 text-gray-500";
  };

  const formatTrips = (completed, total) => {
    if (completed !== null && total !== null) return `${completed}/${total}`;
    if (total !== null) return `${total}`;
    return "-";
  };

  return (
    <>
      {emailTarget && (
        <SendEmailModal user={emailTarget} onClose={() => setEmailTarget(null)} />
      )}

      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#1E293B]">User Management</h1>
          <p className="text-sm text-[#6A7282] mt-1">Manage drivers and passengers</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray/50 shadow-sm p-4 mb-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 text-sm text-gray-800 outline-none transition-all bg-gray-50"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#1B2A5E] text-white shadow"
                    : "text-gray-600 hover:bg-gray-100 border border-gray/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray/50 shadow-sm overflow-hidden">
          {isLoading || isFetching ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-9 h-9 text-blue-500 animate-spin" />
              <p className="text-sm text-gray-500 font-medium">Loading users...</p>
            </div>
          ) : isError ? (
            <div className="px-6 py-16 text-center text-red-500 text-sm">
              Failed to load users.
            </div>
          ) : (
            <>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray/50">
                    {["User", "Contact", "Role", "Trips", "Rating", "Status", "Actions"].map((h) => (
                      <th
                        key={h}
                        className={`px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider ${h === "Actions" ? "text-right" : ""}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray/50">
                  {usersData.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center text-gray-400 text-sm">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    usersData.map((user) => (
                      <tr key={user.user_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.profile_picture || (user.is_driver ? driverAvatar : userAvatar)}
                              alt=""
                              className="w-10 h-10 rounded-full object-cover"
                              onError={(e) => {
                                e.target.src = userAvatar;
                              }}
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                              <div className="text-xs text-gray-400 mt-0.5">{user.user_id}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">{user.email || "-"}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{user.phone_number || "-"}</div>
                        </td>

                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            user.is_driver ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                          }`}>
                            {user.user_type || (user.is_driver ? "driver" : "passenger")}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-700">
                          {formatTrips(user.completed_trips, user.total_trips)}
                        </td>

                        <td className="px-6 py-4">
                          {user.rating !== null ? (
                            <span className="text-sm flex items-center gap-1 text-gray-700">
                              {parseFloat(user.rating).toFixed(1)}{" "}
                              <span className="text-yellow-400"><FaStar /> </span>
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(user.status)}`}>
                            {(user.status || "active").toLowerCase()}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onViewUser(user)}
                              className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="View User"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => setEmailTarget(user)}
                              disabled={!user.id || !user.email}
                              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                              title="Send Email"
                            >
                              <Mail className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray/50 bg-gray-50">
                  <p className="text-xs text-gray-500">
                    Showing{" "}
                    <span className="font-semibold text-gray-700">
                      {totalUsers > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + pageLimit, totalUsers)}
                    </span>{" "}
                    of <span className="font-semibold text-gray-700">{totalUsers}</span> users
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-lg border border-gray/50 text-xs font-medium text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                    ))}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
    </>
  );
};

export default UserTable;
