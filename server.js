const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ======================
// 🔥 MIDDLEWARE
// ======================
app.use(cors());
app.use(express.json());

// ======================
// 🔥 MONGODB CONNECTION
// ======================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Error ❌", err));

// ======================
// 🔥 SCHEMA
// ======================
const userSchema = new mongoose.Schema({
  phone: String,
  password: String, // 🔥 stored as plain text
});

const User = mongoose.model("User", userSchema);

// ======================
// 🔥 ROUTES
// ======================

// ✅ Home (fix Not Found)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Register
app.post("/register", async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.json({
        success: false,
        message: "All fields required",
      });
    }

    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    const newUser = new User({ phone, password }); // 🔥 plain password
    await newUser.save();

    res.json({
      success: true,
      message: "Registered successfully",
    });

  } catch (err) {
    console.log("REGISTER ERROR:", err);
    res.json({
      success: false,
      message: "Server error",
    });
  }
});

// ✅ Login
app.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.json({
        success: false,
        message: "Phone and password required",
      });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // 🔥 Plain password match
    if (user.password !== password) {
      return res.json({
        success: false,
        message: "Wrong password",
      });
    }

    res.json({
      success: true,
      message: "Login successful",
      user,
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.json({
      success: false,
      message: "Server error",
    });
  }
});

// ======================
// 🚀 START SERVER (Render FIX)
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});