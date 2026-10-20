import { useState, useEffect } from "react";
import API_BASE_URL from "../config/api";

function GeneratePayslips({
  show,
  onClose,
  onGenerate,
  employees = [],
}) {
  const today = new Date();

  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const [formData, setFormData] = useState({
    employeeId: "",
    month: currentMonth,
    year: currentYear,
    basicSalary: "",
    allowances: "",
    deductions: "",
  });

  const [netSalary, setNetSalary] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filter out deactivated/inactive employees and ensure list is non-empty
  const activeEmployees = (employees || []).filter((emp) => !emp.isDeleted);

  // Auto-fill salary fields when an employee is selected
  const handleEmployeeChange = (e) => {
    const selectedId = e.target.value;
    const emp = activeEmployees.find(
      (item) => String(item._id || item.id) === String(selectedId)
    );

    if (emp) {
      setFormData((prev) => ({
        ...prev,
        employeeId: selectedId,
        basicSalary: emp.basicSalary !== undefined && emp.basicSalary !== null ? String(emp.basicSalary) : prev.basicSalary,
        allowances: emp.allowances !== undefined && emp.allowances !== null ? String(emp.allowances) : prev.allowances,
        deductions: emp.deductions !== undefined && emp.deductions !== null ? String(emp.deductions) : prev.deductions,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        employeeId: selectedId,
      }));
    }
  };

  useEffect(() => {
    const basic = Number(formData.basicSalary) || 0;
    const allowance = Number(formData.allowances) || 0;
    const deduction = Number(formData.deductions) || 0;

    setNetSalary(basic + allowance - deduction);
  }, [
    formData.basicSalary,
    formData.allowances,
    formData.deductions,
  ]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employeeId) {
      setError("Please select an employee.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("ems_token");
      const res = await fetch(`${API_BASE_URL}/api/payslips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employeeId: formData.employeeId,
          month: Number(formData.month),
          year: Number(formData.year),
          basicSalary: Number(formData.basicSalary) || 0,
          allowances: Number(formData.allowances || 0),
          deductions: Number(formData.deductions || 0),
        }),
      });

      const data = await res.json();

      if (res.ok && (data.success || data.data)) {
        if (onGenerate) onGenerate();
        if (onClose) onClose();
        setFormData({
          employeeId: "",
          month: currentMonth,
          year: currentYear,
          basicSalary: "",
          allowances: "",
          deductions: "",
        });
      } else {
        setError(data.error || "Failed to generate payslip");
      }
    } catch {
      setError("Network error while generating payslip.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <div
        className="modal fade show"
        style={{
          display: "block",
          background: "rgba(0,0,0,.45)",
          backdropFilter: "blur(6px)",
          zIndex: 1050,
        }}
        onClick={onClose}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="modal-header bg-primary text-white py-3 px-4">
              <h5 className="modal-title fw-bold">
                <i className="fa-solid fa-file-invoice-dollar me-2"></i>Generate Payslip
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              ></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body p-4">
                {error && (
                  <div className="alert alert-danger py-2 small">{error}</div>
                )}

                {/* Employee select dropdown */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Select Employee <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleEmployeeChange}
                    required
                  >
                    <option value="">-- Choose Employee --</option>
                    {activeEmployees.map((emp) => {
                      const empId = emp._id || emp.id;
                      return (
                        <option key={empId} value={empId}>
                          {emp.firstName} {emp.lastName} {emp.position ? `— ${emp.position}` : ""} {emp.department ? `(${emp.department})` : ""}
                        </option>
                      );
                    })}
                  </select>
                  {activeEmployees.length === 0 && (
                    <small className="text-danger d-block mt-1">
                      No active employees found to generate payslip.
                    </small>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Month</label>
                    <select
                      className="form-select"
                      name="month"
                      value={formData.month}
                      onChange={handleChange}
                    >
                      {[
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ].map((m, i) => (
                        <option key={i} value={i + 1}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Year</label>
                    <input
                      className="form-control"
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Basic Salary (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="basicSalary"
                    placeholder="e.g. 50000"
                    value={formData.basicSalary}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Allowances (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="allowances"
                      placeholder="0"
                      value={formData.allowances}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Deductions (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="deductions"
                      placeholder="0"
                      value={formData.deductions}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="alert alert-primary mb-0 d-flex justify-content-between align-items-center">
                  <span className="fw-semibold">Calculated Net Salary:</span>
                  <span className="fs-5 fw-bold text-primary">₹{netSalary.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="modal-footer border-0 px-4 pb-4">
                <button
                  className="btn btn-outline-secondary px-4"
                  type="button"
                  onClick={onClose}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary px-4"
                  type="submit"
                  disabled={loading || !formData.employeeId}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Generating...
                    </>
                  ) : (
                    "Generate Payslip"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div
        className="modal-backdrop fade show"
        style={{
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          zIndex: 1040,
        }}
      ></div>
    </>
  );
}

export default GeneratePayslips;