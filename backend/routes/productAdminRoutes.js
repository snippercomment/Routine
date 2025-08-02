const express = require("express");
const Product = require("../model/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();


//  

router.get("/", protect, admin, async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi máy chủ" })
    }
});

// Thêm sản phẩm (admin)
router.post("/", protect, admin, async (req, res) => {
    try {
        const product = new Product({
            ...req.body,
            user: req.user._id,
        });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
});

// Sửa sản phẩm (admin)
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            Object.assign(product, req.body);
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
});

module.exports = router;