import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const fetchProductsByFilters = createAsyncThunk(
    "products/fetchProductsByFilters",
    async({
        collection,
        size,
        color,
        gender,
        minPrice,maxPrice,
        sortBy,
        search,
        category,
        material,
        brand,
        limit,
    }) =>{
        const query = new URLSearchParams();
        if(collection)query.append("collection",collection);
        if(size)query.append("size",size);
        if(color)query.append("color",color);
        if(gender)query.append("gender",gender);
        if(minPrice)query.append("minPrice",minPrice);
        if(maxPrice)query.append("maxPrice",maxPrice);
        if(sortBy)query.append("sortBy",sortBy);
        if(search)query.append("search",search);
        if(category)query.append("category",category);
        if(material)query.append("material",material);
        if(brand)query.append("brand",brand);
        if(limit)query.append("limit",limit);

        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`
        )
        return response.data;
    }
);

export const fetchProductDetails = createAsyncThunk(
    "products/fetchProductsDetails",
    async (id)=>{
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
        );
        return response.data;
    }
);



// Định nghĩa action createProduct
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, thunkAPI) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/products`, productData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// 

export const updateProduct = createAsyncThunk("product/updateProduct",async({id,productData})=>{
    const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,productData,
        {
            headers:{
                Authorization:` Bearer ${localStorage.getItem("userToken")}`,
            }
        }
    );
    return response.data;
});


export const fetchSimilarProducts = createAsyncThunk(
    "products/fetchSimilarProducts",
    async({id})=>{
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`
        );
        return response.data;
    }
    
);

const productsSlice = createSlice({
    name:"products",
    initialState:{
        products:[],
        selectedProduct : null,
        similarProducts: [],
        loading:false,
        error:null,
        filters:{
            category:"",
            size:"",
            color:"",
            gender:"",
            brand:"",
            minPrice:"",
            maxPrice:"",
            sortBy:"",
            search:"",
            material:"",
            collection:""
        }
    },
    reducers:{
        setFilters:(state,action) =>{
            state.filters = {...state.filters,...action.payload};
        },
        clearFilters:(state)=>{
            state.filters ={
                category:"",
            size:"",
            color:"",
            gender:"",
            brand:"",
            minPrice:"",
            maxPrice:"",
            sortBy:"",
            search:"",
            material:"",
            collection:""
            }
        }
    },
    extraReducers:(builder)=>{
        
        builder
        builder.addCase(createProduct.pending, (state) => {
            state.loading = true;
          });
          builder.addCase(createProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.products.push(action.payload);
          });
          builder.addCase(createProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
        // 
            .addCase(fetchProductsByFilters.pending,(state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductsByFilters.fulfilled,(state,action)=>{
                state.loading = false;
                state.products = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchProductsByFilters.rejected,(state,action)=>{
                state.loading = false;
                state.error = action.error.message;
            })

            // detals
            .addCase(fetchProductDetails.pending,(state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductDetails.fulfilled,(state,action)=>{
                state.loading = false;
                state.selectedProduct = action.payload;
            })
            .addCase(fetchProductDetails.rejected,(state,action)=>{
                state.loading = false;
                state.error = action.error.message;
            })
            // upload
            .addCase(updateProduct.pending,(state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled,(state,action)=>{
                state.loading = false;
                const updatedProduct = action.payload;
                const index = state.products.findIndex((product)=>product._id === updatedProduct._id);
                if(index !== -1){
                    state.products[index] = updateProduct;
                }
            })
            .addCase(updateProduct.rejected,(state,action)=>{
                state.loading = false;
                state.error = action.error.message;
            })

            // similar
            .addCase(fetchSimilarProducts.pending,(state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSimilarProducts.fulfilled,(state,action)=>{
                state.loading = false;
                state.similarProducts = action.payload;
            })
            .addCase(fetchSimilarProducts.rejected,(state,action)=>{
                state.loading = false;
                state.error = action.error.message;
            })
    }
})

export const {setFilters,clearFilters} = productsSlice.actions;
export default productsSlice.reducer;