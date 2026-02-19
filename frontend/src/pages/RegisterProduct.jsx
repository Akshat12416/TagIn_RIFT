import { useState } from "react"
import { useWallet } from "@txnlab/use-wallet-react"
import { WalletButton } from "@txnlab/use-wallet-ui-react"
import algosdk from "algosdk"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const ALGOD_SERVER = "https://testnet-api.algonode.cloud"
const ALGOD_TOKEN = ""
const APP_ID = 755785502   // 🔥 Your deployed App ID

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

  const handleRegister = async () => {

    if (!activeAccount?.address) {
      toast.error("Connect wallet first")
      return
    }

    try {
      setLoading(true)

      // -----------------------------------------
      // 1️⃣ PREPARE METADATA + HASH
      // -----------------------------------------

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

      // -----------------------------------------
      // 2️⃣ STEP ONE — CREATE NFT
      // -----------------------------------------

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

      console.log("Asset Pending Info:", pendingInfo)

      const assetId = Number(pendingInfo.assetIndex)

      if (!assetId) {
        throw new Error("Asset creation failed")
      }

      // -----------------------------------------
      // 3️⃣ STEP TWO — CALL SMART CONTRACT
      // -----------------------------------------

      // WL_<address>  (uses raw public key bytes)
      const wlBoxName = new Uint8Array([
        ...new TextEncoder().encode("WL_"),
        ...algosdk.decodeAddress(activeAccount.address).publicKey
      ])

      // PROD_<assetId>
      const prodBoxName = new Uint8Array([
        ...new TextEncoder().encode("PROD_"),
        ...algosdk.encodeUint64(assetId)
      ])

      const appTxn = algosdk.makeApplicationNoOpTxnFromObject({
        sender: activeAccount.address,
        appIndex: APP_ID,
        suggestedParams: params,
        appArgs: [
          new TextEncoder().encode("mint"),
          algosdk.encodeUint64(assetId),
          metadataHash
        ],
        boxes: [
          {
            appIndex: APP_ID,
            name: wlBoxName
          },
          {
            appIndex: APP_ID,
            name: prodBoxName
          }
        ]
      })

      const signedApp = await signTransactions([appTxn])

      const { txid: appTxId } = await algodClient
        .sendRawTransaction(signedApp[0])
        .do()

      await algosdk.waitForConfirmation(algodClient, appTxId, 4)

      // -----------------------------------------
      // 4️⃣ STORE IN DATABASE
      // -----------------------------------------

      const base64Hash = btoa(String.fromCharCode(...metadataHash))

      await axios.post("http://localhost:5000/api/mint", {
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
      console.error(err)
      toast.error("Registration failed: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10">

      <div className="flex justify-end mb-6">
        <WalletButton />
      </div>

      <div className="max-w-2xl mx-auto bg-neutral-100 p-8 rounded-2xl space-y-6">

        <h1 className="text-3xl font-semibold text-center">
          Register Product
        </h1>

        <input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" className="w-full px-4 py-3 border rounded-xl" />
        <input name="serial" value={form.serial} onChange={handleChange} placeholder="Serial Number" className="w-full px-4 py-3 border rounded-xl" />
        <input name="model" value={form.model} onChange={handleChange} placeholder="Model" className="w-full px-4 py-3 border rounded-xl" />
        <input name="type" value={form.type} onChange={handleChange} placeholder="Product Type" className="w-full px-4 py-3 border rounded-xl" />
        <input name="color" value={form.color} onChange={handleChange} placeholder="Color" className="w-full px-4 py-3 border rounded-xl" />
        <input name="manufactureDate" value={form.manufactureDate} onChange={handleChange} placeholder="Manufacture Date" className="w-full px-4 py-3 border rounded-xl" />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-2xl font-semibold"
        >
          {loading ? "Registering..." : "Register Product"}
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}
