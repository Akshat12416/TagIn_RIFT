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

        const algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_SERVER, "")

        const accountInfo = await algodClient
          .accountInformation(activeAccount.address)
          .do()

        const ownedAssets = accountInfo.assets || []

        const ownedAssetIds = ownedAssets
          .filter(asset => asset.amount > 0n)
          .map(asset => {
            const id = asset["asset-id"] || asset.assetId
            return Number(id)
          })
          .filter(id => !isNaN(id))

        if (ownedAssetIds.length === 0) {
          setProducts([])
          setLoading(false)
          return
        }

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

  if (!activeAccount?.address) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-white/30 text-sm mb-6">Wallet not connected.</p>
          <button
            onClick={() => navigate("/user-login")}
            className="bg-[#5282E1] hover:bg-[#4272cc] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black px-6 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-1">Inventory</h1>
            <p className="text-white/30 text-xs font-mono">{activeAccount.address.slice(0, 10)}…{activeAccount.address.slice(-6)}</p>
          </div>
          <span className="text-xs font-medium text-white/40 bg-white/5 border border-white/10 px-4 py-2 rounded-lg">
            {products.length} items
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-32">
            <div className="w-8 h-8 border-2 border-white/10 border-t-white/60 rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-white/30 text-sm">No verified products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.tokenId}
                className="bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:bg-white/[0.05] hover:border-white/15 transition-all group"
              >
                {/* Top row */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white truncate mr-3">
                    {product.product_name}
                  </h3>
                  <span className="text-[#5282E1] font-mono text-xs shrink-0">#{product.tokenId}</span>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-5">
                  {[
                    { k: "Model", v: product.model },
                    { k: "Serial", v: product.serial_number },
                  ].map(({ k, v }) => (
                    <div key={k} className="flex justify-between text-xs">
                      <span className="text-white/30">{k}</span>
                      <span className="text-white/60 font-medium">{v}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button
                  onClick={() => navigate(`/history/${product.tokenId}`)}
                  className="w-full text-center text-xs font-medium text-white/40 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 py-2.5 rounded-lg transition-colors"
                >
                  View History →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
