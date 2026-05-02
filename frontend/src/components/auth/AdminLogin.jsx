import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import API_BASE from "../../api.js";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [, setCookies] = useCookies(["username", "role"]);

  const [admin, setAdmin] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState("");

  function handleChange(e) {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  }

  async function handleLogin(e) {
    e.preventDefault();

    console.log("🚀 Admin login attempt:", admin);

    try {
      const res = await axios.post(`${API_BASE}/Adminlogin`, admin);

      console.log("✅ Backend response:", res.data);

      // 🔴 HARD CHECK
      if (!res.data.role) {
        console.log("❌ No role returned from backend");
        setMsg("Server error: role missing");
        return;
      }

      if (res.data.role.toLowerCase() !== "admin") {
        console.log("❌ Not an admin:", res.data.role);
        setMsg("Not an admin account");
        return;
      }

      // ✅ Set cookies
      setCookies("username", res.data.username, { path: "/" });
      setCookies("role", res.data.role.toLowerCase(), { path: "/" });

      console.log("🍪 Cookies set → username:", res.data.username, "role:", res.data.role);

      // small delay ensures cookie is readable
      setTimeout(() => {
        navigate("/admin");
      }, 100);

    } catch (err) {
      console.log("❌ Login error:", err.response?.data || err.message);
      setMsg("Login Failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 shadow rounded w-full max-w-sm">

        <h2 className="text-xl font-bold text-center mb-4">Admin Login</h2>

        {msg && <p className="text-center text-sm text-red-500">{msg}</p>}

        <form onSubmit={handleLogin} className="space-y-3">
          <input name="username" placeholder="Username" onChange={handleChange} className="w-full border p-2" />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full border p-2" />

          <button className="w-full bg-pink-500 text-white p-2">
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-3">
          Not registered?{" "}
          <Link to="/adminregister" className="text-pink-500">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}