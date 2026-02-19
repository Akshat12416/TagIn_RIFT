import React, { useState, useEffect } from "react"
import algosdk from "algosdk"
import axios from "axios"
import confetti from "canvas-confetti"
import { useSearchParams } from "react-router-dom"

const ALGOD_SERVER = "https://testnet-api.algonode.cloud"
const ALGOD_TOKEN = ""
const APP_ID = 755785502   // 🔥 your deployed app id

export default function Verify() {

  const [assetId, setAssetId] = useState("")
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const [searchParams] = useSearchParams()

  useEffect(() => {
    const id = searchParams.get("assetId")
    if (id) {
      setAssetId(id)
      verifyProduct(id, "nfc")
    }
  }, [])

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

      // 🔹 1️⃣ Fetch metadata hash from CONTRACT BOX

      const boxName = new Uint8Array([
        ...new TextEncoder().encode("PROD_"),
        ...algosdk.encodeUint64(Number(id))
      ])

      let box
      try {
        box = await algodClient
          .getApplicationBoxByName(APP_ID, boxName)
          .do()
      } catch (e) {
        setError("No on-chain record found for this Asset ID.")
        return
      }

      const rawValue = new Uint8Array(box.value)

      if (rawValue.length < 32) {
        setError("Corrupted on-chain metadata.")
        return
      }

      const chainHash = rawValue.slice(0, 32)

      // 🔹 2️⃣ Fetch product from backend

      const res = await axios.get(
        `http://localhost:5000/api/product/${id}`
      )

      const product = res.data

      if (!product) {
        setError("Product not found in backend.")
        return
      }

      // 🔹 3️⃣ Recreate metadata hash locally

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

      // 🔹 DEBUG (can remove later)

      const toHex = (bytes) =>
        Array.from(bytes)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("")

      console.log("------ DEBUG HASH CHECK ------")
      console.log("Metadata JSON:", metadataJson)
      console.log("Local Hash:", toHex(localHash))
      console.log("On-Chain Hash:", toHex(chainHash))
      console.log("------------------------------")

      // 🔹 4️⃣ Compare

      const isVerified =
        localHash.length === chainHash.length &&
        localHash.every((v, i) => v === chainHash[i])

      const verificationResult = {
        isVerified,
        owner: product.owner,
        manufacturer: product.manufacturer,
        product
      }

      setResult(verificationResult)

      // 🔹 5️⃣ Log scan

      await axios.post("http://localhost:5000/api/scan", {
        tokenId: id,
        manufacturer: product.manufacturer,
        owner: product.owner,
        isVerified,
        source: source === "nfc" ? "nfc" : "manual",
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

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-6 py-12">

      <h1 className="text-4xl font-bold mb-8 text-center">
        Verify Product Authenticity
      </h1>

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
                <b>Manufacturer:</b> {result.manufacturer}
              </p>

              <p className="break-all">
                <b>Current Owner:</b> {result.owner}
              </p>

              <p>
                <b>Asset ID:</b> {result.product.tokenId}
              </p>

              <a
                href={`https://testnet.algoexplorer.io/asset/${result.product.tokenId}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                View on AlgoExplorer
              </a>

            </div>
          )}

        </div>
      )}

    </div>
  )
}
