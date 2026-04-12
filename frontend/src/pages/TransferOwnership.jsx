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

    if (!activeAccount?.address) { toast.error("Wallet not connected"); return }
    if (!assetId || !receiver) { toast.error("Please fill all fields"); return }
    if (!algosdk.isValidAddress(receiver)) { toast.error("Invalid Algorand address"); return }

    try {
      setLoading(true)

      const algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_SERVER, "")
      const params = await algodClient.getTransactionParams().do()

      const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        sender: activeAccount.address,
        receiver: receiver,
        amount: 1,
        assetIndex: Number(assetId),
        suggestedParams: params
      })

      const signedTxns = await signTransactions([txn])
      const { txid } = await algodClient.sendRawTransaction(signedTxns[0]).do()
      await algosdk.waitForConfirmation(algodClient, txid, 10)

      const pendingInfo = await algodClient.pendingTransactionInformation(txid).do()
      if (pendingInfo["pool-error"] && pendingInfo["pool-error"].length > 0) {
        throw new Error(pendingInfo["pool-error"])
      }

      await axios.post("https://taginriftbackend1.onrender.com/api/transfer", {
        tokenId: assetId, from: activeAccount.address, to: receiver, txId: txid, timestamp: new Date().toISOString()
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

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        <div className="flex justify-end mb-6">
          <CustomWalletButton />
        </div>

        <div className="border border-white/10 rounded-xl p-6 space-y-5">

          <h1 className="text-xl font-semibold text-white">Transfer Ownership</h1>

          <div className="space-y-3">
            <div>
              <label className="block mb-1.5 text-xs font-medium text-white/30 uppercase tracking-wider">Asset ID</label>
              <input
                type="number"
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-[#5282E1]/50 text-sm transition-colors"
                placeholder="Enter Asset ID"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-xs font-medium text-white/30 uppercase tracking-wider">Receiver</label>
              <input
                type="text"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-[#5282E1]/50 font-mono text-sm transition-colors"
                placeholder="Algorand address…"
              />
            </div>
          </div>

          <button
            onClick={handleTransfer}
            disabled={loading}
            className="w-full bg-[#5282E1] hover:bg-[#4272cc] disabled:opacity-40 text-white py-3 rounded-xl text-sm font-semibold transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Transferring…
              </span>
            ) : "Transfer NFT →"}
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
