"use client"

import { ArrowLeft } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import UserInfo from "../ClientDetailsPage/UserInfo"
import UserStats from "../ClientDetailsPage/UserStats"
import { useGetUserDetailsQuery, useGetUserStatsQuery } from "../../Api/dashboardApi"

const UserProfileDashboard = () => {
  const { id } = useParams()

  // Fetch user details and stats
  const { data: userDetails, isLoading: userLoading, error: userError } = useGetUserDetailsQuery(id)
  const { data: userStats, isLoading: statsLoading, error: statsError } = useGetUserStatsQuery(id)

  if (userLoading || statsLoading) {
    return (
      <div className="h-[90vh] p-4 overflow-y-scroll">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center mb-6">
            <Link to={"/clients"}>
              <ArrowLeft className="w-6 h-6 text-gray-600 mr-4 cursor-pointer" />
            </Link>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Loading user data...</span>
          </div>
        </div>
      </div>
    )
  }

  if (userError || statsError) {
    return (
      <div className="h-[90vh] p-4 overflow-y-scroll">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center mb-6">
            <Link to={"/clients"}>
              <ArrowLeft className="w-6 h-6 text-gray-600 mr-4 cursor-pointer" />
            </Link>
          </div>
          <div className="text-red-500 text-center">
            Error loading user data: {userError?.message || statsError?.message}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[90vh] p-4 overflow-y-scroll">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link to={"/clients"}>
            <ArrowLeft className="w-6 h-6 text-gray-600 mr-4 cursor-pointer" />
          </Link>
        </div>
        {/* User Info Card */}
        <UserInfo userDetails={userDetails} />
        {/* User Stats */}
        <UserStats userStats={userStats} userDetails={userDetails} />
      </div>
    </div>
  )
}

export default UserProfileDashboard
