import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaCaretDown } from 'react-icons/fa';
import { logoutAdmin } from '../../redux/slices/adminAuthSlice';

const AdminHeader = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { admin } = useSelector((state) => state.adminAuth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logoutAdmin());
        navigate('/loginAdmin');
    };

    return (
        <div className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <h1 className="text-xl font-bold text-gray-800">
                        Admin Dashboard
                    </h1>

                    <div className="relative">
                        <button
                            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                <FaUser className="text-white" />
                            </div>
                            <span>{admin?.email || 'Admin'}</span>
                            <FaCaretDown className={`transform transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
                                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                    <p className="font-medium">Đăng nhập với</p>
                                    <p className="truncate">{admin?.email || 'admin@example.com'}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                >
                                    <FaSignOutAlt />
                                    <span>Đăng xuất</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHeader; 