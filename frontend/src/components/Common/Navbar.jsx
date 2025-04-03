import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {HiOutlineUser,HiOutlineShoppingBag,HiBars3BottomRight} from 'react-icons/hi2'
import SearchBar from './SearchBar';
import Cart from '../Layout/Cart';
import { IoMdClose } from 'react-icons/io';
import { useSelector } from 'react-redux';
import logo from '../../assets/logo.webp';


const Navbar = () => {
  const [drawerOpen,setDrawerOpen] = useState(false);
  const [navDrawerOpen,setNavDrawerOpen] = useState(false);
  const {cart} = useSelector((state)=>state.cart);
  const {user} = useSelector((state)=>state.auth);
  const cartItemCount = cart?.products?.reduce((total,product)=>total + product.quantity, 0) || 0;

  const toggleNavDrawer = () =>{
    setNavDrawerOpen(!navDrawerOpen)
  }
    const toggleCart = ()=>{
        setDrawerOpen(!drawerOpen);
    }
  return (
    <>
      <nav className='container mx-auto flex items-center justify-between py-4 px-6'>
      {/* logo web */}
        <div>
                  <Link to="/" >
                   <img src={logo} alt="Logo" className="w-12 h-12" />
                   </Link>

        </div>
         {/* ở giữa */}
         <div className='hidden md:flex space-x-6'>
          <Link to= '/' className='text-gray-700 hover:text-black text-sm font-medium uppercase' >
             Trang chủ
            </Link>
            <Link to= '/collections/all?gender=Men' className='text-gray-700 hover:text-black text-sm font-medium uppercase' >
                Nam
            </Link>
            <Link to= '/collections/all?gender=Women' className='text-gray-700 hover:text-black text-sm font-medium uppercase' >
                Nữ
            </Link>
           
            <Link to= '/about-us' className='text-gray-700 hover:text-black text-sm font-medium uppercase' >
                Về Routine
            </Link>
         </div>
         {/* icon dang nhập */}

        
         <div className='flex items-center space-x-4'>
         {user && user.role === "admin" &&(
            <Link to='/admin' className=' block bg-black px-2 rounded text-sm text-white' >Admin</Link>
         )}
           
            <Link to='/profile' className='hover:text-black'>
                <HiOutlineUser className='h-6 w-6 text-gray-700'/>
            </Link>
           <button onClick={toggleCart} className='relative hover:text-black cursor-pointer'>
            <HiOutlineShoppingBag className='h-6 w-6 text-gray-700'/>
            {cartItemCount > 0 && (
              <span className='absolute -top-1 bg-[#ea2e0e] text-white text-sm rounded-full px-2 py-0.5'>{cartItemCount}</span>
            )}
           
           </button>
           {/* tìm kiếm */}
           <div className='overflow-hidden'>
           <SearchBar/>
           </div>
          
           <button onClick={toggleNavDrawer} className='md:hidden cursor-pointer'>
            <HiBars3BottomRight className='h-6 w-6 text-gray-700 '/>
           </button>
         </div>
      </nav>
     
    <Cart drawerOpen={drawerOpen} toggleCart={toggleCart} />
    {/* mobile */}
    <div className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform 
    duration-300 z-50 ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className='flex justify-end p-4'>
        <button onClick={toggleNavDrawer} className='cursor-pointer' >
          <IoMdClose className='h-6 w-6 text-gray-600' />
        </button>
      </div>
      <div className='p-4'>
        <h2 className='text-xl font-semibold mb-4'>Menu</h2>
        <nav className='space-y-4 cursor-pointer'>
        <Link to="/" onClick={toggleNavDrawer} className='block text-gray-600 hover:text-black'>Trang chủ</Link>
          <Link to="/collections/all?gender=Men" onClick={toggleNavDrawer} className='block text-gray-600 hover:text-black'>Nam</Link>
          <Link to="/collections/all?gender=Women" onClick={toggleNavDrawer} className='block text-gray-600 hover:text-black'>Nữ</Link>
          <Link to="/about-us" onClick={toggleNavDrawer} className='block text-gray-600 hover:text-black'> Về Routine</Link>
        </nav>
      </div>
    </div>
    </>
  );
}

export default Navbar;
