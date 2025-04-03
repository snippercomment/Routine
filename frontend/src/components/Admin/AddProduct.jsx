import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createProduct } from '../../redux/slices/productSlice.js';

const AddProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: 0,
        discountPrice: 0,
        countInStock: 0,
        sku: "",
        sizes: [],
        colors: [],
        gender: "Unisex",
        brand: "",
        material: "",
        images: [],
        category:"",
        collections: []
    });
    const [uploading, setUploading] = useState(false);

    const formatCurrency = (value) => {
        return value.replace(/\D/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;
    
        if (name === "price" || name === "discountPrice") {
            const numericValue = value.replace(/\D/g, ''); // Loại bỏ dấu chấm và ký tự không phải số
            formattedValue = formatCurrency(numericValue);
        }
    
        setProductData((prevData) => ({ ...prevData, [name]: formattedValue }));
    };
    

    const handleArrayChange = (e, field) => {
        const values = e.target.value.split(',').map(item => item.trim());
        setProductData((prevData) => ({ ...prevData, [field]: values }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("image", file);

        try {
            setUploading(true);
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/upload`, formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            setProductData((prevData) => ({
                ...prevData,
                images: [...prevData.images, { url: data.imageUrl, altText: "" }]
            }));
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    };
    const handleImageRemove = (index) => {
        setProductData((prevData) => ({
            ...prevData,
            images: prevData.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const finalData = {
            ...productData,
            price: parseInt(productData.price.replace(/\./g, ""), 10),  // Chuyển về số
            discountPrice: parseInt(productData.discountPrice.replace(/\./g, ""), 10),
        };
    
        dispatch(createProduct(finalData));
        navigate("/admin/products");
    };
    

    return (
        <div className='max-w-5xl mx-auto p-6 shadow-md rounded-md'>
            <h2 className='text-3xl font-bold mb-6'>Thêm sản phẩm</h2>
            <form onSubmit={handleSubmit}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                        <label className='block font-semibold mb-2'>Tên sản phẩm</label>
                        <input type='text' name='name' value={productData.name} onChange={handleChange} className='w-full border border-gray-300 rounded-md p-2' required />
                    </div>
                    <div>
                        <label className='block font-semibold mb-2'>Giới tính</label>
                        <select name='gender' value={productData.gender} onChange={handleChange} className='w-full border border-gray-300 rounded-md p-2'>
                            
                            <option value="Men">Nam</option>
                            <option value="Women">Nữ</option>
                        </select>
                    </div>
                </div>
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Mô tả</label>
                    <textarea name='description' value={productData.description} onChange={handleChange} className='w-full border border-gray-300 rounded-md p-2' rows={4} required />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                        <label className='block font-semibold mb-2'>Giá gốc</label>
                        <input type='text' name='price' value={productData.price} onChange={handleChange} className='w-full border border-gray-300 rounded-md p-2' required />
                    </div>
                    <div>
                        <label className='block font-semibold mb-2'>Giá giảm</label>
                        <input type='text' name='discountPrice' value={productData.discountPrice} onChange={handleChange} className='w-full border border-gray-300 rounded-md p-2' />
                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                        <label className='block font-semibold mb-2'>Đếm trong kho</label>
                        <input type='number' name='countInStock' value={productData.countInStock} onChange={handleChange} className='w-full border border-gray-300 rounded-md p-2' required />
                    </div>
                    <div>
                        <label className='block font-semibold mb-2'>SKU</label>
                        <input type='text' name='sku' value={productData.sku} onChange={handleChange} className='w-full border border-gray-300 rounded-md p-2' required />
                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                        <label className='block font-semibold mb-2'>Thương hiệu</label>
                        <input type='text' name='brand' value={productData.brand} onChange={handleChange} className='w-full border border-gray-300 rounded-md p-2' required />
                    </div>
                    <div>
                        <label className='block font-semibold mb-2'>Vật liệu</label>
                        <input type='text' name='material' value={productData.material} onChange={handleChange} className='w-full border border-gray-300 rounded-md p-2' required />
                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                        <label className='block font-semibold mb-2'>Kích thước</label>
                        <input type='text' placeholder='S, M, L, XL' onChange={(e) => handleArrayChange(e, 'sizes')} className='w-full border border-gray-300 rounded-md p-2' required />
                    </div>
                    <div>
                        <label className='block font-semibold mb-2'>Màu sắc</label>
                        <input type='text' placeholder='Red, Blue, Green' onChange={(e) => handleArrayChange(e, 'colors')} className='w-full border border-gray-300 rounded-md p-2' required />
                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                        <label className='block font-semibold mb-2'>Danh mục</label>
                        <select name='category' value={productData.category} onChange={handleChange} className='w-full border border-gray-300 rounded-md p-2'>
                            <option value="">Chọn loại sản phẩm</option>
                            <option value="ShirtWomen">Áo Nữ</option>
                            <option value="TrousersWomen">Quần Nữ</option>
                            <option value="ShirtMen">Áo Nam</option>
                            <option value="TrousersMen">Quần Nam</option>
                            <option value="Dress">Váy</option>
                        </select>
                    </div>
                </div>
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
             <div className='mb-6'>
    <label className='block font-semibold mb-2'>Hình ảnh</label>
    <input type='file' onChange={handleImageUpload} />
    {uploading && <p>Đang tải hình ảnh lên...</p>}
    <div className='flex gap-4 mt-4'>
        {productData.images.map((image, index) => (
            <div key={index} className='relative'>
                <img 
                    src={image.url} 
                    alt={image.altText || "Product Image"} 
                    className='w-20 h-20 object-cover rounded-sm shadow-md' 
                />
                <button 
                    type='button' 
                    onClick={() => handleImageRemove(index)} 
                    className='absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full text-xs'
                >
                    x
                </button>
            </div>
        ))}
    </div>
</div>

                <button type='submit' className='w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors mt-6 cursor-pointer'>
                    Thêm sản phẩm
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
