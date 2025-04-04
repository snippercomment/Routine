import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PaypalButton from './PaypalButton';
import { useDispatch, useSelector } from 'react-redux';
import { createCheckout } from '../../redux/slices/checkOutSlice';
import axios from 'axios';


// const cart ={
//     products:[
//         {
//             productId : 1,
//             name: "T-shirt",
//             size: "M",
//             color: "Red",
           
//             price:150000,
//             image:"https://picsum.photos/200?ramdom=1"
//         },
//         {
//             productId : 2,
//             name: "TS-shirt",
//             size: "S",
//             color: "Blue",
            
//             price:160000,
//             image:"https://picsum.photos/200?ramdom=2"
//         },


//     ],
//     totalPrice: 310000,
// }
const CheckOut = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {cart,loading,error} = useSelector((state)=>state.cart);
    const {user} = useSelector((state)=>state.auth)
    const [checkoutId,setCheckoutId] =useState(null);
    const [shippingAddress,setShippingAddress] = useState({
        firstName:"",
        lastName:"",
        address:"",
        city:"",
        postalCode:"",
        country:"",
        phone:"",
    });

    // 
    useEffect(()=>{
        if(!cart || !cart.products || cart.products.length === 0){
            navigate("/");
        }
    })
    const handleCreateCheckout = async(e)=>{
        e.preventDefault();
        if(cart && cart.products.length > 0){
            const  res = await dispatch(
                createCheckout({
                    checkoutItems : cart.products,
                    shippingAddress,
                    paymentMethod:"Paypal",
                    totalPrice:cart.totalPrice,
                })
            );
            if(res.payload && res.payload._id){
                setCheckoutId(res.payload._id);
            }
        }
    }
    const handlePaymentSuccess = async(details)=>{
       try {
         const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
            {paymentStatus:"paid",paymentDetails:details},
            {
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("userToken")}`
                }
            }

         );
         
            await handleFinalizeCheckout(checkoutId);
         
         
       } catch (error) {
            console.error(error);
       }
    };

    const handleFinalizeCheckout   = async(checkoutId)=>{
        try {
            const response = await axios.post(`
                ${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
            {},
        {
            headers:{
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            }
        });
        navigate("/order-confirmation");
        } catch (error) {
            console.error(error);
        }
    };
    if(loading) return <p>Đang tải giỏ hàng...</p>;
    if(error) return <p>Lỗi giỏ hàng...:{error}</p>;
    if(!cart || !cart.products || cart.products.length === 0){
        return <p>Giỏ hàng của bạn đang trống</p>
    }


  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter'>
        {/* trái */}
        <div className='bg-white rounded-lg p-6'>
            <h2 className='text-2xl uppercase mb-6'>
                Kiểm tra
            </h2>
            <form onSubmit={handleCreateCheckout}>
                <h3 className='text-lg mb-4'>
                    Chi tiết liên lạc
                </h3>
                <div className='mb-4'>
                    <label className='block text-gray-700'>Email</label>
                    <input type='email' value={user? user.email :""} className='w-full p-2 border rounded'disabled/>
                </div>
                <h3 className='text-lg mb-4'>Vận chuyển</h3>
                <div className='mb-4 grid grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-gray-700'>Tên</label>
                        <input type='text' value={shippingAddress.firstName} 
                        onChange={(e)=>setShippingAddress({...shippingAddress,firstName:e.target.value})}
                        className='w-full p-2 border rounded'/>
                    </div>

                    {/*  */}
                    <div>
                        <label className='block text-gray-700'>Họ</label>
                        <input type='text' value={shippingAddress.lastName} 
                        onChange={(e)=>setShippingAddress({...shippingAddress,lastName:e.target.value})}
                        className='w-full p-2 border rounded'/>
                    </div>
                </div>
                {/* địa chỉ */}
                <div className='mb-4'>
                    <label className='block text-gray-700'>Địa chỉ</label>
                    <input type='text' value={shippingAddress.address} 
                        onChange={(e)=>setShippingAddress({...shippingAddress,address:e.target.value})}
                        className='w-full p-2 border rounded'
                        required
                    />
                </div>
                {/* thành phố và mạ bưu chính thành phố */}
                <div className='mb-4 grid grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-gray-700'>Thành phố</label>
                        <input type='text' value={shippingAddress.city} 
                        onChange={(e)=>setShippingAddress({...shippingAddress,city:e.target.value})}
                        className='w-full p-2 border rounded'/>
                    </div>

                    {/* Bưu chính  */}
                    <div>
                        <label className='block text-gray-700'>Mã bưu chính</label>
                        <input type='text' value={shippingAddress.postalCode} 
                        onChange={(e)=>setShippingAddress({...shippingAddress,postalCode:e.target.value})}
                        className='w-full p-2 border rounded'/>
                    </div>
                </div>
                {/* Quốc gia */}
                <div className='mb-4'>
                    <label className='block text-gray-700'>Quốc gia</label>
                    <input type='text' value={shippingAddress.country} 
                        onChange={(e)=>setShippingAddress({...shippingAddress,country:e.target.value})}
                        className='w-full p-2 border rounded'
                        required
                    />
                </div>
                {/* số điện thoại */}
                <div className='mb-4'>
                    <label className='block text-gray-700'>Số điện thoại</label>
                    <input type='text' value={shippingAddress.phone} 
                        onChange={(e)=>setShippingAddress({...shippingAddress,phone:e.target.value})}
                        className='w-full p-2 border rounded'
                        required
                    />
                </div>
                {/* nút chọn */}
                <div className='mt-6'>
                    {!checkoutId ? (
                        <button type='submit' className='w-full bg-black text-white py-3 rounded'>Tiếp tục thanh toán</button>
                    ):(
                        <div>
                            <h3 className='text-lg mb-4'>Thanh toán bằng Paypal</h3>
                            {/* pay */}
                            <PaypalButton amount={cart.totalPrice} onSuccess ={handlePaymentSuccess} onError={(err)=>alert("Payment failed.Try again.")} />
                        </div>
                    )}
                </div>
            </form>
        </div>
        {/* phải */}
        <div className='bg-gray-50 p-6 rounded-lg'>
            <h3 className='text-lg mb-4'>Tóm tắt đơn hàng</h3>
            <div className='border-t py-4 mb-4'>
                {cart.products.map((product,index)=>(
                    <div key={index} className='flex items-start justify-between py-2 border-b'>
                        <div className='flex items-start'>
                            <img src={product.image} alt={product.name} className='w-20 h-24 object-cover mr-4'/>
                            <div>
                                <h3 className='text-md'>{product.name}</h3>
                                <p className='text-gray-500'>Size: {product.size}</p>
                                <p className='text-gray-500'>Color: {product.color}</p>
                            </div>
                            
                        </div>
                        <p className='text-xl'>
                                {(product.discountPrice ?? product.price)?.toLocaleString('vi-VN')} đ
                            </p>
      
                    </div>
                ))}
            </div>
            <div className='flex justify-between items-center text-lg mb-4'>
                <p>Giá tiền: </p>
                <p>{cart.products.reduce((total, product) => {
                    const price = product.discountPrice ?? product.price;
                    return total + price * product.quantity;
                }, 0).toLocaleString('vi-VN')} đ</p>
            </div>

            <div className='flex justify-between items-center text-lg'>
                <p>Phí ship</p>
                <p>Miễn phí</p>
            </div>
            {/*  */}
                <div className='flex justify-between items-center text-lg mt-4 border-t pt-4'>
                <p>Tổng :</p>
                <p>{cart.products.reduce((total, product) => {
                    const price = product.discountPrice ?? product.price;
                    return total + price * product.quantity;
                }, 0).toLocaleString('vi-VN')} đ</p>
            </div>

        </div>
    </div>
  )
}

export default CheckOut