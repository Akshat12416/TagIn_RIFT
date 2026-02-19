import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Landing from "./pages/Landing";
import ManufacturerLogin from "./pages/ManufacturerLogin";
import Register from "./pages/RegisterProduct";
import Verify from "./pages/Verify";
import Dashboard from "./pages/Dashboard";
import Transfer from "./pages/TransferOwnership";

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("manufacturer")
  );

  const [userAddress, setUserAddress] = useState(
    localStorage.getItem("manufacturer")
  );

  return (
    <Routes>

      <Route path="/" element={<Landing />} />

      <Route
        path="/manufacturer-login"
        element={
          <ManufacturerLogin
            setIsLoggedIn={setIsLoggedIn}
            setUserAddress={setUserAddress}
          />
        }
      />

      <Route
        path="/register"
        element={
          isLoggedIn ? (
            <Register userAddress={userAddress} />
          ) : (
            <Navigate to="/manufacturer-login" />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          isLoggedIn ? <Dashboard /> : <Navigate to="/manufacturer-login" />
        }
      />

      <Route path="/verify" element={<Verify />} />
      <Route path="/transfer" element={<Transfer />} />

    </Routes>
  );
}
