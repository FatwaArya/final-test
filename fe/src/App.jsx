import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import reactLogo from "./assets/react.svg";
import Login from "./pages/login";
import Layout from "./components/layouts";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
