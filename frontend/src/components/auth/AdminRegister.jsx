import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE from "../../api.js";

export default function AdminRegister() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState({
    secretKey: "",
    username: "",
    password: "",
    gmail: "",
    mobile: ""
  });

  const [msg, setMsg] = useState("");

  function handleChange(e) {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  }

  async function handleRegister(e) {
    e.preventDefault();

    console.log("🚀 Admin register attempt:", admin);

    if (admin.secretKey !== "welcome") {
      console.log("❌ Wrong secret key");
      setMsg("Wrong Secret Key");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/AdminRegister`, {
        ...admin,
        role: "admin"
      });

      console.log("✅ Register response:", res.data);

      setMsg("Admin Registered");

      setTimeout(() => {
        navigate("/adminlogin");
      }, 1000);

    } catch (err) {
      console.log("❌ Register error:", err.response?.data || err.message);
      setMsg("Register Failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 shadow rounded w-full max-w-sm">

        <h2 className="text-xl font-bold text-center mb-4">Admin Register</h2>

        {msg && <p className="text-center text-sm text-red-500">{msg}</p>}

        <form onSubmit={handleRegister} className="space-y-3">
          <input name="secretKey" placeholder="Secret Key" onChange={handleChange} className="w-full border p-2" />
          <input name="username" placeholder="Username" onChange={handleChange} className="w-full border p-2" />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full border p-2" />
          <input name="gmail" placeholder="Email" onChange={handleChange} className="w-full border p-2" />
          <input name="mobile" placeholder="Mobile" onChange={handleChange} className="w-full border p-2" />

          <button className="w-full bg-pink-500 text-white p-2">
            Register
          </button>
        </form>

        <p className="text-center text-sm mt-3">
          Already have account?{" "}
          <Link to="/adminlogin" className="text-pink-500">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}