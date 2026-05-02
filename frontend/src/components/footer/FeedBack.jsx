import { useState } from "react";
import axios from "axios";
import API_BASE from "../../api";
export default function FeedBack() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "",
    priority: "",
    message: ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
  e.preventDefault();

  try {
    const payload = {
      ...form,
      rating
    };

    console.log("🚀 Sending feedback:", payload);

    const res = await axios.post(`${API_BASE}/feedback`, payload);

    console.log("✅ Saved:", res.data);

    alert("Feedback submitted successfully");

    // reset form
    setForm({
      name: "",
      email: "",
      category: "",
      priority: "",
      message: ""
    });
    setRating(0);

  } catch (err) {
    console.log("❌ Error:", err.response?.data || err.message);
    alert("Failed to submit feedback");
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-pink-50 flex items-center justify-center p-6">

      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">

        {/* LEFT PANEL */}
        <div className="bg-gradient-to-br from-indigo-600 to-pink-600 text-white p-10 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-3">Feedback Matters</h1>
            <p className="text-sm opacity-90">
              Help us improve your experience.
            </p>
          </div>

          <div className="space-y-4 mt-8">
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur">
              <h3 className="text-sm font-semibold">⚡ Fast Improvement</h3>
              <p className="text-xs opacity-80">We act on your feedback.</p>
            </div>

            <div className="bg-white/10 p-4 rounded-xl backdrop-blur">
              <h3 className="text-sm font-semibold">📊 Better Analytics</h3>
              <p className="text-xs opacity-80">Your data shapes decisions.</p>
            </div>
          </div>

          <p className="text-xs opacity-70 mt-10">© 2026</p>
        </div>

        {/* RIGHT PANEL */}
        <div className="p-8 space-y-6">

          <h2 className="text-2xl font-bold text-gray-800">
            Submit Feedback
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAME + EMAIL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="name"
                placeholder="Name"
                onChange={handleChange}
                className="border p-3 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
              />
              <input
                name="email"
                placeholder="Email"
                onChange={handleChange}
                className="border p-3 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
              />
            </div>

            {/* CATEGORY */}
            <select
              name="category"
              onChange={handleChange}
              className="w-full border p-3 rounded-xl"
            >
              <option value="">Category</option>
              <option>Bug</option>
              <option>Feature</option>
              <option>UI</option>
              <option>Other</option>
            </select>

            {/* PRIORITY */}
            <div className="flex gap-3">
              {["Low", "Medium", "High"].map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setForm({ ...form, priority: p })}
                  className={`px-4 py-2 rounded-full text-sm border transition ${
                    form.priority === p
                      ? "bg-pink-500 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* ⭐ ADVANCED STAR RATING */}
            <div>
              <p className="text-sm font-medium mb-2">
                Rate your experience
              </p>

              <div className="flex gap-2 text-3xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className={`cursor-pointer transition transform hover:scale-125 ${
                      (hover || rating) >= star
                        ? "text-yellow-400 drop-shadow"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              <p className="text-xs text-gray-500 mt-1">
                {rating > 0 && `You selected ${rating} star${rating > 1 ? "s" : ""}`}
              </p>
            </div>

            {/* MESSAGE */}
            <textarea
              name="message"
              rows="4"
              placeholder="Write your feedback..."
              onChange={handleChange}
              className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-pink-400"
            />

            {/* FILE */}
            <input
              type="file"
              className="w-full border p-2 rounded-xl bg-gray-50"
            />

            {/* SUBMIT */}
            <button
              className="w-full bg-pink-600 text-white py-3 rounded-xl hover:bg-pink-700 transition font-semibold"
            >
              Submit Feedback
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}