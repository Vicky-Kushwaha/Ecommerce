// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import Loading from "../layouts/Loader/Loader";

// const ProtectedRoute = ({ isAdmin, Component, ...rest }) => {
//   const { loading, isAuthenticated, user } = useSelector((state) => state.user);

//   const navigate = useNavigate();

//   console.log("isAuthenticated:", isAuthenticated);

//   if (loading === false) {
//     if (isAuthenticated === false) {
//       return navigate("/login");
//     }

//     if (isAdmin === true && user.role !== "admin") {
//       return navigate(-1);
//     }

//     return (
//       <>
//         {loading ? (
//           <Loading />
//         ) : (
//           isAuthenticated === true && <Component {...rest} />
//         )}
//       </>
//     );
//   }
// };

// export default ProtectedRoute;

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
