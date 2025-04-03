import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteProduct, fetchAdminProducts } from '../../redux/slices/adminProductSlice';

const Product = () => {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.adminProducts);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        dispatch(fetchAdminProducts());
    }, [dispatch]);

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
            dispatch(deleteProduct(id));
        }
    };

    // Tính toán danh sách sản phẩm hiển thị
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(products.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p>Lỗi: {error}</p>;

    return (
        <div className='max-w-7xl mx-auto p-6'>
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold'>Quản lý sản phẩm</h2>
                <Link 
                    to='/admin/products/addProduct' 
                    className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600'>
                    Thêm sản phẩm
                </Link>
            </div>
            <div className='overflow-x-auto shadow-md sm:rounded-lg'>
                <table className='min-w-full text-left text-gray-500'>
                    <thead className='bg-gray-100 text-xs uppercase text-gray-700'>
                        <tr>
                            <th className='py-3 px-4'>Tên</th>
                            <th className='py-3 px-4'>Giá</th>
                            <th className='py-3 px-4'>SKU</th>
                            <th className='py-3 px-4'>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
    {currentProducts.length > 0 ? (
        currentProducts.map((product) => (
            <tr key={product._id} className='border-b hover:bg-gray-50 cursor-pointer'>
                <td className='p-4 font-medium text-gray-900 whitespace-nowrap'>{product.name}</td>
                <td className='p-4'>{product.price.toLocaleString('vi-VN')} đ</td>
                <td className='p-4'>{product.sku}</td>
                <td className='p-4'>
                    <Link 
                        to={`/admin/products/${product._id}/edit`} 
                        className='bg-yellow-500 text-white px-3 py-2 rounded-md mr-2 hover:bg-yellow-600 inline-block text-center'>
                        Sửa
                    </Link>
                    <button 
                        onClick={() => handleDelete(product._id)} 
                        className='bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 inline-block text-center cursor-pointer'>
                        Xoá
                    </button>
                </td>
            </tr>
        ))
    ) : (
        <tr>
            <td colSpan={4} className='p-4 text-center text-gray-500'>Không có sản phẩm nào</td>
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
                            className={`mx-1 px-4 py-2 rounded-md ${currentPage === number + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                            {number + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Product;
