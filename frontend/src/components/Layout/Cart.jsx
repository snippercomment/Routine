import React, { useState } from 'react'
import { IoMdClose } from 'react-icons/io';
import CartContent from '../Cart/CartContent';
import { useNavigate } from 'react-router-dom';
import {useSelector} from "react-redux"

const Cart = ({drawerOpen,toggleCart}) => {
  const navigate = useNavigate();
  const {user,guestId} = useSelector((state)=>state.auth);
  const {cart} = useSelector((state)=>state.cart);
  const userId = user ? user._id : null;
  const handleCheckout =()=>{
    toggleCart();
    if(!user){
      navigate("/login?redirect=checkout");
    } else{
      navigate("/checkout");
    }
   
  }
    
  return (
    <div className={`fixed top-0 right-0 w-3/2 sm:w-1/2 md:w-[30rem] h-full bg-white shadow-lg 
    transform transition-transform duration-300 flex flex-col z-50 ${drawerOpen ? "translate-x-0":"translate-x-full"}`}>
      {/* close */}
      <div className='flex justify-end p-4'>
          <button onClick={toggleCart}>
              <IoMdClose className='h-6 w-6 text-gray-600 cursor-pointer' />
          </button>
      </div>
      {/*  */}
      <div className='flex-grow p-4 overflow-y-auto'>
        <h2 className='text-xl font-semibold mb-4'>Giỏ hàng của bạn</h2>
        {cart && cart?.products?.length > 0 ? (
          <CartContent cart={cart} userId={userId} guestId={guestId} />
        ):(
          <p>Giỏ hàng của bạn đang trống</p>
        )}
      </div>
      <div className='p-4 bg-white sticky bottom-0'>
      {cart && cart?.products?.length > 0 && (
        <>
        <button onClick={handleCheckout} className='w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800'>Thanh toán</button>
        <p className='text-sm tracking-tighter text-gray-500 mt-2 text-center'>Phí vận chuyển, thuế và mã giảm giá được tính khi thanh toán</p>
       
        </>
      )}
       </div>
    </div>
  )
};

export default Cart