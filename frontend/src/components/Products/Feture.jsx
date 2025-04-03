import React from 'react'
import { Link } from 'react-router-dom'
import featured from '../../assets/future.png'
const Feture = () => {
  return (
    <section className='container mx-auto flex flex-col-reverse lg:flex-row items-center bg-green-50 rounded-3xl'>
      <div className='lg:w-1/2 p-8 text-center lg:text-left'>
        <h2 className='text-lg font-semibold text-gray-700 mb-2'>
        Sự thoải mái và phong cách
        </h2>
        <h2 className='text-4xl lg:text-5xl font-bold mb-6'>
          Trang phục dành cho cuộc sống hàng ngày của bạn
        </h2>
        <p className='text-lg text-gray-600 mb-6'>
        Khám phá trang phục thoải mái, chất lượng cao, kết hợp thời trang và chức năng một cách dễ dàng. 
        Được thiết kế để giúp bạn trông và cảm thấy tuyệt vời mỗi ngày.
        </p>
        <Link to="/collections/all" className='bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800'>
         Mua ngay
        </Link>
      </div>
      {/* ben phải */}
      <div className='lg:w-1/2'>
        <img src={featured} alt='Fe' className='w-full h-full object-cover lg:rounded-tr-3xl lg:rounded-br-3xl'/>
      </div>
    </section>
  )
}

export default Feture