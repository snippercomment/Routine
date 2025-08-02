import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllOrders, updateOrderStatus } from '../../redux/slices/adminOrderSlice';
import { checkAdminAuth } from '../../redux/slices/adminAuthSlice';
import { FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import { toast } from 'sonner';

const Order = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useSelector((state) => state.adminAuth);
  const { orders, loading, error } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await dispatch(checkAdminAuth()).unwrap();
        dispatch(fetchAllOrders());
      } catch (error) {
        toast.error('Vui lòng đăng nhập để truy cập trang admin');
        navigate("/loginAdmin");
      }
    };

    if (!isAuthenticated) {
      checkAuth();
    } else {
      dispatch(fetchAllOrders());
    }
  }, [dispatch, isAuthenticated, navigate]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await dispatch(updateOrderStatus({ id: orderId, status })).unwrap();
      toast.success('Cập nhật trạng thái đơn hàng thành công');
    } catch (error) {
      toast.error(error.message || 'Không thể cập nhật trạng thái đơn hàng');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FaSpinner className="animate-spin text-blue-500 text-4xl mb-4" />
        <p className="text-gray-600">Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center">
            <FaExclamationCircle className="text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
          <button
            onClick={() => dispatch(fetchAllOrders())}
            className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

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
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className='py-3 px-4'>{order._id}</td>
                  <td className='py-3 px-4'>{order.user?.name || 'N/A'}</td>
                  <td className='py-3 px-4'>{order.totalPrice?.toLocaleString() || '0'}đ</td>
                  <td className='py-3 px-4'>
                    <select
                      value={order.status || 'Processing'}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                    >
                      <option value="Pending">Đang chờ xử lý</option>
                      <option value="Processing">Đang xử lý</option>
                      <option value="Shipped">Đã gửi hàng</option>
                      <option value="Delivered">Đã giao hàng</option>
                      <option value="Cancelled">Đã hủy</option>
                    </select>
                  </td>
                  <td className='py-3 px-4'>
                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className='text-red-600 hover:text-red-900'
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className='py-3 px-4 text-center'>
                  Không có đơn hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Order;
