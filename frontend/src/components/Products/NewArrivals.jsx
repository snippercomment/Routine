import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { FaBoxOpen } from 'react-icons/fa';

const NewArrivals = () => {
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [newArrivals, setNewArrivals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch sản phẩm mới về
    useEffect(() => {
        const fetchNewArrivals = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
                );
                setNewArrivals(response.data);
            } catch (error) {
                setNewArrivals([]);
                // Có thể show toast hoặc thông báo lỗi ở đây
            } finally {
                setLoading(false);
            }
        };
        fetchNewArrivals();
    }, []);

    // Xử lý kéo scroll ngang
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };
    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = x - startX;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };
    const handleMouseUpOrLeave = () => setIsDragging(false);

    // Nút chuyển trái/phải
    const scroll = (direction) => {
        const scrollAmount = direction === "left" ? -350 : 350;
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    };
    const updateScrollButtons = () => {
        const container = scrollRef.current;
        if (container) {
            const leftScroll = container.scrollLeft;
            const rightScrollable = container.scrollWidth > leftScroll + container.clientWidth + 1;
            setCanScrollLeft(leftScroll > 0);
            setCanScrollRight(rightScrollable);
        }
    };
    useEffect(() => {
        const container = scrollRef.current;
        if (container) {
            container.addEventListener("scroll", updateScrollButtons);
            updateScrollButtons();
            return () => container.removeEventListener("scroll", updateScrollButtons);
        }
    }, [newArrivals]);

    // Skeleton loading
    const skeletons = Array(4).fill(0);

    return (
        <section className='py-16 px-4 lg:px-0'>
            <div className='container mx-auto text-center mb-10 relative'>
                <h2 className='text-3xl font-bold mb-4'>Khám Phá Hàng Mới Về</h2>
                {/* Nút chuyển trái/phải chỉ hiện trên desktop */}
                {newArrivals.length > 4 && (
                    <div className='absolute right-0 bottom-[-30px] flex space-x-2 z-10'>
                        <button
                            onClick={() => scroll("left")}
                            disabled={!canScrollLeft}
                            className={`p-2 rounded border shadow ${canScrollLeft ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                            aria-label="Xem trái"
                        >
                            <FiChevronLeft className='text-2xl' />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            disabled={!canScrollRight}
                            className={`p-2 rounded border shadow ${canScrollRight ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                            aria-label="Xem phải"
                        >
                            <FiChevronRight className='text-2xl' />
                        </button>
                    </div>
                )}
            </div>

            {/* Responsive: scroll ngang trên mobile, grid trên desktop */}
            <div
                ref={scrollRef}
                className={`container mx-auto flex gap-6 overflow-x-auto pb-2 ${isDragging ? "cursor-grabbing" : "cursor-grab"} 
        ${newArrivals.length > 4 ? "lg:overflow-x-scroll" : "lg:overflow-x-hidden"}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                tabIndex={0}
                aria-label="Danh sách sản phẩm mới"
                style={{ scrollBehavior: "smooth" }}
            >
                {/* Loading skeleton */}
                {loading
                    ? skeletons.map((_, idx) => (
                        <div key={idx} className="min-w-[250px] sm:min-w-[300px] lg:min-w-[350px] h-[420px] bg-gray-100 rounded-lg animate-pulse shadow" />
                    ))
                    : newArrivals.length === 0
                        ? (
                            <div className="flex flex-col items-center justify-center w-full py-16">
                                <FaBoxOpen className="text-6xl text-gray-300 mb-4" />
                                <p className="text-gray-500 text-lg">Chưa có sản phẩm mới nào.</p>
                            </div>
                        )
                        : newArrivals.map((product) => (
                            <Link
                                key={product._id}
                                to={`/product/${product._id}`}
                                tabIndex={0}
                                className="group min-w-[250px] sm:min-w-[300px] lg:min-w-[350px] relative transition-transform hover:-translate-y-2"
                                aria-label={`${product.name}`}
                            >
                                <div className="relative h-[400px] overflow-hidden rounded-lg shadow-lg border border-gray-100">
                                    <img
                                        src={product.images[0]?.url}
                                        alt={product.images[0]?.altText || product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        draggable="false"
                                        onError={e => { e.target.src = '/default-product.png'; }} // Đường dẫn ảnh mặc định
                                    />
                                    {/* Overlay khi hover */}
                                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 duration-300 flex items-end">

                                    </div>
                                    {/* Tên và giá sản phẩm */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-opacity-70 text-white p-4 rounded-b-lg">
                                        <h4 className="font-semibold text-lg truncate" title={product.name}>{product.name}</h4>
                                        <p className="mt-1 text-base text-gray-200 font-bold">
                                            {product.price?.toLocaleString('vi-VN')} đ
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
            </div>
        </section>
    );
};

export default NewArrivals;