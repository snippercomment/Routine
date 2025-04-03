const jwt = require("jsonwebtoken");
const User = require("../model/User");


// 
const protect = async (req,res,next)=>{
    let token;

    if(
        req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    ){
        try{
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token,process.env.JWT_SECRET)
            req.user = await User.findById(decoded.user.id).select("-password");
            next();
        }catch(error){
            console.error("Xác minh mã thông báo không thành công:",error);
            res.status(401).json({message:"Không được ủy quyền, mã thông báo không thành công"});
        }
    } else{
        res.status(401).json({message:"Không được ủy quyền, không cung cấp mã thông báo"});
    }
};

// admin
const admin = (req,res,next)=>{
    if(req.user && req.user.role === "admin"){
        next();
    }
    else{
        res.status(403).json({message:"Không được ủy quyền làm quản trị viên"});
    }
}

module.exports = {protect,admin};