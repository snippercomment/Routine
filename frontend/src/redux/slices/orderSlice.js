import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userAxios } from "../../config/axios";

// Helper function to get headers with token
const getHeaders = () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
        throw new Error('Vui lòng đăng nhập để xem đơn hàng');
    }
    return {
        Authorization: `Bearer ${token}`
    };
};

export const fetchUserOrders = createAsyncThunk(
    "orders/fetchUserOrders",
    async (_, { rejectWithValue }) => {
        try {
            const headers = getHeaders();
            const response = await userAxios.get(
                `/api/orders/my-orders`,
                { headers }
            );
            return response.data;
        } catch (error) {
            if (error.message === 'Vui lòng đăng nhập để xem đơn hàng') {
                return rejectWithValue({ message: error.message });
            }
            if (error.response?.status === 401) {
                localStorage.removeItem("userToken");
                localStorage.removeItem("userInfo");
                return rejectWithValue({ message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' });
            }
            return rejectWithValue(error.response?.data || { message: 'Không thể tải danh sách đơn hàng' });
        }
    }
);

export const fetchOrderDetails = createAsyncThunk(
    "orders/fetchOrderDetails",
    async (orderId, { rejectWithValue }) => {
        try {
            const headers = getHeaders();
            const response = await userAxios.get(
                `/api/orders/${orderId}`,
                { headers }
            );
            return response.data;
        } catch (error) {
            if (error.message === 'Vui lòng đăng nhập để xem đơn hàng') {
                return rejectWithValue({ message: error.message });
            }
            if (error.response?.status === 401) {
                localStorage.removeItem("userToken");
                localStorage.removeItem("userInfo");
                return rejectWithValue({ message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' });
            }
            return rejectWithValue(error.response?.data || { message: 'Không thể tải chi tiết đơn hàng' });
        }
    }
);

const orderSlice = createSlice({
    name: "orders",
    initialState: {
        orders: [],
        totalOrders: 0,
        orderDetails: null,
        loading: false,
        error: null
    },
    reducers: {
        clearOrders: (state) => {
            state.orders = [];
            state.totalOrders = 0;
            state.orderDetails = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
                state.totalOrders = action.payload.length;
                state.error = null;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Không thể tải danh sách đơn hàng';
            })
            .addCase(fetchOrderDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.orderDetails = action.payload;
                state.error = null;
            })
            .addCase(fetchOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Không thể tải chi tiết đơn hàng';
            });
    }
});

export const { clearOrders, clearError } = orderSlice.actions;
export default orderSlice.reducer;