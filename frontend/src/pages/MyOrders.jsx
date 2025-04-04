import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserOrders } from '../redux/slices/orderSlice';

const MyOrders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi hiển thị... {error}</p>;

  return (
    <div className='max-w-7xl mx-auto p-4 sm:p-6'>
      <h2 className='text-xl sm:text-2xl font-bold mb-6'>Đơn hàng của tôi</h2>
      <div className='relative shadow-md sm:rounded-lg overflow-hidden'>
        <table className='min-w-full text-left text-gray-500'>
          <thead className='bg-gray-100 text-xs uppercase text-gray-700'>
            <tr>
              <th className='py-2 px-4 sm:py-3'>Hình Ảnh</th>
              <th className='py-2 px-4 sm:py-3'>ID</th>
              <th className='py-2 px-4 sm:py-3'>Ngày tạo</th>
              <th className='py-2 px-4 sm:py-3'>Địa chỉ giao hàng</th>
              <th className='py-2 px-4 sm:py-3'>Số lượng mặt hàng</th>
              <th className='py-2 px-4 sm:py-3'>Giá</th>
              <th className='py-2 px-4 sm:py-3'>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => handleRowClick(order._id)}
                  className='border-b hover:border-gray-500 cursor-pointer'>
                  {/* Cột hình ảnh */}
                  <td className='py-2 px-2 sm:py-4 sm:px-4'>
                    {order?.orderItems?.length > 0 && (
                      <img
                        src={order.orderItems[0].image || 'default-image.jpg'}
                        alt={order.orderItems[0].name}
                        className='w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg'
                      />
                    )}
                  </td>

                  {/* Cột ID đơn hàng */}
                  <td className='py-2 px-2 sm:py-4 font-medium text-gray-900 whitespace-nowrap'>
                    #{order._id}
                  </td>

                  {/* Cột ngày tạo */}
                  <td className='py-2 px-2 sm:py-4'>
                    {new Date(order.createdAt).toLocaleDateString()}{" "}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </td>

                  {/* Cột địa chỉ giao hàng */}
                  <td className='py-2 px-2 sm:py-4'>
                    {order.shippingAddress
                      ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                      : "N/A"}
                  </td>

                  {/* Cột số lượng mặt hàng */}
                  <td className='py-2 px-2 sm:py-4 font-medium'>
                    {order?.orderItems?.reduce((total, item) => total + item.quantity, 0)}
                  </td>

                  {/* Cột giá tiền */}
                  <td className='py-2 px-2 sm:py-4 font-medium'>
                    {order.totalPrice.toLocaleString()} đ
                  </td>

                  {/* Cột trạng thái đơn hàng */}
                  <td className='py-2 px-2 sm:py-4'>
                    <span
                      className={`${
                        order.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      } px-2 py-1 rounded-full text-xs sm:text-sm font-medium`}>
                      {order.isPaid ? "Đã giải quyết" : "Chưa giải quyết"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className='py-4 px-4 text-center text-gray-500'>
                  Không có đơn hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrders;
