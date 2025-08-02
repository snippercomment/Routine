import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userAxios } from "../../config/axios";

const loadCartFromStorage = () => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : { products: [] };
};

const saveCartToStorage = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
};

export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async ({ userId, guestId }, { rejectWithValue }) => {
        try {
            const response = await userAxios.get(
                `/api/cart`,
                { params: { userId, guestId } }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Không thể tải giỏ hàng" });
        }
    }
);

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ productId, quantity, size, color, guestId, userId }, { rejectWithValue }) => {
        try {
            const response = await userAxios.post(
                `/api/cart`,
                { productId, quantity, size, color, guestId, userId }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Không thể thêm vào giỏ hàng" });
        }
    }
);

export const updateCartItemQuantity = createAsyncThunk(
    "cart/updateCartItemQuantity",
    async ({ productId, quantity, guestId, userId, size, color }, { rejectWithValue }) => {
        try {
            const response = await userAxios.put(
                `/api/cart`,
                { productId, quantity, guestId, userId, size, color }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Không thể cập nhật số lượng" });
        }
    }
);

export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async ({ productId, guestId, userId, size, color }, { rejectWithValue }) => {
        try {
            const response = await userAxios.delete(`/api/cart`, {
                data: { productId, guestId, userId, size, color }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Không thể xóa sản phẩm" });
        }
    }
);

export const mergeCart = createAsyncThunk(
    "cart/mergeCart",
    async ({ guestId, user }, { rejectWithValue }) => {
        try {
            const response = await userAxios.post(
                `/api/cart/merge`,
                { guestId, user }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Không thể hợp nhất giỏ hàng" });
        }
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: loadCartFromStorage(),
        loading: false,
        error: null
    },
    reducers: {
        clearCart: (state) => {
            state.cart = { products: [] };
            localStorage.removeItem("cart");
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
                saveCartToStorage(action.payload);
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Không thể tải giỏ hàng";
            })
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                if (Array.isArray(action.payload.products)) {
                    state.cart = action.payload;
                    saveCartToStorage(action.payload);
                } else {
                    state.error = "Cấu trúc giỏ hàng không hợp lệ";
                }
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Không thể thêm vào giỏ hàng";
            })
            .addCase(updateCartItemQuantity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
                saveCartToStorage(action.payload);
            })
            .addCase(updateCartItemQuantity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Không thể cập nhật số lượng";
            })
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
                saveCartToStorage(action.payload);
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Không thể xóa sản phẩm";
            })
            .addCase(mergeCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(mergeCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
                saveCartToStorage(action.payload);
            })
            .addCase(mergeCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Không thể hợp nhất giỏ hàng";
            });
    }
});

export const { clearCart, clearError } = cartSlice.actions;
export default cartSlice.reducer;