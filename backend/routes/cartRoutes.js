const express = require("express");
const Cart = require("../model/Cart");
const Product = require("../model/Product");
const {protect} = require("../middleware/authMiddleware");


const router = express.Router();
// 
const getCart = async(userId,guestId) =>{
    if(userId){
        return await Cart.findOne({user:userId});
    } else if (guestId){
        return await Cart.findOne({guestId});
    }
    return null;
}

// 
router.post("/",async(req,res)=>{
    const {productId,quantity,size,color,guestId,userId}=req.body;
    try {
        const product = await Product.findById(productId);
        if(!product) return res.status(404).json({message:"Không tìm thấy giỏ hàng"});

        // 
        let cart = await getCart(userId,guestId);
        // if
        if(cart){
            const  productIndex = cart.products.findIndex(
                (p) =>
                    p.productId.toString() === productId &&
                    p.size === size &&
                    p.color === color 
            );
             if(productIndex > -1){
                cart.products[productIndex].quantity += quantity;
             } else{
                cart.products.push({
                    productId,
                    name:product.name,
                    image: product.images[0].url,
                    price: product.price,
                    discountPrice: product.discountPrice,
                    size,
                        color,
                        quantity
                })
             }
            //  
            cart.totalPrice = cart.products.reduce(
                (acc,item) => acc + item.price * item.quantity,
                0
            );
            await cart.save();
            return res.status(200).json(cart);

        } else{
            const newCart = await Cart.create({
                userId: userId ? userId : undefined,
                guestId: guestId ? guestId : "guest_" + new Date().getTime(),
                products:[
                    {
                        productId,
                        name:product.name,
                        image:product.images[0].url,
                        price: product.price,
                        size,color,quantity,
                    }
                ],
                totalPrice:product.price * quantity,
            })
            return res.status(201).json(newCart);
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Lỗi máy chủ"});
    }
})

// thêm giỏ hàng
router.put("/",async(req,res)=>{
    const {productId,quantity,size,color,guestId,userId} = req.body;
    try {
        let cart = await getCart(userId,guestId);
        if(!cart) return res.status(404).json({message:"Không tìm thấy giỏ hàng"});

        const productIndex = cart.products.findIndex(
            (p)=>
                p.productId.toString() === productId &&
            p.size === size &&
            p.color === color
        );

        if(productIndex > -1){
            if(quantity > 0){
                cart.products[productIndex].quantity = quantity;
            } else{
                cart.products.splice(productIndex, 1);
            }
            cart.totalPrice = cart.products.reduce(
                (acc, item) => {
                  const price = item.discountPrice ?? item.price;
                  return acc + price * item.quantity;
                },
                0
              );
                        
            await cart.save();
            return res.status(200).json(cart);
        }
        else{
            return res.status(404).json({message:"Không tìm thấy giỏ hàng"});
        }
   
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"Lỗi hệ thống"});
    }
})

// xoá

router.delete("/",async(req,res)=>{
    const {productId,size,color,guestId,userId} = req.body;
    try {
        let cart = await getCart(userId,guestId);

        if(!cart) return res.status(404).json({message:"Không tìm thấy giỏ hàng"});

        const productIndex = cart.products.findIndex(
            (p) => p.productId.toString() === productId &&
            p.size === size &&
            p.color === color
        );

        if(productIndex > -1){
            cart.products.splice(productIndex,1);

            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );
            
            await cart.save();
            return res.status(200).json(cart);
        }
        else{
            return res.status(404).json({message:"Không tìm thấy sản phẩm trong giỏ hàng"});
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"Lỗi hệ thống"})
    }
})

// 
router.get("/", async(req,res)=>{
    const {userId,guestId} =req.query;

    try {
        const cart = await getCart(userId,guestId);
        if(cart){
            res.json(cart);
        }
         else {
            res.status(404).json({message:"Không tìm thấy giỏ hàng"});
         }
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Lỗi hệ thống"});
    }
})

// 
router.post("/merge",protect,async(req,res)=>{
    const{guestId} = req.body;

    try {
        // 
        const guestCart = await Cart.findOne({guestId});
        const userCart = await Cart.findOne({user: req.user._id})

        if(guestCart){
            if(guestCart.products.length === 0){
                return res.status(400).json({message:"Giỏ hàng của khách đang trống"});
            }

            if(userCart){
                guestCart.products.forEach((guestItem)=>{
                    const productIndex = userCart.products.findIndex(
                        (item) =>
                            item.productId.toString() === guestItem.productId.toString() &&
                            item.size === guestItem.size &&
                            item.color === guestItem.color
                    );

                    if(productIndex > -1){
                        userCart.products[productIndex].quantity += guestItem.quantity;

                    }
                    else{
                        userCart.products.push(guestItem);
                    }
                });

                userCart.totalPrice = userCart.products.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                );
                
                await userCart.save();

                // xoá
                try {
                    await Cart.findOneAndDelete({guestId});
                } catch (error) {
                    console.error("Lỗi khi xóa giỏ hàng của khách:",error);
                }
                res.status(200).json(userCart);
            }else{
                guestCart.user = req.user._id;
                guestCart.guestId = undefined;
                await guestCart.save();

                res.status(200).json(guestCart);
            }
        }
        else{
            if(userCart){
                return res.status(200).json(userCart);
            }
            res.status(404).json({message:"Không tìm thấy giỏ hàng của khách"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Lỗi hệ thống"});
    }
})

module.exports = router;