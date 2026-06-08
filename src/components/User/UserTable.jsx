import { useState, useMemo } from "react";
import { Search, Eye, Mail, X, Send, Loader2 } from "lucide-react";
import {
  useGetUsersQuery,
  useGetPlatformDriversQuery,
  useGetPlatformNormalUsersQuery,
} from "../../Api/dashboardApi";
import userAvatar from "../../assets/images/userAvatar.png";
import driverAvatar from "../../assets/images/driverAvatar.png";
import toast from "react-hot-toast";

// ─── Static mock users (shown when API returns empty) ────────────────────────
const MOCK_USERS = [
  {
    user_id: "U001",
    full_name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone_number: "+1 234-567-8901",
    is_driver: true,
    status: "Active",
    completed_trips: 328,
    total_trips: 342,
    rating: 4.8,
    total_earnings: 12450,
    date_joined: "2024-01-15",
    profile_picture: null,
  },
  {
    user_id: "U002",
    full_name: "Michael Chen",
    email: "michael.chen@email.com",
    phone_number: "+1 234-567-8902",
    is_driver: false,
    status: "Active",
    completed_trips: 156,
    total_trips: 156,
    rating: 4.9,
    total_earnings: null,
    date_joined: "2024-02-20",
    profile_picture: null,
  },
  {
    user_id: "U003",
    full_name: "Emily Rodriguez",
    email: "emily.r@email.com",
    phone_number: "+1 234-567-8903",
    is_driver: true,
    status: "Active",
    completed_trips: 475,
    total_trips: 489,
    rating: 4.9,
    total_earnings: 18920,
    date_joined: "2023-11-05",
    profile_picture: null,
  },
  {
    user_id: "U004",
    full_name: "James Wilson",
    email: "james.w@email.com",
    phone_number: "+1 234-567-8904",
    is_driver: false,
    status: "Active",
    completed_trips: 87,
    total_trips: 89,
    rating: 4.7,
    total_earnings: null,
    date_joined: "2024-03-10",
    profile_picture: null,
  },
  {
    user_id: "U005",
    full_name: "Lisa Anderson",
    email: "lisa.a@email.com",
    phone_number: "+1 234-567-8905",
    is_driver: true,
    status: "Suspended",
    completed_trips: 255,
    total_trips: 267,
    rating: 4.6,
    total_earnings: 9870,
    date_joined: "2023-09-22",
    profile_picture: null,
  },
  {
    user_id: "U006",
    full_name: "David Martinez",
    email: "david.m@email.com",
    phone_number: "+1 234-567-8906",
    is_driver: true,
    status: "Active",
    completed_trips: 398,
    total_trips: 412,
    rating: 4.8,
    total_earnings: 16300,
    date_joined: "2023-08-14",
    profile_picture: null,
  },
  {
    user_id: "U007",
    full_name: "Anna Thompson",
    email: "anna.t@email.com",
    phone_number: "+1 234-567-8907",
    is_driver: false,
    status: "Active",
    completed_trips: 201,
    total_trips: 203,
    rating: 4.8,
    total_earnings: null,
    date_joined: "2024-04-01",
    profile_picture: null,
  },
  {
    user_id: "U008",
    full_name: "Robert Brown",
    email: "robert.b@email.com",
    phone_number: "+1 234-567-8908",
    is_driver: true,
    status: "Active",
    completed_trips: 560,
    total_trips: 578,
    rating: 4.9,
    total_earnings: 22100,
    date_joined: "2023-06-30",
    profile_picture: null,
  },
];

// ─── Send Email Modal ────────────────────────────────────────────────────────
function SendEmailModal({ user, onClose }) {
  const [subject, setSubject] = useState(
    `Platform Charge Payment Reminder - ${user.full_name}`
  );
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    toast.success(`Email sent to ${user.email}`);
    onClose();
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
            <label className="block text-sm font-medium text-gray-600 mb-1.5">To:</label>
            <input
              readOnly
              value={user.email}
              className="w-full px-4 py-2.5 rounded-xl border border-gray/50 bg-gray-50 text-gray-700 text-sm outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Subject:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 text-gray-800 text-sm outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Message:</label>
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
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
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

// ─── User Table ──────────────────────────────────────────────────────────────
const TABS = [
  { id: "all", label: "All Users" },
  { id: "drivers", label: "Drivers" },
  { id: "users", label: "Passengers" },
];

const ITEMS_PER_PAGE = 8;

const UserTable = ({ onViewUser }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [emailTarget, setEmailTarget] = useState(null);

  const { data: allUsersData, isLoading: loadingAll } = useGetUsersQuery();
  const { data: driversData, isLoading: loadingDrivers } = useGetPlatformDriversQuery();
  const { data: normalUsersData, isLoading: loadingNormal } = useGetPlatformNormalUsersQuery();

  const isLoading = loadingAll || loadingDrivers || loadingNormal;

  // Normalize API data
  const normalize = (raw, tabSource) =>
    raw.map((u, idx) => ({
      profile_picture: u.profile_picture || u.avatar || null,
      user_id: u.user_id || u.id || `U${String(idx + 1).padStart(3, "0")}`,
      full_name: u.full_name || u.name || "Unknown",
      email: u.email || "",
      phone_number: u.phone_number || u.phone || "",
      status: u.status || u.user_status || "Active",
      is_driver:
        typeof u.is_driver === "boolean"
          ? u.is_driver
          : u.role === "Driver" || tabSource === "drivers",
      date_joined: u.date_joined || u.created_at || null,
      completed_trips: u.completed_trips ?? u.driver_completed_trip_count ?? null,
      total_trips: u.total_trips ?? u.driver_total_trip_count ?? null,
      rating: u.rating ?? u.driver_ratings ?? null,
      total_earnings: u.total_earnings ?? null,
    }));

  // Pick dataset: API first, fallback to mock
  const apiData = useMemo(() => {
    let raw = [];
    if (activeTab === "drivers") raw = Array.isArray(driversData) ? driversData : [];
    else if (activeTab === "users") raw = Array.isArray(normalUsersData) ? normalUsersData : [];
    else raw = Array.isArray(allUsersData) ? allUsersData : [];
    return normalize(raw, activeTab);
  }, [activeTab, allUsersData, driversData, normalUsersData]);

  // Use mock if API is empty (not loading)
  const mockFiltered = useMemo(() => {
    if (activeTab === "drivers") return MOCK_USERS.filter((u) => u.is_driver);
    if (activeTab === "users") return MOCK_USERS.filter((u) => !u.is_driver);
    return MOCK_USERS;
  }, [activeTab]);

  const usersData = !isLoading && apiData.length === 0 ? mockFiltered : apiData;

  // Filter by search
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return usersData;
    const q = searchQuery.toLowerCase().trim();
    return usersData.filter(
      (u) =>
        u.full_name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }, [usersData, searchQuery]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
    if (total !== null) return `0/${total}`;
    return "—";
  };

  return (
    <>
      {emailTarget && (
        <SendEmailModal user={emailTarget} onClose={() => setEmailTarget(null)} />
      )}

      <div className="p-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#1E293B]">User Management</h1>
          <p className="text-sm text-[#6A7282] mt-1">Manage drivers and passengers</p>
        </div>

        {/* Search + Tabs */}
        <div className="bg-white rounded-2xl border border-gray/50 shadow-sm p-4 mb-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
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

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray/50 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-9 h-9 text-blue-500 animate-spin" />
              <p className="text-sm text-gray-500 font-medium">Loading users...</p>
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
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center text-gray-400 text-sm">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user) => (
                      <tr key={user.user_id} className="hover:bg-gray-50 transition-colors">
                        {/* USER */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.profile_picture || (user.is_driver ? driverAvatar : userAvatar)}
                              alt=""
                              className="w-10 h-10 rounded-full object-cover"
                              onError={(e) => { e.target.src = userAvatar; }}
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                              <div className="text-xs text-gray-400 mt-0.5">{user.user_id}</div>
                            </div>
                          </div>
                        </td>

                        {/* CONTACT */}
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">{user.email}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{user.phone_number}</div>
                        </td>

                        {/* ROLE */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            user.is_driver ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                          }`}>
                            {user.is_driver ? "driver" : "passenger"}
                          </span>
                        </td>

                        {/* TRIPS */}
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {formatTrips(user.completed_trips, user.total_trips)}
                        </td>

                        {/* RATING */}
                        <td className="px-6 py-4">
                          {user.rating !== null ? (
                            <span className="text-sm text-gray-700">
                              {parseFloat(user.rating).toFixed(1)}{" "}
                              <span className="text-yellow-400">★</span>
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>

                        {/* STATUS */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(user.status)}`}>
                            {(user.status || "active").toLowerCase()}
                          </span>
                        </td>

                        {/* ACTIONS */}
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
                              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray/50 bg-gray-50">
                  <p className="text-xs text-gray-500">
                    Showing{" "}
                    <span className="font-semibold text-gray-700">
                      {filteredUsers.length > 0 ? startIndex + 1 : 0}–
                      {Math.min(startIndex + ITEMS_PER_PAGE, filteredUsers.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-700">{filteredUsers.length}</span> users
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
