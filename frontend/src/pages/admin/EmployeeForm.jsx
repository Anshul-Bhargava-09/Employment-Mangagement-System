import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { DEPARTMENTS } from "../../assets/assets";
import API_BASE_URL from "../../config/api";

function EmployeeForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // If present, edit mode
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    position: "",
    department: "Engineering",
    basicSalary: "",
    allowances: "",
    deductions: "",
    joinDate: new Date().toISOString().split("T")[0],
    role: "EMPLOYEE",
    bio: "",
  });

  // Fetch employee if edit mode
  useEffect(() => {
    if (!id) return;
    const fetchEmployee = async () => {
      setFetching(true);
      try {
        const token = localStorage.getItem("ems_token");
        const res = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const emp = await res.json();
          setFormData({
            firstName: emp.firstName || "",
            lastName: emp.lastName || "",
            email: emp.email || "",
            password: "", // leave blank if unchanged
            phone: emp.phone || "",
            position: emp.position || "",
            department: emp.department || "Engineering",
            basicSalary: emp.basicSalary ?? "",
            allowances: emp.allowances ?? "",
            deductions: emp.deductions ?? "",
            joinDate: emp.joinDate ? emp.joinDate.split("T")[0] : new Date().toISOString().split("T")[0],
            role: emp.user?.role || "EMPLOYEE",
            bio: emp.bio || "",
          });
        } else {
          setError("Failed to load employee details for editing.");
        }
      } catch {
        setError("Network error while loading employee details.");
      } finally {
        setFetching(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("ems_token");
      const url = isEdit
        ? `${API_BASE_URL}/api/employees/${id}`
        : `${API_BASE_URL}/api/employees`;
      const method = isEdit ? "PUT" : "POST";

      const payload = { ...formData };
      // In edit mode, if password is blank, don't send it so existing password is kept
      if (isEdit && !payload.password) {
        delete payload.password;
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/admin/employees");
        }, 1200);
      } else {
        setError(data.error || (isEdit ? "Failed to update employee" : "Failed to create employee"));
      }
    } catch (err) {
      setError(isEdit ? "Network error. Failed to update employee." : "Network error. Failed to add employee.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="main-content py-5 text-center">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <p className="text-muted">Loading employee profile...</p>
      </div>
    );
  }

  return (
    <>
      <div className="main-content">
        {/* Header Breadcrumbs / Nav */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <Link to="/admin/employees" className="text-decoration-none text-muted small">
                <i className="fa-solid fa-arrow-left me-1"></i> Back to Employees
              </Link>
            </div>
            <h2 className="fw-bold mb-1">{isEdit ? "Edit Employee" : "Add New Employee"}</h2>
            <p className="text-muted mb-0">
              {isEdit ? "Update employee profile and position details" : "Create an employee profile and login account"}
            </p>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show rounded-3" role="alert">
            <i className="fa-solid fa-circle-exclamation me-2"></i>
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>
        )}

        {success && (
          <div className="alert alert-success rounded-3" role="alert">
            <i className="fa-solid fa-circle-check me-2"></i>
            {isEdit ? "Employee updated successfully! Redirecting..." : "Employee created successfully! Redirecting..."}
          </div>
        )}

        {/* Form Container */}
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body p-4 p-md-5">
            <form onSubmit={handleSubmit}>
              {/* Section 1: Personal Details */}
              <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">
                <i className="fa-solid fa-user me-2 text-primary"></i>
                Personal Information
              </h5>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-medium small">
                    First Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    className="form-control"
                    placeholder="e.g. John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-medium small">
                    Last Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    className="form-control"
                    placeholder="e.g. Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-medium small">
                    Phone Number <span className="text-danger">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="e.g. +91 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-medium small">
                    Joining Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    name="joinDate"
                    className="form-control"
                    value={formData.joinDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Section 2: Account & Login Credentials */}
              <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">
                <i className="fa-solid fa-key me-2 text-primary"></i>
                Login Account Credentials
              </h5>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-medium small">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="e.g. john.doe@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-medium small">
                    {isEdit ? "New Password (leave blank to keep current)" : "Initial Password"} {!isEdit && <span className="text-danger">*</span>}
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder={isEdit ? "Enter new password if changing" : "Temporary login password"}
                    value={formData.password}
                    onChange={handleChange}
                    required={!isEdit}
                  />
                </div>
              </div>

              {/* Section 3: Job Role & Compensation */}
              <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">
                <i className="fa-solid fa-briefcase me-2 text-primary"></i>
                Job Position & Salary
              </h5>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-medium small">
                    Position / Job Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="position"
                    className="form-control"
                    placeholder="e.g. Senior Frontend Developer"
                    value={formData.position}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-medium small">
                    Department <span className="text-danger">*</span>
                  </label>
                  <select
                    name="department"
                    className="form-select"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-medium small">Basic Salary (₹)</label>
                  <input
                    type="number"
                    name="basicSalary"
                    className="form-control"
                    placeholder="e.g. 50000"
                    value={formData.basicSalary}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-medium small">Allowances (₹)</label>
                  <input
                    type="number"
                    name="allowances"
                    className="form-control"
                    placeholder="e.g. 5000"
                    value={formData.allowances}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-medium small">Deductions (₹)</label>
                  <input
                    type="number"
                    name="deductions"
                    className="form-control"
                    placeholder="e.g. 2000"
                    value={formData.deductions}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-medium small">Bio / Notes</label>
                  <textarea
                    name="bio"
                    rows="3"
                    className="form-control"
                    placeholder="Optional notes or biography about the employee..."
                    value={formData.bio}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="d-flex justify-content-end gap-3 pt-3 border-top">
                <Link to="/admin/employees" className="btn btn-outline-secondary px-4 py-2">
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading || success}
                  className="btn btn-primary px-5 py-2 fw-semibold"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className={`fa-solid ${isEdit ? "fa-floppy-disk" : "fa-user-plus"} me-2`}></i>
                      {isEdit ? "Update Employee" : "Save Employee"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmployeeForm;