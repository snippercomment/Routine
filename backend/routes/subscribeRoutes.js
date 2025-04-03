const express = require("express");
const router = express.Router();
const Subscriber = require("../model/Subscriber");


// 


router.post("/subcribe",async(req,res)=>{
    const {email} = req.body;

    if(!email){
        return res.status(400).json({message:"Email là bắt buộc"});
    }

    try {
        let subscriber = await Subscriber.findOne({email});

        if(subscriber){
            return res.status(400).json({message:"Email đã được đăng ký"});
        }

        // create
        subscriber = new Subscriber({email});
        await subscriber.save();

        res.status(201).json({message:"Đã đăng ký nhận bản tin thành công!"});

    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Lỗi máy chủ"});
    }
});

module.exports = router;