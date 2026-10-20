import { NavLink } from "react-router-dom";

function SidebarContent({ menu }) {
  return (
    <>
      <div className="border p-2 d-flex mt-5 ms-3 me-3 rounded">
        <div className="border p-2 ms-3 me-3 rounded">
          Box
        </div>

        <div className="flex-fill me-3">
          <h6 className="mb-0 mt-2">Employee MS</h6>
          <p className="mb-0" style={{ fontSize: "12px" }}>
            Management System
          </p>
        </div>
      </div>

      <h6 className="mt-5 ms-3">NAVIGATIONS</h6>

      <ul className="list-unstyled p-1">
        {menu.map((item) => (
          <li key={item.path} className="">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >
              <i className={`${item.icon} me-3`}></i>
              {item.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </>
  );
}

export default SidebarContent;