import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const loadCartFromStorage =()=>{
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart): {products:[]};

};
// hepl
const saveCartToStorage = (cart)=>{
    localStorage.setItem("cart",JSON.stringify(cart))
}

// 
export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async ({userId,guestId},{rejectWithValue})=>{
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                {
                    params:{userId,guestId},
                }
            );
            return response.data;
        } catch (error) {
            console.error(error);
            return rejectWithValue(error.response.data)
        }
    }
)


export const addToCart = createAsyncThunk("cart/addToCart",async({productId, quantity,size,color,guestId,userId},{rejectWithValue})=>{
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
            {
                productId,
                quantity,
                size,
                color,
                guestId,
                userId
            }
        );
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

// update
export const updateCartItemQuantity = createAsyncThunk(
    "cart/updateCartItemQuantity",async ({productId,quantity,guestId,userId,size,color},{rejectWithValue})=>{
        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cart`,{
                productId,
                quantity,
                guestId,
                userId,
                size,
                color
            })
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// remove
export const removeFromCart = createAsyncThunk("cart/removeFromCart",async({productId,guestId,userId,size,color},{rejectWithValue})=>{
    try {
        const response = await axios({
            method:"DELETE",
            url:`${import.meta.env.VITE_BACKEND_URL}/api/cart`,
            data:{productId,guestId,userId,size,color}
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// merge

export const mergeCart = createAsyncThunk(
    "cart/mergeCart", async({guestId,user},{rejectWithValue})=>{
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
                {guestId,user},
                {
                    headers:{
                        Authorization:`Bearer ${localStorage.getItem("userToken")}`,
                    }
                }
            )
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

const cartSlice = createSlice({
    name:"cart",
    initialState:{
        cart:loadCartFromStorage(),
        loading:false,
        error:null
    },
    reducers:{
        clearCart:(state)=>{
            state.cart = {products:[]};
            localStorage.removeItem("cart");
        }
    },
    extraReducers:(builder) =>{
        builder
            .addCase(fetchCart.pending,(state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled,(state,action)=>{
                state.loading = false;
                state.cart = action.payload;
                saveCartToStorage(action.payload);
            })
            .addCase(fetchCart.rejected,(state,action)=>{
                state.loading = false;
                state.error = action.error.message || "Failed to fetch cart";
            })
            // addtoCart
            .addCase(addToCart.pending,(state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled,(state,action)=>{
                state.loading = false;
    if (Array.isArray(action.payload.products)) {
        state.cart = action.payload;
        saveCartToStorage(action.payload);
    } else {
        console.error("Cấu trúc giỏ hàng không hợp lệ:", action.payload);
    }
            })
            .addCase(addToCart.rejected,(state,action)=>{
                state.loading = false;
                state.error = action.payload?.message || "Không thêm được vào giỏ hàng";
            })
            // 
            .addCase(updateCartItemQuantity.pending,(state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItemQuantity.fulfilled,(state,action)=>{
                state.loading = false;
                state.cart = action.payload;
                saveCartToStorage(action.payload);
            })
            .addCase(updateCartItemQuantity.rejected,(state,action)=>{
                state.loading = false;
                state.error = action.payload?.message || "Không cập nhật được số lượng sản phẩm";
            })
            // 
            .addCase(removeFromCart.pending,(state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled,(state,action)=>{
                state.loading = false;
                state.cart = action.payload;
                saveCartToStorage(action.payload);
            })
            .addCase(removeFromCart.rejected,(state,action)=>{
                state.loading = false;
                state.error = action.payload?.message || "Không thể xóa mục";
            })
            // 
            .addCase(mergeCart.pending,(state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(mergeCart.fulfilled,(state,action)=>{
                state.loading = false;
                state.cart = action.payload;
                saveCartToStorage(action.payload);
            })
            .addCase(mergeCart.rejected,(state,action)=>{
                state.loading = false;
                state.error = action.payload?.message || "Không thể hợp nhất giỏ hàng";
            })
    }
})

export const {clearCart} = cartSlice.actions;
export default cartSlice.reducer;