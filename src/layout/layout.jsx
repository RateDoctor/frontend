import React from 'react';
import Navbar from '../components/navbar/navbar.jsx';
import Footer from '../components/footer/footer.jsx';
import { useNavigate, useLocation, Outlet } from "react-router-dom";

const Layout = () => {

  const navigate = useNavigate();
  const location = useLocation();


  // Define routes that should NOT show the default Navbar
  const hideNavbarRoutes  = [
    "/my-ratings",
    "/settings",
    "/settings/change-email",
    "/settings/change-password",
    "/addDoctor",
    "/saved-doctors",
    "/contact",
    "/create-university",
    "/rate-supervisor",
    "/leaderboard",
    "/helpFAQ",
    "/login",
    "/singup",
    "/checking",
    "/Upload",
    "/forgot-password",
    "/Welcome",
    "/logout",
    "/welcome/*",
  ];

  const hideFooterRoutes  = 
  [
  "/login",
  "/singup",
  "/Upload",
  "/checking",
  "/forgot-password",
  "/Welcome",
  "/logout",
  "/welcome/*",
  ]
  

const shouldHideDefaultNavbar =
  location.pathname.startsWith("/welcome") || hideNavbarRoutes.includes(location.pathname);

const shouldHideDefaultFooter =
  location.pathname.startsWith("/welcome") || hideFooterRoutes.includes(location.pathname);

  return (
    <div className="app">
     {!shouldHideDefaultNavbar && (
        <Navbar
          title="Explore"
          onBack={() => {
            if (window.history.length > 2) {
              window.history.back();
            } else {
              window.location.href = "/";
            }
          }}
        />
      )}
      <div className="content">
        <Outlet />
      </div>
        {!shouldHideDefaultFooter && (
      <Footer />
      )}      
    </div>
  );
};

export default Layout;
