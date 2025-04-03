import {configureStore} from "@reduxjs/toolkit";

import authReducer from "./slices/uathSlice";
import productReducer from "./slices/productSlice"
import cartReducer from "./slices/cartSlice"
import checkoutReducer from "./slices/checkOutSlice"
import orderReducer from "./slices/orderSlice"

// admin
import adminReducer from "./slices/adminSlice"
import adminProductReducer from "./slices/adminProductSlice"
import adminOrderReducer from "./slices/adminOrderSlice"

const store = configureStore({
    reducer:{
        auth:authReducer,
        products: productReducer,
        cart: cartReducer,
        checkout: checkoutReducer,
        orders:orderReducer,
        // admin
        admin:adminReducer,
        adminProducts:adminProductReducer,
        adminOrders:adminOrderReducer
    },
});

export default store;