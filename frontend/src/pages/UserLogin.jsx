import React from "react"
import { useWallet } from "@txnlab/use-wallet-react"
import { useNavigate } from "react-router-dom"
import CustomWalletButton from "../components/CustomWalletButton"

export default function UserLogin() {

  const { activeAccount } = useWallet()
  const navigate = useNavigate()

  const handleContinue = () => {
    if (!activeAccount?.address) return
    navigate("/inventory")
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-white font-['ClashDisplay']">

      <div className="w-full max-w-md bg-[#111111] border border-white/10 p-10 rounded-3xl shadow-xl text-center space-y-6 relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#5282E1]/20 rounded-full blur-[80px] pointer-events-none"></div>

        <h1 className="text-3xl font-bold tracking-wide relative z-10">
          User Login
        </h1>

        <p className="text-white/60 text-sm tracking-wide leading-relaxed relative z-10">
          Connect your Algorand wallet to view your NFT inventory
        </p>

        <div className="flex justify-center relative z-10 pt-4">
          <CustomWalletButton />
        </div>

        {/* 🔥 Only show continue if wallet connected */}
        {activeAccount?.address && (
          <button
            onClick={handleContinue}
            className="w-full bg-white/10 hover:bg-white/20 transition text-white py-3 border border-white/20 rounded-2xl font-medium tracking-wide relative z-10 mt-6"
          >
            Continue to Inventory
          </button>
        )}

      </div>
    </div>
  )
}
