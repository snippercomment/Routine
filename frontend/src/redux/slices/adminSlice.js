import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminAxios } from "../../config/axios";

export const fetchUsers = createAsyncThunk(
    "admin/fetchUsers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await adminAxios.get(`/api/admin/users`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Không thể tải danh sách người dùng' });
        }
    }
);

export const addUser = createAsyncThunk(
    "admin/addUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await adminAxios.post(`/api/admin/users`, userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Không thể thêm người dùng' });
        }
    }
);

export const updateUser = createAsyncThunk(
    "admin/updateUser",
    async ({ id, name, email, role }, { rejectWithValue }) => {
        try {
            const response = await adminAxios.put(
                `/api/admin/users/${id}`,
                { name, email, role }
            );
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Không thể cập nhật người dùng' });
        }
    }
);

export const deleteUser = createAsyncThunk(
    "admin/deleteUser",
    async (id, { rejectWithValue }) => {
        try {
            await adminAxios.delete(`/api/admin/users/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Không thể xóa người dùng' });
        }
    }
);

const adminSlice = createSlice({
    name: "Admin",
    initialState: {
        users: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Lỗi không xác định';
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const updatedUser = action.payload;
                const userIndex = state.users.findIndex(
                    (user) => user._id === updatedUser._id
                );
                if (userIndex !== -1) {
                    state.users[userIndex] = updatedUser;
                }
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter((user) => user._id !== action.payload);
            })
            .addCase(addUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload.user);
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Lỗi không xác định';
            });
    }
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;