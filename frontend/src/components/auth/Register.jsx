import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE from "../../api.js";

export default function Register() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    password: "",
    gmail: "",
    mobile: ""
  });

  const [admin, setAdmin] = useState({
    secretKey: "",
    username: "",
    password: "",
    gmail: "",
    mobile: ""
  });

  const [loading, setLoading] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [adminMsg, setAdminMsg] = useState("");

  function handleUserChange(e) {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  }

  function handleAdminChange(e) {
    const { name, value } = e.target;
    setAdmin(prev => ({ ...prev, [name]: value }));
  }

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      await axios.post(`${API_BASE}/register`, user);
      setMsg("User Registered");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setMsg("Failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdminRegister(e) {
    if (admin.secretKey !== "secret") {
      console.log ("wrong secret key ")
      return ; 
    }
    e.preventDefault();
    setAdminLoading(true);
    setAdminMsg("");

    try {
      await axios.post(`${API_BASE}/AdminRegister`, admin);
      setAdminMsg("Admin Registered");
      setTimeout(() => navigate("/AdminLogin"), 1000);
    } catch (err) {
      setAdminMsg("Failed");
    } finally {
      setAdminLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex  items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-">

        {/* USER REGISTER */}
        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-xl font-bold text-center">Register</h2>
          {msg && <p className="text-center text-sm">{msg}</p>}

          <form onSubmit={handleRegister} className="space-y-3">
            <input name="username" value={user.username} onChange={handleUserChange} placeholder="Username" className="w-full border p-2" />
            <input type="password" name="password" value={user.password} onChange={handleUserChange} placeholder="Password" className="w-full border p-2" />
            <input name="gmail" value={user.gmail} onChange={handleUserChange} placeholder="Email" className="w-full border p-2" />
            <input name="mobile" value={user.mobile} onChange={handleUserChange} placeholder="Mobile" className="w-full border p-2" />

            <button type="submit" className="w-full bg-pink-500 text-white p-2">
              {loading ? "Loading..." : "Register"}
            </button>
          </form>

          <p className="text-center text-sm mt-2">
            <Link to="/login">Login</Link>
          </p>
        </div>

        {/* ADMIN REGISTER */}
        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-xl font-bold text-center">Admin Register</h2>
          {adminMsg && <p className="text-center text-sm">{adminMsg}</p>}

          <form onSubmit={handleAdminRegister} className="space-y-3">
            <input name="secretKey" value={admin.secretKey} onChange={handleAdminChange} placeholder="Secret Key" className="w-full border p-2" />
            <input name="username" value={admin.username} onChange={handleAdminChange} placeholder="Username" className="w-full border p-2" />
            <input type="password" name="password" value={admin.password} onChange={handleAdminChange} placeholder="Password" className="w-full border p-2" />
            <input name="gmail" value={admin.gmail} onChange={handleAdminChange} placeholder="Email" className="w-full border p-2" />
            <input name="mobile" value={admin.mobile} onChange={handleAdminChange} placeholder="Mobile" className="w-full border p-2" />

            <button type="submit" className="w-full bg-pink-500 text-white p-2">
              {adminLoading ? "Loading..." : "Admin Register"}
            </button>
          </form>

          <p className="text-center text-sm mt-2">
            <Link to="/AdminLogin">Admin Login</Link>
          </p>
        </div>

      </div>
    </div>
  );
}