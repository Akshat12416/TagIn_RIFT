import React from "react"
import { useWallet } from "@txnlab/use-wallet-react"
import { useNavigate } from "react-router-dom"
import CustomWalletButton from "../components/CustomWalletButton"

export default function UserLogin() {
  const { activeAccount } = useWallet()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">

        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5282E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-white mb-2">Consumer Login</h1>
        <p className="text-white/40 text-sm mb-10">Connect your wallet to view your inventory.</p>

        <div className="space-y-3">
          <CustomWalletButton />

          {activeAccount?.address && (
            <button
              onClick={() => navigate("/inventory")}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-xl text-sm font-medium transition-colors"
            >
              Continue to Inventory →
            </button>
          )}
        </div>

        <p className="text-white/20 text-xs mt-10">Products sync automatically from your wallet.</p>
      </div>
    </div>
  )
}
