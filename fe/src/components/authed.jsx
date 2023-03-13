import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function Authenticated() {
  const { userInfo } = useSelector((state) => state);
  const isExpired = () => {
    const now = new Date();
    const exp = new Date(userInfo?.exp * 1000);
    return now > exp;
  };

  useEffect(() => {
    if (!userInfo || isExpired()) {
      <Navigate to="/" />;
    }

    return () => {};
  }, [userInfo, isExpired]);
  return <Outlet />;
}

export default Authenticated;
