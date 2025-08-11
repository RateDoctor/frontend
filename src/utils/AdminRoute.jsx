import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";

const AdminRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (!isAdmin) return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
};

export default AdminRoute;
