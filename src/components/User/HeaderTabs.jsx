const HeaderTabs = ({ activeTab, onTabChange }) => {

  const tabs = [
    { id: "users", label: "Users", count: 1856 },
    { id: "drivers", label: "Drivers", count: 264 },
    { id: "pending", label: "Pending Request", count: "01" },
    { id: "all", label: "All Users", count: 2120 },
  ]

  return (
    <div className="flex items-center gap-6 px-8 pt-4 bg-white border-b border-gray">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 px-6 py-3 rounded-t-xl transition-all cursor-pointer ${activeTab === tab.id
              ? "bg-[#0066CC] text-white shadow-lg shadow-blue-200"
              : "text-gray-500 hover:bg-gray-50"
            }`}
        >
          <span className="text-[15px]">{tab.label}</span>
       
        </button>
      ))}
    </div>
  )
}

export default HeaderTabs
