import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import reactLogo from "./assets/react.svg";
import Login from "./pages/login";
import Layout from "./components/layouts";
import Dashboard from "./pages/dashboard";
import Authenticated from "./components/authed";
import Attendance from "./pages/attendace";
import Reimbursement from "./pages/Reimbursement";
import Overtime from "./pages/overtime";
import Register from "./pages/register";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<Authenticated />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reimbursement" element={<Reimbursement />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/overtime" element={<Overtime />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
