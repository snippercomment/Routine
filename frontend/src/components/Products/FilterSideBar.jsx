import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const FilterSideBar = () => {
    const [searchParams,setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [filters,setFilters] = useState({
      category:"",
      gender:"",
      color:"",
      size:[],
      material:[],
      brand:[],
      minPrice:0,
      maxPrice:0,
    });
    
    const [priceRange,setPriceRance]=useState([0,1000000]);
    const categories = [
      { label: "Áo Nữ", value: "ShirtWomen" },
      { label: "Quần Nữ", value: "TrousersWomen" },
      { label: "Áo Nam", value: "ShirtMen" },
      { label: "Quần Nam", value: "TrousersMen" },
      { label: "Đầm Váy", value: "Dress" },
    ];
    
    const colors =[
      "Red",
      "Blue",
      "Black",
      "Green",
      "Yellow",
      "Grey",
      "White",
      "Pink",
      "Beige",
      "Navy"
      
    ];
    const sizes =["XS","S","M","L","XL","XXL"];
    const materials =[
      "Polyester",
      "Knit",
      "Rayon Poly",
      "Cotton",
      "Café",
      "Viscose",
      " Denim",
      " Interlock Pique"
      , "Acrylic"
    ];
    const genders = [
      {label:"Nam", value:"Men"},
      {label:"Nữ", value:"Women"},

    ];
    const brands =[
      "Ten11",
      "Pomelo"
    ]
    useEffect(()=>{
      const params = Object.fromEntries([...searchParams]);
      setFilters({
          category: params.category ? params.category.split(",") : [],
          gender:params.gender ||"",
          color:params.color || "",
          size:params.size ? params.size.split(",") :[],
          material:params.material ? params.material.split(",") :[],
          brand:params.brand ? params.brand.split(",") :[],
          
      })
      
    },[searchParams]);
    const handleFilterChange = (e)=>{
      const{name,value,checked,type} =e.target;
      let newFilters = {...filters};
      if(type === "checkbox"){
        if(checked){
          newFilters[name]=[...(newFilters[name]||[]),value];
        } else{
          newFilters[name] = newFilters[name].filter((item) => item !== value);
        }
      }else{
        newFilters[name]= value;  
      }
      setFilters(newFilters);
      updateURLParams(newFilters);
    };
    const updateURLParams = (newFilters) =>{
      const params = new URLSearchParams();
      Object.keys(newFilters).forEach((key)=>{
        if(Array.isArray(newFilters[key] )&& newFilters[key].length > 0){
          params.append(key,newFilters[key].join(","));
        } else if (newFilters[key]){
          params.append(key,newFilters[key]);
        }
      });
      setSearchParams(params);
      navigate(`?${params.toString()}`);
    };
    
    

  return (
    <div className='p-4'>
      <h3 className='text-xl font-medium text-gray-800 mb-4'>Bọ Lọc</h3>
      {/* Bộ lộc giá trị áo quần */}
      <div className='mb-6'>
      <label className='block text-gray-600 font-medium mb-2'>Loại</label>
      {categories.map(({ label, value }) => (
  <div key={value} className='flex items-center mb-1'>
    <input type='checkbox' name='category'
      value={value} // Dùng mã thay vì tên
      onChange={handleFilterChange}
      checked={filters.category.includes(value)}
      className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300'
    />
    <span className='text-gray-700'>{label}</span> {/* Hiển thị tên */}
  </div>
))}

      </div>
      {/* Giới tính */}
      <div className='mb-6'>
      <label className='block text-gray-600 font-medium mb-2'>Giới tính</label>
        {genders.map(({label,value}) => (
          <div key={value} className='flex items-center mb-1'>
            <input type='radio' name='gender'
            value={value}
            onChange={handleFilterChange}
            checked={filters.gender === value}
            className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300'/>
            <span className='text-gray-700'>{label}</span>
          </div>
        ))}
      </div>
      {/* màu sắc */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Màu sắc</label>
        <div className='flex flex-wrap gap-2'>
          {
            colors.map((color)=>(
              <button key={color} name='color'
              value={color}
              onClick={handleFilterChange}
               className={`w-8 h-8 rounded-full border border-gray-300 cursor-pointer transition hover:scale-105
              ${filters.color === color ? "ring-2 ring-blue-500" :""}`} style={{backgroundColor: color.toLowerCase()}} ></button>
              
            ))
          }
        </div>
      </div>
      {/* kích thước */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Kích thước</label>
        {
          sizes.map((size)=>(
            <div key={size} className='flex items-center mb-1' >
              <input type='checkbox' name='size'
              value={size}
              onChange={handleFilterChange}
              checked={filters.size.includes(size)}
               className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300'/>
              <span className='text-gray-700'>{size}</span>
            </div>
          ))
        }
      </div>

       {/* vật liệu */}
       <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Vật Liệu</label>
        {
          materials.map((material)=>(
            <div key={material} className='flex items-center mb-1' >
              <input type='checkbox' name='material' 
              value={material}
              onChange={handleFilterChange}
              checked={filters.material.includes(material)}
               className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300'/>
              <span className='text-gray-700'>{material}</span>
            </div>
          ))
        }
      </div>

       {/* thương hiệu */}
       <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Thương Hiệu</label>
        {
          brands.map((brand)=>(
            <div key={brand} className='flex items-center mb-1' >
              <input type='checkbox' name='brand'
              value={brand}
              onChange={handleFilterChange}
              checked={filters.brand.includes(brand)}
               className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300'/>
              <span className='text-gray-700'>{brand}</span>
            </div>
          ))
        }
      </div>
    
    </div>
  )
}

export default FilterSideBar
