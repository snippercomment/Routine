import React from 'react'
import { FaBoxOpen,  FaClipboardList, FaSign, FaSignOutAlt, FaStore, FaUser } from 'react-icons/fa'
import { useDispatch } from 'react-redux';
import {Link, NavLink, useNavigate} from "react-router-dom"
import { clearCart } from '../../redux/slices/cartSlice';
import { logout } from '../../redux/slices/uathSlice';
import logo from '../../assets/logo.webp';


const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = ()=>{
    dispatch(logout());
    dispatch(clearCart());
    navigate("/");
  }
  return (
    <div className='p-6'>
      <div className="mb-6 flex justify-center items-center">
        <Link to="/admin">
          <img src={logo} alt="Logo" className="w-12 h-12" />
        </Link>
      </div>

      
        <nav className='flex flex-col space-y-2'>
        {/*  */}
            <NavLink to="/admin/users" className={({isActive})=> isActive ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2":

            "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"} >
                <FaUser />
                <span>Người dùng</span>
            </NavLink>
            {/*  */}
            <NavLink to="/admin/products" className={({isActive})=> isActive ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2":

            "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"} >
                <FaBoxOpen />
                <span>Sản phẩm </span>
            </NavLink>

            {/*  */}
            <NavLink to="/admin/orders" className={({isActive})=> isActive ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2":

            "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"} >
                <FaClipboardList/>
                <span>Đơn hàng</span>
            </NavLink>
            {/*  */}
            <NavLink to="/admin/shop" className={({isActive})=> isActive ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2":

            "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"} >
                <FaStore/>
                <span>Cửa hàng</span>
            </NavLink>
        </nav>
        <div className='mt-6'>
          <button onClick={handleLogout} className='w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center
           justify-center space-x-2 hover:cursor-pointer'>
            <FaSignOutAlt/>
            <span>Đăng xuất</span>
           </button>
        </div>
    </div>
  )
}

export default AdminSidebar
