import React from 'react'
import { Link } from 'react-router-dom';
import {FaFacebook} from 'react-icons/fa'
import {IoLogoInstagram} from 'react-icons/io'
import {RiTwitterXLine} from 'react-icons/ri'
import { FiPhoneCall } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className='border-t py-12 px-6'>
        <div className='container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0'>
            <div>
                <h3 className='text-lg text-gray-800 mb-4'>Bản tin</h3>
                <p className='text-gray-500 mb-4'>Hãy là người đầu tiên biết về sản phẩm mới, sự kiện độc quyền và ưu đãi trực tuyến.</p>
                <p className='font-medium text-sm text-gray-600 mb-6'>Đăng ký và được giảm giá 10% cho đơn hàng đầu tiên của bạn</p>
                {/*  */}
                <form className="flex max-w-xs">
                    <input
                        type="email"
                        placeholder="Nhập Email của bạn"
                        className="p-2 w-full text-xs border-t border-l border-b border-gray-300 rounded-l-md 
                                focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-black text-white px-4 py-2 text-xs rounded-r-md hover:bg-gray-800 
                                cursor-pointer transition-all"
                    >
                        Đặt mua
                    </button>
                    </form>

            </div>
            {/* link */}
            <div>
                <h3 className='text-lg text-gray-800 mb-4'>Cửa hàng</h3>
                <ul className='space-y-2 text-gray-600'>
                    <li>
                        <Link to="#" className='hover:text-gray-500 transition-colors'>Áo nam</Link>
                    </li>
                    <li>
                        <Link to="#" className='hover:text-gray-500 transition-colors'>Áo nữ</Link>
                    </li>
                    <li>
                        <Link to="#" className='hover:text-gray-500 transition-colors'>Quần nam</Link>
                    </li>
                    <li>
                        <Link to="#" className='hover:text-gray-500 transition-colors'>Quần nữ</Link>
                    </li>
                    <li>
                        <Link to="#" className='hover:text-gray-500 transition-colors'>Đầm Váy</Link>
                    </li>
                </ul>
            </div>

            {/*  */}
            <div>
                <h3 className='text-lg text-gray-800 mb-4'>Chính sách khách hàng</h3>
                <ul className='space-y-2 text-gray-600'>
                    <li>
                        <Link to="/warranty" className='hover:text-gray-500 transition-colors'>Chính sách bảo hành</Link>
                    </li>
                    <li>
                        <Link to="/security" className='hover:text-gray-500 transition-colors'>Chính sách bảo mật</Link>
                    </li>
                    <li>
                        <Link to="/return" className='hover:text-gray-500 transition-colors'>Chính sách đổi trả</Link>
                    </li>
                    
                </ul>
            </div>
        {/*  */}
            <div>
                <h3 className='text-lg text-gray-800 mb-4'>Theo dõi chúng tôi</h3>
                <div className='flex items-center space-x-4 mb-6'>
                    <a href='https://www.facebook.com/thuann.minh.142' target='_blank' rel="noopener noreferrer"
                    className='hover:text-gray-500'>
                        <FaFacebook className='h-5 w-5'/>
                    </a>
                    <a href='' target='_blank' rel="noopener noreferrer"
                    className='hover:text-gray-500'>
                         <IoLogoInstagram className='w-5 h-5'/>
                    </a>
                    <a href='' target='_blank' rel="noopener noreferrer"
                    className='hover:text-gray-500'>
                         <RiTwitterXLine className='w-4 h-4'/>
                    </a>
                </div>
                <p className='text-gray-500'>Gọi cho chúng tôi</p>
                <p>
                    <FiPhoneCall className='inline-block mr-2'/>
                    0123-456-789
                </p>
            </div>
        </div>
        {/*  */}
        <div className='container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-200 pt-6'>
            <p className='text-center text-gray-500 text-sm tracking-tighter'>
                2025,CompileTab. All Rights Reserved.
            </p>
        </div>
    </footer>
  )
}

export default Footer