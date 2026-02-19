import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useWallet } from "@txnlab/use-wallet-react"
import algosdk from "algosdk"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const ALGOD_SERVER = "https://testnet-api.algonode.cloud"
const ALGOD_TOKEN = ""

export default function TransferHistory() {

  const { tokenId } = useParams()
  const { activeAccount, signTransactions } = useWallet()

  const [history, setHistory] = useState([])
  const [receiver, setReceiver] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (tokenId) fetchHistory()
  }, [tokenId])

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        `https://taginriftbackend1.onrender.com/api/transfers/${tokenId}`
      )
      setHistory(res.data || [])
    } catch (err) {
      console.error("Failed to fetch history:", err)
      toast.error("Failed to load transfer history")
    }
  }

  const handleTransfer = async () => {

    if (!activeAccount?.address) {
      toast.error("Wallet not connected")
      return
    }

    if (!receiver) {
      toast.error("Please enter receiver address")
      return
    }

    if (!algosdk.isValidAddress(receiver)) {
      toast.error("Invalid Algorand address")
      return
    }

    setLoading(true)

    try {
      const algodClient = new algosdk.Algodv2(
        ALGOD_TOKEN,
        ALGOD_SERVER,
        ""
      )

      const params = await algodClient.getTransactionParams().do()

      const txn =
        algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          sender: activeAccount.address,
          receiver: receiver,
          amount: 1,
          assetIndex: Number(tokenId),
          suggestedParams: params
        })

      const signed = await signTransactions([txn])

      const { txid } = await algodClient
        .sendRawTransaction(signed[0])
        .do()

      await algosdk.waitForConfirmation(algodClient, txid, 10)

      const pendingInfo = await algodClient
        .pendingTransactionInformation(txid)
        .do()

      if (pendingInfo["pool-error"]?.length > 0) {
        throw new Error(pendingInfo["pool-error"])
      }

      // Update backend
      await axios.post("https://taginriftbackend1.onrender.com/api/transfer", {
        tokenId: tokenId,
        from: activeAccount.address,
        to: receiver,
        txId: txid,
        timestamp: new Date().toISOString()
      })

      toast.success("Ownership transferred successfully!")

      setReceiver("")
      fetchHistory()

    } catch (err) {
      console.error(err)
      toast.error("Transfer failed: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white p-10">

      <h1 className="text-3xl font-bold mb-8">
        Transfer History - {tokenId}
      </h1>

      {/* HISTORY SECTION */}
      <div className="space-y-4 mb-10">
        {history.length === 0 ? (
          <p className="text-gray-500">No transfer records found.</p>
        ) : (
          history.map((h, i) => (
            <div key={i} className="border p-4 rounded-xl">
              <p><b>From:</b> {h.from}</p>
              <p><b>To:</b> {h.to}</p>
              <p><b>Date:</b> {new Date(h.timestamp).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>

      {/* TRANSFER SECTION */}
      <div className="border p-6 rounded-2xl space-y-4">

        <h2 className="text-xl font-semibold">
          Transfer Ownership
        </h2>

        <input
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          placeholder="Receiver Address"
          className="w-full border px-4 py-3 rounded-xl font-mono text-sm"
        />

        <button
          onClick={handleTransfer}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl disabled:opacity-50"
        >
          {loading ? "Transferring..." : "Transfer"}
        </button>

      </div>

      <ToastContainer position="top-right" autoClose={3000} />

    </div>
  )
}
