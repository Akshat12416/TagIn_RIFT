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
    toast.error("Connect wallet first")
    return
  }

  if (!assetId || !receiver) {
    toast.error("Fill all fields")
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

    const txn =
      algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        sender: activeAccount.address,   // ✅ correct
        receiver: receiver,
        amount: 1,
        assetIndex: Number(assetId),
        suggestedParams: params,
      })

    // ✅ DO NOT encode manually
    const signedTxns = await signTransactions([txn])

    const { txId } = await algodClient
      .sendRawTransaction(signedTxns)
      .do()

    await algosdk.waitForConfirmation(algodClient, txId, 4)

    toast.success("NFT transferred successfully!")

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
              type="text"
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
            className="w-full bg-black text-white py-4 rounded-2xl font-semibold"
          >
            {loading ? "Transferring..." : "Transfer NFT"}
          </button>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}
