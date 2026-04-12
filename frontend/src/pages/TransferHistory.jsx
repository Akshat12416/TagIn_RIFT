import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useWallet } from "@txnlab/use-wallet-react"
import algosdk from "algosdk"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const ALGOD_SERVER = "https://testnet-api.algonode.cloud"
const ALGOD_TOKEN = ""

const shortAddr = (addr) => addr ? `${addr.slice(0, 8)}...${addr.slice(-6)}` : ""

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
      toast.error("Transfer failed: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 font-['ClashDisplay']">

      <div className="max-w-3xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-wide mb-1">Transfer History</h1>
          <p className="text-white/40 font-mono text-sm">Token ID: {tokenId}</p>
        </div>

        {/* History Timeline */}
        <div className="bg-[#111111] border border-white/10 rounded-3xl p-8 space-y-4">
          <h2 className="text-lg font-semibold text-white/70 mb-6 tracking-wide uppercase text-sm">Ownership Chain</h2>
          {history.length === 0 ? (
            <p className="text-white/30 py-6 text-center">No transfer records found.</p>
          ) : (
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10"></div>
              <div className="space-y-6 pl-10">
                {history.map((h, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[22px] w-3 h-3 rounded-full bg-[#5282E1] border-2 border-black mt-1"></div>
                    <div className="bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-5 transition">
                      <p className="text-xs text-white/30 mb-3">
                        {new Date(h.timestamp).toLocaleString()}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs uppercase tracking-widest text-white/40 w-8">From</span>
                          <span className="font-mono text-sm text-white/70">{shortAddr(h.from)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs uppercase tracking-widest text-[#5282E1] w-8">To</span>
                          <span className="font-mono text-sm text-white">{shortAddr(h.to)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Transfer Section */}
        <div className="bg-[#111111] border border-white/10 rounded-3xl p-8 space-y-5 relative overflow-hidden">
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#5282E1]/10 rounded-full blur-[60px] pointer-events-none"></div>

          <h2 className="text-xl font-semibold tracking-wide relative z-10">Transfer Ownership</h2>

          <input
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            placeholder="Receiver Algorand Address..."
            className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 px-4 py-3 rounded-xl focus:outline-none focus:border-[#5282E1] focus:ring-1 focus:ring-[#5282E1] font-mono text-sm transition relative z-10"
          />

          <button
            onClick={handleTransfer}
            disabled={loading}
            className="w-full bg-[#5282E1] hover:bg-[#3d68bc] disabled:opacity-50 text-white py-3 rounded-2xl font-medium tracking-wide transition shadow-[0_0_15px_rgba(82,130,225,0.3)] relative z-10"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Transferring...
              </span>
            ) : "Transfer"}
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
