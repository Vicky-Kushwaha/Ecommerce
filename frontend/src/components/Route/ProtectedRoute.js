import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loading from "../layouts/Loader/Loader";

const ProtectedRoute = ({ Component, isAdmin }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin === true && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Component />;
};

export default ProtectedRoute;
