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
      <div
        className="d-none d-lg-block bg-dark text-white position-fixed overflow-auto"
        style={{
          width: "300px",
          height: "100vh",
          left: 0,
          top: 0,
        }}
      >
         <div className="d-flex align-items-center ms-4 mt-4">
        <i className="fa-regular fa-user fa-2xl"></i>

        <div className="ms-4">
          <h6 className="mb-0">Employee MS</h6>
          <p className="mb-0" style={{ fontSize: "12px" }}>
            Management System
          </p>
        </div>
      </div>
      <SidebarContent menu={menu}/>
     
           
      </div>

      {/* Offcanvas Sidebar (Only md and below) */}
      <div
        className="offcanvas offcanvas-start bg-dark text-white d-lg-none"
        tabIndex="-1"
        id="sidebar"
        data-bs-backdrop="static"
        style={{ width: "300px" }}
      > 
        <div className="offcanvas-header  ">
           <div className="d-flex align-items-center ms-3 mt-3">
        <i className="fa-regular fa-user fa-2xl"></i>

        <div className="ms-3">
          <h6 className="mb-0">Employee MS</h6>
          <p className="mb-0" style={{ fontSize: "12px" }}>
            Management System
          </p>
        </div>
      </div>
          <button style={{color:"white"}}
            type="button"
            className="btn-close  btn-close-white btn btn-light"
            data-bs-dismiss="offcanvas"
          ></button>
            
        </div>
        <SidebarContent menu={menu}/>
        

       
      </div>

     
      
    </>
  );
}

export default Sidebar;
