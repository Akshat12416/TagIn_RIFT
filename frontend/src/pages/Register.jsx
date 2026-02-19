import { useState } from "react";
import API from "../services/api";

export default function Register() {
  const [form, setForm] = useState({
    product_name: "",
    serial_number: "",
    model: "",
    color: "",
  });

  const [loading, setLoading] = useState(false);
  const [assetId, setAssetId] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // STEP 1: Mint on Algorand
      const mintRes = await API.post("/mint", {
        ...form,
        manufacturer: "MANUFACTURER_WALLET_ADDRESS"
      });

      const { assetId, metadataHash } = mintRes.data;

      // STEP 2: Store full product data in MongoDB
      await API.post("/register", {
        name: form.product_name,
        serial: form.serial_number,
        model: form.model,
        type: "General",
        color: form.color,
        date: new Date().toISOString(),
        tokenId: assetId,
        metadataHash,
        manufacturer: "MANUFACTURER_WALLET_ADDRESS",
        owner: "MANUFACTURER_WALLET_ADDRESS"
      });

      setAssetId(assetId);

    } catch (err) {
      console.error(err);
      alert("Mint failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Register Product</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input
          name="product_name"
          placeholder="Product Name"
          onChange={handleChange}
          required
          className="border p-2"
        />
        <input
          name="serial_number"
          placeholder="Serial Number"
          onChange={handleChange}
          required
          className="border p-2"
        />
        <input
          name="model"
          placeholder="Model"
          onChange={handleChange}
          required
          className="border p-2"
        />
        <input
          name="color"
          placeholder="Color"
          onChange={handleChange}
          required
          className="border p-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white py-2"
        >
          {loading ? "Minting..." : "Register Product"}
        </button>
      </form>

      {assetId && (
        <div className="mt-6 text-green-600">
          ✅ Minted Successfully!  
          <div>Asset ID: {assetId}</div>
        </div>
      )}
    </div>
  );
}
