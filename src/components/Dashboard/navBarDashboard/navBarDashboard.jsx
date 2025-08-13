import React from "react";
import Sidebar from "../../Dashboard/sideBarDash/sideBar.jsx";
import "./navBarDashboard.css";
import { Outlet } from "react-router-dom";

function NavBar({ dashboardName, adminName, adminAvatar }) {
    return (
        <>
            <div className="navbar">
                <div className="navbar-start">
                    <h1>{dashboardName}Dashboard</h1>
                </div>
                <div className="navbar-end">
                    <div className="admin-details">
                        <span>{adminName}adminName</span>
                    </div>
                </div>
            </div>
            <div className="trying-table">
                <Sidebar />
                <Outlet />
            </div>
        </>
    );
}

export default NavBar;
import React from "react";
import Sidebar from "../../Component/sideBar/sideBar.jsx";
import "./navBarDashboard.css";
import { Outlet } from "react-router-dom";

function NavBar({ dashboardName, adminName, adminAvatar }) {
    return (
        <>
            <div className="navbar">
                <div className="navbar-start">
                    <h1>{dashboardName}Dashboard</h1>
                </div>
                <div className="navbar-end">
                    <div className="admin-details">
                        <span>{adminName}adminName</span>
                    </div>
                </div>
            </div>
            <div className="trying-table">
                <Sidebar />
                <Outlet />
            </div>
        </>
    );
}

export default NavBar;
