import {BrowserRouter, Routes,Route} from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout"
import Home from "./pages/Home";
import {Toaster} from 'sonner'
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CollectionPage from "./pages/CollectionPage";
import ProductDetail from "./components/Products/ProductDetail";
import CheckOut from "./components/Cart/CheckOut";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import MyOrders from "./pages/MyOrders";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminHomePage from "./pages/AdminHomePage";
import UserManagement from "./components/Admin/UserManagement";
import Product from "./components/Admin/Product";
import EditProduct from "./components/Admin/EditProduct";
import Order from "./components/Admin/Order";
import ProtectedRoute from "./components/Common/ProtectedRoute"

import {Provider} from "react-redux";
import store from "./redux/store";
import AddProduct from "./components/Admin/AddProduct";
import AboutUs from "./pages/AboutUs";
import Security from "./pages/Security";
import Warranty from "./pages/Warranty";
import Returns from "./pages/Returns";


const App = () => {
  return (
    <Provider store={store}>
    <BrowserRouter future={{v7_startTransition:true, v7_relativeSplatPath:true}}>
    <Toaster position ="top-right" />
      <Routes>
      <Route path="/" element={<UserLayout/>}>
        <Route index element={<Home/>}/>
        <Route path="login" element={<Login/>} />
        <Route path="register" element={<Register/>} />
        <Route path="profile" element={<Profile/>} />
        <Route path="collections/:collection" element={<CollectionPage/>} />
        <Route path="product/:id" element={<ProductDetail/>}/>
        <Route path="checkout" element={<CheckOut/>}/>
        <Route path="order-confirmation" element={<OrderConfirmationPage/>} />
        <Route path="order/:id" element= {<OrderDetailsPage/>}/>
        <Route path="my-orders" element={<MyOrders/>}/>
        <Route path="about-us" element={<AboutUs />} /> 
        <Route path="security" element={<Security />} /> 
        <Route path="warranty" element={<Warranty />} /> 
        <Route path="return" element={<Returns />} /> 

      </Route>
      <Route path="/admin" element={
        <ProtectedRoute role="admin"> <AdminLayout/></ProtectedRoute>
      }>
        <Route index element={<AdminHomePage/>}/>
        <Route path="users" element={<UserManagement/>}/>
        <Route path="products" element={<Product/>}/>
        <Route path="products/:id/edit" element={<EditProduct/>}/>
        <Route path="orders" element={<Order/>}/>
        <Route path="/admin/products/addProduct" element={<AddProduct />} />

      </Route>
      </Routes>
    </BrowserRouter>
    </Provider>
  )
}

export default App
