import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import bcrypt from "bcrypt";

const app = express();
app.use(cors());
app.use(express.json());

/* ===============================
   DB CONNECTION
================================ */
const client = new MongoClient("mongodb+srv://rinkusahu1302_db_users:rinkusahu1302_db_users@cluster0.agp0rnc.mongodb.net/?appName=Cluster0");

let db;

async function startServer() {
  try {
    await client.connect();
    db = client.db("campusDashboard");
    console.log("✅ DB connected");

    app.listen(4000, () => {
      console.log("🚀 Server running on http://localhost:4000");
    });

  } catch (err) {
    console.error("❌ DB ERROR:", err);
  }
}

startServer();

/* ===============================
   MIDDLEWARE
================================ */
function checkDB(req, res, next) {
  if (!db) return res.status(500).json({ error: "Database not connected" });
  next();
}

/* ===============================
   REGISTER
================================ */
app.post("/register", checkDB, async (req, res) => {
  try {
    const { username, password, gmail, mobile } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const exists = await db.collection("users").findOne({ username });
    if (exists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.collection("users").insertOne({
      username,
      password: hashed,
      gmail: gmail || "",
      mobile: mobile || "",
      role: "user",
      points: 0,
      createdAt: new Date()
    });

    res.json({ message: "User registered successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ===============================
   LOGIN
================================ */
app.post("/login", checkDB, async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await db.collection("users").findOne({ username });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    res.json({
      username: user.username,
      role: user.role
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* ===============================
   GET USERS (Leaderboard)
================================ */
app.get("/users", checkDB, async (req, res) => {
  try {
    const users = await db
      .collection("users")
      .find({}, { projection: { password: 0 } })
      .sort({ points: -1 })
      .toArray();

    res.json(users);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* ===============================
   🔥 UPDATE USER POINTS
================================ */
app.put("/users/:username/points", checkDB, async (req, res) => {
  try {
    const { username } = req.params;
    const { points } = req.body;

    if (typeof points !== "number") {
      return res.status(400).json({ error: "Points must be a number" });
    }

    const result = await db.collection("users").updateOne(
      { username },
      { $inc: { points: points } } // 🔥 adds points
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Points updated" });

  } catch (err) {
    console.error("POINT UPDATE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});
/* ===============================
   TEST APIs (UNCHANGED)
================================ */
app.get("/tests", checkDB, async (req, res) => {
  const tests = await db.collection("questionsets").aggregate([
    {
      $project: {
        title: 1,
        company: 1,
        description: 1,
        questionset: 1,
        numberOfQuestions: { $size: "$questionset" }
      }
    }
  ]).toArray();

  res.json(tests);
});

app.get("/tests/:id", checkDB, async (req, res) => {
  const { id } = req.params;
  const test = await db.collection("questionsets")
    .findOne({ _id: new ObjectId(id) });

  res.json(test);
});