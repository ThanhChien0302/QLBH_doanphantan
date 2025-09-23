const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Đăng ký user mới (Admin có thể dùng API này để tạo user)
exports.register = async (req, res) => {
    try {
        const { username, password,  } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        // Kiểm tra username đã tồn tại chưa
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "Username already exists" });

        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: "Username and password required" });

        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "User not found" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ message: "Invalid password" });

        // Tạo JWT token, dùng secret từ .env
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token, role: user.role, username: user.username });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
