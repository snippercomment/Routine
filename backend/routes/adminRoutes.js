const express = require("express");
const User = require("../model/User");
const {protect,admin} =require("../middleware/authMiddleware");



const router =express.Router();

router.get("/",protect,admin,async(req,res)=>{
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Lỗi máy chủ"});
    }
})

//them
router.post("/",protect,admin,async(req,res)=>{
    const {name,email,password,role} = req.body;

    try{
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:"Người dùng đã tồn tại"});
        }

        user = new User({
            name,
            email,
            password,
            role:role || "customer",
        });

        await user.save();
        res.status(201).json({message:"Người dùng đã được tạo thành công",user});
    } catch(error){
        console.error(error);
        res.status().json({message:"Lỗi máy chủ"});
    }
}) 

// sửa
router.put("/:id",protect,admin,async(req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        if(user){
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;
        }
        const updateUser = await user.save();
        res.json({message:"Người dùng đã cập nhật thành công",user:updateUser});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Lỗi máy chủ"});
    }
});


// xoá
router.delete("/:id",protect,admin,async(req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        if(user){
            await user.deleteOne();
            res.json({message:"Người dùng đã bị xóa thành công"});
        } else {
            res.status(404).json({message:"Không tìm thấy người dùng"});
        }
    } catch(error){
        console.error(error);
        res.status(500).json({message:"Lỗi máy chủ"});
    };
});

module.exports = router;