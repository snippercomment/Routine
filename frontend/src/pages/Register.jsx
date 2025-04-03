import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import login from '../assets/lolo.png';
import { registerUser } from '../redux/slices/uathSlice';
import { useDispatch, useSelector } from 'react-redux';
import { mergeCart } from '../redux/slices/cartSlice';

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
    const { user, guestId, loading } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart);

    const redirect = new URLSearchParams(location.search).get("redirect") || "/";
    const isCheckoutRedirect = redirect.includes("checkout");

    useEffect(() => {
        if (user) {
            if (cart?.products?.length > 0 && guestId) {
                dispatch(mergeCart({ guestId, user })).then(() => {
                    navigate(isCheckoutRedirect ? "/checkout" : "/");
                });
            } else {
                navigate(isCheckoutRedirect ? "/checkout" : "/");
            }
        }
    }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

    const validateFields = () => {
        let newErrors = {};
        if (!name.trim()) newErrors.name = "Tên không được để trống.";
        if (!email.trim()) newErrors.email = "Email không được để trống.";
        if (password.length < 6) newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
    };

    const handleBlur = (field, value) => {
        let message = "";
        if (field === "name" && !value.trim()) message = "Tên không được để trống.";
        if (field === "email" && !value.trim()) message = "Email không được để trống.";
        if (field === "password" && value.length < 6) message = "Mật khẩu phải có ít nhất 6 ký tự.";
        setErrors((prev) => ({ ...prev, [field]: message }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateFields()) return;

        dispatch(registerUser({ name, email, password })).then((res) => {
            if (res?.payload?.success) {
                navigate(redirect);
            } else {
                setErrors((prev) => ({ ...prev, email: "Đăng ký thất bại. Vui lòng thử lại." }));
            }
        });
    };

    return (
        <div className='flex'>
            <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12'>
                <form onSubmit={handleSubmit} className='w-full max-w-md bg-white p-8 rounded-lg border shadow-sm'>
                    <div className='flex justify-center mb-6'>
                        <h2 className='text-xl font-medium'>Routine</h2>
                    </div>
                    <p className='text-center mb-6'>
                        Nhập tên người dùng và mật khẩu để đăng ký
                    </p>
                    
                    <div className='mb-4'>
                        <label className='block text-sm font-semibold mb-2'>Tên</label>
                        <input
                            type='text'
                            value={name}
                            className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : ''}`}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={(e) => handleBlur("name", e.target.value)}
                            placeholder='Nhập Tên của bạn'
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>

                    <div className='mb-4'>
                        <label className='block text-sm font-semibold mb-2'>Email</label>
                        <input
                            type='email'
                            value={email}
                            className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : ''}`}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={(e) => handleBlur("email", e.target.value)}
                            placeholder='Nhập Email của bạn'
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    <div className='mb-4'>
                        <label className='block text-sm font-semibold mb-2'>Mật khẩu</label>
                        <input
                            type='password'
                            value={password}
                            className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : ''}`}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={(e) => handleBlur("password", e.target.value)}
                            placeholder='Nhập Mật khẩu của bạn'
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>

                    <button className='w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition'>
                        {loading ? "Đang tải.." : "Đăng Ký"}
                    </button>
                    <p className='mt-6 text-center text-sm'>
                        Bạn đã có tài khoản?
                        <Link className='text-blue-500 cursor-pointer' to={`/login?redirect=${encodeURIComponent(redirect)}`}> Đăng Nhập</Link>
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
