const express = require("express");
const Checkout = require("../model/CheckOut");
const Cart = require("../model/Cart");
const Product = require("../model/Product");
const Order = require("../model/Order");
const {protect} = require("../middleware/authMiddleware");



const router = express.Router();

// 
router.post("/",protect,async(req,res)=>{
    const {checkoutItems,shippingAddress, paymentMethod,totalPrice} = req.body;

    if(!checkoutItems || checkoutItems.length === 0){
        return res.status(400).json({message:"Không có mục nào trong thanh toán"});
    }

    try {
        const newCheckout = await Checkout.create({
            user :req.user._id,
            checkoutItems:checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus:"Pending",
            isPaid:false,
        });
        console.log(`Đã tạo thanh toán cho người dùng:${req.user._id}`);
        res.status(201).json(newCheckout);
    } catch (error) {
        console.error("Lỗi khi tạo phiên thanh toán:",error);
        res.status(500).json({message:"Lỗi hệ thống"});
    }
})


// put 

router.put("/:id/pay",protect,async(req,res)=>{
    // const checkout = await Checkout.findById(req.params.id);
    const {paymentStatus,paymentDetails} = req.body;
    try {
        const checkout = await Checkout.findById(req.params.id)
        if(!checkout){
            return res.status(404).json({message:"Không tìm thấy thanh toán"});
        }
    
        if(paymentStatus === "paid"){
            checkout.isPaid = true;
            checkout.paymentStatus = paymentStatus;
            checkout.paymentDetails = paymentDetails;
            checkout.paidAt = Date.now();
            await checkout.save();

            res.status(200).json(checkout);
        }
        else{
            res.status(400).json({message:"Trạng thái thanh toán không hợp lệ"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Lỗi hệ thống"});
    }
})


// 


router.post("/:id/finalize",protect,async(req,res)=>{
    try {
        const checkout = await Checkout.findById(req.params.id);

        if(!checkout){
            return res.status(404).json({message:"Không tìm thấy thanh toán"});
        }

        if(checkout.isPaid && !checkout.isFinalized){
            const finalOrder = await Order.create({
                user: checkout.user,
                orderitems:checkout.checkoutItems,
                shippingAddress:checkout.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                totalPrice:checkout.totalPrice,
                isPaid:true,
                paidAt:checkout.paidAt,
                isDelivered:false,
                paymentStatus:"paid",
                paymentDetails:checkout.paymentDetails,
            });

            checkout.isFinalized = true;
            checkout.finalizedAt = Date.now();
            await checkout.save();

            await Cart.findOneAndDelete({user:checkout.user});
            res.status(201).json(finalOrder);

        } else if(checkout.isFinalized){
            res.status(400).json({message:"Thanh toán đã hoàn tất"})
        } else{
            res.status(400).json({message:"Thanh toán chưa được thanh toán"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Lỗi hệ thống"});
    }
}) 

module.exports = router;
