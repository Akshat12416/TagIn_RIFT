import React, { useEffect, useState } from "react"
import algosdk from "algosdk"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useWallet } from "@txnlab/use-wallet-react"

const ALGOD_SERVER = "https://testnet-api.algonode.cloud"
const ALGOD_TOKEN = ""

export default function Inventory() {

  const { activeAccount } = useWallet()
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const fetchInventory = async () => {


      if (!activeAccount?.address) {
        setLoading(false)
        return
      }


      try {

        const algodClient = new algosdk.Algodv2(
          ALGOD_TOKEN,
          ALGOD_SERVER,
          ""
        )

        // 🔥 1️⃣ Fetch account info
        const accountInfo = await algodClient
          .accountInformation(activeAccount.address)
          .do()


        const ownedAssets = accountInfo.assets || []


        // 🔥 2️⃣ Filter assets with amount > 0
const ownedAssetIds = ownedAssets
  .filter(asset => asset.amount > 0n) // BigInt comparison
  .map(asset => {

    const id = asset["asset-id"] || asset.assetId

    // 🔥 Convert BigInt → Number
    return Number(id)
  })
  .filter(id => !isNaN(id))



        if (ownedAssetIds.length === 0) {
          setProducts([])
          setLoading(false)
          return
        }

        // 🔥 3️⃣ Fetch products from backend
        const backendProducts = await Promise.all(
          ownedAssetIds.map(async (id) => {
            try {

              const res = await axios.get(
                `https://taginriftbackend1.onrender.com/api/product/${id}`
              )


              return res.data

            } catch (err) {
              return null
            }
          })
        )

        const validProducts = backendProducts.filter(p => p !== null)


        setProducts(validProducts)

      } catch (err) {
      } finally {
        setLoading(false)
      }
    }

    fetchInventory()

  }, [activeAccount])

  // 🔥 Protect page if wallet not connected
  if (!activeAccount?.address) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-['ClashDisplay']">
        <div className="text-center space-y-4">
          <p className="text-white/60 text-lg">Wallet not connected</p>
          <button
            onClick={() => navigate("/user-login")}
            className="bg-[#5282E1] hover:bg-[#3d68bc] text-white px-8 py-3 rounded-2xl font-medium transition shadow-[0_0_20px_rgba(82,130,225,0.4)]"
          >
            Connect Wallet First
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-8 lg:p-12 font-['ClashDisplay']">

      <div className="max-w-7xl mx-auto">

        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-wide">
            Your Inventory
          </h2>
          <p className="text-xs font-mono text-white/40 break-all mt-2">
            {activeAccount.address}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-12 h-12 border-4 border-white/10 border-t-[#5282E1] rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-[#111111] border border-white/10 rounded-3xl p-16 text-center">
            <p className="text-white/40 text-lg">No verified products found in your wallet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div
                key={product.tokenId}
                className="bg-[#111111] border border-white/10 hover:border-[#5282E1]/40 p-6 rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(82,130,225,0.15)] relative overflow-hidden group"
              >
                {/* Card glow */}
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#5282E1]/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-[#5282E1]"></div>
                  <h3 className="text-lg font-bold tracking-wide truncate">
                    {product.product_name}
                  </h3>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-white/50 text-sm">Token ID</span>
                    <span className="text-sm font-mono text-white/90">{product.tokenId}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-white/50 text-sm">Model</span>
                    <span className="text-sm text-white/90">{product.model}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-white/50 text-sm">Serial</span>
                    <span className="text-sm text-white/90">{product.serial_number}</span>
                  </div>
                </div>

                <button
                  className="w-full bg-white/10 hover:bg-[#5282E1] border border-white/10 hover:border-[#5282E1] text-white px-6 py-3 rounded-2xl transition-all font-medium tracking-wide relative z-10"
                  onClick={() => navigate(`/history/${product.tokenId}`)}
                >
                  View Transfer History
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
