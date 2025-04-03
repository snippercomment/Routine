import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import login from '../assets/lala.png'
import {loginUser} from "../redux/slices/uathSlice"
import { useDispatch, useSelector } from 'react-redux';
import { mergeCart } from '../redux/slices/cartSlice';

const Login = () => {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const {user,guestId,loading } = useSelector((state)=>state.auth);
    const {cart} = useSelector((state)=> state.cart);
    // 
    const redirect = new URLSearchParams(location.search).get("redirect") || "/";
    const isCheckoutRedirect = redirect.includes("checkout");

    useEffect(()=>{
        if(user){
            if(cart?.products?.length > 0 && guestId){
                dispatch(mergeCart({guestId,user})).then(()=>{
                    navigate(isCheckoutRedirect ? "/checkout":"/");
                });
            } else{
                navigate(isCheckoutRedirect ? "/checkout":"/");
            }
        }
    },[user,guestId,cart,navigate,isCheckoutRedirect,dispatch])

    const handleSubmit = (e)=>{
        e.preventDefault();
       dispatch(loginUser({email,password}));
    }
  return (
    <div className='flex'>
        <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12'>
            <form onSubmit={handleSubmit} className='w-full max-w-md bg-white p-8 rounded-lg border shadow-sm'>
            <div className='flex justify-center mb-6'>
                <h2 className='text-xl font-medium'>Routine</h2>
            </div>
            <p className='text-center mb-6'>
                Nhập tên người dùng và mật khẩu để đăng nhập
            </p>
            <div className='mb-4'>
                <label className='block text-sm font-semibold mb-2'>Email</label>
                <input
                    type='email'
                    value={email}
                    className='w-full p-2 border rounded'
                    onChange={(e)=> setEmail(e.target.value)}
                    placeholder='Nhập Email của bạn' 
                />
                
            </div>
            <div className='mb-4'>
                <label className='block text-sm font-semibold mb-2'>Mật khẩu</label>
                <input
                    type='password'
                    value={password}
                    className='w-full p-2 border rounded'
                    onChange={(e)=> setPassword(e.target.value)}
                    placeholder='Nhập Mật khẩu của bạn' 
                />
                
            </div>
            <button className='w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition'>
           { loading ? "Đang tải.."  :  "Đăng Nhập"}
            </button>
            <p className='mt-6 text-center text-sm'>
             Bạn chưa có tài khoản?
              <Link className='text-blue-500' to={`/register?redirect=${encodeURIComponent(redirect)}`}> Đăng ký</Link>
            </p>
            </form>
        </div>
        <div className='hidden md:block w-1/2 bg-gray-800'>
            <div className='h-full flex flex-col justify-center items-center'>
                <img src={login} alt='Login' className='h-[750px] w-full object-cover'/>
            </div>
        </div>
    </div>
  )
}

export default Login