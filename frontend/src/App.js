import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layouts/Header/Header";
import Footer from "./components/layouts/Footer/Footer";
import Home from "./components/Home/Home";
import ProductDetails from "./components/Product/ProductDetails";
import Products from "./components/Product/Products";
import LoginSignUp from "./components/User/LoginSignUp";
import UpdateProfile from "./components/User/UpdateProfile";
import ProtectedRoute from "./components/Route/ProtectedRoute";
import Profile from "./components/User/Profile";
import UpdatePassword from "./components/User/UpdatePassword";
import ForgotPassword from "./components/User/ForgotPassword";
import ResetPassword from "./components/User/ResetPassword";
import Cart from "./components/Cart/Cart";
import ConfirmOrder from "./components/Cart/ConfirmOrder";
import OrderSuccess from "./components/Cart/OrderSuccess";
import Payment from "./components/Cart/Payment";
import MyOrder from "./components/Order/MyOrders";
import OrderDetails from "./components/Order/OrderDetails";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { loadUser } from "./actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import Shipping from "./components/Cart/Shipping";
import axios from "axios";
import Dashboard from "./components/Admin/Dashboard";
import ProductList from "./components/Admin/ProductList";
import OrderList from "./components/Admin/OrderList";
import NewProduct from "./components/Admin/NewProduct";
import UpdateProduct from "./components/Admin/UpdateProduct";
import ProcessOrder from "./components/Admin/ProcessOrder";
import UsersList from "./components/Admin/UsersList";
import UpdateUser from "./components/Admin/UpdateUser";
import NotFound from "./components/layouts/Not Found/NotFound";
import SingleOrder from "./components/Order/SingleOrder";
import ScrollToTop from "./components/layouts/ScrollToTop";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    if (isAuthenticated) {
      const { data } = await axios.get("/api/auth/stripeapikey");

      setStripeApiKey(data.stripeApiKey);
    }
  }

  useEffect(() => {
    getStripeApiKey();
  });

  useEffect(() => {
    dispatch(loadUser());
  }, []);

  return (
    <>
      <Router>
        <Header />
        <ScrollToTop />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/product/:id" element={<ProductDetails />} />
          <Route exact path="/products" element={<Products />} />
          <Route path="/products/:keyword" element={<Products />} />
          <Route exact path="/login" element={<LoginSignUp />} />

          <Route exact path="/password/forgot" element={<ForgotPassword />} />

          <Route
            exact
            path="/account"
            element={<ProtectedRoute Component={Profile} />}
          />

          <Route
            exact
            path="/me/update"
            element={<ProtectedRoute Component={UpdateProfile} />}
          />

          <Route
            exact
            path="/password/update"
            element={<ProtectedRoute Component={UpdatePassword} />}
          />

          <Route exact path="/cart" element={<Cart />} />

          <Route
            exact
            path="/shipping"
            element={<ProtectedRoute Component={Shipping} />}
          />

          <Route
            exact
            path="/order/confirm"
            element={<ProtectedRoute Component={ConfirmOrder} />}
          />

          <Route
            exact
            path="/singleOrder/confirm"
            element={<ProtectedRoute Component={SingleOrder} />}
          />

          {stripeApiKey && (
            <Route
              exact
              path="/process/payment"
              element={
                <Elements stripe={loadStripe(stripeApiKey)}>
                  <ProtectedRoute Component={Payment} />{" "}
                </Elements>
              }
            />
          )}

          <Route
            exact
            path="/success"
            element={<ProtectedRoute Component={OrderSuccess} />}
          />

          <Route
            exact
            path="/myOrder"
            element={<ProtectedRoute Component={MyOrder} />}
          />

          <Route
            exact
            path="/orderDetails/:id"
            element={<ProtectedRoute Component={OrderDetails} />}
          />

          <Route
            exact
            path="/admin/dashboard"
            element={<ProtectedRoute isAdmin={true} Component={Dashboard} />}
          />

          <Route
            exact
            path="/admin/products"
            element={<ProtectedRoute isAdmin={true} Component={ProductList} />}
          />

          <Route
            exact
            path="/admin/newproduct"
            element={<ProtectedRoute isAdmin={true} Component={NewProduct} />}
          />

          <Route
            exact
            path="/admin/product/:id"
            element={
              <ProtectedRoute isAdmin={true} Component={UpdateProduct} />
            }
          />

          <Route
            exact
            path="/admin/orders"
            element={<ProtectedRoute isAdmin={true} Component={OrderList} />}
          />

          <Route
            exact
            path="/admin/order/:id"
            element={<ProtectedRoute isAdmin={true} Component={ProcessOrder} />}
          />

          <Route
            exact
            path="/admin/users"
            element={<ProtectedRoute isAdmin={true} Component={UsersList} />}
          />

          <Route
            exact
            path="/admin/user/:id"
            element={<ProtectedRoute isAdmin={true} Component={UpdateUser} />}
          />

          <Route
            exact
            path="/password/reset/:token"
            element={<ResetPassword />}
          />

          <Route exact path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
