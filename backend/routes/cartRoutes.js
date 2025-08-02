const express = require("express");
const Cart = require("../model/Cart");
const Product = require("../model/Product");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const getCart = async (userId, guestId) => {
    if (userId) return await Cart.findOne({ user: userId });
    if (guestId) return await Cart.findOne({ guestId });
    return null;
};

// Thêm sản phẩm vào giỏ
router.post("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

        let cart = await getCart(userId, guestId);

        const itemData = {
            productId,
            name: product.name,
            image: product.images[0]?.url,
            price: product.price,
            discountPrice: product.discountPrice,
            size,
            color,
            quantity
        };

        if (cart) {
            const index = cart.products.findIndex(
                (p) =>
                    p.productId.toString() === productId &&
                    p.size === size &&
                    p.color === color
            );

            if (index > -1) {
                cart.products[index].quantity += quantity;
            } else {
                cart.products.push(itemData);
            }
        } else {
            cart = new Cart({
                user: userId || undefined,
                guestId: guestId || `guest_${Date.now()}`,
                products: [itemData],
            });
        }

        cart.totalPrice = cart.products.reduce(
            (acc, item) => acc + (item.discountPrice ?? item.price) * item.quantity,
            0
        );

        await cart.save();
        res.status(cart.isNew ? 201 : 200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
});

// Cập nhật số lượng hoặc xoá sản phẩm
router.put("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;
    try {
        const cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });

        const index = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
        );

        if (index > -1) {
            if (quantity > 0) {
                cart.products[index].quantity = quantity;
            } else {
                cart.products.splice(index, 1);
            }

            cart.totalPrice = cart.products.reduce(
                (acc, item) => (acc + (item.discountPrice ?? item.price) * item.quantity),
                0
            );

            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
});

// Xoá sản phẩm khỏi giỏ
router.delete("/", async (req, res) => {
    const { productId, size, color, guestId, userId } = req.body
    try {
        const cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });

        const index = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
        );

        if (index > -1) {
            cart.products.splice(index, 1);

            cart.totalPrice = cart.products.reduce(
                (acc, item) => (acc + (item.discountPrice ?? item.price) * item.quantity),
                0
            );

            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
});

// Lấy giỏ hàng
router.get("/", async (req, res) => {
    const { userId, guestId } = req.query;

    try {
        const cart = await getCart(userId, guestId);
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
});

// Gộp giỏ hàng
router.post("/merge", protect, async (req, res) => {
    const { guestId } = req.body;

    try {
        const guestCart = await Cart.findOne({ guestId });
        let userCart = await Cart.findOne({ user: req.user._id });

        if (guestCart) {
            if (guestCart.products.length === 0) {
                return res.status(400).json({ message: "Giỏ hàng của khách đang trống" });
            }

            if (userCart) {
                guestCart.products.forEach((guestItem) => {
                    const index = userCart.products.findIndex(
                        (item) =>
                            item.productId.toString() === guestItem.productId.toString() &&
                            item.size === guestItem.size &&
                            item.color === guestItem.color
                    );

                    if (index > -1) {
                        userCart.products[index].quantity += guestItem.quantity;
                    } else {
                        userCart.products.push(guestItem);
                    }
                });

                userCart.totalPrice = userCart.products.reduce(
                    (acc, item) => acc + (item.discountPrice ?? item.price) * item.quantity,
                    0
                );

                await userCart.save();
                await Cart.findOneAndDelete({ guestId });
                return res.status(200).json(userCart);
            } else {
                guestCart.user = req.user._id;
                guestCart.guestId = undefined;
                guestCart.totalPrice = guestCart.products.reduce(
                    (acc, item) => acc + (item.discountPrice ?? item.price) * item.quantity,
                    0
                );

                await guestCart.save();
                return res.status(200).json(guestCart);
            }
        } else {
            if (userCart) return res.status(200).json(userCart);
            return res.status(404).json({ message: "Không tìm thấy giỏ hàng của khách" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
});

module.exports = router;
