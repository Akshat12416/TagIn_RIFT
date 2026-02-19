import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold mb-10">
        Blockchain Product Authentication
      </h1>

      <div className="flex gap-6">
        <Link to="/register" className="px-6 py-3 bg-white text-black rounded-xl">
          Manufacturer
        </Link>

        <Link to="/verify" className="px-6 py-3 bg-white text-black rounded-xl">
          Verify Product
        </Link>

        <Link to="/dashboard" className="px-6 py-3 bg-white text-black rounded-xl">
          Dashboard
        </Link>
      </div>
    </div>
  );
}
