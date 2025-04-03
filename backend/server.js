const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const cartRouter = require("./routes/cartRoutes");
const checkoutRouter = require("./routes/checkOutRouter");
const orderRouter = require("./routes/orderRoutes");
const uploadRouter = require("./routes/uploadRoutes");
const subscribeRouter = require("./routes/subscribeRoutes");
const adminRouter = require("./routes/adminRoutes");
const productAdminRouter = require("./routes/productAdminRoutes");
const orderAdminRouter = require("./routes/adminOrderRoutes");



const app = express();
app.use(express.json());
app.use(cors());


dotenv.config();

const PORT = process.env.PORT || 3000;

// Mongo Db
connectDB();

app.get("/",(req,res)=>{
    res.send("CHÀO MỪNG ĐẾN VỚI API ROUTINE!")
})

// API Routes
app.use("/api/users",userRouter);
app.use("/api/products",productRouter);
app.use("/api/cart",cartRouter);
app.use("/api/checkout",checkoutRouter);
app.use("/api/orders",orderRouter);
app.use("/api/upload",uploadRouter);
app.use("/api",subscribeRouter);

// admin
app.use("/api/admin/users",adminRouter);
app.use("/api/admin/products",productAdminRouter);
app.use("/api/admin/orders",orderAdminRouter);

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})