import { Link, useNavigate } from "react-router-dom"

export default function ManufacturerNavbar() {

  const navigate = useNavigate()
  const wallet = localStorage.getItem("manufacturer")

  const handleLogout = () => {
    localStorage.removeItem("manufacturer")
    navigate("/")
  }

  return (
    <div className="w-full bg-black text-white px-8 py-4 flex justify-between items-center">

      <div className="font-semibold text-lg">
        Manufacturer Panel
      </div>

      <div className="flex gap-6 items-center">

        <Link to="/register" className="hover:underline">
          Register Product
        </Link>

        <Link to="/dashboard" className="hover:underline">
          Dashboard
        </Link>

        <Link to="/transfer" className="hover:underline">
          Ownership Transfer
        </Link>

        <span className="text-xs font-mono opacity-70 hidden md:block">
          {wallet?.slice(0,6)}...{wallet?.slice(-4)}
        </span>

        <button
          onClick={handleLogout}
          className="bg-white text-black px-4 py-1 rounded-xl text-sm"
        >
          Logout
        </button>

      </div>
    </div>
  )
}
