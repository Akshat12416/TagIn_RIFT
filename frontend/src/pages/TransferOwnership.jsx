import React, { useState } from "react"
import algosdk from "algosdk"
import axios from "axios"
import { useWallet } from "@txnlab/use-wallet-react"
import { WalletButton } from "@txnlab/use-wallet-ui-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

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

      // 🔥 Create Transfer Transaction
      const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        sender: activeAccount.address,
        receiver: receiver,
        amount: 1,
        assetIndex: Number(assetId),
        suggestedParams: params
      })

      // 🔥 Sign via wallet
      const signedTxns = await signTransactions([txn])

      // 🔥 Send to blockchain
      const { txid } = await algodClient
        .sendRawTransaction(signedTxns[0])
        .do()

      console.log("Transfer TxID:", txid)

      await algosdk.waitForConfirmation(algodClient, txid, 10)

      const pendingInfo = await algodClient
        .pendingTransactionInformation(txid)
        .do()

      if (pendingInfo["pool-error"] && pendingInfo["pool-error"].length > 0) {
        throw new Error(pendingInfo["pool-error"])
      }

      // =====================================================
      // 🔥 AFTER CONFIRMATION → UPDATE DATABASE
      // =====================================================

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
      console.error(err)
      toast.error("Transfer failed: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">

      <div className="w-full max-w-2xl">

        <div className="flex justify-end mb-6">
          <WalletButton />
        </div>

        <h1 className="text-4xl font-semibold text-center mb-8">
          Transfer Ownership
        </h1>

        <div className="bg-neutral-100 p-8 rounded-2xl border space-y-6">

          <div>
            <label className="block mb-2 text-sm font-medium">
              Asset ID
            </label>
            <input
              type="number"
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border"
              placeholder="Enter Asset ID"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Receiver Wallet Address
            </label>
            <input
              type="text"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border font-mono"
              placeholder="Algorand address..."
            />
          </div>

          <button
            onClick={handleTransfer}
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl font-semibold disabled:opacity-50"
          >
            {loading ? "Transferring..." : "Transfer NFT"}
          </button>

        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />

    </div>
  )
}
