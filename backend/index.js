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

app.post ("/AdminRegister" , checkDB , async (req , res ) => {
  console.log ("/admin register hit ")
  try {
    const { username, password, gmail, mobile } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const exists = await db.collection("Admins").findOne({ username });
    if (exists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.collection("Admins").insertOne({
      username,
      password: hashed,
      gmail: gmail || "",
      mobile: mobile || "",
      role: "Admin",
      points: 0,
      createdAt: new Date()
    });
    console.log ("store admin ")

    res.json({ message: "Admin registered successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
} )

app.post("/Adminlogin", checkDB, async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await db.collection("Admins").findOne({ username });
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



app.post("/feedback", async (req, res) => {
  try {

    const feedback = {
      name: req.body.name,
      email: req.body.email,
      category: req.body.category,
      priority: req.body.priority,
      message: req.body.message,
      rating: req.body.rating,
      createdAt: new Date()
    };

    console.log("📥 Incoming feedback:", feedback);

    const result = await db.collection("feedback").insertOne(feedback);

    res.status(200).json({
      message: "Feedback saved",
      id: result.insertedId
    });

  } catch (err) {
    console.error("❌ DB Error:", err);
    res.status(500).json({ error: "Failed to save feedback" });
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

app.put("/admins/:username/points", checkDB, async (req, res) => {
  console.log ("enter into admin points ")
  const { username } = req.params;
  const { points } = req.body;

  const result = await db.collection("Admins").updateOne(
    { username },
    { $inc: { points } }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ error: "Admin not found" });
  }

  res.json({ message: "Admin points updated" });
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


app.post("/questionform", async (req, res) => {
  try {
    const { title, company, description, questionset } = req.body;

    if (!title || !questionset) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const result = await db.collection("questionsets").insertOne({
      title,
      company,
      description,
      questionset,
      createdAt: new Date(),
    });

    res.json({
      message: "Exam created",
      id: result.insertedId,
    });

  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});
app.get("/tests/:id", checkDB, async (req, res) => {
  const { id } = req.params;
  const test = await db.collection("questionsets")
    .findOne({ _id: new ObjectId(id) });

  res.json(test);
});



/* ===============================
   UPDATE EXAM
================================ */
app.put("/tests/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, company, description } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const result = await db.collection("questionsets").updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, company, description } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Exam not found" });
    }

    res.json({ message: "Exam updated successfully" });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ===============================
   DELETE EXAM (FIXED 🔥)
================================ */
app.delete("/tests/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log("DELETE ID:", id);

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const result = await db.collection("questionsets").deleteOne({
      _id: new ObjectId(id),
    });

    console.log("DELETE RESULT:", result);

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Exam not found" });
    }

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ===============================
   ADD QUESTION
================================ */
app.post("/tests/:id/question", async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection("questionsets").updateOne(
      { _id: new ObjectId(id) },
      { $push: { questionset: req.body } }
    );

    res.json({ message: "Question added" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* ===============================
   UPDATE QUESTION
================================ */
app.put("/tests/:id/question/:index", async (req, res) => {
  try {
    const { id, index } = req.params;

    const test = await db
      .collection("questionsets")
      .findOne({ _id: new ObjectId(id) });

    if (!test) {
      return res.status(404).json({ error: "Test not found" });
    }

    const questions = [...test.questionset];

    if (!questions[index]) {
      return res.status(400).json({ error: "Invalid index" });
    }

    questions[index] = req.body;

    await db.collection("questionsets").updateOne(
      { _id: new ObjectId(id) },
      { $set: { questionset: questions } }
    );

    res.json({ message: "Question updated" });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* ===============================
   DELETE QUESTION
================================ */
app.delete("/tests/:id/question/:index", async (req, res) => {
  try {
    const { id, index } = req.params;

    const test = await db
      .collection("questionsets")
      .findOne({ _id: new ObjectId(id) });

    if (!test) {
      return res.status(404).json({ error: "Test not found" });
    }

    const questions = [...test.questionset];

    if (!questions[index]) {
      return res.status(400).json({ error: "Invalid index" });
    }

    questions.splice(index, 1);

    await db.collection("questionsets").updateOne(
      { _id: new ObjectId(id) },
      { $set: { questionset: questions } }
    );

    res.json({ message: "Question deleted" });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
