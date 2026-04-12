import React, { useState, useEffect } from "react"
import algosdk from "algosdk"
import axios from "axios"
import confetti from "canvas-confetti"
import { useSearchParams, useNavigate, useParams } from "react-router-dom"

const ALGOD_SERVER = "https://testnet-api.algonode.cloud"
const ALGOD_TOKEN = ""
const APP_ID = 758713172

export default function Verify() {

  const [assetId, setAssetId] = useState("")
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const [searchParams] = useSearchParams()
  const { assetId: paramId } = useParams()
  const navigate = useNavigate()

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
      if (!id || isNaN(id)) { setError("Invalid Asset ID"); return }

      const algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_SERVER, "")

      const boxName = new Uint8Array([
        ...new TextEncoder().encode("PROD_"),
        ...algosdk.encodeUint64(Number(id))
      ])

      let box
      try {
        box = await algodClient.getApplicationBoxByName(APP_ID, boxName).do()
      } catch {
        setError("No on-chain record found for this Asset ID.")
        return
      }

      const rawValue = new Uint8Array(box.value)
      const chainHash = rawValue.slice(0, 32)

      const res = await axios.get(`https://taginriftbackend1.onrender.com/api/product/${id}`)
      const product = res.data

      if (!product) { setError("Product not found in backend."); return }

      const metadata = {
        product_name: product.product_name,
        serial_number: product.serial_number,
        model: product.model,
        type: product.type,
        color: product.color,
        manufacture_date: product.manufacture_date,
        manufacturer: product.manufacturer
      }

      const metadataJson = JSON.stringify(metadata, Object.keys(metadata).sort())
      const localHash = await sha256(metadataJson)

      const isVerified =
        localHash.length === chainHash.length &&
        localHash.every((v, i) => v === chainHash[i])

      setResult({ isVerified, product, assetId: id })

      await axios.post("https://taginriftbackend1.onrender.com/api/scan", {
        tokenId: id,
        manufacturer: product.manufacturer,
        owner: product.owner,
        isVerified,
        source,
        timestamp: new Date().toISOString()
      })

      if (isVerified) {
        confetti({ particleCount: 100, spread: 70, colors: ["#5282E1", "#fff", "#888"] })
      }

    } catch (err) {
      setError("Verification failed")
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = () => verifyProduct(assetId, "manual")

  return (
    <div className="min-h-screen bg-black">

      {/* Navbar */}
      <nav className="w-full bg-black border-b border-white/5 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 onClick={() => navigate("/")} className="text-sm font-semibold text-white cursor-pointer tracking-wide">
          TAG-IN
        </h1>
        <button
          onClick={() => navigate("/user-login")}
          className="text-xs font-medium text-white/40 hover:text-white transition-colors"
        >
          Login →
        </button>
      </nav>

      {/* Main */}
      <div className="flex flex-col items-center px-6 py-16">

        <div className="w-full max-w-md text-center mb-10">
          <h2 className="text-2xl font-semibold text-white mb-2">Verify Product</h2>
          <p className="text-white/30 text-sm">
            Cryptographically verify authenticity on-chain.
          </p>
        </div>

        {/* Input */}
        <div className="border border-white/10 rounded-xl p-6 w-full max-w-md space-y-4">

          <input
            type="number"
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
            placeholder="Enter Asset ID"
            className="w-full bg-white/[0.03] border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-[#5282E1]/50 text-sm transition-colors"
          />

          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-[#5282E1] hover:bg-[#4272cc] disabled:opacity-40 text-white py-3 rounded-xl text-sm font-semibold transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Verifying…
              </span>
            ) : "Verify →"}
          </button>

          {error && (
            <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-4 py-2.5 rounded-lg">
              {error}
            </p>
          )}
        </div>

        {/* Result */}
        {result && (
          <div className={`mt-6 border rounded-xl p-6 max-w-md w-full ${
            result.isVerified
              ? "border-[#5282E1]/30 bg-[#5282E1]/5"
              : "border-red-400/30 bg-red-400/5"
          }`}>

            <div className="flex items-center gap-3 mb-6">
              {result.isVerified ? (
                <>
                  <div className="w-8 h-8 rounded-lg bg-[#5282E1]/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#5282E1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">Verified</h2>
                    <p className="text-[10px] text-white/30">Hash match confirmed</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-lg bg-red-400/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-red-400">Failed</h2>
                    <p className="text-[10px] text-white/30">Hash mismatch</p>
                  </div>
                </>
              )}
            </div>

            {result.isVerified && (
              <div className="space-y-0 divide-y divide-white/5">
                {[
                  { label: "Product", value: result.product.product_name },
                  { label: "Serial", value: result.product.serial_number },
                  { label: "Model", value: result.product.model },
                  { label: "Type", value: result.product.type },
                  { label: "Color", value: result.product.color },
                  { label: "Date", value: result.product.manufacture_date },
                  { label: "Owner", value: result.product.owner, mono: true },
                ].map(({ label, value, mono }) => (
                  <div key={label} className="flex justify-between py-2.5 text-xs">
                    <span className="text-white/30">{label}</span>
                    <span className={`text-right max-w-[60%] break-all ${mono ? "font-mono text-white/40" : "text-white/70"}`}>
                      {value}
                    </span>
                  </div>
                ))}

                <div className="pt-4">
                  <a
                    href={`https://lora.algokit.io/testnet/asset/${result.assetId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-[#5282E1] hover:text-white transition-colors"
                  >
                    View on Explorer ↗
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