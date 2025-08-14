import React from "react";
import "./sideBar.css";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { RiAdminFill } from "react-icons/ri";
import {  MdOutlineLogout } from "react-icons/md";
import { FaUserCog , FaUniversity} from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { VscFeedback } from "react-icons/vsc";

import { useAuth } from "../../../utils/AuthProvider.jsx";

function Sidebar() {
    const navigate = useNavigate();
    const { logout } = useAuth();



     const handleLogout = () => {
        logout();                    
        localStorage.removeItem("currentUser"); 
        navigate("/login", { replace: true });  
    };


    const link = [
         {
            path: "/dashboard/universities",
            name: "Universities",
            icon: <FaUniversity />,
        },
     
        
        {
            path: "/dashboard/doctors",
            name: "Doctors",
            icon: <GiTeacher />,
        },

         {
            path: "/dashboard/feedbacks",
            name: "Feedbacks",
            icon: <VscFeedback />,
        },
        {
            path: "/dashboard/users",
            name: "Users",
            icon: <FaUserCog />,
        },

        {
            path: "/dashboard/Admins",
            name: "Admins",
            icon: <RiAdminFill />,
        },
    ];

    let activeStyle = {
        backgroundColor: "#bf681b",
        color: "#fff",
        borderRadius: "5px",
        transition: "all 0.3s ease-in",
        width: "200px",
        boxShadow: "0px 1px 5px #bf681b",
        fontWeight: "bold",
    };
    return (
        <>
            <div className="sidebar">
                <div className="sidebar-main">
                    {link.map((e) => {
                        return (
                            <ul>
                                <li>
                                    <NavLink
                                        style={({ isActive }) =>
                                            isActive ? activeStyle : undefined
                                        }
                                        to={e.path}
                                        className="link-name"
                                    >
                                        {e.icon}
                                        {e.name}
                                    </NavLink>
                                </li>
                            </ul>
                        );
                    })}
                </div>

                <ul className="sidebar-end">
                    <li>
                    <button
                        className="logout-button"
                        onClick={handleLogout}
                        style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "none", border: "none", cursor: "pointer", color: "#333" }}
                    >
                        <MdOutlineLogout />
                        Logout
                    </button>
                </li>
                </ul>
            </div>
        </>
    );
}

export default Sidebar;
