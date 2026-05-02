
import { Routes, Route, Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import UserLogin from "./components/auth/UserLogin.jsx";
import AdminLogin from "./components/auth/AdminLogin.jsx";
import UserRegister from "./components/auth/UserRegister.jsx";
import AdminRegister from "./components/auth/AdminRegister.jsx";
import Home from "./components/home/Home.jsx";
import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/Register.jsx";
import ErrorLogin from "./components/auth/ErrorLogin.jsx";
import Participants from "./components/partcipant/Participants.jsx";
import ScheduleExam from "./components/schedule Exam/ScheduleExam.jsx";
import ExamPage from "./components/exam/ExamPage.jsx";
import Help from "./components/Help.jsx";
import FeedBack from "./components/footer/FeedBack.jsx";
import About from "./components/footer/About";
import Contact from "./components/footer/Contact";
import Jobs from "./components/footer/Jobs";
import PressKit from "./components/footer/PressKit";
import Exams from "./components/exam/Exam.jsx";

// ✅ NEW ADMIN IMPORTS
import AdminPage from "./components/admin/AdminPage.jsx";
import AdminQuestions from "./components/admin/AdminQuestions.jsx";

/* ===============================
   PROTECTED ROUTE (LOGIN REQUIRED)
================================ */
function Protected({ children }) {
  const [cookies] = useCookies(["username"]);
  if (!cookies.username) return <Navigate to="/login" replace />;
  return children;
}

/* ===============================
   ADMIN ROUTE (ONLY ADMIN)
================================ */
function AdminProtected({ children }) {
  const [cookies] = useCookies(["username", "role"]);

  console.log("🔍 AdminProtected check →", cookies);

  if (!cookies.username) {
    console.log("❌ No username → redirect login");
    return <Navigate to="/login" replace />;
  }

  if (!cookies.role) {
    console.log("❌ No role → redirect login");
    return <Navigate to="/login" replace />;
  }

  if (cookies.role.toLowerCase() !== "admin") {
    console.log("❌ Not admin → redirect home. Role:", cookies.role);
    return <Navigate to="/home" replace />;
  }

  console.log("✅ Admin verified → access granted");
  return children;
}
/* ===============================
   APP ROUTES
================================ */
export default function App() {
  return (
    <Routes>

  {/* ENTRY */}
  <Route path="/" element={<Navigate to="/login" replace />} />
  <Route path="/login" element={<Login />} />

  {/* USER AUTH */}
  <Route path="/userlogin" element={<UserLogin />} />
  <Route path="/userregister" element={<UserRegister />} />

  {/* ADMIN AUTH */}
  <Route path="/adminlogin" element={<AdminLogin />} />
  <Route path="/adminregister" element={<AdminRegister />} />

  {/* USER PROTECTED */}
  <Route path="/home" element={<Protected><Home /></Protected>} />
  <Route path="/exam" element={<Protected><Exams /></Protected>} />
  <Route path="/participants" element={<Protected><Participants /></Protected>} />
  <Route path="/schedule-exam" element={<Protected><ScheduleExam /></Protected>} />
  <Route path="/exampage/:testId" element={<Protected><ExamPage /></Protected>} />
  <Route path="/help" element={<Protected><Help /></Protected>} />

  {/* ADMIN PROTECTED */}
  <Route path="/admin" element={<AdminProtected><AdminPage /></AdminProtected>} />
  <Route path="/admin/test/:testId" element={<AdminProtected><AdminQuestions /></AdminProtected>} />

  {/* MISC */}
  <Route path="/error" element={<ErrorLogin />} />
  <Route path="/about" element={<About />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/jobs" element={<Jobs />} />
  <Route path="/press-kit" element={<PressKit />} />
    <Route path="/feedback" element={<FeedBack />} />


  {/* 404 */}
  <Route
    path="*"
    element={
      <h2 className="text-center text-red-500 mt-20 text-3xl">
        404 — Page Not Found
      </h2>
    }
  />

</Routes>
  );
}