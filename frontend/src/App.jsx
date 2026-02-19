import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Landing from "./pages/Landing";
import ManufacturerLogin from "./pages/ManufacturerLogin";
import Register from "./pages/RegisterProduct";
import Verify from "./pages/Verify";
import Dashboard from "./pages/Dashboard";
import Transfer from "./pages/TransferOwnership";
import ManufacturerNavbar from "./components/ManufacturerNavbar";

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("manufacturer")
  );

  const [userAddress, setUserAddress] = useState(
    localStorage.getItem("manufacturer")
  );

  return (
    <Routes>

      {/* Public Routes */}
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

      <Route path="/verify" element={<Verify />} />
     

      {/* Protected Register Route */}
      <Route
        path="/register"
        element={
          isLoggedIn ? (
            <>
              <ManufacturerNavbar />
              <Register userAddress={userAddress} />
            </>
          ) : (
            <Navigate to="/manufacturer-login" />
          )
        }
      />

      {/* Protected Dashboard Route */}
      <Route
        path="/dashboard"
        element={
          isLoggedIn ? (
            <>
              <ManufacturerNavbar />
              <Dashboard userAddress={userAddress} />
            </>
          ) : (
            <Navigate to="/manufacturer-login" />
          )
        }
      />

      <Route
        path="/transfer"
        element={
          isLoggedIn ? (
            <>
              <ManufacturerNavbar />
              <Transfer userAddress={userAddress} />
            </>
          ) : (
            <Navigate to="/manufacturer-login" />
          )
        }
      />

    </Routes>
  );
}
