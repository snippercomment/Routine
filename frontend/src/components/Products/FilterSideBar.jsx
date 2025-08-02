import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const FilterSideBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 0,
  });

  const [priceRange, setPriceRance] = useState([0, 1000000]);
  const categories = [
    { label: "Áo Nữ", value: "ShirtWomen" },
    { label: "Quần Nữ", value: "TrousersWomen" },
    { label: "Áo Nam", value: "ShirtMen" },
    { label: "Quần Nam", value: "TrousersMen" },
    { label: "Đầm Váy", value: "Dress" },
  ];


  const genders = [
    { label: "Nam", value: "Men" },
    { label: "Nữ", value: "Women" },

  ];

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    setFilters({
      category: params.category ? params.category.split(",") : [],
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],

    })

  }, [searchParams]);
  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    let newFilters = { ...filters };
    if (type === "checkbox") {
      if (checked) {
        newFilters[name] = [...(newFilters[name] || []), value];
      } else {
        newFilters[name] = newFilters[name].filter((item) => item !== value);
      }
    } else {
      newFilters[name] = value;
    }
    setFilters(newFilters);
    updateURLParams(newFilters);
  };
  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        params.append(key, newFilters[key].join(","));
      } else if (newFilters[key]) {
        params.append(key, newFilters[key]);
      }
    });
    setSearchParams(params);
    navigate(`?${params.toString()}`);
  };



  return (
    <div className='p-4'>
      <h3 className='text-xl font-medium text-gray-800 mb-4'>Bọ Lọc</h3>
      {/* Bộ lọc loại sản phẩm */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Loại</label>
        {categories.map(({ label, value }) => (
          <div key={value} className='flex items-center mb-1'>
            <input type='checkbox' name='category'
              value={value}
              onChange={handleFilterChange}
              checked={filters.category.includes(value)}
              className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300'
            />
            <span className='text-gray-700'>{label}</span>
          </div>
        ))}
      </div>
      {/* Giới tính */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Giới tính</label>
        {genders.map(({ label, value }) => (
          <div key={value} className='flex items-center mb-1'>
            <input type='radio' name='gender'
              value={value}
              onChange={handleFilterChange}
              checked={filters.gender === value}
              className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300' />
            <span className='text-gray-700'>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FilterSideBar
