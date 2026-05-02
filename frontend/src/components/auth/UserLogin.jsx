import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import API_BASE from "../../api.js";

export default function UserLogin() {
  const navigate = useNavigate();
  const [, setCookies] = useCookies(["username", "role"]);

  const [user, setUser] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState("");

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/login`, user);

      setCookies("username", res.data.username, { path: "/" });
      setCookies("role", res.data.role, { path: "/" });

      navigate("/home");
    } catch {
      setMsg("Login Failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 shadow rounded w-full max-w-sm">

        <h2 className="text-xl font-bold text-center mb-4">User Login</h2>

        {msg && <p className="text-center text-sm">{msg}</p>}

        <form onSubmit={handleLogin} className="space-y-3">
          <input name="username" placeholder="Username" onChange={handleChange} className="w-full border p-2" />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full border p-2" />

          <button className="w-full bg-pink-500 text-white p-2">
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-3">
          Not registered?{" "}
          <Link to="/userregister" className="text-pink-500">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}