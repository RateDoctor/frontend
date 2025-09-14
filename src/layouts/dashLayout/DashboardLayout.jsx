import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Dashboard/sideBarDash/sideBar.jsx";
import { useAuth } from "../../utils/AuthProvider.jsx";
import Loader from "../../layouts/load/load.jsx";

import './dashboardLayout.css';

const DashboardLayout = () => {
  const { isAuthenticated, isAdmin, loading, token, role } = useAuth();

  // if (loading) return <p>Loading...</p>;

    if (loading) {
    return (
      <div className="ratings-container">
        <Loader type={1} />
      </div>
    );
  }
  
  if (!isAuthenticated || !isAdmin) return <p>Unauthorized</p>;

  const currentUser = { token, role }; // ✅ pass token + role

  return (
    <div className="dashboard-app">
      <Sidebar />
      <main className="dashboard-content">
        <Outlet context={{ currentUser }} /> {/* ✅ nested pages receive currentUser */}
      </main>
    </div>
  );
};

export default DashboardLayout;
