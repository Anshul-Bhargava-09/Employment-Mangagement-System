import { useCallback, useEffect, useState } from "react";
import { dummyEmployeeData } from "../../assets/assets.jsx";
import API_BASE_URL from "../../config/api";
import Loader from "../../components/Loader";
import { format } from "date-fns";
import GeneratePayslips from "../../components/GeneratePayslips";

function AdminPayslipsPage() {
  const [payslips, setPayslips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const fetchPayslips = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("ems_token");
      const res = await fetch(`${API_BASE_URL}/api/payslips`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const result = await res.json();
        setPayslips(result.data || []);
      } else {
        setPayslips([]);
      }
    } catch {
      setPayslips([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEmployees = useCallback(async () => {
    try {
      const token = localStorage.getItem("ems_token");
      const res = await fetch(`${API_BASE_URL}/api/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const result = await res.json();
        setEmployees(result.data || result || []);
      } else {
        setEmployees(dummyEmployeeData);
      }
    } catch {
      setEmployees(dummyEmployeeData);
    }
  }, []);

  useEffect(() => {
    fetchPayslips();
    fetchEmployees();
  }, [fetchPayslips, fetchEmployees]);

  const handleGeneratePayslip = () => {
    fetchPayslips();
  };

  if (loading) return <Loader />;

  // Filter payslips by employee search
  const filteredPayslips = payslips.filter((p) => {
    const emp = p.employee || p.employeeId;
    const name = emp
      ? `${emp.firstName || ""} ${emp.lastName || ""}`.toLowerCase()
      : "";
    return name.includes(search.toLowerCase());
  });

  const totalPayroll = payslips.reduce((sum, p) => sum + (p.netSalary || 0), 0);

  return (
    <>
      <div className="main-content d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="fw-bold mb-1">Payslips Management</h2>
          <p className="text-muted mb-0">
            Generate and manage all employee payslips
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          type="button"
          className="btn btn-primary px-3 shadow-sm"
        >
          <i className="fa-solid fa-plus me-2"></i>Generate Payslip
        </button>
      </div>

      <div className="main-content">
        {/* Summary Cards */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-0 rounded-4 p-3">
              <div className="text-muted small">Total Payslips Issued</div>
              <h4 className="fw-bold text-primary mb-0">{payslips.length}</h4>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-0 rounded-4 p-3">
              <div className="text-muted small">Total Disbursed</div>
              <h4 className="fw-bold text-success mb-0">₹{totalPayroll.toLocaleString("en-IN")}</h4>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-0 rounded-4 p-3">
              <div className="text-muted small">Eligible Employees</div>
              <h4 className="fw-bold text-dark mb-0">{employees.length}</h4>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4" style={{ maxWidth: "350px", position: "relative" }}>
          <i
            className="fa-solid fa-magnifying-glass"
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#888",
            }}
          ></i>
          <input
            type="text"
            className="form-control ps-5"
            placeholder="Search by employee name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-header bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
            <h6 className="fw-bold mb-0">All Employee Payslips</h6>
            <small className="text-muted">{filteredPayslips.length} records</small>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-muted">
                <tr>
                  <th className="ps-4">Employee</th>
                  <th>Period</th>
                  <th>Basic Salary</th>
                  <th>Allowances</th>
                  <th>Deductions</th>
                  <th>Net Salary</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredPayslips.length > 0 ? (
                  filteredPayslips.map((payslip) => {
                    const emp = payslip.employee || payslip.employeeId;
                    const payslipId = payslip._id || payslip.id;
                    return (
                      <tr key={payslipId}>
                        <td className="ps-4 fw-medium">
                          <div>
                            {emp ? `${emp.firstName || ""} ${emp.lastName || ""}`.trim() : "—"}
                          </div>
                          {emp?.department && (
                            <small className="text-muted">{emp.department}</small>
                          )}
                        </td>
                        <td>
                          {format(
                            new Date(payslip.year, payslip.month - 1),
                            "MMMM yyyy"
                          )}
                        </td>
                        <td>₹{payslip.basicSalary?.toLocaleString("en-IN") || 0}</td>
                        <td className="text-success">+₹{payslip.allowances?.toLocaleString("en-IN") || 0}</td>
                        <td className="text-danger">-₹{payslip.deductions?.toLocaleString("en-IN") || 0}</td>
                        <td className="fw-bold text-primary">
                          ₹{payslip.netSalary?.toLocaleString("en-IN") || 0}
                        </td>
                        <td className="text-center">
                          <a
                            href={`/payslip/${payslipId}`}
                            className="btn btn-sm btn-outline-secondary"
                            title="View/Print Payslip"
                          >
                            <i className="fa-solid fa-file-invoice me-1"></i> View
                          </a>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      <i className="fa-solid fa-file-invoice-dollar fa-2x mb-2 d-block"></i>
                      No payslips found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <GeneratePayslips
        show={showModal}
        onClose={() => setShowModal(false)}
        onGenerate={handleGeneratePayslip}
        employees={employees}
      />
    </>
  );
}

export default AdminPayslipsPage;
