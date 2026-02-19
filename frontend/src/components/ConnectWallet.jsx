import { useWallet } from "@txnlab/use-wallet-react"
import { WalletButton } from "@txnlab/use-wallet-ui-react"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"

export default function ManufacturerLogin() {

  const { activeAccount } = useWallet()
  const navigate = useNavigate()
  const [status, setStatus] = useState("")

  useEffect(() => {
    if (!activeAccount?.address) return

    const checkWhitelist = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/manufacturer/${activeAccount.address}`
        )

        if (res.data.allowed) {
          localStorage.setItem("manufacturer", activeAccount.address)
          navigate("/register")
        } else {
          setStatus("Not whitelisted")
        }

      } catch (err) {
        console.error(err)
        setStatus("Login failed")
      }
    }

    checkWhitelist()

  }, [activeAccount])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md space-y-6">

        <h1 className="text-xl font-bold text-center">
          Manufacturer Login
        </h1>

        <div className="flex justify-center">
          <WalletButton />
        </div>

        {activeAccount && (
          <p className="text-xs font-mono text-center break-all">
            {activeAccount.address}
          </p>
        )}

        {status && (
          <p className="text-center text-sm text-red-500">
            {status}
          </p>
        )}

      </div>
    </div>
  )
}
