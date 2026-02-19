import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
        Blockchain Product Authentication
      </h1>

      <p className="text-gray-400 mb-12 text-center max-w-xl">
        Secure product registration and ownership verification powered by Algorand blockchain.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-md">

        {/* Manufacturer */}
       <Link
            to="/manufacturer-login"
            className="px-6 py-3 bg-white text-black rounded-xl"
            >
            Manufacturer
            </Link>


        {/* Verify */}
        <Link
          to="/verify"
          className="w-full text-center px-6 py-4 bg-gray-800 border border-gray-700 rounded-2xl font-semibold hover:bg-gray-700 transition-all duration-300"
        >
          Verify Product
        </Link>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-sm text-gray-500">
        Built on Algorand Testnet
      </div>

    </div>
  );
}
