import React, { useEffect, useState } from 'react'
import Hero from '../components/Layout/Hero'
import Gender from '../components/Products/Gender'
import NewArrivals from '../components/Products/NewArrivals'
import ProductDetail from '../components/Products/ProductDetail'
import ProductGrid from '../components/Products/ProductGrid'
import Feture from '../components/Products/Feture'
import Section from '../components/Products/Section'
import {useDispatch, useSelector} from "react-redux";
import axios from 'axios'
import { fetchProductsByFilters } from '../redux/slices/productSlice'


const Home = () => {
  const dispatch = useDispatch();
  const {products,loading,error} = useSelector((state)=>state.products);
  const [bestSellerProduct,setBetSellerProduct] = useState(null);

  useEffect(()=>{
    dispatch(
      fetchProductsByFilters({
        gender:"Women",
        category:"ShirtWomen",
        limit: 8
    })
  );

  const fetchBestSeller = async()=>{
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
      );
      setBetSellerProduct(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  fetchBestSeller();
  },[dispatch])
  return (
    <div>
        <Hero/>
        <Gender/>
        <NewArrivals/>
         {/* */}
        <h2 className='text-3xl text-center font-bold mb-4'>
          Bán chạy nhất
        </h2>
        {bestSellerProduct ? (
          <ProductDetail productId= {bestSellerProduct._id}/> 
        ): (
          <p className='text-center'>Đang tải sản phẩm bán chạy nhất</p>
        )}
        <div className='container mx-auto'>
          <h2 className='text-3xl text-center font-bold mb-4'>
            Trang phục hàng đầu dành cho phụ nữ
          </h2>
          <ProductGrid products={products} loading={loading} error={error} />
         </div>
         <Feture/>
         <Section/>
    </div>
  )
}

export default Home