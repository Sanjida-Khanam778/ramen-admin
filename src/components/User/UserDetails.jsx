import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  DollarSign,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
  Star,
  X,
} from "lucide-react";
import {
  useGetUserDetailsQuery,
  useSendUserEmailMutation,
  useUpdatePlatformUserStatusMutation,
} from "../../Api/dashboardApi";
import userAvatar from "../../assets/images/userAvatar.png";
import driverAvatar from "../../assets/images/driverAvatar.png";
import toast from "react-hot-toast";

function SendEmailModal({ userId, email, name, onClose }) {
  const { t } = useTranslation();
  const [subject, setSubject] = useState(
    t("user.emailModal.subjectDefault", { name })
  );
  const [message, setMessage] = useState("");
  const [sendUserEmail, { isLoading: sending }] = useSendUserEmailMutation();

  const handleSend = async () => {
    if (!subject.trim()) {
      toast.error(t("user.emailModal.errorSubject"));
      return;
    }
    if (!message.trim()) {
      toast.error(t("user.emailModal.errorMessage"));
      return;
    }

    try {
      const result = await sendUserEmail({
        userId,
        email,
        subject,
        message,
      }).unwrap();
      console.log(result);
      toast.success(
        result?.message || t("user.emailModal.successToast", { email })
      );
      onClose();
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.email[0] || t("user.emailModal.errorToast"));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray/50">
          <h2 className="text-lg font-semibold text-gray-900">
            {t("user.emailModal.title")}
          </h2>
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
              {t("user.emailModal.to")}
            </label>
            <input
              readOnly
              value={email}
              className="w-full px-4 py-2.5 rounded-xl border border-gray/50 bg-gray-50 text-gray-700 text-sm outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              {t("user.emailModal.subject")}
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
              {t("user.emailModal.message")}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("user.emailModal.placeholder")}
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
            {t("user.emailModal.send")}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            {t("user.emailModal.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, iconBg, iconColor, label, value }) {
  const IconComponent = icon;

  return (
    <div className="bg-white rounded-xl border border-gray/50 shadow-sm p-5 flex items-center gap-4">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}
      >
        <IconComponent className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-xl font-semibold text-gray-900 mt-0.5">
          {value}
        </div>
      </div>
    </div>
  );
}

const UserDetails = ({ user, onBack }) => {
  const { t } = useTranslation();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [blockingUser, setBlockingUser] = useState(false);
  const [localStatus, setLocalStatus] = useState(user?.status || "Active");

  const selectedUserId = user?.id || user?.user_id;
  const [updateUserStatus] = useUpdatePlatformUserStatusMutation();
  const {
    data: userDetails,
    isLoading: loadingDetails,
    isError: detailsError,
  } = useGetUserDetailsQuery(selectedUserId, { skip: !selectedUserId });

  const detailsUser = userDetails
    ? {
        ...user,
        ...userDetails,
        full_name: userDetails.name || user.full_name,
        rating: userDetails.average_rating,
        status: userDetails.is_active ? "Active" : "Suspended",
        is_driver: userDetails.user_type === "driver",
      }
    : user;

  useEffect(() => {
    if (detailsUser?.is_active !== undefined) {
      setLocalStatus(detailsUser.is_active ? "Active" : "Suspended");
    } else if (detailsUser?.status) {
      setLocalStatus(detailsUser.status);
    }
  }, [detailsUser?.is_active, detailsUser?.status]);

  if (!user) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-gray-500">{t("user.details.noUser")}</p>
        <button
          onClick={onBack}
          className="mt-4 px-5 py-2 rounded-xl border border-gray/50 text-sm"
        >
          {t("user.details.goBack")}
        </button>
      </div>
    );
  }

  const fullName = detailsUser.full_name || detailsUser.name || "User";
  const email = detailsUser.email || "";
  const phone = detailsUser.phone_number || detailsUser.phone || "";
  const isDriver =
    detailsUser.user_type === "driver" || !!detailsUser.is_driver;
  const userId = detailsUser.id || detailsUser.user_id || "-";
  const avatar =
    detailsUser.profile_picture ||
    detailsUser.avatar ||
    (isDriver ? driverAvatar : userAvatar);

  const isBlocked =
    localStatus.toLowerCase() === "suspended" ||
    localStatus.toLowerCase() === "blocked" ||
    localStatus.toLowerCase() === "banned";

  const totalTrips =
    detailsUser.total_trips ?? detailsUser.driver_total_trip_count ?? null;
  const completedTrips =
    detailsUser.completed_trips ??
    detailsUser.driver_completed_trip_count ??
    null;
  const rating =
    detailsUser.average_rating ??
    detailsUser.rating ??
    detailsUser.driver_ratings ??
    null;
  const earnings = detailsUser.total_earnings ?? null;

  const dateJoined = detailsUser.date_joined
    ? new Date(detailsUser.date_joined).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "N/A";

  const handleToggleBlock = async () => {
    const willActivate = isBlocked;
    const newStatus = willActivate ? "Active" : "Suspended";

    setBlockingUser(true);
    try {
      if (userId && userId !== "-") {
        await updateUserStatus({ userId, is_active: willActivate }).unwrap();
      }
      setLocalStatus(newStatus);
      toast.success(
        willActivate
          ? t("user.details.actions.toastActivated")
          : t("user.details.actions.toastSuspended")
      );
    } catch {
      toast.error(t("user.details.actions.toastFailed"));
    } finally {
      setBlockingUser(false);
    }
  };

  return (
    <>
      {showEmailModal && (
        <SendEmailModal
          userId={userId}
          email={email}
          name={fullName}
          onClose={() => setShowEmailModal(false)}
        />
      )}

      <div className="p-8 max-w-7xl mx-auto">
        {loadingDetails && (
          <div className="mb-5 flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            {t("user.details.loading")}
          </div>
        )}
        {detailsError && (
          <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {t("user.details.failed")}
          </div>
        )}

        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={onBack}
            className="p-2.5 bg-white border border-gray/50 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <p className="text-xl font-semibold text-gray-400">
              {t("user.details.title")}
            </p>
            <h1 className="text-sm text-[#4A5565]">
              {t("user.details.subtitle")}
            </h1>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray/50 shadow-sm p-6 mb-5">
          <div className="flex items-start gap-5">
            <img
              src={avatar}
              alt={fullName}
              className="w-20 h-20 rounded-full object-cover border-2 border-gray/50 shadow-sm flex-shrink-0"
              onError={(e) => {
                e.target.src = isDriver ? driverAvatar : userAvatar;
              }}
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {fullName}
                  </h2>
                  <p className="text-sm text-[#4A5565] mt-0.5">
                    {t("user.details.id", { id: userId })}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    isBlocked
                      ? "bg-red-50 text-red-600"
                      : "bg-green-50 text-green-600"
                  }`}
                >
                  {isBlocked
                    ? t("user.table.statuses.suspended")
                    : t("user.table.statuses.active")}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2 text-sm text-[#4A5565]">
                {email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {email}
                  </span>
                )}
                {phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {phone}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  {t("user.details.joined", { date: dateJoined })}
                </span>
                <span
                  className={`items-center w-fit px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isDriver
                      ? "bg-blue-50 text-blue-600"
                      : "bg-purple-50 text-purple-600"
                  }`}
                >
                  {isDriver
                    ? t("overview.roles.driver")
                    : t("overview.roles.passenger")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <StatCard
            icon={MapPin}
            iconBg="bg-blue-50"
            iconColor="text-blue-500"
            label={t("user.details.stats.totalTrips")}
            value={totalTrips !== null ? totalTrips.toLocaleString() : "-"}
          />
          <StatCard
            icon={CheckCircle}
            iconBg="bg-green-50"
            iconColor="text-green-500"
            label={t("user.details.stats.completedTrips")}
            value={
              completedTrips !== null ? completedTrips.toLocaleString() : "-"
            }
          />
          <StatCard
            icon={Star}
            iconBg="bg-yellow-50"
            iconColor="text-yellow-500"
            label={t("user.details.stats.rating")}
            value={rating !== null ? parseFloat(rating).toFixed(1) : "-"}
          />
          <StatCard
            icon={DollarSign}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-500"
            label={t("user.details.stats.totalEarnings")}
            value={
              earnings !== null
                ? `$${parseFloat(earnings).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : "-"
            }
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray/50 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            {t("user.details.actions.title")}
          </h3>
          <div className="flex items-center flex-wrap gap-3">
            <button
              onClick={handleToggleBlock}
              disabled={blockingUser}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer disabled:opacity-60 ${
                isBlocked
                  ? "bg-green-500 hover:bg-green-600 text-white shadow-sm shadow-green-200"
                  : "bg-red-500 hover:bg-red-600 text-white shadow-sm shadow-red-200"
              }`}
            >
              {blockingUser && <Loader2 className="w-4 h-4 animate-spin" />}
              {isBlocked
                ? t("user.details.actions.activate")
                : t("user.details.actions.suspend")}
            </button>

            <button
              onClick={() => setShowEmailModal(true)}
              disabled={!email || !userId || userId === "-"}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-white border border-gray/50 text-gray-700 hover:bg-gray-50 transition-all cursor-pointer shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Mail className="w-4 h-4" />
              {t("user.details.actions.sendEmail")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDetails;