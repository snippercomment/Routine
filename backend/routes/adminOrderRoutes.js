const express = require("express");
const Order = require("../model/Order");
const {protect,admin} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/",protect,admin,async(req,res)=>{
    try {
        const orders = await Order.find({}).populate("user","name email");
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Lỗi máy chủ"})
    }
});


// 
router.put("/:id",protect,admin,async(req,res)=>{
    try {
        const order = await Order.findById(req.params.id).populate("user","name");
        if(order){
            order.status = req.body.status || order.status;
            order.isDelivered = req.body.status === "Delivered" ? true :order.isDelivered;
            order.deilverAt = req.body.status === "Delivered" ? Date.now() : order.deilverAt;
            const updateOrder = await order.save();
            res.json(updateOrder);
        }else{
            res.status(404).json({message:"Không tìm thấy đơn hàng"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"SLỗi máy chủ"});
    }
})

// delete
router.delete("/:id",protect,admin,async(req,res)=>{
    try {
        const order = await Order.findById(req.params.id);
        if(order){
            await order.deleteOne();
            res.json({message:"Order removed"})
        }
        else{
            res.status(404).json({message:"Không tìm thấy đơn hàng"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Lỗi máy chủ"});
    }
})

module.exports = router;