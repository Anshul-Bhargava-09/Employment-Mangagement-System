import { useCallback, useEffect, useState } from "react";
import API_BASE_URL from "../../config/api";
import Loader from "../../components/Loader";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

function EmployeePayslipsPage() {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchPayslips();
  }, [fetchPayslips]);

  if (loading) return <Loader />;

  // Stats
  const totalNet = payslips.reduce((sum, p) => sum + (p.netSalary || 0), 0);
  const latestPayslip = payslips[0];

  return (
    <>
      {/* Header */}
      <div className="main-content d-flex justify-content-between align-items-center mb-2">
        <div>
          <h2 className="mb-1">My Payslips</h2>
          <p className="text-muted mb-0">Your payslip history</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="main-content">
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-4">
            <div className="card shadow-sm border-0 rounded-4 p-3">
              <div className="text-muted small">Total Payslips</div>
              <h4 className="fw-bold text-primary mb-0">{payslips.length}</h4>
            </div>
          </div>
          <div className="col-6 col-md-4">
            <div className="card shadow-sm border-0 rounded-4 p-3">
              <div className="text-muted small">Latest Net Salary</div>
              <h4 className="fw-bold text-success mb-0">
                {latestPayslip ? `₹${latestPayslip.netSalary?.toLocaleString("en-IN")}` : "—"}
              </h4>
            </div>
          </div>
          <div className="col-6 col-md-4">
            <div className="card shadow-sm border-0 rounded-4 p-3">
              <div className="text-muted small">Total Earned</div>
              <h4 className="fw-bold text-dark mb-0">₹{totalNet.toLocaleString("en-IN")}</h4>
            </div>
          </div>
        </div>

        {/* Payslip Table */}
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-header bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
            <h6 className="fw-bold mb-0">Payslip History</h6>
            <small className="text-muted">{payslips.length} records</small>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-muted">
                <tr>
                  <th className="ps-4">Period</th>
                  <th>Basic Salary</th>
                  <th>Allowances</th>
                  <th>Deductions</th>
                  <th>Net Salary</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {payslips.length > 0 ? (
                  payslips.map((payslip) => {
                    const payslipId = payslip._id || payslip.id;
                    return (
                      <tr key={payslipId}>
                        <td className="ps-4 fw-semibold">
                          {format(new Date(payslip.year, payslip.month - 1), "MMMM yyyy")}
                        </td>
                        <td>₹{payslip.basicSalary?.toLocaleString("en-IN") || "0"}</td>
                        <td className="text-success">+₹{payslip.allowances?.toLocaleString("en-IN") || "0"}</td>
                        <td className="text-danger">-₹{payslip.deductions?.toLocaleString("en-IN") || "0"}</td>
                        <td>
                          <span className="fw-bold text-primary">
                            ₹{payslip.netSalary?.toLocaleString("en-IN") || "0"}
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary px-3"
                            onClick={() => navigate(`/payslip/${payslipId}`)}
                          >
                            <i className="fa-solid fa-eye me-1"></i>
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      <i className="fa-solid fa-file-invoice-dollar fa-2x mb-2 d-block"></i>
                      No payslips found. Contact your admin.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmployeePayslipsPage;