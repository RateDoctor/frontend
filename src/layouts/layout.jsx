import React from 'react';
import Navbar from '../components/navbar/navbar.jsx';
import Footer from '../components/footer/footer.jsx';
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { matchPath } from "react-router-dom";

/** Clean helper function to match routes properly */
const isPathMatch = (pathname, pattern) => {
  const isWildcard = pattern.endsWith("/*");
  const cleanPattern = isWildcard ? pattern.replace("/*", "") : pattern;

  return matchPath(
    { path: cleanPattern, end: !isWildcard },
    pathname
  );
};

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  /** Routes where Navbar should not appear */
  const hideNavbarRoutes = [
    "/my-ratings/*",
    "/settings/*",
    "/addDoctor/*",
    "/saved-doctors",
    "/contact",
    "/create-university",
    "/rate-admin",
    "/leaderboard",
    "/helpFAQ",
    "/login",
    "/singup",
    "/checking",
    "/upload",
    "/forgot-password",
    "/welcome/*",
    "/logout",
    "/dashboard/*",
  ];

  /** Routes where Footer should not appear */
  const hideFooterRoutes = [
    "/login",
    "/singup",
    "/upload",
    "/checking",
    "/forgot-password",
    "/welcome/*",
    "/logout",
    "/my-ratings/*",
    "/dashboard/*",
  ];

  /** Evaluate Navbar and Footer visibility */
  const shouldHideNavbar = hideNavbarRoutes.some(pattern => isPathMatch(pathname, pattern));
  const shouldHideFooter = hideFooterRoutes.some(pattern => isPathMatch(pathname, pattern));

  return (
    <div className="app">
      {!shouldHideNavbar && (
        <Navbar
          title="Explore"
          onBack={() => {
            if (window.history.length > 2) {
              window.history.back();
            } else {
              navigate("/");
            }
          }}
        />
      )}
      <div className="content">
        <Outlet />
      </div>
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default Layout;
