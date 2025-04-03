import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllOrders, updateOrderStatus } from '../../redux/slices/adminOrderSlice';

const Order = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user}= useSelector((state)=>state.auth);
    const {orders,loading,error} = useSelector((state)=>state.adminOrders);
    useEffect(()=>{
      if(!user || user.role !== "admin"){
        navigate("/")
      } else{
        dispatch(fetchAllOrders());
      }
    },[dispatch,user,navigate])
    const handleStatusChange = (orderId,status) =>{
       dispatch(updateOrderStatus({id:orderId,status}))
    };
    if(loading) return <p>Đang tải ...</p>;
    if(error) return <p>Lỗi: {error}</p>;
  return (
    <div className='max-w-7xl mx-auto p-6'>
      <h2 className='text-2xl font-bold mb-6'>Quản lý đơn hàng</h2>
      <div className='overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='min-w-full text-left text-gray-500'>
            <thead className='bg-gray-100 text-xs uppercase text-gray-700'>
                <tr>
                    <th className='py-3 px-4'>Mã đơn hàng</th>
                    <th className='py-3 px-4'>Khách hàng</th>
                    <th className='py-3 px-4'>Tổng giá</th>
                    <th className='py-3 px-4'>Trạng thái</th>
                    <th className='py-3 px-4'>Hành động</th>
                </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order)=>(
                  <tr key={order._id} className='border-b hover:bg-gray-50 cursor-pointer'>
                    <td className='py-4 px-4 font-medium text-gray-900 whitespace-nowrap'>
                      #{order._id}
                    </td>
                    <td className='p-4'>{order.user.name}</td>
                    <td className='p-4'>{order.totalPrice.toFixed(2)} đ</td>
                    <td className='p-4'>
                      <select
                       value={order.status}
                       onChange={(e) => handleStatusChange(order._id,e.target.value)}
                       className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5'
                      >
                        <option value="Processing">Đang xử lý</option>
                        <option value="Shipped">Đã vận chuyển</option>
                        <option value="Delivered">Đã giao hàng</option>
                        <option value="Cancelled">Đã hủy</option>
                      </select>
                    </td>
                    <td className='p-4'>
                      <button onClick={()=>handleStatusChange(order._id,"Delivered")
                        
                      }
                      className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'>Đánh dấu là Đã giao hàng</button>
                    </td>
                  </tr>
                ))
              ):(
                <tr>
                  <td colSpan={5} className='p-4 text-center text-gray-500'>Không có đơn hàng nào.</td>
                </tr>
              )}
            </tbody>
               
        </table>
      </div>
    </div>
  );
}

export default Order;
