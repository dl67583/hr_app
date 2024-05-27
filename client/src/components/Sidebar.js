import "../styles/Sidebar.css";
import { useLocation } from "react-router-dom";
import { useSidebar } from '../context/sidebarContext';

const Sidebar = () => {
  const location = useLocation();
  const { isSidebarOpen } = useSidebar();

  return (
    <div className={`sidebar ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <div className="side-logo d-flex justify-content-center align-items-center">
        <label className="logo">HR App</label>
      </div>
      <div className="mt-5">
      
        <div className={`side-opt ${location.pathname === "/users" ? "selected-sidebar-link" : ""}`} >
          <a className={location.pathname === "/users" ? "selected" : ""} href="/users">Users</a>
        </div>
             <div className={`side-opt ${location.pathname === "/departments" ? "selected-sidebar-link" : ""}`} >

          <a className={location.pathname === "/departments" ? "selected" : ""} href="/departments">Departments</a>
        </div>
        <div className={`side-opt ${location.pathname === "/requests" ? "selected-sidebar-link" : ""}`} >

          <a className={location.pathname === "/requests" ? "selected" : ""} href="/requests">Requests</a>
        </div>
        <div className={`side-opt ${location.pathname === "/candidates" ? "selected-sidebar-link" : ""}`} >

          <a className={location.pathname === "/candidates" ? "selected" : ""} href="/candidates">Candidates</a>
        </div>


        <div className={`side-opt ${location.pathname === "/attendance" ? "selected-sidebar-link" : ""}`} >

<a className={location.pathname === "/attendance" ? "selected" : ""} href="/attendance">Time and Attendance</a>
</div>

      </div>
      <hr style={{ color: 'white', margin: '10%' }} />
    </div>
  );
};

export default Sidebar;
