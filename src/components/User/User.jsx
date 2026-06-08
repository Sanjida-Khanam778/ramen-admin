import { useState } from "react";
import UserTable from "./UserTable";
import UserDetails from "./UserDetails";

const User = () => {
  const [currentView, setCurrentView] = useState("list");
  const [selectedUser, setSelectedUser] = useState(null);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setCurrentView("user-details");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {currentView === "list" && (
        <UserTable onViewUser={handleViewUser} />
      )}

      {currentView === "user-details" && selectedUser && (
        <UserDetails
          user={selectedUser}
          onBack={handleBackToList}
        />
      )}
    </div>
  );
};

export default User;
