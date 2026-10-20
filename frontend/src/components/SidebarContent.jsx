import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function SidebarContent({ menu }) {
  const { user } = useAuth();

  const getInitials = () => {
    if (!user) return "EM";

    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.firstName) {
      return user.firstName.slice(0, 2).toUpperCase();
    }
    if (user.email) {
      const emailPrefix = user.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
      if (emailPrefix.length >= 2) {
        return emailPrefix.slice(0, 2).toUpperCase();
      }
      return emailPrefix.slice(0, 1).toUpperCase() || "EM";
    }
    if (user.role === "ADMIN") return "AD";
    return "EM";
  };

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user?.role === "ADMIN"
    ? "Admin"
    : user?.email
    ? user.email.split("@")[0]
    : "Employee";

  return (
    <div className="sidebar-container d-flex flex-column h-100">
      {/* Brand Header with User Short Form in glowing box */}
      <div className="sidebar-brand-wrapper px-3 pt-4 pb-2">
        <div className="d-flex align-items-center gap-3">
          {/* User Name Short Form inside Glowing Box */}
          <div className="sidebar-brand-icon">
            <span className="sidebar-initials-text">
              {getInitials()}
            </span>
          </div>

          <div className="sidebar-brand-titles">
            <h5 className="sidebar-title-main mb-0">Employment</h5>
            <div className="sidebar-title-sub">Management System</div>
            <div className="sidebar-brand-glow-bar mt-2"></div>
          </div>
        </div>
      </div>

      {/* Navigations Section Title */}
      <div className="sidebar-nav-header px-4 mt-3 mb-2">
        <span className="sidebar-nav-label">NAVIGATIONS</span>
        <div className="sidebar-nav-line"></div>
      </div>

      {/* Navigation List */}
      <ul className="sidebar-nav-list list-unstyled px-3 flex-grow-1 overflow-auto mb-0">
        {menu.map((item) => (
          <li key={item.path} className="mb-2">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "custom-sidebar-link active"
                  : "custom-sidebar-link"
              }
            >
              <div className="d-flex align-items-center gap-3">
                <i className={`${item.icon} nav-icon`}></i>
                <span className="nav-title">{item.title}</span>
              </div>
              <i className="fa-solid fa-chevron-right nav-arrow"></i>
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Red Outlined Logout Button */}
      <div className="px-3 pb-3 pt-3">
        <button
          onClick={() => {
            localStorage.removeItem("ems_token");
            localStorage.removeItem("ems_user");
            window.location.href = "/";
          }}
          className="btn sidebar-logout-btn w-100 d-flex align-items-center justify-content-center gap-2 rounded-3 py-2"
        >
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default SidebarContent;