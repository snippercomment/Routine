import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import login from '../assets/lolo.png';
import { registerUser } from '../redux/slices/uathSlice';
import { useDispatch, useSelector } from 'react-redux';
import { mergeCart } from '../redux/slices/cartSlice';
import { toast } from 'sonner';

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: ""
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, guestId, loading, error } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart);

    const redirect = new URLSearchParams(location.search).get("redirect") || "/";

    useEffect(() => {
        // Only handle redirect after successful registration and auto-login
        if (user) {
            const handleRedirect = async () => {
                try {
                    // If there are items in cart and we have a guestId, merge cart first
                    if (cart?.products?.length > 0 && guestId) {
                        await dispatch(mergeCart({ guestId, user })).unwrap();
                    }
                    // After cart merge (or if no merge needed), handle redirect
                    navigate(redirect);
                } catch (error) {
                    console.error('Error merging cart:', error);
                    // Even if cart merge fails, we should still redirect
                    navigate(redirect);
                }
            };

            handleRedirect();
        }
    }, [user, guestId, cart, navigate, redirect, dispatch]);

    const validateFields = () => {
        let newErrors = {};
        if (!name.trim()) newErrors.name = "Tên không được để trống.";
        if (!email.trim()) newErrors.email = "Email không được để trống.";
        if (password.length < 6) newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBlur = (field, value) => {
        let message = "";
        if (field === "name" && !value.trim()) message = "Tên không được để trống.";
        if (field === "email" && !value.trim()) message = "Email không được để trống.";
        if (field === "password" && value.length < 6) message = "Mật khẩu phải có ít nhất 6 ký tự.";
        setErrors((prev) => ({ ...prev, [field]: message }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateFields()) return;

        try {
            const result = await dispatch(registerUser({ name, email, password })).unwrap();

            if (result?.success) {
                toast.success('Đăng ký thành công!');
                // The redirect will be handled by the useEffect when user state updates
            }
        } catch (err) {
            const errorMessage = err.message || 'Đăng ký thất bại. Vui lòng thử lại.';
            toast.error(errorMessage);
            setErrors((prev) => ({ ...prev, email: errorMessage }));
        }
    };

    return (
        <div className='flex min-h-screen'>
            <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12'>
                <form onSubmit={handleSubmit} className='w-full max-w-md bg-white p-8 rounded-lg border shadow-sm'>
                    <div className='flex justify-center mb-6'>
                        <h2 className='text-2xl font-bold text-gray-800'>Routine</h2>
                    </div>
                    <p className='text-center mb-6 text-gray-600'>
                        Nhập thông tin để tạo tài khoản mới
                    </p>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                            <p className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </p>
                        </div>
                    )}

                    <div className='mb-4'>
                        <label className='block text-sm font-semibold mb-2 text-gray-700'>Tên</label>
                        <input
                            type='text'
                            value={name}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${errors.name ? 'border-red-500' : ''}`}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={(e) => handleBlur("name", e.target.value)}
                            placeholder='Nhập Tên của bạn'
                            disabled={loading}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div className='mb-4'>
                        <label className='block text-sm font-semibold mb-2 text-gray-700'>Email</label>
                        <input
                            type='email'
                            value={email}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${errors.email ? 'border-red-500' : ''}`}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={(e) => handleBlur("email", e.target.value)}
                            placeholder='Nhập Email của bạn'
                            disabled={loading}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div className='mb-6'>
                        <label className='block text-sm font-semibold mb-2 text-gray-700'>Mật khẩu</label>
                        <input
                            type='password'
                            value={password}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${errors.password ? 'border-red-500' : ''}`}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={(e) => handleBlur("password", e.target.value)}
                            placeholder='Nhập Mật khẩu của bạn'
                            disabled={loading}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <button
                        className={`w-full p-3 rounded-lg font-semibold transition-all duration-300 ${loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-black hover:bg-gray-800 text-white'
                            }`}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang xử lý...
                            </span>
                        ) : 'Đăng Ký'}
                    </button>
                    <p className='mt-6 text-center text-sm text-gray-600'>
                        Bạn đã có tài khoản?
                        <Link className='text-blue-600 hover:text-blue-800 ml-1 font-medium' to={`/login?redirect=${encodeURIComponent(redirect)}`}>
                            Đăng Nhập
                        </Link>
                    </p>
                </form>
            </div>
            <div className='hidden md:block w-1/2 bg-gray-800'>
                <div className='h-full flex flex-col justify-center items-center'>
                    <img src={login} alt='Login' className='h-[750px] w-full object-cover' />
                </div>
            </div>
        </div>
    );
};

export default Register;
