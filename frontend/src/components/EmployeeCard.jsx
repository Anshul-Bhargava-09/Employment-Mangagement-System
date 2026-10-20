import "./EmployeeCard.css";
import { Link } from "react-router-dom";

function EmployeeCard({ employee, onDelete, onRestore, isHistory = false }) {
  const empId = employee._id || employee.id;

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(empId, `${employee.firstName} ${employee.lastName}`);
    }
  };

  const handleRestoreClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRestore) {
      onRestore(empId, `${employee.firstName} ${employee.lastName}`);
    }
  };

  const initials = `${employee.firstName?.[0] || ""}${employee.lastName?.[0] || ""}`.toUpperCase() || "EM";

  return (
    <div className={`employee-card ${isHistory ? "opacity-75 border-secondary-subtle" : ""}`}>
      <div className="card-top">
        {/* Hover / Action Icons */}
        <div className="card-icons">
          {!isHistory ? (
            <>
              <Link
                to={`/admin/employees/edit/${empId}`}
                style={{ textDecoration: "none" }}
                onClick={(e) => e.stopPropagation()}
                title="Edit Employee"
              >
                <button className="icon-btn edit-btn" type="button">
                  <i className="fa-solid fa-pen"></i>
                </button>
              </Link>

              <button
                className="icon-btn delete-btn"
                type="button"
                onClick={handleDeleteClick}
                title="Delete Employee"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </>
          ) : (
            <button
              className="icon-btn text-success"
              type="button"
              onClick={handleRestoreClick}
              title="Restore Employee to Active"
            >
              <i className="fa-solid fa-rotate-left"></i>
            </button>
          )}
        </div>

        <div className="department d-flex align-items-center gap-1">
          {isHistory && <span className="badge bg-danger-subtle text-danger py-0 px-1 me-1" style={{ fontSize: "10px" }}>Inactive</span>}
          {employee.department || "General"}
        </div>

        <div className="avatar">
          {initials}
        </div>
      </div>

      <div className="card-bottom">
        <h4>{employee.firstName} {employee.lastName}</h4>
        <p className="mb-1">{employee.position}</p>
        <div className="ms-3 text-muted small">
          <i className="fa-regular fa-envelope me-1"></i>
          {employee.email}
        </div>
      </div>
    </div>
  );
}

export default EmployeeCard;
