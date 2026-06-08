import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex font-nunito">
      {!sidebarOpen && (
        <button
          className="lg:hidden absolute top-4 left-4 z-30 bg-primary rounded-full p-2 shadow-lg"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <GoSidebarCollapse className="text-xl text-white" />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`h-screen flex-shrink-0 transition-all duration-300 bg-primary 
          ${sidebarOpen ? "fixed inset-0 z-40 w-64" : "w-72 lg:relative lg:w-72"
          }
          ${!sidebarOpen ? "hidden lg:block" : ""}
        `}
        style={{ minWidth: 220 }}
      >
        <Sidebar />
        {/* Close button for md and below (hidden on lg+) */}
        {sidebarOpen && (
          <button
            className="lg:hidden absolute top-4 right-4 z-50 bg-primary rounded-full p-2 shadow-lg"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <GoSidebarExpand className="text-xl text-white" />
          </button>
        )}
      </div>

      {/* Overlay when sidebar is open on md and below (hidden on lg+) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex flex-col flex-1 font-nunito h-screen overflow-y-auto">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
}
