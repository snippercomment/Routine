const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./model/Product");
const User = require("./model/User");
const Cart = require("./model/Cart");
const products = require("./Data/product");


dotenv.config();

// 
mongoose.connect(process.env.MONGO_URI);

// 

const seedData = async()=>{
    try {
        // xoá toàn bộ
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();
        //  tạo
        const createdUser = await User.create({
            name:"Admin User",
            email:"admin@gmail.com",
            password:"123456",
            role:"admin" 
        });
        // 
        const userID = createdUser._id;
        const sampleProducts = products.map((product)=>{
            return {...product,user:userID};
        })

        await Product.insertMany(sampleProducts);
        console.log("Dữ liệu sản phẩm đã được gieo thành công");
        process.exit();
    } catch (error) {
        console.error('Lỗi khi gieo dữ liệu:',error);
        process.exit(1);
    }
};
seedData();