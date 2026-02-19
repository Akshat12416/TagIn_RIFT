import { useWallet } from "@txnlab/use-wallet-react"
import { WalletButton } from "@txnlab/use-wallet-ui-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import axios from "axios"

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
      console.error(err)
      setStatus("Login failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-6">

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200">

        <h1 className="text-2xl font-semibold mb-2 text-center tracking-wide">
          Manufacturer Login
        </h1>

        <p className="text-center text-sm text-gray-500 mb-8">
          Connect your Algorand wallet to continue
        </p>

        {/* Wallet Connect Section */}
        <div className="flex justify-center mb-8">
        <div className="flex justify-center mb-8">
        <WalletButton className="!bg-black !text-white !rounded-2xl !px-6 !py-3 hover:!bg-gray-900 transition" />
        </div>

        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-black hover:bg-gray-900 transition text-white py-3 rounded-2xl font-medium shadow-md"
        >
          Continue
        </button>

        {status && (
          <p className="text-center text-sm mt-6 text-red-500">
            {status}
          </p>
        )}

      </div>
    </div>
  )
}
