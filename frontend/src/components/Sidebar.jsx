import "./Sidebar.css";
import SidebarContent from "./SidebarContent";
import { adminMenu,employeeMenu } from "./SidebarData";

function Sidebar({role}) {
   const menu = role === "admin" ? adminMenu : employeeMenu;
  
  return (
    <>
      {/* Hamburger Button (Only md and below) */}
      <button
        className="btn btn-primary d-lg-none m-3"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#sidebar"
      >
        ☰
      </button>

      {/* Fixed Sidebar (Only lg and above) */}
      <aside
        className="d-none d-lg-flex flex-column ems-sidebar position-fixed"
        style={{
          width: "280px",
          height: "100vh",
          left: 0,
          top: 0,
          zIndex: 1040,
        }}
      >
        <SidebarContent menu={menu} />
      </aside>

      {/* Offcanvas Sidebar (Only md and below) */}
      <div
        className="offcanvas offcanvas-start ems-sidebar text-white d-lg-none"
        tabIndex="-1"
        id="sidebar"
        data-bs-backdrop="true"
        style={{ width: "280px" }}
      > 
        <div className="offcanvas-header justify-content-end p-2 pb-0">
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>
        <div className="offcanvas-body p-0 d-flex flex-column h-100">
          <SidebarContent menu={menu} />
        </div>
      </div>

     
      
    </>
  );
}

export default Sidebar;
