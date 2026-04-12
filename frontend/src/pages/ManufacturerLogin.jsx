import { useWallet } from "@txnlab/use-wallet-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import axios from "axios"
import CustomWalletButton from "../components/CustomWalletButton"

export default function ManufacturerLogin() {

  const { activeAccount } = useWallet()
  const navigate = useNavigate()
  const [status, setStatus] = useState("")

  const handleLogin = async () => {

    if (!activeAccount?.address) {
      setStatus("Connect wallet first")
      return
    }

    try {
      const res = await axios.get(
        `https://taginriftbackend1.onrender.com/api/check-whitelist/${activeAccount.address}`
      )

      if (res.data.allowed) {
        localStorage.setItem("manufacturer", activeAccount.address)
        navigate("/register")
      } else {
        setStatus("Wallet not whitelisted on-chain")
      }

    } catch (err) {
      setStatus("Login failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-6 text-white font-['ClashDisplay']">

      <div className="bg-[#111111] p-10 rounded-3xl shadow-xl w-full max-w-md border border-white/10 relative overflow-hidden">

        {/* Glow effect */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#5282E1]/20 rounded-full blur-[80px] pointer-events-none"></div>

        <h1 className="text-3xl font-semibold mb-2 text-center tracking-wide relative z-10">
          Manufacturer Login
        </h1>

        <p className="text-center text-sm text-white/50 mb-8 tracking-wide relative z-10">
          Connect your Algorand wallet to continue
        </p>

        {/* Wallet Connect Section */}
        <div className="flex justify-center mb-8 relative z-10">
          <CustomWalletButton />
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-[#5282E1] hover:bg-[#3d68bc] transition text-white py-3 rounded-2xl font-medium tracking-wide shadow-[0_0_15px_rgba(82,130,225,0.3)] relative z-10"
        >
          Continue
        </button>

        {status && (
          <p className="text-center text-sm mt-6 text-[#ef4444] bg-white/5 py-2 rounded-xl border border-red-500/20 relative z-10">
            {status}
          </p>
        )}

      </div>
    </div>
  )
}
