import { Link, NavLink, useLocation } from "react-router-dom";
import "./Sidebar.css";
import { LuCircleUserRound, LuCreditCard, LuDumbbell, LuLayoutDashboard, LuSettings, LuTag, LuUsers } from "react-icons/lu";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../../features/authSlice";
import { TbDiamond } from "react-icons/tb";
import { RxDashboard } from "react-icons/rx";
import { PiShoppingBagOpenBold } from "react-icons/pi";
import { BiUserCheck } from "react-icons/bi";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FiMessageSquare } from "react-icons/fi";
import logo from "../../assets/images/logo.png";

export default function Sidebar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <div className="text-white h-screen sticky left-0 z-20 flex flex-col justify-between w-48 md:w-64 xl:w-72" style={{
          background: `linear-gradient(90deg, #001A55 0%, #0241A3 100%)`,
        }}>
      {/* Ober Logo */}
      <div className="mt-12 flex justify-center">
      <img src={logo} className="h-20" alt="Ober Logo" />
      </div>

      <nav className="flex-1 font-nunito mt-10">
        <ul className="space-y-2">
          <li>
            <NavLink to={"/"} className="flex items-center mx-4 rounded-2xl px-6 py-4">
              <LuLayoutDashboard className="mr-3 text-2xl" />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/user"}
              className="flex items-center mx-4 rounded-2xl px-6 py-4">
            
              <LuUsers className="mr-3 text-2xl" />
              User Management
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/driver-verification"}
              className="flex items-center mx-4 rounded-2xl px-6 py-4"
            >
              <BiUserCheck className="mr-3 text-3xl" />
              Driver Verification
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/promo-code"}
              className="flex items-center mx-4 rounded-2xl px-6 py-4"
            >
              <LuTag className="text-xl mr-3" />
             Promo Codes
            </NavLink>
          </li>
         
          <li>
            <NavLink
              to={"/commission"}
              className="flex items-center mx-4 rounded-2xl px-6 py-4"
            >
              <FaArrowTrendUp className="mr-3 text-xl" />
              Rate & Commission
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/payment"}
              className="flex items-center mx-4 rounded-2xl px-6 py-4"
            >
              <LuCreditCard className="mr-3 text-2xl" />
              Payment Management
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/complaints"}
              className="flex items-center mx-4 rounded-2xl px-6 py-4"
            >
              <FiMessageSquare className="mr-3 text-xl" />
              Complaints
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/settings"}
              className="flex items-center mx-4 rounded-2xl px-6 py-4"
            >
              <LuSettings className="mr-3 text-2xl" /> 
              Settings
            </NavLink>
          </li>
        </ul>
      </nav>
      <Link to={"/login"}>
        <button
          onClick={handleLogout}
          className="flex items-center mx-4 rounded-2xl px-6 py-4 text-xl w-full text-white"
        >
          <LogOut className="mr-3" />
          Logout
        </button>
      </Link>
    </div>
  );
}
