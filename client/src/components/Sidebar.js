import "../styles/Sidebar.css";
import { useLocation } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {
    const location = useLocation()
    return (
        <>
            <div className="sidebar">
                <div className="side-logo d-flex justify-content-center align-items-center">
                    <label className="logo">HR App</label>
                </div>
                <div className="mt-5">
                    <div className="side-opt" style={location.pathname === "/" ? {backgroundColor: 'lightgray'} : {}}>
                        <a className={location.pathname === "/" ? "selected" : ""} href="/">Dashboard</a>
                    </div>
                    <div className="side-opt" style={location.pathname === "/users" ? {backgroundColor: 'lightgray'} : {}}>
                        <a className={location.pathname === "/users" ? "selected" : ""} href="/users">Users</a>
                    </div>
                    <div className="side-opt" style={location.pathname === "/departments" ? {backgroundColor: 'lightgray'} : {}}>
                        <a className={location.pathname === "/departments" ? "selected" : ""} href="/departments">Departments</a>
                    </div>
                    <div className="side-opt" style={location.pathname === "/requests" ? {backgroundColor: 'lightgray'} : {}}>
                        <a className={location.pathname === "/requests" ? "selected" : ""} href="/requests">Requests</a>
                    </div>
                    <div className="side-opt" style={location.pathname === "/candidates" ? {backgroundColor: 'lightgray'} : {}}>
                        <a className={location.pathname === "/candidates" ? "selected" : ""} href="/candidates">Candidates</a>
                    </div>
                </div>
                <hr style={{color: 'white', margin: '10%'}}/>
            </div>
        </>
    )
}

export default Sidebar;