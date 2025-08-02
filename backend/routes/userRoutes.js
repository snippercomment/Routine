const express = require("express");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware")

const router = express.Router();

// Đăng ký
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng điền đầy đủ thông tin"
            });
        }

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "Email đã được sử dụng"
            });
        }

        // Create new user
        user = new User({
            name,
            email,
            password,
            role: "customer" // Set default role
        });

        // Save user
        await user.save();
        // console.log('User registered successfully:', user._id);

        // Generate token
        const token = jwt.sign({ user: { id: user._id, role: user.role } }, process.env.JWT_SECRET, { expiresIn: "40h" });
        res.status(201).json({ user, token });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi đăng ký",
            error: error.message
        });
    }
});

// dang nhập

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "Thông tin không hợp lệ" });
        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ message: "Thông tin không hợp lệ" });
        const payload = { user: { id: user._id, role: user.role } }

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "40h" }, (err, token) => {
            if (err) throw err;


            res.status(201).json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token,
            })

        })
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Lỗi máy chủ")
    }
})

// ho sơ cá nhân

router.post("/profile", protect, async (req, res) => {
    res.json(req.user)
})


module.exports = router;