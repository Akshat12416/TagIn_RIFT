import React from "react"
import { useWallet } from "@txnlab/use-wallet-react"
import { WalletButton } from "@txnlab/use-wallet-ui-react"
import { useNavigate } from "react-router-dom"

export default function UserLogin() {

  const { activeAccount } = useWallet()
  const navigate = useNavigate()

  const handleContinue = () => {
    if (!activeAccount?.address) return
    navigate("/inventory")
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">

      <div className="w-full max-w-md bg-neutral-100 p-10 rounded-3xl shadow-xl text-center space-y-6">

        <h1 className="text-3xl font-bold">
          User Login
        </h1>

        <p className="text-gray-600 text-sm">
          Connect your Algorand wallet to view your NFT inventory
        </p>

        <div className="flex justify-center">
          <WalletButton />
        </div>

        {/* 🔥 Only show continue if wallet connected */}
        {activeAccount?.address && (
          <button
            onClick={handleContinue}
            className="w-full bg-black text-white py-3 rounded-2xl font-medium"
          >
            Continue to Inventory
          </button>
        )}

      </div>
    </div>
  )
}
