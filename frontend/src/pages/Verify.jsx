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
      if (!id || isNaN(id)) {
        setError("Invalid Asset ID")
        return
      }

      const algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_SERVER, "")

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

      const res = await axios.get(
        `https://taginriftbackend1.onrender.com/api/product/${id}`
      )

      const product = res.data

      if (!product) {
        setError("Product not found in backend.")
        return
      }

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
        confetti({ particleCount: 120, spread: 70, colors: ["#5282E1", "#fff", "#82a8f4"] })
      }

    } catch (err) {
      setError("Verification failed")
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = () => verifyProduct(assetId, "manual")

  return (
    <div className="min-h-screen bg-black text-white font-['ClashDisplay']">

      {/* NAVBAR */}
      <nav className="w-full border-b border-white/10 bg-black/80 backdrop-blur px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1
          onClick={() => navigate("/")}
          className="text-xl font-bold cursor-pointer tracking-wide"
        >
          Tag<span className="text-[#5282E1]">In</span>
        </h1>

        <button
          onClick={() => navigate("/user-login")}
          className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-5 py-2 rounded-xl hover:border-white/20 transition text-sm tracking-wide"
        >
          User Login
        </button>
      </nav>

      {/* MAIN */}
      <div className="flex flex-col items-center px-6 py-16">

        <div className="w-full max-w-xl text-center mb-10">
          <h2 className="text-4xl font-bold mb-3 tracking-wide">
            Verify Authenticity
          </h2>
          <p className="text-white/40 text-sm">
            Enter an Asset ID to verify your product on the Algorand blockchain
          </p>
        </div>

        <div className="bg-[#111111] border border-white/10 rounded-3xl p-8 w-full max-w-xl space-y-5 relative overflow-hidden">

          <div className="absolute -top-20 -left-20 w-56 h-56 bg-[#5282E1]/10 rounded-full blur-[80px] pointer-events-none"></div>

          <input
            type="number"
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
            placeholder="Enter Asset ID"
            className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 px-4 py-3 rounded-xl focus:outline-none focus:border-[#5282E1] focus:ring-1 focus:ring-[#5282E1] transition relative z-10"
          />

          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-[#5282E1] hover:bg-[#3d68bc] disabled:opacity-60 text-white py-3 rounded-2xl font-medium tracking-wide transition shadow-[0_0_20px_rgba(82,130,225,0.35)] relative z-10"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Verifying on-chain...
              </span>
            ) : "Verify"}
          </button>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl relative z-10">
              ⚠ {error}
            </p>
          )}
        </div>

        {/* RESULT */}
        {result && (
          <div className={`mt-10 rounded-3xl border p-8 max-w-xl w-full transition-all ${
            result.isVerified
              ? "bg-[#111111] border-[#5282E1]/30 shadow-[0_0_40px_rgba(82,130,225,0.15)]"
              : "bg-[#111111] border-red-500/20"
          }`}>

            <div className="flex items-center justify-center gap-3 mb-8">
              {result.isVerified ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-[#5282E1]/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#5282E1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-[#5282E1]">Product Verified</h2>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-red-400">Verification Failed</h2>
                </>
              )}
            </div>

            {result.isVerified && (
              <div className="space-y-3">
                {[
                  { label: "Product Name", value: result.product.product_name },
                  { label: "Serial Number", value: result.product.serial_number },
                  { label: "Model", value: result.product.model },
                  { label: "Type", value: result.product.type },
                  { label: "Color", value: result.product.color },
                  { label: "Manufacture Date", value: result.product.manufacture_date },
                  { label: "Current Owner", value: result.product.owner, mono: true },
                ].map(({ label, value, mono }) => (
                  <div key={label} className="flex justify-between items-start p-3 bg-white/5 border border-white/5 rounded-xl">
                    <span className="text-white/40 text-sm">{label}</span>
                    <span className={`text-sm text-right max-w-[60%] break-all ${mono ? "font-mono text-white/60" : "text-white"}`}>
                      {value}
                    </span>
                  </div>
                ))}

                <div className="pt-4 border-t border-white/10 mt-4">
                  <a
                    href={`https://lora.algokit.io/testnet/asset/${result.assetId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#5282E1] hover:bg-[#3d68bc] text-white px-5 py-2.5 rounded-xl transition text-sm font-medium tracking-wide"
                  >
                    View on Algokit Explorer
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
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