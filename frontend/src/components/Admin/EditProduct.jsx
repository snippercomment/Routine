import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProductDetails, updateProduct } from '../../redux/slices/productSlice.js';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProduct = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { selectedProduct, loading, error } = useSelector((state) => state.products);
    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: 0,
        discountPrice: 0,
        countInStock: 0,

        sku: "",
        category: "",
        brand: "",
        sizes: [],
        colors: [],
        collections: "",
        material: "",
        gender: "",
        images: [

        ]
    })
    const [uploading, setUploading] = useState(false);
    const COMMON_COLORS = [
        { name: 'Đen', value: '#000000' },
        { name: 'Trắng', value: '#ffffff' },
        { name: 'Đỏ', value: '#ff0000' },
        { name: 'Xanh lá', value: '#00ff00' },
        { name: 'Xanh dương', value: '#0000ff' },
        { name: 'Vàng', value: '#ffff00' },
        { name: 'Hồng', value: '#ff69b4' },
        { name: 'Xám', value: '#808080' },
        { name: 'Nâu', value: '#8B4513' },
        { name: 'Tím', value: '#800080' },
    ];
    useEffect(() => {
        if (id) {
            dispatch(fetchProductDetails(id));
        }
    }, [dispatch, id])

    useEffect(() => {
        if (selectedProduct) {
            console.log(selectedProduct);
            setProductData(selectedProduct);
        }
    }, [selectedProduct])
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({ ...prevData, [name]: value }));
    }
    // 
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        setUploading(true);
        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append("image", file);
                const { data } = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
                setProductData((prevData) => ({
                    ...prevData,
                    images: [...prevData.images, { url: data.imageUrl, altText: "" }],
                }));
            }
            toast.success("Tải hình ảnh lên thành công!", { autoClose: 2000 });
        } catch (error) {
            toast.error("Tải hình ảnh thất bại, vui lòng thử lại!", { autoClose: 2000 });
        } finally {
            setUploading(false);
        }
    };
    const handleRemoveImage = (index) => {
        setProductData((prevData) => ({
            ...prevData,
            images: prevData.images.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateProduct({ id, productData }));
        navigate("/admin/products");
    };


    if (loading) return <p>Đang tải...</p>;
    if (error) return <p>Lỗi: {error}</p>;
    return (
        <div className='max-w-5xl mx-auto p-6 shadow-md rounded-md'>
            <h2 className='text-3xl font-bold mb-6'>Sửa sản phẩm</h2>
            <form onSubmit={handleSubmit}>
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'> Tên sản phẩm</label>
                    <input
                        type='text'
                        name='name'
                        value={productData.name}
                        onChange={handleChange}
                        className='w-full border border-gray-300 rounded-md p-2'
                        required
                    />
                </div>
                {/* decs */}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'> Mô tả</label>
                    <textarea
                        name='description'
                        value={productData.description}
                        onChange={handleChange}
                        className='w-full border border-gray-300 rounded-md p-2'
                        rows={4}
                        required
                    />
                </div>
                {/* giá */}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Giá</label>
                    <input
                        type='text'
                        name='price'
                        value={productData.price.toLocaleString('vi-VN')}
                        onChange={(e) => {
                            const rawValue = e.target.value.replace(/\D/g, ""); // Loại bỏ ký tự không phải số
                            setProductData({ ...productData, price: Number(rawValue) });
                        }}
                        className='w-full border border-gray-300 rounded-md p-2'
                    />
                </div>
                {/* Giá giảm */}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Giá giảm</label>
                    <input
                        type='text'
                        name='discountPrice'
                        value={productData.discountPrice.toLocaleString('vi-VN')}
                        onChange={(e) => {
                            const rawValue = e.target.value.replace(/\D/g, "");
                            setProductData({ ...productData, discountPrice: Number(rawValue) });
                        }}
                        className='w-full border border-gray-300 rounded-md p-2'
                    />
                </div>

                {/* Count in stock */}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Đếm trong kho</label>
                    <input
                        type='number'
                        name='countInStock'
                        value={productData.countInStock}
                        onChange={handleChange}
                        className='w-full border border-gray-300 rounded-md p-2'
                    />
                </div>
                {/* sku */}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>SKU</label>
                    <input
                        type='text'
                        name='sku'
                        value={productData.sku}
                        onChange={handleChange}
                        className='w-full border border-gray-300 rounded-md p-2'
                    />
                </div>
                {/* Thương hiệu */}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Thương hiệu</label>
                    <input
                        type='text'
                        name='brand'
                        value={productData.brand}
                        onChange={handleChange}
                        className='w-full border border-gray-300 rounded-md p-2'
                    />
                </div>
                {/* Giới tính */}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Giới tính</label>
                    <select
                        name='gender'
                        value={productData.gender}
                        onChange={handleChange}
                        className='w-full border border-gray-300 rounded-md p-2'
                    >
                        <option value='Men'>Nam</option>
                        <option value='Women'>Nữ</option>
                    </select>
                </div>


                {/*  kích thước*/}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Kích thước</label>
                    <input
                        type='text'
                        name='sizes'
                        value={productData.sizes.join(", ")}
                        onChange={(e) => setProductData({ ...productData, sizes: e.target.value.split(",").map((size) => size.trim()) })}
                        className='w-full border border-gray-300 rounded-md p-2'
                    />
                </div>
                {/* màu sắc */}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Màu sắc</label>
                    <input
                        type='text'
                        name='colors'
                        value={productData.colors.join(", ")}
                        onChange={(e) => setProductData({ ...productData, colors: e.target.value.split(",").map((color) => color.trim()) })}
                        className='w-full border border-gray-300 rounded-md p-2'
                    />
                </div>
                {/* Danh mục sản phẩm */}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Danh mục</label>
                    <input
                        type='text'
                        name='category'
                        value={productData.category}
                        onChange={handleChange}
                        className='w-full border border-gray-300 rounded-md p-2'
                    />
                </div>
                {/* Bộ sưu tập */}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Bộ sưu tập</label>
                    <input
                        type='text'
                        name='collections'
                        value={productData.collections}
                        onChange={handleChange}
                        className='w-full border border-gray-300 rounded-md p-2'
                    />
                </div>

                {/* Chất liệu */}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Chất liệu</label>
                    <input
                        type='text'
                        name='material'
                        value={productData.material}
                        onChange={handleChange}
                        className='w-full border border-gray-300 rounded-md p-2'
                    />
                </div>



                {/* Hình ảnh đã tải lên */}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Cập nhật hình ảnh</label>
                    <input type='file' multiple onChange={handleImageUpload} />
                    {uploading && <p>Đang tải hình ảnh lên...</p>}
                    <div className='flex gap-4 mt-4'>
                        {productData.images.map((image, index) => (
                            <div key={index} className='relative flex flex-col items-center'>
                                <img
                                    src={image.url}
                                    alt={image.altText || "Product Image"}
                                    className='w-20 h-20 object-cover rounded-sm shadow-md'
                                />
                                <button
                                    type="button"
                                    className='absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full'
                                    onClick={() => handleRemoveImage(index)}
                                >
                                    x
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <button type='submit' className='w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors cursor-pointer'>
                    Cập nhật sản phẩm
                </button>
            </form>
        </div>
    )
}

export default EditProduct
