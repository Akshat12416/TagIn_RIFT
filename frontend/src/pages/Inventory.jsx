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

      console.log("===== INVENTORY DEBUG START =====")

      if (!activeAccount?.address) {
        console.log("No wallet connected")
        setLoading(false)
        return
      }

      console.log("Connected Wallet:", activeAccount.address)

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

        console.log("Full Account Info:", accountInfo)

        const ownedAssets = accountInfo.assets || []

        console.log("All Assets in Wallet:", ownedAssets)

        // 🔥 2️⃣ Filter assets with amount > 0
const ownedAssetIds = ownedAssets
  .filter(asset => asset.amount > 0n) // BigInt comparison
  .map(asset => {
    console.log("Asset Object:", asset)

    const id = asset["asset-id"] || asset.assetId

    // 🔥 Convert BigInt → Number
    return Number(id)
  })
  .filter(id => !isNaN(id))


        console.log("Filtered Owned Asset IDs:", ownedAssetIds)

        if (ownedAssetIds.length === 0) {
          console.log("No assets with balance > 0")
          setProducts([])
          setLoading(false)
          return
        }

        // 🔥 3️⃣ Fetch products from backend
        const backendProducts = await Promise.all(
          ownedAssetIds.map(async (id) => {
            try {
              console.log("Fetching backend product for Asset ID:", id)

              const res = await axios.get(
                `https://taginriftbackend1.onrender.com/api/product/${id}`
              )

              console.log("Backend Response for", id, ":", res.data)

              return res.data

            } catch (err) {
              console.log("No backend product found for asset:", id)
              return null
            }
          })
        )

        const validProducts = backendProducts.filter(p => p !== null)

        console.log("Final Valid Products:", validProducts)

        setProducts(validProducts)

      } catch (err) {
        console.error("Inventory Fetch Error:", err)
      } finally {
        setLoading(false)
        console.log("===== INVENTORY DEBUG END =====")
      }
    }

    fetchInventory()

  }, [activeAccount])

  // 🔥 Protect page if wallet not connected
  if (!activeAccount?.address) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button
          onClick={() => navigate("/user-login")}
          className="bg-black text-white px-6 py-3 rounded-xl"
        >
          Connect Wallet First
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-8 lg:p-12">

      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-black">
            Your Inventory
          </h2>
          <p className="text-xs font-mono text-gray-500 break-all mt-2">
            {activeAccount.address}
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-12 text-center">
            <p className="text-gray-500 text-lg animate-pulse">
              Fetching your NFTs...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-12 text-center">
            <p className="text-gray-500 text-lg">
              No verified products found in your wallet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div
                key={product.tokenId}
                className="bg-white border border-gray-200 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <h3 className="text-2xl font-bold mb-4 text-black">
                  {product.product_name}
                </h3>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="font-semibold text-sm">Token ID:</span>
                    <span className="text-sm font-mono">{product.tokenId}</span>
                  </div>

                  <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="font-semibold text-sm">Model:</span>
                    <span className="text-sm">{product.model}</span>
                  </div>

                  <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="font-semibold text-sm">Serial:</span>
                    <span className="text-sm">{product.serial_number}</span>
                  </div>
                </div>

                <button
                  className="w-full bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-xl transition-all font-medium"
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
