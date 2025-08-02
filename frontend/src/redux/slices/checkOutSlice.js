import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userAxios } from "../../config/axios";

export const createCheckout = createAsyncThunk(
    "checkout/createCheckout",
    async (checkoutdata, { rejectWithValue }) => {
        try {
            const response = await userAxios.post(
                `/api/checkout`,
                checkoutdata
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Không thể tạo đơn hàng' });
        }
    }
);

const checkoutSlice = createSlice({
    name: "checkout",
    initialState: {
        checkout: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearCheckout: (state) => {
            state.checkout = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createCheckout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCheckout.fulfilled, (state, action) => {
                state.loading = false;
                state.checkout = action.payload;
                state.error = null;
            })
            .addCase(createCheckout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Không thể tạo đơn hàng';
            });
    }
});

export const { clearCheckout, clearError } = checkoutSlice.actions;
export default checkoutSlice.reducer;