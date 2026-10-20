import { useCallback, useEffect, useState } from "react";
import { dummyEmployeeData, DEPARTMENTS } from "../../assets/assets";
import API_BASE_URL from "../../config/api";
import EmployeeCard from "../../components/EmployeeCard";
import "./AdminPages.css";
import { Link } from "react-router-dom";

function AdminEmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectdepartment, setSelectDepartment] = useState("All");
  const [activeTab, setActiveTab] = useState("active"); // 'active' or 'history'
  const [message, setMessage] = useState(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("ems_token");
      const deptQuery =
        selectdepartment && selectdepartment !== "All"
          ? `&department=${encodeURIComponent(selectdepartment)}`
          : "";
      const statusQuery =
        activeTab === "history"
          ? "?includeDeleted=only"
          : "?includeDeleted=false";

      const url = `${API_BASE_URL}/api/employees${statusQuery}${deptQuery}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setEmployees(Array.isArray(data) ? data : []);
      } else {
        setEmployees(dummyEmployeeData);
      }
    } catch {
      setEmployees(dummyEmployeeData);
    } finally {
      setLoading(false);
    }
  }, [selectdepartment, activeTab]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Handle employee delete
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}"? The employee will be moved to Previous Employees history.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("ems_token");
      const res = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setMessage({ type: "success", text: `"${name}" moved to Previous Employees.` });
        fetchEmployees();
      } else {
        const err = await res.json();
        setMessage({ type: "danger", text: err.error || "Failed to remove employee." });
      }
    } catch {
      setMessage({ type: "danger", text: "Network error while removing employee." });
    }
  };

  // Handle employee restore
  const handleRestore = async (id, name) => {
    if (!window.confirm(`Restore "${name}" back to Active Employees?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("ems_token");
      const res = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isDeleted: false, employmentStatus: "ACTIVE" }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: `"${name}" restored to Active Employees!` });
        fetchEmployees();
      } else {
        const err = await res.json();
        setMessage({ type: "danger", text: err.error || "Failed to restore employee." });
      }
    } catch {
      setMessage({ type: "danger", text: "Network error while restoring employee." });
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const fullName = `${employee.firstName || ""} ${employee.lastName || ""}`.toLowerCase();
    const matchSearch = fullName.includes(search.toLowerCase()) || (employee.email && employee.email.toLowerCase().includes(search.toLowerCase()));
    const matchDepartment =
      selectdepartment === "All" || employee.department === selectdepartment;

    return matchSearch && matchDepartment;
  });

  return (
    <>
      {/* Header section */}
      <div className="main-content justify-content-between align-items-center d-flex mt-3 flex-wrap gap-2">
        <div>
          <h3 className="fw-bold mb-1">Employees Directory</h3>
          <p className="text-muted mb-0">Manage current staff members and view former employee history</p>
        </div>

        <div className="d-flex gap-2">
          {/* Previous Employees history button */}
          <button
            type="button"
            className={`btn px-3 py-2 fw-medium ${activeTab === "history" ? "btn-dark shadow-sm" : "btn-outline-secondary"}`}
            onClick={() => setActiveTab(activeTab === "history" ? "active" : "history")}
          >
            <i className={`fa-solid ${activeTab === "history" ? "fa-users" : "fa-clock-rotate-left"} me-2`}></i>
            {activeTab === "history" ? "Active Employees" : "Previous Employees"}
          </button>

          <Link to="/admin/employees/new">
            <button
              type="button"
              className="btn btn-primary signIn-btn px-3 py-2 fw-medium"
            >
              <i className="fa-solid fa-user-plus me-2"></i>Add Employee
            </button>
          </Link>
        </div>
      </div>

      {/* Alert Notification */}
      {message && (
        <div className="main-content mt-2">
          <div className={`alert alert-${message.type} alert-dismissible fade show rounded-3 py-2 small`} role="alert">
            <i className={`fa-solid ${message.type === "success" ? "fa-circle-check" : "fa-triangle-exclamation"} me-2`}></i>
            {message.text}
            <button type="button" className="btn-close py-2" onClick={() => setMessage(null)}></button>
          </div>
        </div>
      )}

      {/* Tabs Pill Indicator */}
      <div className="main-content d-flex align-items-center gap-2 mt-3">
        <button
          className={`btn btn-sm rounded-pill px-3 py-1 ${activeTab === "active" ? "btn-primary" : "btn-light text-muted"}`}
          onClick={() => setActiveTab("active")}
        >
          Active Staff ({activeTab === "active" ? employees.length : "..."})
        </button>
        <button
          className={`btn btn-sm rounded-pill px-3 py-1 ${activeTab === "history" ? "btn-secondary text-white" : "btn-light text-muted"}`}
          onClick={() => setActiveTab("history")}
        >
          <i className="fa-solid fa-box-archive me-1"></i>
          Previous Employees ({activeTab === "history" ? employees.length : "History"})
        </button>
      </div>

      {/* Input search box & Filters */}
      <div className="main-content d-flex justify-content-between align-items-center gap-3 mt-3 flex-wrap">
        <div style={{ position: "relative", flex: "1 1 280px" }}>
          <i
            className="fa-solid fa-magnifying-glass"
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "gray",
            }}
          ></i>

          <input
            type="text"
            className="form-control ps-5"
            placeholder={activeTab === "history" ? "Search previous employees..." : "Search active employees by name or email..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div>
          <select
            className="form-select"
            value={selectdepartment}
            onChange={(e) => setSelectDepartment(e.target.value)}
            style={{ minWidth: "180px" }}
          >
            <option value="All">All Departments</option>
            {DEPARTMENTS.map((deptName) => (
              <option key={deptName} value={deptName}>
                {deptName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="main-content py-5 text-center">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-2">Loading employees directory...</p>
        </div>
      ) : (
        /* Employees data card grid */
        <div className="cards-container main-content mt-3">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <EmployeeCard
                key={employee._id || employee.id}
                employee={employee}
                onDelete={handleDelete}
                onRestore={handleRestore}
                isHistory={activeTab === "history"}
              />
            ))
          ) : (
            <div className="card border-0 shadow-sm rounded-4 w-100 py-5 text-center">
              <i className={`fa-solid ${activeTab === "history" ? "fa-clock-rotate-left" : "fa-user-slash"} fa-3x text-muted mb-3`}></i>
              <h5 className="fw-semibold text-secondary">
                {activeTab === "history" ? "No Previous Employees Found" : "No Active Employees Found"}
              </h5>
              <p className="text-muted mb-0 small">
                {activeTab === "history"
                  ? "Deleted or archived employees will appear in this history list."
                  : "No employees match your search or department filter."}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default AdminEmployeePage;
