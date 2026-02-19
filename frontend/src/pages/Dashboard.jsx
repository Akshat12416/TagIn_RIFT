import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard({ userAddress }) {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userAddress) return;

    setLoading(true);

    axios
      .get(`http://localhost:5000/api/products/${userAddress}`)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });

  }, [userAddress]);

  return (
    <div className="min-h-screen bg-white px-6 py-12">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-semibold mb-2">
            Manufacturer Dashboard
          </h1>
          <p className="text-gray-500 text-sm">
            Wallet: <span className="font-mono break-all">{userAddress}</span>
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-neutral-200 border-t-black rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No products registered yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">

            <table className="w-full text-sm text-left">

              <thead className="bg-black text-white">
                <tr>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Serial Number</th>
                  <th className="px-6 py-4">Model</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Color</th>
                  <th className="px-6 py-4">Manufacture Date</th>
                  <th className="px-6 py-4">Token ID</th>
                  <th className="px-6 py-4">Current Owner</th>
                  <th className="px-6 py-4">Metadata Hash</th>
                  <th className="px-6 py-4">Explorer</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium">
                      {p.product_name}
                    </td>

                    <td className="px-6 py-4">
                      {p.serial_number}
                    </td>

                    <td className="px-6 py-4">
                      {p.model}
                    </td>

                    <td className="px-6 py-4">
                      {p.type}
                    </td>

                    <td className="px-6 py-4">
                      {p.color}
                    </td>

                    <td className="px-6 py-4">
                      {p.manufacture_date}
                    </td>

                    <td className="px-6 py-4 font-mono">
                      {p.tokenId}
                    </td>

                    <td className="px-6 py-4 font-mono text-xs break-all">
                      {p.owner}
                    </td>

                    <td className="px-6 py-4 font-mono text-xs break-all max-w-[200px]">
                      {p.metadataHash}
                    </td>

                    <td className="px-6 py-4">
                      <a
                        href={`https://testnet.algoexplorer.io/asset/${p.tokenId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </a>
                    </td>
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
