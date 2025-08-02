import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteProduct, fetchAdminProducts } from '../../redux/slices/adminProductSlice';
import { FaSpinner, FaExclamationCircle, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'sonner';

const Product = () => {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.adminProducts);
    const [currentPage, setCurrentPage] = useState(1);
    const [deletingId, setDeletingId] = useState(null);
    const itemsPerPage = 10;

    useEffect(() => {
        dispatch(fetchAdminProducts());
    }, [dispatch]);

    const handleDelete = async (id) => {
        if (deletingId) return; // Đang xóa sản phẩm khác, không cho xóa tiếp
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
            try {
                setDeletingId(id);
                await dispatch(deleteProduct(id)).unwrap();
                toast.success('Xóa sản phẩm thành công');
            } catch (error) {
                toast.error(error.message || 'Không thể xóa sản phẩm');
            } finally {
                setDeletingId(null);
            }
        }
    };

    // Tính toán danh sách sản phẩm hiển thị
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products?.slice(indexOfFirstItem, indexOfLastItem) || [];
    const totalPages = Math.ceil((products?.length || 0) / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <FaSpinner className="animate-spin text-blue-500 text-4xl mb-4" />
                <p className="text-gray-600">Đang tải danh sách sản phẩm...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <div className="flex items-center">
                        <FaExclamationCircle className="text-red-500 mr-2" />
                        <p className="text-red-700">
                            {error === 'Failed to fetch'
                                ? 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet của bạn.'
                                : error}
                        </p>
                    </div>
                    <button
                        onClick={() => dispatch(fetchAdminProducts())}
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
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold'>Quản lý sản phẩm</h2>
                <Link
                    to='/admin/products/addProduct'
                    className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors'>
                    Thêm sản phẩm
                </Link>
            </div>
            <div className='overflow-x-auto shadow-md sm:rounded-lg'>
                <table className='min-w-full text-left text-gray-500'>
                    <thead className='bg-gray-100 text-xs uppercase text-gray-700'>
                        <tr>
                            <th className='py-3 px-4'>Tên</th>
                            <th className='py-3 px-4'>Giá</th>
                            <th className='py-3 px-4'>Mã sản phẩm</th>
                            <th className='py-3 px-4'>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.length > 0 ? (
                            currentProducts.map((product) => (
                                <tr key={product._id} className='border-b hover:bg-gray-50'>
                                    <td className='p-4 font-medium text-gray-900 whitespace-nowrap'>{product.name}</td>
                                    <td className='p-4'>{product.price?.toLocaleString('vi-VN')} đ</td>
                                    <td className='p-4'>{product.sku || 'N/A'}</td>
                                    <td className='p-4'>
                                        <Link
                                            to={`/admin/products/${product._id}/edit`}
                                            className='bg-yellow-500 text-white px-3 py-2 rounded-md mr-2 hover:bg-yellow-600 transition-colors inline-flex items-center'>
                                            <FaEdit className="mr-1" />
                                            Sửa
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            disabled={deletingId === product._id}
                                            className={`bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors inline-flex items-center ${deletingId === product._id ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                            <FaTrash className="mr-1" />
                                            {deletingId === product._id ? 'Đang xóa...' : 'Xóa'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className='p-4 text-center text-gray-500'>
                                    Không có sản phẩm nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Phân trang */}
            {totalPages > 1 && (
                <div className='flex justify-center mt-4'>
                    {[...Array(totalPages).keys()].map(number => (
                        <button
                            key={number + 1}
                            onClick={() => handlePageChange(number + 1)}
                            className={`mx-1 px-4 py-2 rounded-md transition-colors ${currentPage === number + 1
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}>
                            {number + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Product;
