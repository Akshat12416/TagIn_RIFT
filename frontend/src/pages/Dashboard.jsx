import { useEffect, useState } from "react";
import axios from "axios";

const shortAddr = (addr) => addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "";

export default function Dashboard({ userAddress }) {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userAddress) return;
    setLoading(true);
    axios
      .get(`https://taginriftbackend1.onrender.com/api/products/${userAddress}`)
      .then((res) => { setProducts(res.data); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, [userAddress]);

  return (
    <div className="min-h-screen bg-black px-6 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-1">Dashboard</h1>
            <p className="text-white/30 text-xs font-mono">{shortAddr(userAddress)}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-white/40 bg-white/5 border border-white/10 px-4 py-2 rounded-lg">
              {products.length} products
            </span>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-32">
            <div className="w-8 h-8 border-2 border-white/10 border-t-white/60 rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-white/30 text-sm">No products registered yet.</p>
          </div>
        ) : (
          <div className="border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="border-b border-white/10 bg-white/[0.02]">
                  <tr>
                    {["Product","Serial","Model","Type","Color","Date","Token ID","Owner"].map(h => (
                      <th key={h} className="px-5 py-3.5 text-white/30 font-medium text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((p, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5 text-white font-medium whitespace-nowrap">{p.product_name}</td>
                      <td className="px-5 py-3.5 text-white/50">{p.serial_number}</td>
                      <td className="px-5 py-3.5 text-white/50">{p.model}</td>
                      <td className="px-5 py-3.5 text-white/50">{p.type}</td>
                      <td className="px-5 py-3.5 text-white/50">{p.color}</td>
                      <td className="px-5 py-3.5 text-white/40 whitespace-nowrap">{p.manufacture_date}</td>
                      <td className="px-5 py-3.5 text-[#5282E1] font-mono text-xs">{p.tokenId}</td>
                      <td className="px-5 py-3.5 text-white/30 font-mono text-xs">{shortAddr(p.owner)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
