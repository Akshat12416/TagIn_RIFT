import React, { useState } from "react"
import algosdk from "algosdk"
import axios from "axios"
import { useWallet } from "@txnlab/use-wallet-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import CustomWalletButton from "../components/CustomWalletButton"

const ALGOD_SERVER = "https://testnet-api.algonode.cloud"
const ALGOD_TOKEN = ""

export default function TransferOwnership() {

  const { activeAccount, signTransactions } = useWallet()

  const [assetId, setAssetId] = useState("")
  const [receiver, setReceiver] = useState("")
  const [loading, setLoading] = useState(false)

  const handleTransfer = async () => {

    if (!activeAccount?.address) {
      toast.error("Wallet not connected")
      return
    }

    if (!assetId || !receiver) {
      toast.error("Please fill all fields")
      return
    }

    if (!algosdk.isValidAddress(receiver)) {
      toast.error("Invalid Algorand address")
      return
    }

    try {
      setLoading(true)

      const algodClient = new algosdk.Algodv2(
        ALGOD_TOKEN,
        ALGOD_SERVER,
        ""
      )

      const params = await algodClient.getTransactionParams().do()

      const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        sender: activeAccount.address,
        receiver: receiver,
        amount: 1,
        assetIndex: Number(assetId),
        suggestedParams: params
      })

      const signedTxns = await signTransactions([txn])

      const { txid } = await algodClient
        .sendRawTransaction(signedTxns[0])
        .do()

      await algosdk.waitForConfirmation(algodClient, txid, 10)

      const pendingInfo = await algodClient
        .pendingTransactionInformation(txid)
        .do()

      if (pendingInfo["pool-error"] && pendingInfo["pool-error"].length > 0) {
        throw new Error(pendingInfo["pool-error"])
      }

      await axios.post("https://taginriftbackend1.onrender.com/api/transfer", {
        tokenId: assetId,
        from: activeAccount.address,
        to: receiver,
        txId: txid,
        timestamp: new Date().toISOString()
      })

      toast.success("NFT transferred & database updated!")

      setAssetId("")
      setReceiver("")

    } catch (err) {
      toast.error("Transfer failed: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-white/5 border border-white/10 text-white placeholder-white/30 px-4 py-3 rounded-xl focus:outline-none focus:border-[#5282E1] focus:ring-1 focus:ring-[#5282E1] transition"

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 font-['ClashDisplay'] text-white">

      <div className="w-full max-w-2xl">

        <div className="flex justify-end mb-8">
          <CustomWalletButton />
        </div>

        <div className="bg-[#111111] border border-white/10 rounded-3xl p-10 space-y-7 relative overflow-hidden">

          {/* Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#5282E1]/10 rounded-full blur-[80px] pointer-events-none"></div>

          <h1 className="text-3xl font-semibold tracking-wide relative z-10">
            Transfer Ownership
          </h1>

          <div className="relative z-10">
            <label className="block mb-2 text-sm text-white/50 tracking-wide">
              Asset ID
            </label>
            <input
              type="number"
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              className={inputClass}
              placeholder="Enter Asset ID"
            />
          </div>

          <div className="relative z-10">
            <label className="block mb-2 text-sm text-white/50 tracking-wide">
              Receiver Wallet Address
            </label>
            <input
              type="text"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              className={`${inputClass} font-mono`}
              placeholder="Algorand address..."
            />
          </div>

          <button
            onClick={handleTransfer}
            disabled={loading}
            className="w-full bg-[#5282E1] hover:bg-[#3d68bc] disabled:opacity-50 text-white py-4 rounded-2xl font-semibold tracking-wide transition shadow-[0_0_20px_rgba(82,130,225,0.3)] relative z-10"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Transferring...
              </span>
            ) : "Transfer NFT"}
          </button>

        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        toastStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
      />
    </div>
  )
}
