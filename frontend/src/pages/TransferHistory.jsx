import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useWallet } from "@txnlab/use-wallet-react"
import algosdk from "algosdk"
import axios from "axios"

const ALGOD_SERVER = "https://testnet-api.algonode.cloud"
const ALGOD_TOKEN = ""

export default function TransferHistory() {

  const { tokenId } = useParams()
  const { activeAccount, signTransactions } = useWallet()

  const [history, setHistory] = useState([])
  const [receiver, setReceiver] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/transfers/${tokenId}`
    )
    setHistory(res.data)
  }

  const handleTransfer = async () => {

    if (!activeAccount) return

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

      await algosdk.waitForConfirmation(algodClient, txid, 4)

      await axios.post("http://localhost:5000/api/transfer", {
        tokenId,
        from: activeAccount.address,
        to: receiver,
        timestamp: new Date().toISOString()
      })

      fetchHistory()

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white p-10">

      <h1 className="text-3xl font-bold mb-8">
        Transfer History - {tokenId}
      </h1>

      <div className="space-y-4 mb-10">
        {history.map((h, i) => (
          <div key={i} className="border p-4 rounded-xl">
            <p><b>From:</b> {h.from}</p>
            <p><b>To:</b> {h.to}</p>
            <p><b>Date:</b> {new Date(h.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="border p-6 rounded-2xl space-y-4">

        <h2 className="text-xl font-semibold">
          Transfer Ownership
        </h2>

        <input
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          placeholder="Receiver Address"
          className="w-full border px-4 py-3 rounded-xl"
        />

        <button
          onClick={handleTransfer}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl"
        >
          {loading ? "Transferring..." : "Transfer"}
        </button>

      </div>

    </div>
  )
}
