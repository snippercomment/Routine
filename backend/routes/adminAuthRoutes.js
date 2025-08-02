const express = require("express");
const User = require("../model/User");
const generateToken = require("../utils/generateToken");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @desc    Admin login
// @route   POST /api/loginAdmin
// @access  Public
router.post("/", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kiểm tra email và password có được gửi không
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập đầy đủ email và mật khẩu"
            });
        }

        // Tìm user theo email
        const user = await User.findOne({ email });
        console.log('Found user:', user); // Log để debug

        // Kiểm tra user tồn tại
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Email không tồn tại"
            });
        }

        // Kiểm tra password
        const isMatch = await user.matchPassword(password);
        console.log('Password match:', isMatch); // Log để debug

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Mật khẩu không đúng"
            });
        }

        // Kiểm tra role admin
        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Không có quyền truy cập trang admin"
            });
        }

        // Tạo token và trả về thông tin
        const token = generateToken(user._id);
        res.json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi đăng nhập",
            error: error.message
        });
    }
});

// @desc    Check admin auth status
// @route   GET /api/loginAdmin/check-auth
// @access  Private/Admin
router.get("/check-auth", protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (user) {
            res.json({
                success: true,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Không tìm thấy thông tin người dùng"
            });
        }
    } catch (error) {
        console.error('Check auth error:', error);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi kiểm tra xác thực",
            error: error.message
        });
    }
});

module.exports = router;