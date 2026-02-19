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
        `http://localhost:5000/api/check-whitelist/${activeAccount.address}`
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">

        <h1 className="text-xl font-bold mb-6 text-center">
          Manufacturer Login
        </h1>

        <div className="flex justify-center mb-6">
          <WalletButton />
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white py-3 rounded-xl"
        >
          Login
        </button>

        <p className="text-center text-sm mt-4 text-gray-600">
          {status}
        </p>

      </div>
    </div>
  )
}
