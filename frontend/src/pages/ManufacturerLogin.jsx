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
    if (!activeAccount?.address) { setStatus("Connect wallet first"); return }

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
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">

        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5282E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/>
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-white mb-2">Manufacturer Login</h1>
        <p className="text-white/40 text-sm mb-10">Connect your whitelisted wallet to continue.</p>

        <div className="space-y-3">
          <CustomWalletButton />

          <button
            onClick={handleLogin}
            className="w-full bg-[#5282E1] hover:bg-[#4272cc] text-white py-3 rounded-xl text-sm font-semibold transition-colors"
          >
            Continue →
          </button>

          {status && (
            <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
              {status}
            </p>
          )}
        </div>

        <p className="text-white/20 text-xs mt-10">Only whitelisted wallets can access the dashboard.</p>
      </div>
    </div>
  )
}
