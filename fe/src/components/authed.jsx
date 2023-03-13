import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function Authenticated() {
  const { userInfo } = useSelector((state) => state);
  return userInfo ? <Outlet /> : <Navigate to="/" />;
}

export default Authenticated;
