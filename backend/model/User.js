const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const userschema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true,
    }
    ,
    email:{
        type:String,
        require:true,
        unique:true,
        trim:true,
        match:[/.+\@.+\..+/,"Vui lòng nhập địa chỉ email hợp lệ"]
    },
    password:{
        type:String,
        require: true,
        minLength:6,
    },
    role:{
        type:String,
        enum:["customer","admin"],
        default:"customer"
    },
   
}, {timestamps:true})


// Mật khẩu hash để không hiện thông tin mật khẩu
userschema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
});


userschema.methods.matchPassword = async function (enterdPassword){
    return await bcrypt.compare(enterdPassword,this.password);
}

module.exports = mongoose.model("User",userschema)