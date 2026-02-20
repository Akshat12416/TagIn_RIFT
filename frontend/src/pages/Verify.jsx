import React, { useState, useEffect } from "react"
import algosdk from "algosdk"
import axios from "axios"
import confetti from "canvas-confetti"
import { useSearchParams, useNavigate, useParams } from "react-router-dom"

const ALGOD_SERVER = "https://testnet-api.algonode.cloud"
const ALGOD_TOKEN = ""
const APP_ID = 755785502

export default function Verify() {

  const [assetId, setAssetId] = useState("")
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const [searchParams] = useSearchParams()
  const { assetId: paramId } = useParams()
  const navigate = useNavigate()

  // ✅ AUTO DETECT NFC OR ROUTE PARAM
  useEffect(() => {
    const queryId = searchParams.get("assetId")

    if (paramId) {
      setAssetId(paramId)
      verifyProduct(paramId, "nfc")
    } else if (queryId) {
      setAssetId(queryId)
      verifyProduct(queryId, "nfc")
    }
  }, [paramId, searchParams])

  const sha256 = async (message) => {
    const msgBuffer = new TextEncoder().encode(message)
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer)
    return new Uint8Array(hashBuffer)
  }

  const verifyProduct = async (id, source = "manual") => {

    setError("")
    setResult(null)
    setLoading(true)

    try {

      if (!id || isNaN(id)) {
        setError("Invalid Asset ID")
        return
      }

      const algodClient = new algosdk.Algodv2(
        ALGOD_TOKEN,
        ALGOD_SERVER,
        ""
      )

      // 🔹 Fetch hash from contract box
      const boxName = new Uint8Array([
        ...new TextEncoder().encode("PROD_"),
        ...algosdk.encodeUint64(Number(id))
      ])

      let box
      try {
        box = await algodClient
          .getApplicationBoxByName(APP_ID, boxName)
          .do()
      } catch {
        setError("No on-chain record found for this Asset ID.")
        return
      }

      const rawValue = new Uint8Array(box.value)
      const chainHash = rawValue.slice(0, 32)

      // 🔹 Fetch backend product
      const res = await axios.get(
        `https://taginriftbackend1.onrender.com/api/product/${id}`
      )

      const product = res.data

      if (!product) {
        setError("Product not found in backend.")
        return
      }

      // 🔹 Recreate metadata
      const metadata = {
        product_name: product.product_name,
        serial_number: product.serial_number,
        model: product.model,
        type: product.type,
        color: product.color,
        manufacture_date: product.manufacture_date,
        manufacturer: product.manufacturer
      }

      const metadataJson = JSON.stringify(
        metadata,
        Object.keys(metadata).sort()
      )

      const localHash = await sha256(metadataJson)

      const isVerified =
        localHash.length === chainHash.length &&
        localHash.every((v, i) => v === chainHash[i])

      setResult({
        isVerified,
        product,
        assetId: id
      })

      // 🔹 Log scan
      await axios.post("https://taginriftbackend1.onrender.com/api/scan", {
        tokenId: id,
        manufacturer: product.manufacturer,
        owner: product.owner,
        isVerified,
        source,
        timestamp: new Date().toISOString()
      })

      if (isVerified) {
        confetti({ particleCount: 120, spread: 70 })
      }

    } catch (err) {
      console.error(err)
      setError("Verification failed")
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = () => {
    verifyProduct(assetId, "manual")
  }

  const handleUserLogin = () => {
    navigate("/user-login")
  }

  return (
    <div className="min-h-screen bg-white">

      {/* NAVBAR */}
      <nav className="w-full border-b bg-white px-6 py-4 flex justify-between items-center">
        <h1
          onClick={() => navigate("/")}
          className="text-xl font-bold cursor-pointer"
        >
          ProductVerify
        </h1>

        <button
          onClick={handleUserLogin}
          className="bg-black text-white px-5 py-2 rounded-xl hover:bg-gray-800 transition"
        >
          User Login
        </button>
      </nav>

      {/* MAIN */}
      <div className="flex flex-col items-center px-6 py-12">

        <h2 className="text-4xl font-bold mb-8 text-center">
          Verify Product Authenticity
        </h2>

        <div className="bg-neutral-100 p-8 rounded-2xl w-full max-w-xl space-y-6">

          <input
            type="number"
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
            placeholder="Enter Asset ID"
            className="w-full px-4 py-3 border rounded-xl"
          />

          <button
            onClick={handleVerify}
            className="w-full bg-black text-white py-3 rounded-xl"
          >
            Verify
          </button>

          {loading && <p>Verifying...</p>}
          {error && <p className="text-red-500">{error}</p>}
        </div>

        {result && (
          <div className="mt-10 bg-white border rounded-2xl shadow p-8 max-w-2xl w-full">

            <h2 className="text-2xl font-bold mb-6 text-center">
              {result.isVerified
                ? "Product Verified ✅"
                : "Product Verification Failed ❌"}
            </h2>

            {result.isVerified && (
              <div className="space-y-4 text-sm">

                <p><b>Product Name:</b> {result.product.product_name}</p>
                <p><b>Serial Number:</b> {result.product.serial_number}</p>
                <p><b>Model:</b> {result.product.model}</p>
                <p><b>Type:</b> {result.product.type}</p>
                <p><b>Color:</b> {result.product.color}</p>
                <p><b>Manufacture Date:</b> {result.product.manufacture_date}</p>

                <p className="break-all">
                  <b>Current Owner:</b> {result.product.owner}
                </p>

                {/* ✅ NEW: Direct Algokit Explorer Link */}
                <div className="pt-4 border-t">
                  <a
                    href={`https://lora.algokit.io/testnet/asset/${result.assetId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-black text-white px-5 py-2 rounded-xl hover:bg-gray-800 transition text-sm"
                  >
                    View On Algokit Explorer
                  </a>
                </div>

              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}