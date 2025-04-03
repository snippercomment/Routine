import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const NewArrivals = () => {
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [newArrivals, setNewArrivals] = useState([]);

    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
                );
                setNewArrivals(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchNewArrivals();
    }, []);

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

    const handleMouseUpOrLeave = () => {
        setIsDragging(false);
    };

    const scroll = (direction) => {
        const scrollAmount = direction === "left" ? -300 : 300;
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    };

    const updateScrollButtons = () => {
        const container = scrollRef.current;
        if (container) {
            const leftScroll = container.scrollLeft;
            const rightScrollable = container.scrollWidth > leftScroll + container.clientWidth;
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

    return (
        <section className='py-16 px-4 lg:px-0'>
            <div className='container mx-auto text-center mb-10 relative'>
                <h2 className='text-3xl font-bold mb-4 '>Khám Phá Hàng Mới Về</h2>
                <div className='absolute right-0 bottom-[-30px] flex space-x-2'>
                    <button
                        onClick={() => scroll("left")}
                        disabled={!canScrollLeft}
                        className={`p-2 rounded border ${canScrollLeft ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                    >
                        <FiChevronLeft className='text-2xl' />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        disabled={!canScrollRight}
                        className={`p-2 rounded border ${canScrollRight ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                    >
                        <FiChevronRight className='text-2xl' />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className={`container mx-auto overflow-x-scroll flex space-x-6 relative ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
            >
                {newArrivals.map((product) => (
                    <Link key={product._id} to={`/product/${product._id}`} tabIndex={0}>
                        <div className='min-w-[250px] sm:min-w-[300px] lg:min-w-[350px] relative'>
                            <img
                                src={product.images[0]?.url}
                                alt={product.images[0]?.altText || product.name}
                                className='w-full h-[400px] object-cover rounded-lg'
                                draggable="false"
                            />
                          <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 backdrop-blur-md text-white p-4 rounded-b-lg'>
                                <h4 className='font-semibold text-lg text-white drop-shadow-md'>{product.name}</h4>
                                <p className='mt-1 text-base text-gray-300 drop-shadow-md'>
                                    {product.price.toLocaleString('vi-VN')} đ
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
