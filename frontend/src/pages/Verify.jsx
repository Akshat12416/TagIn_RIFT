import { useState } from "react";
import API from "../services/api";

export default function Verify() {
  const [assetId, setAssetId] = useState("");
  const [result, setResult] = useState(null);

  const handleVerify = async () => {
    try {
      // 1️⃣ Get product metadata from DB
      const productRes = await API.get(`/product/${assetId}`);
      const product = productRes.data;

      // 2️⃣ Send metadata to blockchain verification
      const verifyRes = await API.post(`/verify/${assetId}`, {
        product_name: product.name,
        serial_number: product.serial,
        model: product.model,
        color: product.color,
        manufacturer: product.manufacturer
      });

      setResult(verifyRes.data);

    } catch (err) {
      console.error(err);
      alert("Verification failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Verify Product</h1>

      <input
        placeholder="Enter Asset ID"
        value={assetId}
        onChange={(e) => setAssetId(e.target.value)}
        className="border p-2 mb-4"
      />

      <button
        onClick={handleVerify}
        className="bg-black text-white px-6 py-2"
      >
        Verify
      </button>

      {result && (
        <div className="mt-6">
          {result.verified ? (
            <div className="text-green-600">
              ✅ Product Verified
            </div>
          ) : (
            <div className="text-red-600">
              ❌ Counterfeit Detected
            </div>
          )}

          <div className="mt-2 text-sm">
            Owner: {result.owner}
          </div>
        </div>
      )}
    </div>
  );
}
