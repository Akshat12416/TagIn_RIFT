import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useWallet } from "@txnlab/use-wallet-react"
import algosdk from "algosdk"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const ALGOD_SERVER = "https://testnet-api.algonode.cloud"
const ALGOD_TOKEN = ""

const shortAddr = (addr) => addr ? `${addr.slice(0, 8)}…${addr.slice(-6)}` : ""

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

    if (!activeAccount?.address) { toast.error("Wallet not connected"); return }
    if (!receiver) { toast.error("Please enter receiver address"); return }
    if (!algosdk.isValidAddress(receiver)) { toast.error("Invalid Algorand address"); return }

    setLoading(true)

    try {
      const algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_SERVER, "")
      const params = await algodClient.getTransactionParams().do()

      const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        sender: activeAccount.address,
        receiver: receiver,
        amount: 1,
        assetIndex: Number(tokenId),
        suggestedParams: params
      })

      const signed = await signTransactions([txn])
      const { txid } = await algodClient.sendRawTransaction(signed[0]).do()
      await algosdk.waitForConfirmation(algodClient, txid, 10)

      const pendingInfo = await algodClient.pendingTransactionInformation(txid).do()
      if (pendingInfo["pool-error"]?.length > 0) throw new Error(pendingInfo["pool-error"])

      await axios.post("https://taginriftbackend1.onrender.com/api/transfer", {
        tokenId, from: activeAccount.address, to: receiver, txId: txid, timestamp: new Date().toISOString()
      })

      toast.success("Ownership transferred!")
      setReceiver("")
      fetchHistory()

    } catch (err) {
      toast.error("Transfer failed: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-white mb-1">Transfer History</h1>
          <p className="text-white/30 text-xs font-mono">Token #{tokenId}</p>
        </div>

        {/* Timeline */}
        <div className="border border-white/10 rounded-xl p-6">
          <h2 className="text-xs font-medium text-white/30 mb-5 uppercase tracking-wider">Ownership Chain</h2>

          {history.length === 0 ? (
            <p className="text-white/20 text-sm text-center py-8">No transfer records found.</p>
          ) : (
            <div className="relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10"></div>
              <div className="space-y-4 pl-7">
                {history.map((h, i) => (
                  <div key={i} className="relative">
                    <div className={`absolute -left-[23px] top-3 w-[10px] h-[10px] rounded-full border-2 ${
                      i === 0 ? "border-[#5282E1] bg-[#5282E1]/20" : "border-white/20 bg-black"
                    }`}></div>
                    <div className="bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-lg p-4 transition-colors">
                      <p className="text-[10px] text-white/20 mb-2 font-mono">
                        {new Date(h.timestamp).toLocaleString()}
                      </p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-white/30">From</span>
                        <span className="text-white/60 font-mono">{shortAddr(h.from)}</span>
                        <span className="text-white/20">→</span>
                        <span className="text-white/30">To</span>
                        <span className="text-white font-mono font-medium">{shortAddr(h.to)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Transfer */}
        <div className="border border-white/10 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">Transfer Ownership</h2>

          <input
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            placeholder="Receiver Algorand address…"
            className="w-full bg-white/[0.03] border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-[#5282E1]/50 font-mono text-sm transition-colors"
          />

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
            ) : "Transfer →"}
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
