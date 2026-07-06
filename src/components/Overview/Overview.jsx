import {
  Users,
  Car,
  User,
  MapPin,
  CheckCircle,
  XCircle,
  DollarSign,
  Clock,
  Star,
} from "lucide-react";
import UserGrowthChart from "../Charts/UserGrowthChart.jsx";
import RevenueChart from "../Charts/RevenueChart.jsx";
import {
  useGetPlatformAdminStatsQuery,
  useGetAdminRideAnalyticsQuery,
  useGetAdminEarningsAnalyticsQuery,
  useGetAdminRecentRidesQuery,
  useGetAdminRecentUsersQuery,
} from "../../Api/dashboardApi";
import {
  useGetUserStatsQuery,
  useGetTransactionStatsQuery,
} from "../../Api/couponApi";
import { useTranslation } from "react-i18next";

// Import avatar assets
import userAvatar from "../../assets/images/userAvatar.png";
import driverAvatar from "../../assets/images/driverAvatar.png";
import generalAvatar from "../../assets/images/Avatar.png";

export default function Overview() {
  const { t } = useTranslation();
  const { data, isLoading, error } = useGetPlatformAdminStatsQuery();
  const { data: rideAnalyticsData } = useGetAdminRideAnalyticsQuery();
  const { data: earningsAnalyticsData } = useGetAdminEarningsAnalyticsQuery();
  const { data: recentRidesData } = useGetAdminRecentRidesQuery();
  const { data: recentUsersData } = useGetAdminRecentUsersQuery();

  // New: user stats (total/active/suspended users, drivers, passengers)
  const { data: userStatsData, isLoading: isUserStatsLoading } =
    useGetUserStatsQuery();
  console.log(userStatsData);
  // New: transaction stats (platform earnings, revenue, success rate)
  const { data: txnStatsData, isLoading: isTxnStatsLoading } =
    useGetTransactionStatsQuery();
  console.log(txnStatsData);
  const totals = data?.totals || {};
  const revenue = totals.revenue?.value ?? 0;
  const users = totals.users?.value ?? 0;
  const drivers = totals.drivers?.value ?? 0;

  // ── User stats derived values ──────────────────────────────────────────────
  const userOverview = userStatsData?.overview || {};
  const byStatus = userStatsData?.by_status || {};

  const totalUsersCount = userOverview.total_users ?? 0;

  const totalDriversCount =
    (byStatus.active?.drivers ?? 0) + (byStatus.suspended?.drivers ?? 0);

  const totalPassengersCount =
    (byStatus.active?.passengers ?? 0) + (byStatus.suspended?.passengers ?? 0);

  // ── Transaction stats derived values ───────────────────────────────────────
  const txnOverview = txnStatsData?.overview || {};
  const totalPlatformEarnings = Number(
    txnOverview.total_platform_earnings ?? 0,
  );
  const totalRevenue = Number(txnOverview.total_revenue ?? 0);
  const successRate = txnOverview.success_rate_percentage;

  const userGrowth =
    Array.isArray(rideAnalyticsData?.graph_data) &&
    rideAnalyticsData.graph_data.length > 0
      ? rideAnalyticsData.graph_data.map((item) => ({
          month: item.month_name || item.month,
          value: Number(item.ride_count ?? item.value ?? item.count ?? 0),
        }))
      : data?.growth?.users?.map((u) => ({ month: u.month, value: u.count })) ||
        null;

  const revenueGrowth =
    Array.isArray(earningsAnalyticsData?.graph_data) &&
    earningsAnalyticsData.graph_data.length > 0
      ? earningsAnalyticsData.graph_data.map((item) => ({
          month: item.month_name || item.month,
          total: Number(item.total_revenue ?? item.earnings ?? item.total ?? 0),
        }))
      : data?.growth?.revenue?.map((r) => ({
          month: r.month,
          total: r.total,
        })) || null;

  const formatCurrency = (n) =>
    typeof n === "number"
      ? `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : n;

  const status = error?.status ?? error?.originalStatus ?? null;
  const errorMessage =
    status === 401
      ? t("overview.errors.unauthorized")
      : t("overview.errors.failedLoad");

  // 6 stat cards — first 3 from user-stats API, last 3 from transaction-stats API
  const metrics = [
    {
      title: t("overview.metrics.totalUsers"),
      value: isUserStatsLoading ? "..." : totalUsersCount.toLocaleString(),
      icon: Users,
      iconBg: "bg-[#2563EB]", // Blue
    },
    {
      title: t("overview.metrics.totalDrivers"),
      value: isUserStatsLoading ? "..." : totalDriversCount.toLocaleString(),
      icon: Car,
      iconBg: "bg-[#00D154]", // Green
    },
    {
      title: t("overview.metrics.totalPassengers"),
      value: isUserStatsLoading ? "..." : totalPassengersCount.toLocaleString(),
      icon: User,
      iconBg: "bg-[#A855F7]", // Purple
    },
    {
      title: t("overview.metrics.totalRevenue"), // total_revenue
      value: isTxnStatsLoading ? "..." : formatCurrency(totalRevenue),
      icon: Clock,
      iconBg: "bg-[#EAB308]", // Yellow/Gold
    },
    {
      title: t("overview.metrics.totalEarnings"), // total_platform_earnings
      value: isTxnStatsLoading ? "..." : formatCurrency(totalPlatformEarnings),
      icon: DollarSign,
      iconBg: "bg-[#00D154]", // Green
    },
    {
      title: t("overview.metrics.successRate"), // success_rate_percentage
      value: isTxnStatsLoading
        ? "..."
        : successRate !== undefined
          ? `${successRate}%`
          : "0%",
      icon: Star,
      iconBg: "bg-[#F59E0B]", // Orange/Gold
    },
  ];

  // Helper function to format relative time
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t("overview.time.justNow");
    if (diffMins < 60)
      return diffMins === 1
        ? t("overview.time.minuteAgo", { count: 1 })
        : t("overview.time.minutesAgo", { count: diffMins });
    if (diffHours < 24)
      return diffHours === 1
        ? t("overview.time.hourAgo", { count: 1 })
        : t("overview.time.hoursAgo", { count: diffHours });
    if (diffDays < 7)
      return diffDays === 1
        ? t("overview.time.dayAgo", { count: 1 })
        : t("overview.time.daysAgo", { count: diffDays });
    return then.toLocaleDateString();
  };

  // Recent activity data from API or fallback
  const recentActivities =
    Array.isArray(recentRidesData?.data) && recentRidesData.data.length > 0
      ? recentRidesData.data.slice(0, 5).map((ride) => ({
          id: ride.transaction_id,
          name: ride.passenger?.name || t("overview.guestPassenger"),
          action: t("overview.rideFrom", {
            pickup:
              ride.ride_details?.pickup_location?.split(",")[0] || "Pickup",
            dropoff:
              ride.ride_details?.dropoff_location?.split(",")[0] || "Dropoff",
          }),
          time: getRelativeTime(ride.timestamps?.created_at),
        }))
      : [
          {
            id: 1,
            name: "Sarah Johnson",
            action: t("overview.activities.completed"),
            time: t("overview.time.minutesAgo", { count: 2 }),
          },
          {
            id: 2,
            name: "Michael Chen",
            action: t("overview.activities.booked"),
            time: t("overview.time.minutesAgo", { count: 5 }),
          },
          {
            id: 3,
            name: "Emily Rodriguez",
            action: t("overview.activities.started"),
            time: t("overview.time.minutesAgo", { count: 8 }),
          },
          {
            id: 4,
            name: "James Wilson",
            action: t("overview.activities.cancelled"),
            time: t("overview.time.minutesAgo", { count: 12 }),
          },
          {
            id: 5,
            name: "David Martinez",
            action: t("overview.activities.completed"),
            time: t("overview.time.minutesAgo", { count: 15 }),
          },
        ];

  // Newly registered users data from API or fallback
  const newlyRegisteredUsers =
    Array.isArray(recentUsersData?.data) && recentUsersData.data.length > 0
      ? recentUsersData.data.map((user) => ({
          id: user.id,
          name: user.name,
          role: t(`overview.roles.${user.user_type}`) || user.user_type,
          date: new Date(user.date_joined).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }),
          avatar: user.user_type === "driver" ? driverAvatar : userAvatar,
        }))
      : [
          {
            id: 1,
            name: "Alex Murphy",
            role: t("overview.roles.passenger"),
            date: "2026-03-09",
            avatar: userAvatar,
          },
          {
            id: 2,
            name: "Jessica Lee",
            role: t("overview.roles.driver"),
            date: "2026-03-09",
            avatar: driverAvatar,
          },
          {
            id: 3,
            name: "Tom Hardy",
            role: t("overview.roles.passenger"),
            date: "2026-03-08",
            avatar: generalAvatar,
          },
          {
            id: 4,
            name: "Rachel Green",
            role: t("overview.roles.driver"),
            date: "2026-03-08",
            avatar: driverAvatar,
          },
        ];

  return (
    <div className="bg-[#F8FAFC] p-8 font-nunito">
      <div className="min-h-screen mx-auto">
        {/* Error Banner */}
        {/* {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 text-sm border border-red-100 shadow-sm">
            {errorMessage}
          </div>
        )} */}

        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#1E293B]">
            {t("overview.title")}
          </h1>
          <p className="text-sm text-[#6A7282] mt-1">
            {t("overview.subtitle")}
          </p>
        </div>

        {/* 6 Stat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metrics.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-5 border border-gray shadow-sm flex items-center justify-between hover:shadow-md transition-shadow duration-200"
              >
                <div>
                  <p className="text-xs font-medium text-[#6A7282] uppercase tracking-wider">
                    {card.title}
                  </p>
                  <h3 className="text-2xl font-semibold text-[#1E293B] mt-2">
                    {card.value}
                  </h3>
                </div>
                <div
                  className={`w-11 h-11 rounded-lg flex items-center justify-center text-white ${card.iconBg}`}
                >
                  <IconComponent className="w-5.5 h-5.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <UserGrowthChart data={userGrowth} total={users} />
          <RevenueChart data={revenueGrowth} total={revenue} />
        </div>

        {/* Bottom Lists Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity Card */}
          <div className="bg-white rounded-xl p-6 border border-gray shadow-sm">
            <h3 className="text-base font-semibold text-[#1E293B] mb-5">
              {t("overview.recentRides")}
            </h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 text-sm pb-3 border-b border-gray/50 last:border-b-0 last:pb-0"
                >
                  <span className="w-2 h-2 rounded-full bg-[#00D154] mt-1.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-[#1E293B] leading-tight">
                      <span className="font-semibold text-slate-800">
                        {activity.name}
                      </span>{" "}
                      {activity.action}
                    </p>
                    <span className="text-[11px] text-[#6A7282] block mt-1 font-medium">
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newly Registered Users Card */}
          <div className="bg-white rounded-xl p-6 border border-gray shadow-sm">
            <h3 className="text-base font-semibold text-[#1E293B] mb-5">
              {t("overview.newlyRegisteredUsers")}
            </h3>
            <div className="space-y-4">
              {newlyRegisteredUsers.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between pb-3 border-b border-gray/50 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-100 shadow-sm"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-[#1E293B]">
                        {u.name}
                      </h4>
                      <p className="text-xs text-[#6A7282] font-medium mt-0.5">
                        {u.role}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-[#6A7282] font-medium">
                    {u.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
