import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE from "../../api.js";

export default function UserRegister() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    password: "",
    gmail: "",
    mobile: ""
  });

  const [msg, setMsg] = useState("");

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  async function handleRegister(e) {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/register`, user);
      setMsg("Registered Successfully");
      setTimeout(() => navigate("/userlogin"), 1000);
    } catch {
      setMsg("Register Failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 shadow rounded w-full max-w-sm">

        <h2 className="text-xl font-bold text-center mb-4">User Register</h2>

        {msg && <p className="text-center text-sm">{msg}</p>}

        <form onSubmit={handleRegister} className="space-y-3">
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
          <Link to="/userlogin" className="text-pink-500">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}