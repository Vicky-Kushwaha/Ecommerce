import "./App.css";
import { useEffect, useState, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layouts/Header/Header";
import Footer from "./components/layouts/Footer/Footer";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { loadUser } from "./actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ScrollToTop from "./components/layouts/ScrollToTop";
import Loading from "./components/layouts/Loader/Loader";

// -------------------------
// Lazy Loaded Components
// -------------------------
const Home = lazy(() => import("./components/Home/Home"));
const ProductDetails = lazy(() =>
  import("./components/Product/ProductDetails")
);
const Products = lazy(() => import("./components/Product/Products"));
const LoginSignUp = lazy(() => import("./components/User/LoginSignUp"));
const UpdateProfile = lazy(() => import("./components/User/UpdateProfile"));
const Profile = lazy(() => import("./components/User/Profile"));
const UpdatePassword = lazy(() => import("./components/User/UpdatePassword"));
const ForgotPassword = lazy(() => import("./components/User/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/User/ResetPassword"));
const Shipping = lazy(() => import("./components/Cart/Shipping"));
const Cart = lazy(() => import("./components/Cart/Cart"));
const ConfirmOrder = lazy(() => import("./components/Cart/ConfirmOrder"));
const Payment = lazy(() => import("./components/Cart/Payment"));
const OrderSuccess = lazy(() => import("./components/Cart/OrderSuccess"));
const MyOrder = lazy(() => import("./components/Order/MyOrders"));
const OrderDetails = lazy(() => import("./components/Order/OrderDetails"));
const SingleOrder = lazy(() => import("./components/Order/SingleOrder"));

// Admin
const Dashboard = lazy(() => import("./components/Admin/Dashboard"));
const ProductList = lazy(() => import("./components/Admin/ProductList"));
const OrderList = lazy(() => import("./components/Admin/OrderList"));
const NewProduct = lazy(() => import("./components/Admin/NewProduct"));
const UpdateProduct = lazy(() => import("./components/Admin/UpdateProduct"));
const ProcessOrder = lazy(() => import("./components/Admin/ProcessOrder"));
const UsersList = lazy(() => import("./components/Admin/UsersList"));
const UpdateUser = lazy(() => import("./components/Admin/UpdateUser"));

const ProtectedRoute = lazy(() => import("./components/Route/ProtectedRoute"));
const NotFound = lazy(() => import("./components/layouts/Not Found/NotFound"));

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

        {/* Suspense fallback UI */}
        <Suspense fallback={<Loading />}>
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
                    <ProtectedRoute Component={Payment} />
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

            {/* Admin routes */}
            <Route
              exact
              path="/admin/dashboard"
              element={<ProtectedRoute isAdmin={true} Component={Dashboard} />}
            />

            <Route
              exact
              path="/admin/products"
              element={
                <ProtectedRoute isAdmin={true} Component={ProductList} />
              }
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
              element={
                <ProtectedRoute isAdmin={true} Component={ProcessOrder} />
              }
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
        </Suspense>

        <Footer />
      </Router>
    </>
  );
}

export default App;
