import { useEffect, useState } from "react";
import axios from "axios";

const shortAddr = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

export default function Dashboard({ userAddress }) {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userAddress) return;

    setLoading(true);

    axios
      .get(`https://taginriftbackend1.onrender.com/api/products/${userAddress}`)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });

  }, [userAddress]);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 font-['ClashDisplay']">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-semibold mb-2 tracking-wide">
              Manufacturer Dashboard
            </h1>
            <p className="text-white/40 text-sm">
              Wallet: <span className="font-mono text-white/60 break-all">{shortAddr(userAddress)}</span>
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-[#111] border border-white/10 px-4 py-2 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]"></div>
            <span className="text-xs text-white/50 font-mono">Connected</span>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-12 h-12 border-4 border-white/10 border-t-[#5282E1] rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-[#111111] border border-white/10 rounded-3xl p-16 text-center">
            <p className="text-white/40 text-lg">No products registered yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10 shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  {["Product Name", "Serial Number", "Model", "Type", "Color", "Manufacture Date", "Token ID", "Current Owner", "Metadata Hash"].map(h => (
                    <th key={h} className="px-6 py-4 text-white/50 font-medium tracking-wider text-xs uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p, index) => (
                  <tr
                    key={index}
                    className="border-b border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{p.product_name}</td>
                    <td className="px-6 py-4 text-white/70">{p.serial_number}</td>
                    <td className="px-6 py-4 text-white/70">{p.model}</td>
                    <td className="px-6 py-4 text-white/70">{p.type}</td>
                    <td className="px-6 py-4 text-white/70">{p.color}</td>
                    <td className="px-6 py-4 text-white/70 whitespace-nowrap">{p.manufacture_date}</td>
                    <td className="px-6 py-4 font-mono text-[#5282E1]">{p.tokenId}</td>
                    <td className="px-6 py-4 font-mono text-xs text-white/40 break-all max-w-[140px]">{shortAddr(p.owner)}</td>
                    <td className="px-6 py-4 font-mono text-xs text-white/30 break-all max-w-[140px]">{p.metadataHash ? p.metadataHash.slice(0, 12) + "…" : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
