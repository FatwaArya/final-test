import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RequireRole({ role }) {
  const { userInfo } = useSelector((state) => state.user);
  console.log(role);
  const location = useLocation();
  if (userInfo && userInfo.role === role) {
    console.log("role", role);
    return <Outlet />;
  }
  return <Navigate to="/login" state={{ from: location }} />;
}
