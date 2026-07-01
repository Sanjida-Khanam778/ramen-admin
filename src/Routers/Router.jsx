import { createBrowserRouter } from "react-router-dom";
import Settings from "../components/Settings/Settings";
import SignIn from "../Pages/Auth/SignIn";
import Overview from "../components/Overview/Overview";
import User from "../components/User/User";
import Notifications from "../components/Notifications/Notifications";
import Dashboard from "../Layouts/Dashboard";
import DriverVerification from "../components/DriverVerification/DriverVerification";
import PromoCodeManagement from "../components/PromoCode/Promocodemanagement";
import RateCommissionManagement from "../components/Ratecommission/Ratecommissionmanagement";
import PaymentManagement from "../components/Payment/Paymentmanagement";
import ComplaintManagement from "../components/Complaint/Complaintmanagement";
import ComplaintDetail from "../components/Complaintdetail/Complaintdetail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      // <PrivateRoute>
      //   <Dashboard />
      // </PrivateRoute>
      <Dashboard />
    ),
    errorElement: <h1>404</h1>,
    children: [
      {
        path: "/",
        element: <Overview />,
      },
      {
        path: "/user",
        element: <User />,
      },
      {
        path: "/driver-verification",
        element: <DriverVerification />,
      },
      {
        path: "/promo-code",
        element: <PromoCodeManagement />,
      },
      {
        path: "/payment",
        element: <PaymentManagement />,
      },
      {
        path: "/notifications",
        element: <Notifications />,
      },
      {
        path: "/complaints",
        element: <ComplaintManagement />,
      },
      {
        path: "/complaints/:complaintId",
        element: <ComplaintDetail />,
      },
      {
        path: "/commission",
        element: <RateCommissionManagement />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "/login",
    element: <SignIn />,
  },
]);