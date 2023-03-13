import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RequireRole({ role }) {
  const { userInfo } = useSelector((state) => state);
  const location = useLocation();

  if (userInfo?.role === role) {
    return <Outlet />;
  }

  return <Navigate to="/" state={{ from: location }} />;
}
