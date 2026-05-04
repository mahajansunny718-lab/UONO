const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(express.static("public"));

// ✅ MongoDB connect
mongoose.connect("mongodb://127.0.0.1:27017/uonoDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// ✅ Schema
const UserSchema = new mongoose.Schema({
    phone: String,
    password: String
});

const User = mongoose.model("User", UserSchema);

// 🔥 LOGIN = CREATE + LOGIN (plain password)
app.post("/login", async (req, res) => {
    try {
        const { phone, password } = req.body;

        let user = await User.findOne({ phone });

        // ✅ If user not exist → create
        if (!user) {
            user = new User({
                phone: phone,
                password: password   // ❗ plain text
            });

            await user.save();

            return res.json({
                success: true,
                message: "New user created & logged in"
            });
        }

        // ✅ If exists → check password
        if (user.password === password) {
            res.json({
                success: true,
                message: "Login successful"
            });
        } else {
            res.json({
                success: false,
                message: "Wrong password"
            });
        }

    } catch (err) {
        res.json({
            success: false,
            message: "Server error",
            error: err
        });
    }
});

// 🚀 Start server
app.listen(5000, () => {
    console.log("Server running → http://localhost:5000");
});