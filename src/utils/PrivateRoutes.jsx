import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider"; // adjust path

const PrivateRoute = () => {
  const { isAuthenticated, loading, loggingOut} = useAuth();
   const location = useLocation();

  if (loading) return <p>Loading auth...</p>;
  if (!isAuthenticated  && !loggingOut) {
    // Redirect to login with "from" so user can be redirected back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
    return <Outlet />;
};

export default PrivateRoute;




// import { Outlet, Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "../utils/AuthProvider";

// const PrivateRoutes = () => {
//   const { isAuthenticated, role, loading } = useAuth();
//   const location = useLocation();

//   console.log("Authenticated:", isAuthenticated);
//   console.log("User role:", role);
//   console.log("Current path:", location.pathname);

//     if (loading) {
//     return <div>Loading...</div>; // or a spinner
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   const adminOnlyRoutes = ["/addDoctor", "/create-university"];

//   if (adminrOnlyRoutes.some(path => location.pathname.startsWith(path)) && role !== "admin") {
//     return <Navigate to="/" replace />;
//   }

//    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
// };

// export default PrivateRoutes;



