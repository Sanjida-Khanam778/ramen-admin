import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export function PrivateRoute({ children }) {
  const location = useLocation();
  const data = useSelector((state) => state.auth);
  const isAuthenticated =
    Boolean(data.access || data.refresh) && data.isAuthenticated;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
