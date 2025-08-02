import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userAxios, adminAxios } from "../../config/axios";

// Helper function to validate token
const isValidToken = (token) => {
    return token && typeof token === 'string' && token.trim() !== '' && token !== 'undefined' && token !== 'null';
};

// Helper function to safely store user data
const storeUserData = (user, token) => {
    if (user && isValidToken(token)) {
        localStorage.setItem("userInfo", JSON.stringify(user));
        localStorage.setItem("userToken", token);
        return true;
    }
    return false;
};

// Get user from localStorage
const userFromStorage = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")) : null;

// Get token from localStorage
const tokenFromStorage = localStorage.getItem("userToken") || null;

// Generate guest ID
const initialGuestId = localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
localStorage.setItem("guestId", initialGuestId);

// Initial state
const initialState = {
    user: userFromStorage,
    token: tokenFromStorage,
    guestId: initialGuestId,
    loading: false,
    error: null,
    successMessage: null,
}

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await userAxios.post('/api/users/login', userData);
            const { user, token } = response.data;

            if (user && isValidToken(token)) {
                if (storeUserData(user, token)) {
                    return { user, token };
                }
            }

            return rejectWithValue({
                message: 'Đăng nhập thất bại: Phản hồi từ server không hợp lệ.'
            });
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
            return rejectWithValue({ message: errorMessage });
        }
    }
);

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await userAxios.post('/api/users/register', userData);
            const data = response.data;

            // Handle explicit failure from backend
            if (data && data.success === false) {
                return rejectWithValue({
                    message: data.message || 'Đăng ký thất bại theo chỉ định từ server.'
                });
            }

            // Validate token and user data
            const validToken = isValidToken(data?.token) ? data.token : null;
            const registeredUser = data?.user;

            if (validToken && registeredUser) {
                if (storeUserData(registeredUser, validToken)) {
                    return {
                        success: true,
                        user: registeredUser,
                        token: validToken,
                        message: data?.message || 'Đăng ký thành công!'
                    };
                }
            }

            // Invalid response structure
            return rejectWithValue({
                message: 'Đăng ký thất bại: Phản hồi từ server không hợp lệ hoặc thiếu thông tin người dùng/token.'
            });

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Đăng ký thất bại do lỗi mạng hoặc server.';
            return rejectWithValue({ message: errorMessage });
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.successMessage = null;
            state.guestId = `guest_${new Date().getTime()}`;
            localStorage.removeItem("userInfo");
            localStorage.removeItem("userToken");
            localStorage.setItem("guestId", state.guestId);
        },
        generateNewGuestId: (state) => {
            state.guestId = `guest_${new Date().getTime()}`;
            localStorage.setItem("guestId", state.guestId);
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
                state.successMessage = 'Đăng nhập thành công!';
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
                state.successMessage = null;
            })

            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success) {
                    state.user = action.payload.user;
                    state.token = action.payload.token;
                    state.successMessage = action.payload.message;
                    state.error = null;
                }
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
                state.successMessage = null;
            })
    }
});

export const { logout, generateNewGuestId, clearError } = authSlice.actions;
export default authSlice.reducer;