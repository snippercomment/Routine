import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addUser, deleteUser, fetchUsers, updateUser } from '../../redux/slices/adminSlice';
import { toast } from 'sonner';

const UserManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { admin } = useSelector((state) => state.adminAuth);
    const { users, loading, error } = useSelector((state) => state.admin);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!admin) {
            navigate('/loginAdmin');
        } else if (admin.role !== 'admin') {
            navigate('/loginAdmin');
        }
    }, [admin, navigate]);

    useEffect(() => {
        if (admin && admin.role === 'admin') {
            dispatch(fetchUsers());
        }
    }, [dispatch, admin]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "customer"
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await dispatch(addUser(formData)).unwrap();
            toast.success('Thêm người dùng thành công');
            setFormData({
                name: "",
                email: "",
                password: "",
                role: "customer"
            });
        } catch (error) {
            toast.error(error.message || 'Lỗi khi thêm người dùng');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        if (window.confirm(`Bạn có chắc chắn muốn thay đổi quyền của người dùng này thành ${newRole}?`)) {
            try {
                await dispatch(updateUser({ id: userId, role: newRole })).unwrap();
                toast.success('Cập nhật quyền thành công');
            } catch (error) {
                toast.error(error.message || 'Lỗi khi cập nhật quyền');
            }
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
            try {
                await dispatch(deleteUser(userId)).unwrap();
                toast.success('Xóa người dùng thành công');
            } catch (error) {
                toast.error(error.message || 'Lỗi khi xóa người dùng');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className='max-w-7xl mx-auto p-4 sm:p-6'>
            <h2 className='text-2xl font-bold mb-6'>Quản lý người dùng</h2>
            {error && (
                <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                    <p>{error}</p>
                </div>
            )}

            {/* Form thêm người dùng */}
            <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
                <h3 className='text-lg font-bold mb-4'>Thêm người dùng mới</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-gray-700 mb-2'>Tên</label>
                            <input
                                type='text'
                                name='name'
                                value={formData.name}
                                onChange={handleChange}
                                className='w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                required
                            />
                        </div>

                        <div>
                            <label className='block text-gray-700 mb-2'>Email</label>
                            <input
                                type='email'
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                className='w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                required
                            />
                        </div>

                        <div>
                            <label className='block text-gray-700 mb-2'>Mật Khẩu</label>
                            <input
                                type='password'
                                name='password'
                                value={formData.password}
                                onChange={handleChange}
                                className='w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                required
                            />
                        </div>

                        <div>
                            <label className='block text-gray-700 mb-2'>Quyền</label>
                            <select
                                name='role'
                                value={formData.role}
                                onChange={handleChange}
                                className='w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            >
                                <option value="customer">Khách hàng</option>
                                <option value="admin">Quản trị viên</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className={`w-full md:w-auto px-6 py-2 rounded-lg font-medium transition-colors duration-300 ${isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                    >
                        {isSubmitting ? 'Đang xử lý...' : 'Thêm người dùng'}
                    </button>
                </form>
            </div>

            {/* Bảng danh sách người dùng */}
            <div className='bg-white rounded-lg shadow-md overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>
                        <thead className='bg-gray-50'>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Tên</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Email</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Quyền</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Hành động</th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {users.map((user) => (
                                <tr key={user._id} className='hover:bg-gray-50'>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='text-sm font-medium text-gray-900'>{user.name}</div>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='text-sm text-gray-500'>{user.email}</div>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            className='text-sm border rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                        >
                                            <option value="customer">Khách hàng</option>
                                            <option value="admin">Quản trị viên</option>
                                        </select>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm'>
                                        <button
                                            onClick={() => handleDeleteUser(user._id)}
                                            className='text-red-600 hover:text-red-900 font-medium'
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
