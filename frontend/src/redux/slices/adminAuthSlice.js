import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";

// Validate token
const validateToken = (token) => {
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
};

const initialState = {
    admin: null,
    loading: false,
    error: null,
    isAuthenticated: false
};

export const loginAdmin = createAsyncThunk(
    'adminAuth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/loginAdmin`,
                { email, password }
            );

            if (!response.data.token) {
                throw new Error('Token không hợp lệ');
            }

            if (response.data.user.role !== 'admin') {
                throw new Error('Không có quyền truy cập trang admin');
            }

            localStorage.setItem('adminToken', response.data.token);
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('adminToken');
                return rejectWithValue('Thông tin đăng nhập không chính xác');
            }
            return rejectWithValue(error.response?.data?.message || error.message || 'Đăng nhập thất bại');
        }
    }
);

export const checkAdminAuth = createAsyncThunk(
    'adminAuth/check',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token || !validateToken(token)) {
                localStorage.removeItem('adminToken');
                throw new Error('Phiên đăng nhập đã hết hạn');
            }

            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/loginAdmin/check-auth`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            return response.data;
        } catch (error) {
            localStorage.removeItem('adminToken');
            return rejectWithValue(error.response?.data?.message || error.message || 'Phiên đăng nhập không hợp lệ');
        }
    }
);

const adminAuthSlice = createSlice({
    name: 'adminAuth',
    initialState,
    reducers: {
        logoutAdmin: (state) => {
            state.admin = null;
            state.isAuthenticated = false;
            localStorage.removeItem('adminToken');
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.admin = action.payload.user;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
                state.admin = null;
            })
            .addCase(checkAdminAuth.fulfilled, (state, action) => {
                state.admin = action.payload.user;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(checkAdminAuth.rejected, (state, action) => {
                state.admin = null;
                state.isAuthenticated = false;
                state.error = action.payload;
                localStorage.removeItem('adminToken');
            });
    }
});

export const { logoutAdmin, clearError } = adminAuthSlice.actions;
export default adminAuthSlice.reducer; 