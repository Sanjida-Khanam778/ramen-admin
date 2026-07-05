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
import { useGetPlatformAdminStatsQuery } from "../../Api/dashboardApi";

// Import avatar assets
import userAvatar from "../../assets/images/userAvatar.png";
import driverAvatar from "../../assets/images/driverAvatar.png";
import generalAvatar from "../../assets/images/Avatar.png";

export default function Overview() {
  const { data, isLoading, error } = useGetPlatformAdminStatsQuery();

  const totals = data?.totals || {};
  const revenue = totals.revenue?.value ?? 0;
  const users = totals.users?.value ?? 0;
  const drivers = totals.drivers?.value ?? 0;

  const userGrowth =
    data?.growth?.users?.map((u) => ({ month: u.month, value: u.count })) ||
    null;
  const revenueGrowth =
    data?.growth?.revenue?.map((r) => ({ month: r.month, total: r.total })) ||
    null;

  const formatCurrency = (n) =>
    typeof n === "number"
      ? `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : n;

  const status = error?.status ?? error?.originalStatus ?? null;
  const errorMessage =
    status === 401 ? "Unauthorized — please sign in" : "Failed to load stats";

  // Card metrics parsing with mock fallbacks matching the mockup
  const metrics = [
    {
      title: "Total Users",
      value: isLoading ? "12,847" : users ? users.toLocaleString() : "12,847",
      icon: Users,
      iconBg: "bg-[#2563EB]", // Blue
    },
    {
      title: "Total Drivers",
      value: isLoading ? "4,523" : drivers ? drivers.toLocaleString() : "4,523",
      icon: Car,
      iconBg: "bg-[#00D154]", // Green
    },
    {
      title: "Total Passengers",
      value: isLoading
        ? "8,324"
        : users && drivers
          ? (users - drivers).toLocaleString()
          : "8,324",
      icon: User,
      iconBg: "bg-[#A855F7]", // Purple
    },
    {
      title: "Total Trips",
      value: isLoading
        ? "45,678"
        : totals.trips?.value
          ? totals.trips.value.toLocaleString()
          : "45,678",
      icon: MapPin,
      iconBg: "bg-[#FF6600]", // Orange
    },
    {
      title: "Completed Trips",
      value: isLoading
        ? "43,892"
        : totals.completed_trips?.value
          ? totals.completed_trips.value.toLocaleString()
          : "43,892",
      icon: CheckCircle,
      iconBg: "bg-[#00C5A0]", // Teal
    },
    {
      title: "Cancelled Trips",
      value: isLoading
        ? "1,786"
        : totals.cancelled_trips?.value
          ? totals.cancelled_trips.value.toLocaleString()
          : "1,786",
      icon: XCircle,
      iconBg: "bg-[#EF4444]", // Red
    },
    {
      title: "Total Earnings",
      value: isLoading
        ? "$1,234,567.89"
        : revenue
          ? formatCurrency(revenue)
          : "$1,234,567.89",
      icon: DollarSign,
      iconBg: "bg-[#00D154]", // Green
    },
    {
      title: "Pending Payments",
      value: isLoading
        ? "$23,456.50"
        : totals.pending_payments?.value
          ? formatCurrency(totals.pending_payments.value)
          : "$23,456.50",
      icon: Clock,
      iconBg: "bg-[#EAB308]", // Yellow/Gold
    },
    {
      title: "Average Rating",
      value: isLoading
        ? "4.7"
        : totals.average_rating?.value
          ? totals.average_rating.value.toFixed(1)
          : "4.7",
      icon: Star,
      iconBg: "bg-[#F59E0B]", // Orange/Gold
    },
  ];

  // Recent activity data
  const recentActivities = [
    {
      id: 1,
      name: "Sarah Johnson",
      action: "completed a trip",
      time: "2 minutes ago",
    },
    {
      id: 2,
      name: "Michael Chen",
      action: "booked a ride",
      time: "5 minutes ago",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      action: "started a trip",
      time: "8 minutes ago",
    },
    {
      id: 4,
      name: "James Wilson",
      action: "cancelled a ride",
      time: "12 minutes ago",
    },
    {
      id: 5,
      name: "David Martinez",
      action: "completed a trip",
      time: "15 minutes ago",
    },
  ];

  // Newly registered users data
  const newlyRegisteredUsers = [
    {
      id: 1,
      name: "Alex Murphy",
      role: "passenger",
      date: "2026-03-09",
      avatar: userAvatar,
    },
    {
      id: 2,
      name: "Jessica Lee",
      role: "driver",
      date: "2026-03-09",
      avatar: driverAvatar,
    },
    {
      id: 3,
      name: "Tom Hardy",
      role: "passenger",
      date: "2026-03-08",
      avatar: generalAvatar,
    },
    {
      id: 4,
      name: "Rachel Green",
      role: "driver",
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
            Dashboard Overview
          </h1>
          <p className="text-sm text-[#6A7282] mt-1">
            Monitor your ride-sharing platform performance
          </p>
        </div>

        {/* 9 Stat Cards Grid */}
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
              Recent Activity
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
              Newly Registered Users
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
