import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Link, useParams} from "react-router-dom";
import { fetchOrderDetails } from '../redux/slices/orderSlice';

const OrderDetailsPage = () => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const {orderDetails,loading,error} = useSelector((state)=>state.orders);

    useEffect(()=>{
      dispatch(fetchOrderDetails(id));
    },[dispatch,id])

  
    if(loading) return <p>Đang tải...</p>;
    if(error) return <p>Lỗi...:{error}</p>;
  return (
    <div className='max-w-7xl mx-auto p-4 sm:p-6'>
      <h2 className='text-2xl md:text-3xl font-bold mb-6'>
        Chi tiết đơn hàng
      </h2>
      {!orderDetails ? (<p className=''>Không tìm thấy chi tiết đơn hàng</p>): <div className='p-4 sm:p-6 rounded-lg border'>
        <div className='flex flex-col sm:flex-row justify-between mb-8'>
          <div>
            <h3 className='text-lg md:text-xl font-semibold'>
              Mã đơn hàng: #{orderDetails._id}
            </h3>
            <p className='text-gray-600'>
              {new Date(orderDetails.createdAt).toLocaleDateString()}
            </p>
          </div>
          {/*  */}
          <div className='flex flex-col items-start sm:items-end mt-4 sm:mt-0'>
            <span className={`${orderDetails.isPaid ? "bg-green-100 text-green-700":"bg-red-100 text-red-700"} px-3 py-1 rounded-full text-sm font-medium mb-2`}>{orderDetails.isPaid ? "Đã phê duyệt":"Chưa phê duyệt"}</span>
            <span className={`${orderDetails.isDelivered ? "bg-green-100 text-green-700":"bg-yellow-100 text-yellow-700"} px-3 py-1 rounded-full text-sm font-medium mb-2`}>{orderDetails.isDelivered ? "Đã giao hàng":"Đang chờ giao hàng"}</span>
          </div>
        </div>
        {/*  */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8'>
          <div>
            <h4 className='text-lg font-semibold mb-2'>Thông tin thanh toán</h4>
            <p className=''>Phương thức thanh toán: {orderDetails.paymentMethod}</p>
            <p>Trạng thái: {orderDetails.isPaid ? "Đã thanh toán":"Chưa thanh toán"}</p>
          </div>
          {/*  */}
          <div>
            <h4 className='text-lg font-semibold mb-2'>Thông tin vận chuyển</h4>
            <p className=''>Phương thức vận chuyển: {orderDetails.shippingMethod}</p>
            <p>Địa chỉ: {`${orderDetails.shippingAddress.city},${orderDetails.shippingAddress.country}`}</p>
          </div>
        </div>
        {/*  */}
        <div className='overflow-x-auto'> 
         <h4 className='text-lg font-semibold mb-4'>Sản phẩm</h4>
         <table className='min-w-full text-gray-600 mb-4'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='py-2 px-4'>Tên</th>
                <th className='py-2 px-4'>Đơn giá</th>
                <th className='py-2 px-4'>Số Lượng</th>
                <th className='py-2 px-4'>Tổng cộng</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails?.orderItems?.map((item)=>(
                <tr key={item.productId} className='border-b'>
                  <td className='py-2 px-4 flex items-center'>
                    <img src={item.image}
                      alt={item.name}
                      className='w-12 h-12 object-cover rounded-lg mr-4'
                    />
                    <Link to={`/product/${item.productId}`} className='text-blue-600 hover:underline'>{item.name}</Link>
                  </td>
                  <td className='py-2 px-4'>{item.price} đ</td>
                  <td className='py-2 px-4'>{item.quantity}</td>
                  <td className='py-2 px-4'>{item.price * item.quantity} đ</td>
                </tr>
              ))}
            </tbody>
         </table>
        </div>
        {/*  */}
        <Link to='/my-orders' className='text-blue-500 hover:underline'>Quay lại đơn hàng của tôi</Link>
      </div>}
    </div>
  );
}

export default OrderDetailsPage;
