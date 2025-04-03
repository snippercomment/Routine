import React, {  useEffect, useState } from 'react'
import {toast} from 'sonner'
import ProductGrid from './ProductGrid';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, fetchSimilarProducts } from '../../redux/slices/productSlice';
import { addToCart } from '../../redux/slices/cartSlice';

// const selectedProduct = {
//     name:"stybe",
//     price: 120000,
//     originalPrice:150000,
//     description:"This ...",
//     brand:"Fasion",
//     material:"Led",
//     sizes:["S","M"],
//     colors:["Red","Blue"],
//     images:[{
//         url:"https://picsum.photos/500/500?random=1",
//         altText:"No no"
//     },
//     {
//         url:"https://picsum.photos/500/500?random=2",
//         altText:"No no"
//     },
//     {
//         url:"https://picsum.photos/500/500?random=3",
//         altText:"No no"
//     }
// ],
    
// };
// const similarProducts =[
//     {
//         _id:1,
//         name:"Product 1",
//         price:100,
//         images:[{
//             url:"https://picsum.photos/500/500?random=4"
//         }]
//     },
//     {
//         _id:2,
//         name:"Product 2",
//         price:100,
//         images:[{
//             url:"https://picsum.photos/500/500?random=5"
//         }]
//     },
//     {
//         _id:3,
//         name:"Product 3",
//         price:100,
//         images:[{
//             url:"https://picsum.photos/500/500?random=6"
//         }]
//     },
//     {
//         _id:4,
//         name:"Product 4",
//         price:100,
//         images:[{
//             url:"https://picsum.photos/500/500?random=7"
//         }]
//     },
// ]

const ProductDetail = ({productId}) => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const {selectedProduct,loading,error,similarProducts} = useSelector(
        (state)=>state.products
    );
    const {user,guestId} = useSelector((state)=> state.auth);
    const [mainImage,setMainImage]= useState("");
    const [selectedSize,setSelectedSize]= useState("");
    const [selectedColor,setSelectedColor] = useState("");
    const [quantity,setQuantity] = useState(1);
    const [isButtonDisabled,setIsButtonDisabled] = useState(false);

    const productFetchId = productId || id;

    useEffect(()=>{
        if(productFetchId){
           
            dispatch(fetchProductDetails(productFetchId))
            dispatch(fetchSimilarProducts({id: productFetchId}));
        }
    },[dispatch,productFetchId])

    useEffect(()=>{
        if(selectedProduct?.images?.length > 0){
            setMainImage(selectedProduct.images[0].url);
        }
    },[selectedProduct])
    // này số liệu nút thêm số lượng 
    const handleQuantityChange = (action) =>{
        if(action === "plus") setQuantity((prev)=>prev + 1);
        if(action === "minus" && quantity > 1) setQuantity((prev)=> prev -1);
    }  
    // dữ liệu khi thêm vào giỏ hàng 
    const handleAddToCart = () =>{
        if(!selectedSize || !selectedColor) {
            toast.error("Vui lòng chọn kích thước và màu sắc trước khi thêm vào giỏ hàng.",{
                duration:1000,
            })
            return;
        }
        setIsButtonDisabled(true);

        // setTimeout(()=>{
        //     toast.success("Thêm sản phẩm vào giỏ hàng!",{
        //         duration:1000,
        //     });
        //     setIsButtonDisabled(false);
        // },500);

        dispatch(
            addToCart({
                productId:productFetchId,
                quantity,
                size:selectedSize,
                color:selectedColor,
                guestId,
                userId:user?._id
            })
        ).then(()=>{
            toast.success("Sản phẩm đã được thêm vào giỏ hàng!",{
                duration:1000,
            });
        }).finally(()=>{
            setIsButtonDisabled(false);
        })
    };

    if(loading){
        return <p>Đang Tải...</p>
    }

    if(error){
        return <p>Lỗi : {error}</p>;
    }
  return (
    <div className='p-6'>
        {selectedProduct && (<div className='max-w-6xl mx-auto bg-white p-8 rounded-lg'>
            <div className='flex flex-col md:flex-row'>
                {/*  */}
                <div className='hidden md:flex flex-col space-y-4 mr-6'>
                    {selectedProduct.images.map((image,index)=>(
                        <img key={index} src={image.url} alt={image.altText||`Thumbnail ${index}`}
                            className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === image.url ? "border-black" : "border-gray-300"}`}
                            onClick={()=> setMainImage(image.url)}
                        />
                    ))}
                </div>
                {/* main */}
                <div className='md:w-1/2'>
                    <div className='mb-4'>
                        <img src={mainImage} alt='Main' className='w-full h-auto object-cover rounded-lg'/>
                    </div>
                </div>
                {/* mobile */}
                <div className='md:hidden flex overscroll-x-scroll space-x-4 mb-4'>
                {selectedProduct.images.map((image,index)=>(
                        <img key={index} src={image.url} alt={image.altText||`Thumbnail ${index}`}
                             className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === image.url ? "border-black" : "border-gray-300"}`}
                            onClick={()=>setMainImage(image.url)}
                        />
                    ))}
                </div>
                {/*  */}
                <div className='md:w-1/2 md:ml-10'>
                    <h1 className='text-2xl mdtext-3xl font-semibold mb-2'>
                        {selectedProduct.name}
                    </h1>
                    <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                            <p className="text-xl text-gray-500">Giá:</p>
                            <p className="text-lg text-gray-600 line-through">
                            {selectedProduct.price
                                ? `${selectedProduct.price.toLocaleString("vi-VN")} đ`
                            : ""}

                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <p className="text-xl text-gray-500">Giảm còn:</p>
                            <p className="text-xl text-gray-500">
                            {selectedProduct.discountPrice
                                ? `${selectedProduct.discountPrice.toLocaleString("vi-VN")} đ`
                                : ""}
                            </p>

                        </div>
                        </div>

                    <p className='text-gray-600 mb-4'>{selectedProduct.description}</p>
                    <div className='mb-4'>
                        <p className='text-gray-700'>Color:</p>
                        <div className='flex gap-2 mt-2'>
                            {selectedProduct.colors.map((color)=>(
                                <button key={color} 
                                onClick={()=>setSelectedColor(color)}
                                className={`w-8 h-8 rounded-full border ${selectedColor === color ? "border-4 border-black": "border-gray-300"}`}
                                style={{backgroundColor:color.toLocaleLowerCase(),filter:"brightness(0.5"}}></button>
                            ))}
                        </div>
                    </div>
                    {/*  */}
                    <div className='mb-4'>
                        <p className='text-gray-700'>Size:</p>
                        <div className='flex gap-2 mt-2'>
                            {selectedProduct.sizes.map((size)=>(
                                <button key={size} 
                                onClick={()=>setSelectedSize(size)}
                                className={`px-4 py-2 rounded border cursor-pointer ${selectedSize === size ? "bg-black text-white ": ""}`}
                                >{size}</button>
                            ))}
                        </div>
                    </div>
                    <div className='mb-6'>
                        <p className='text-gray-700'>Quantity:</p>
                        <div className='flex items-center space-x-4 mt-2'>
                            <button onClick={()=> handleQuantityChange("minus")} className='px-2 py-1 bg-gray-200 rounded text-lg'>
                                -
                            </button>
                            <span className='text-lg'>{quantity}</span>
                            <button onClick={()=> handleQuantityChange("plus")} className='px-2 py-1 bg-gray-200 rounded text-lg'>
                                +
                            </button>
                        </div>
                    </div>
                    {/* nut mua */}
                    <button onClick={handleAddToCart}
                    disabled={isButtonDisabled}
                    className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${isButtonDisabled ? "cursor-not-allowed opacity-50":"hover:bg-gray-900"}`}>{isButtonDisabled ? "Thêm...":"Thêm vào giỏ hàng"}</button>
                    <div className='mt-10 text-gray-700'>
                        <h3 className='text-xl font-bold mb-4'>Đặc trưng:</h3>
                        <table className="w-full text-left text-sm text-gray-600">
                            <tbody>
                                <tr>
                                    <td className="py-1 whitespace-nowrap">Thương hiệu:</td>
                                    <td className="py-1 whitespace-nowrap">{selectedProduct.brand}</td>
                                </tr>
                                <tr>
                                    <td className="py-1 whitespace-nowrap">Vật liệu:</td>
                                    <td className="py-1 whitespace-nowrap">{selectedProduct.material}</td>
                                </tr>
                            </tbody>
                         </table>
                    </div>
                </div>       
            </div>  
            <div className='mt-20'>
                <h2 className='text-2xl text-center font-medium mb-4'>
                    Bạn cũng có thể thích
                </h2>
                <ProductGrid products={similarProducts} loading={loading} error={error}/>
            </div>       
        </div>    
        )} 
    </div>
  )
}

export default ProductDetail