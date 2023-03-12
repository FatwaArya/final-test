import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RequireRole({ role }) {
  const { userInfo } = useSelector((state) => state.user);
  const location = useLocation();

  return <Navigate to="/login" state={{ from: location }} />;
}
