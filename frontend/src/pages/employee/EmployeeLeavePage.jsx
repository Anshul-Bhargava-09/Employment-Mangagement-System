import { useCallback, useEffect, useState } from "react";
import { dummyLeaveData } from "../../assets/assets.jsx";
import API_BASE_URL from "../../config/api";
import Loader from "../../components/Loader";
import Card from "../../components/Card";
import { format } from "date-fns";
import "./EmployeePages.css";
import LeaveFormModal from "../../components/LeaveFormModal";

function EmployeeLeavePage() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("ems_token");
      const res = await fetch(`${API_BASE_URL}/api/leave`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const result = await res.json();
        setLeaves(result.data || []);
        // check if employee is deactivated
        if (result.employee?.isDeleted) setIsDeleted(true);
      } else {
        setLeaves(dummyLeaveData);
      }
    } catch {
      setLeaves(dummyLeaveData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  // After a new leave is submitted via modal, refresh from API
  const handleAddLeave = () => {
    fetchLeaves();
  };

  if (loading) return <Loader />;

  const approvedLeaves = leaves.filter((l) => l.status === "APPROVED");
  const sickCount = approvedLeaves.filter((l) => l.type === "SICK").length;
  const casualCount = approvedLeaves.filter((l) => l.type === "CASUAL").length;
  const annualCount = approvedLeaves.filter((l) => l.type === "ANNUAL").length;

  const leaveStats = [
    {
      label: "Sick Leaves",
      value: sickCount,
      icon: <i className="fa-solid fa-thermometer-half"></i>,
    },
    {
      label: "Casual Leaves",
      value: casualCount,
      icon: <i className="fa-solid fa-umbrella-beach"></i>,
    },
    {
      label: "Annual Leaves",
      value: annualCount,
      icon: <i className="fa-solid fa-tree"></i>,
    },
  ];

  return (
    <>
      {/* Header */}
      <div className="main-content d-flex justify-content-between align-items-center">
        <div>
          <h2 className="mb-1">Leave Management</h2>
          <p className="text-muted mb-0">Your leave history and requests</p>
        </div>
        {!isDeleted && (
          <button
            onClick={() => setShowModal(true)}
            type="button"
            className="btn btn-primary"
            style={{ width: "170px" }}
          >
            + Apply For Leave
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="cards-container main-content">
        {leaveStats.map((c) => (
          <Card
            key={c.label}
            title={c.label}
            value={c.value}
            suffix="taken"
            icon={c.icon}
          />
        ))}
      </div>

      {/* Leave Table - only THIS employee's leaves */}
      <div className="main-content">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-header bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
            <h6 className="fw-bold mb-0">My Leave Requests</h6>
            <small className="text-muted">{leaves.length} records</small>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small text-muted">
                  <tr>
                    <th className="ps-4">Type</th>
                    <th>Dates</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.length > 0 ? (
                    leaves.map((leave) => (
                      <tr key={leave._id || leave.id}>
                        <td className="ps-4 fw-medium">
                          <span className="badge bg-primary-subtle text-primary px-2 py-1">
                            {leave.type}
                          </span>
                        </td>
                        <td>
                          {format(new Date(leave.startDate), "MMM dd")} —{" "}
                          {format(new Date(leave.endDate), "MMM dd, yyyy")}
                        </td>
                        <td className="text-muted" style={{ maxWidth: "220px" }}>
                          {leave.reason}
                        </td>
                        <td>
                          <span
                            className={`badge px-2 py-1 ${
                              leave.status === "APPROVED"
                                ? "bg-success-subtle text-success"
                                : leave.status === "REJECTED"
                                ? "bg-danger-subtle text-danger"
                                : "bg-warning-subtle text-warning"
                            }`}
                          >
                            {leave.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-5 text-muted">
                        <i className="fa-regular fa-calendar-xmark fs-3 mb-2 d-block"></i>
                        No leave requests found. Apply for one above!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <LeaveFormModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onAddLeave={handleAddLeave}
      />
    </>
  );
}

export default EmployeeLeavePage;
