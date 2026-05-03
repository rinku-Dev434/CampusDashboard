
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function Navbar() {
  const [sticky, setSticky] = useState(false);
  const [cookies, , removeCookie] = useCookies(["username"]);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ NEW

  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleSignOut() {
    removeCookie("username", { path: "/" });
    navigate("/login");
  }

  // ✅ function to style active link
  const getLinkClass = (path) =>
    `px-2 py-1 rounded-md transition ${
      location.pathname === path
        ? "text-black font-semibold border-b-2 border-pink-500"
        : "text-gray-500 hover:text-black"
    }`;

  const navLinks = (
    <>
      <li><Link to="/home" className={getLinkClass("/home")}>Home</Link></li>
      <li><Link to="/exam" className={getLinkClass("/exam")}>Exam</Link></li>
      <li><Link to="/participants" className={getLinkClass("/participants")}>Leaderboard</Link></li>
      <li><Link to="/schedule-exam" className={getLinkClass("/schedule-exam")}>Schedule Exam</Link></li>
      <li><Link to="/admin" className={getLinkClass("/admin")}>Admin</Link></li>
      <li><Link to="/help" className={getLinkClass("/help")}>Help</Link></li>
    </>
  );

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${sticky ? "bg-white shadow-md" : "bg-transparent"}`}>
      <div className="max-w-screen-2xl container mx-auto px-4 md:px-20">
        <div className="navbar">

          {/* Mobile */}
          <div className="navbar-start">
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                ☰
              </div>
              <ul className="menu menu-sm dropdown-content bg-base-100 mt-3 w-52 p-2 shadow">
                {navLinks}
              </ul>
            </div>

            <span className="font-bold text-2xl cursor-pointer">
              Campus <span className="text-pink-500">Dashboard</span>
            </span>
          </div>

          {/* Desktop */}
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">{navLinks}</ul>
          </div>

          {/* Right */}
          <div className="navbar-end gap-3">
            {cookies.username && (
              <span className="text-sm text-gray-600 hidden md:block font-medium">
                👤 {cookies.username}
              </span>
            )}
            <button
              onClick={handleSignOut}
              className="bg-black text-white rounded-md px-4 py-2 hover:bg-slate-800 text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}