import {FaFacebook} from 'react-icons/fa'
import {IoLogoInstagram} from 'react-icons/io'
import {RiTwitterXLine} from 'react-icons/ri'

const Topbar = () => {
  return (
    <div className="bg-[#ea2e0e] text-white">
        <div className="container mx-auto flex justify-between items-center py-3 px-4" >
            <div className='hidden md:flex items-center space-x-4'>
                <a href="#" className="hover:text-gray-300">
                <FaFacebook className='w-5 h-5'/>
                </a>
                <a href="#" className="hover:text-gray-300">
                <IoLogoInstagram className='w-5 h-5'/>
                </a>
                <a href="#" className="hover:text-gray-300">
                <RiTwitterXLine className='w-4 h-4'/>
                </a>
                
            </div>
            <div className='text-sm text-center flex-grow'>
              <span>Chúng tôi giao hàng trên toàn thế giới - Giao hàng nhanh chóng và đáng tin cậy!</span>
            </div>
            <div className='text-sm hidden md:block'>
              <a href='tel:+1234567890' className='hover:text-gray-300'>
                +1 (234) 567-890
              </a>
            </div>
        </div>
    </div>
  )
}

export default Topbar