import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider"; // adjust path

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <p>Loading auth...</p>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
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

//   const supervisorOnlyRoutes = ["/addDoctor", "/create-university"];

//   if (supervisorOnlyRoutes.some(path => location.pathname.startsWith(path)) && role !== "supervisor") {
//     return <Navigate to="/" replace />;
//   }

//    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
// };

// export default PrivateRoutes;



