import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminAxios } from "../../config/axios";

export const fetchAllOrders = createAsyncThunk(
    "adminOrders/fetchAllOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await adminAxios.get(`/api/admin/orders`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Không thể tải danh sách đơn hàng' });
        }
    }
);

export const updateOrderStatus = createAsyncThunk(
    "adminOrders/updateOrder",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await adminAxios.put(
                `/api/admin/orders/${id}`,
                { status }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Không thể cập nhật trạng thái đơn hàng' });
        }
    }
);

export const deleteOrder = createAsyncThunk(
    "adminOrders/deleteOrder",
    async (id, { rejectWithValue }) => {
        try {
            await adminAxios.delete(`/api/admin/orders/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Không thể xóa đơn hàng' });
        }
    }
);

const adminOrderSlice = createSlice({
    name: "adminOrders",
    initialState: {
        orders: [],
        totalOrders: 0,
        totalSales: 0,
        loading: false,
        error: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // all
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
                state.totalOrders = action.payload.length;
                const totalSales = action.payload.reduce((acc, order) => {
                    return acc + order.totalPrice;
                }, 0);
                state.totalSales = totalSales;
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Lỗi không xác định';
            })
            //  update
            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false;
                const updatedOrder = action.payload;
                const orderIndex = state.orders.findIndex(
                    (order) => order._id === updatedOrder._id
                );
                if (orderIndex !== -1) {
                    state.orders[orderIndex] = updatedOrder;
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Lỗi không xác định';
            })
            // delete
            .addCase(deleteOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = state.orders.filter(
                    (order) => order._id !== action.payload
                );
                state.totalOrders = state.orders.length;
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Lỗi không xác định';
            });
    }
});

export const { clearError } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;