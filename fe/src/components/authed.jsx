import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";

function Authenticated() {
  const { userToken } = useSelector((state) => state);
  const isExpired = (token) => {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  };

  useEffect(() => {
    if (isExpired(userToken)) {
      Cookies.remove("token");
    }
  }, [userToken]);

  return userToken ? <Outlet /> : <Navigate to="/" />;
}

export default Authenticated;
