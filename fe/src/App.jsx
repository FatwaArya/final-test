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
import Announcement from "./pages/announcement";
import RequireRole from "./components/requireRole";
import Approval from "./pages/approval";

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

            <Route element={<RequireRole role="hr" />}>
              <Route path="/announcements/create" element={<Announcement />} />
              <Route path="/approval" element={<Approval />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
