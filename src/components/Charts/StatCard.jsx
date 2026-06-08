export default function StatCard({ title, value, change, icon, bgColor }) {
  const changeNum = typeof change === "string" ? parseFloat(change) : change;
  const changeColor =
    changeNum > 0
      ? "text-green-500"
      : changeNum < 0
        ? "text-red-500"
        : "text-gray-500";
  const sign = changeNum > 0 ? "+" : changeNum < 0 ? "" : "";

  return (
    <div className={`${bgColor} rounded-xl p-6 shadow-xl`}>
      <div className="flex items-start justify-between">
        <div>
          <img src={icon} alt="" />

          <p className="text-gray-600 text-sm">{title}</p>
          <h3 className="text-3xl font-semibold text-gray-900 mt-2">{value}</h3>
        </div>
        <p
          className={`text-sm bg-white px-2 py-1 rounded-full w-fit ${changeColor}`}
        >
          {sign}
          {changeNum}%
        </p>
      </div>
    </div>
  );
}
