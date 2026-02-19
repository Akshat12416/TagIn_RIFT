import { Routes, Route, Navigate } from "react-router-dom"
import { useState } from "react"

import Landing from "./pages/Landing"
import ManufacturerLogin from "./pages/ManufacturerLogin"
import Register from "./pages/RegisterProduct"
import Dashboard from "./pages/Dashboard"
import TransferOwnership from "./pages/TransferOwnership"
import ManufacturerNavbar from "./components/ManufacturerNavbar"

import Verify from "./pages/Verify"
import UserLogin from "./pages/UserLogin"
import Inventory from "./pages/Inventory"
import TransferHistory from "./pages/TransferHistory"

export default function App() {

  // -----------------------------
  // Manufacturer Auth
  // -----------------------------
  const [isManufacturerLoggedIn, setIsManufacturerLoggedIn] = useState(
    !!localStorage.getItem("manufacturer")
  )

  const [manufacturerAddress, setManufacturerAddress] = useState(
    localStorage.getItem("manufacturer")
  )

  // -----------------------------
  // User Auth
  // -----------------------------
  const [userAddress, setUserAddress] = useState(null)

  return (
    <Routes>

      {/* -------------------------------- */}
      {/* PUBLIC ROUTES */}
      {/* -------------------------------- */}

      <Route path="/" element={<Landing />} />
      <Route path="/verify" element={<Verify />} />

      {/* -------------------------------- */}
      {/* USER ROUTES */}
      {/* -------------------------------- */}

      <Route
        path="/user-login"
        element={
          <UserLogin setUserAddress={setUserAddress} />
        }
      />

<Route
  path="/inventory"
  element={
    <Inventory />
  }
/>

<Route
  path="/history/:tokenId"
  element={
    <TransferHistory />
  }
/>

      {/* -------------------------------- */}
      {/* MANUFACTURER ROUTES */}
      {/* -------------------------------- */}

      <Route
        path="/manufacturer-login"
        element={
          <ManufacturerLogin
            setIsLoggedIn={setIsManufacturerLoggedIn}
            setUserAddress={setManufacturerAddress}
          />
        }
      />

      <Route
        path="/register"
        element={
          isManufacturerLoggedIn ? (
            <>
              <ManufacturerNavbar />
              <Register userAddress={manufacturerAddress} />
            </>
          ) : (
            <Navigate to="/manufacturer-login" />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          isManufacturerLoggedIn ? (
            <>
              <ManufacturerNavbar />
              <Dashboard userAddress={manufacturerAddress} />
            </>
          ) : (
            <Navigate to="/manufacturer-login" />
          )
        }
      />

      <Route
        path="/transfer"
        element={
          isManufacturerLoggedIn ? (
            <>
              <ManufacturerNavbar />
              <TransferOwnership />
            </>
          ) : (
            <Navigate to="/manufacturer-login" />
          )
        }
      />

    </Routes>
  )
}
