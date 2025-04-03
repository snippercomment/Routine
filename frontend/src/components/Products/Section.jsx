import React from 'react'
import { HiArrowDownOnSquare, HiArrowPathRoundedSquare, HiOutlineCreditCard, HiShoppingBag } from 'react-icons/hi2'

const Section = () => {
  return (
    <section className='py-16 px-4 bg-white'>
        <div className='container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
            {/*  1*/}
            <div className='flex flex-col items-center'>
                <div className='p-4 rounded-full mb-4'>
                    <HiShoppingBag className='text-xl'/>
                </div>
                <h4 className='tracking-tighter mb-2'>
                 MIỄN PHÍ VẬN CHUYỂN QUỐC TẾ
                </h4>
                <p className='text-gray-600 text-sm tracking-tighter'>
                    Trên tất cả các đơn hàng trên 500,00 đ
                </p>
            </div>
             {/*  2*/}
             <div className='flex flex-col items-center'>
                <div className='p-4 rounded-full mb-4'>
                    <HiArrowPathRoundedSquare className='text-xl'/>
                </div>
                <h4 className='tracking-tighter mb-2'>
                    45 NGÀY TRẢ HÀNG
                </h4>
                <p className='text-gray-600 text-sm tracking-tighter'>
                Đảm bảo hoàn lại tiền
                </p>
            </div>
             {/*  3*/}
             <div className='flex flex-col items-center'>
                <div className='p-4 rounded-full mb-4'>
                    <HiOutlineCreditCard className='text-xl'/>
                </div>
                <h4 className='tracking-tighter mb-2'>
                    THANH TOÁN AN TOÀN
                </h4>
                <p className='text-gray-600 text-sm tracking-tighter'>
                    Quy trình thanh toán an toàn 100%
                </p>
            </div>
        </div>
    </section>
  )
}

export default Section