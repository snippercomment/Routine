import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { checkAdminAuth } from '../../redux/slices/adminAuthSlice';

const AdminProtectedRoute = ({ children }) => {
    const dispatch = useDispatch();
    const { isAuthenticated, loading } = useSelector((state) => state.adminAuth);

    useEffect(() => {
        dispatch(checkAdminAuth());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/loginAdmin" replace />;
    }

    return children;
};

export default AdminProtectedRoute; 