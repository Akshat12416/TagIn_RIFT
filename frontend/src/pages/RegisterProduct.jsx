import { useState } from "react"
import { useWallet } from "@txnlab/use-wallet-react"
import algosdk from "algosdk"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import CustomWalletButton from "../components/CustomWalletButton"

const ALGOD_SERVER = "https://testnet-api.algonode.cloud"
const ALGOD_TOKEN = ""
const APP_ID = 758713172   

// 🔥 Hardcoded Demo Data
const DEMO_DATA = {
  name: "Rolex Submariner",
  serial: "RX-2026-7788",
  model: "Luxury Edition",
  type: "Watch",
  color: "Gold",
  manufactureDate: "20-02-2026"
}

export default function RegisterProduct() {

  const { activeAccount, signTransactions } = useWallet()

  const [form, setForm] = useState({
    name: "",
    serial: "",
    model: "",
    type: "",
    color: "",
    manufactureDate: ""
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFillDemo = () => {
    setForm(DEMO_DATA)
    toast.info("Demo data filled")
  }

  const handleRegister = async () => {

    if (!activeAccount?.address) {
      toast.error("Connect wallet first")
      return
    }

    try {
      setLoading(true)

      const metadata = {
        product_name: form.name,
        serial_number: form.serial,
        model: form.model,
        type: form.type,
        color: form.color,
        manufacture_date: form.manufactureDate,
        manufacturer: activeAccount.address
      }

      const metadataJson = JSON.stringify(metadata, Object.keys(metadata).sort())

      const msgBuffer = new TextEncoder().encode(metadataJson)
      const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer)
      const metadataHash = new Uint8Array(hashBuffer)

      const algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_SERVER, "")
      const params = await algodClient.getTransactionParams().do()

      const assetTxn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        sender: activeAccount.address,
        total: 1,
        decimals: 0,
        assetName: "VerifiedProduct",
        unitName: "VPRD",
        defaultFrozen: false,
        manager: activeAccount.address,
        suggestedParams: params,
        metadataHash: metadataHash
      })

      const signedAsset = await signTransactions([assetTxn])

      const { txid: assetTxId } = await algodClient
        .sendRawTransaction(signedAsset[0])
        .do()

      await algosdk.waitForConfirmation(algodClient, assetTxId, 4)

      const pendingInfo = await algodClient
        .pendingTransactionInformation(assetTxId)
        .do()

      const assetId = Number(pendingInfo.assetIndex)

      if (!assetId) throw new Error("Asset creation failed")

      const wlBoxName = new Uint8Array([
        ...new TextEncoder().encode("WL_"),
        ...algosdk.decodeAddress(activeAccount.address).publicKey
      ])

      const prodBoxName = new Uint8Array([
        ...new TextEncoder().encode("PROD_"),
        ...algosdk.encodeUint64(assetId)
      ])

      const appTxn = algosdk.makeApplicationNoOpTxnFromObject({
        sender: activeAccount.address,
        appIndex: APP_ID,
        suggestedParams: params,
        appArgs: [
          new Uint8Array([210, 186, 254, 49]),
          new Uint8Array([0, 8, ...algosdk.encodeUint64(assetId)]),
          new Uint8Array([0, 32, ...metadataHash])
        ],
        boxes: [
          { appIndex: APP_ID, name: wlBoxName },
          { appIndex: APP_ID, name: prodBoxName }
        ]
      })

      const signedApp = await signTransactions([appTxn])

      const { txid: appTxId } = await algodClient
        .sendRawTransaction(signedApp[0])
        .do()

      await algosdk.waitForConfirmation(algodClient, appTxId, 4)

      const base64Hash = btoa(String.fromCharCode(...metadataHash))

      await axios.post("https://taginriftbackend1.onrender.com/api/mint", {
        ...metadata,
        tokenId: assetId,
        metadataHash: base64Hash,
        manufacturer: activeAccount.address
      })

      toast.success(`Product Registered! Asset ID: ${assetId}`)

      setForm({
        name: "",
        serial: "",
        model: "",
        type: "",
        color: "",
        manufactureDate: ""
      })

    } catch (err) {
      toast.error("Registration failed: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { name: "name", placeholder: "Product Name", type: "text" },
    { name: "serial", placeholder: "Serial Number", type: "text" },
    { name: "model", placeholder: "Model", type: "text" },
    { name: "type", placeholder: "Product Type", type: "text" },
    { name: "color", placeholder: "Color", type: "text" },
    { name: "manufactureDate", placeholder: "Manufacture Date", type: "date" },
  ]

  return (
    <div className="min-h-screen bg-black px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-semibold text-white">Register Product</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handleFillDemo}
              className="text-xs font-medium text-white/30 hover:text-white/60 transition-colors"
            >
              Fill Demo
            </button>
            <CustomWalletButton />
          </div>
        </div>

        {/* Form */}
        <div className="border border-white/10 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fields.map(f => (
              <input
                key={f.name}
                name={f.name}
                type={f.type}
                value={form[f.name]}
                onChange={handleChange}
                placeholder={f.placeholder}
                className="w-full bg-white/[0.03] border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-[#5282E1]/50 text-sm transition-colors [color-scheme:dark]"
              />
            ))}
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-[#5282E1] hover:bg-[#4272cc] disabled:opacity-40 text-white py-3 rounded-xl text-sm font-semibold transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Registering…
              </span>
            ) : "Register Product →"}
          </button>
        </div>

      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        toastStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: "12px", fontSize: "13px" }}
      />
    </div>
  )
}
