import { useCallback, useEffect, useState } from "react";
import { dummyLeaveData } from "../../assets/assets.jsx";
import Loader from "../../components/Loader";
import { format } from "date-fns";
import "./AdminPages.css";
import API_BASE_URL from "../../config/api";

function AdminLeavePage() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [toastMessage, setToastMessage] = useState(null);

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("ems_token");
      const url =
        statusFilter && statusFilter !== "All"
          ? `${API_BASE_URL}/api/leave?status=${statusFilter}`
          : `${API_BASE_URL}/api/leave`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const result = await res.json();
        setLeaves(result.data || []);
      } else {
        const errData = await res.json().catch(() => ({}));
        console.error("Fetch leaves error:", errData);
        // Only fallback to dummy data if user has no data and not 401/403
        if (res.status === 401 || res.status === 403) {
          setLeaves([]);
          setToastMessage({
            type: "danger",
            text: errData.error || "Session expired or unauthorized. Please re-login.",
          });
        } else {
          setLeaves([]);
        }
      }
    } catch (err) {
      console.error("Network error fetching leaves:", err);
      setLeaves([]);
      setToastMessage({
        type: "danger",
        text: "Could not connect to server. Ensure backend is running.",
      });
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const handleStatusUpdate = async (id, status) => {
    if (!id) {
      setToastMessage({ type: "danger", text: "Invalid leave ID" });
      return;
    }

    setProcessing(id);
    try {
      const token = localStorage.getItem("ems_token");
      const res = await fetch(`${API_BASE_URL}/api/leave/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        // Update locally in real time
        setLeaves((prev) =>
          prev.map((l) =>
            String(l._id || l.id) === String(id) ? { ...l, status } : l
          )
        );
        setToastMessage({
          type: "success",
          text: `Leave request has been ${status.toLowerCase()} successfully!`,
        });
        setTimeout(() => setToastMessage(null), 3500);
      } else {
        // If the ID was dummy demo data (not in MongoDB), update locally so user can still test UI
        const isDummy = dummyLeaveData.some((d) => String(d._id || d.id) === String(id));
        if (isDummy) {
          setLeaves((prev) =>
            prev.map((l) =>
              String(l._id || l.id) === String(id) ? { ...l, status } : l
            )
          );
          setToastMessage({
            type: "warning",
            text: `Updated locally (sample record not in DB). Status is now ${status.toLowerCase()}.`,
          });
          setTimeout(() => setToastMessage(null), 3500);
        } else {
          setToastMessage({
            type: "danger",
            text: data.error || `Failed to update status to ${status}`,
          });
        }
      }
    } catch (err) {
      console.error("Failed to update leave status", err);
      // Fallback update for dummy demo data when offline
      const isDummy = dummyLeaveData.some((d) => String(d._id || d.id) === String(id));
      if (isDummy) {
        setLeaves((prev) =>
          prev.map((l) =>
            String(l._id || l.id) === String(id) ? { ...l, status } : l
          )
        );
        setToastMessage({
          type: "warning",
          text: `Updated locally in demo mode. Status: ${status}`,
        });
      } else {
        setToastMessage({
          type: "danger",
          text: "Network error while updating leave status. Please check backend connection.",
        });
      }
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <Loader />;

  // Stats
  const pendingCount = leaves.filter((l) => l.status === "PENDING").length;
  const approvedCount = leaves.filter((l) => l.status === "APPROVED").length;
  const rejectedCount = leaves.filter((l) => l.status === "REJECTED").length;

  // Search filter by employee name
  const filtered = leaves.filter((leave) => {
    const emp = leave.employee || leave.employeeId;
    const name = emp
      ? `${emp.firstName || ""} ${emp.lastName || ""}`.toLowerCase()
      : "";
    return name.includes(search.toLowerCase());
  });

  return (
    <>
      {/* Header */}
      <div className="main-content d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1">Leave Management</h2>
          <p className="text-muted mb-0">Review and approve or reject employee leave applications</p>
        </div>
      </div>

      {/* Feedback Toast / Alert Banner */}
      {toastMessage && (
        <div className="main-content mt-2">
          <div
            className={`alert alert-${toastMessage.type} alert-dismissible fade show rounded-3 py-2 px-3 small d-flex align-items-center justify-content-between`}
            role="alert"
          >
            <div>
              <i
                className={`fa-solid ${
                  toastMessage.type === "success"
                    ? "fa-circle-check text-success"
                    : "fa-triangle-exclamation text-danger"
                } me-2`}
              ></i>
              {toastMessage.text}
            </div>
            <button
              type="button"
              className="btn-close py-2"
              onClick={() => setToastMessage(null)}
            ></button>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="main-content">
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 rounded-4 p-3">
              <div className="text-muted small">Total Applications</div>
              <h4 className="fw-bold text-primary mb-0">{leaves.length}</h4>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 rounded-4 p-3">
              <div className="text-muted small">Pending</div>
              <h4 className="fw-bold text-warning mb-0">{pendingCount}</h4>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 rounded-4 p-3">
              <div className="text-muted small">Approved</div>
              <h4 className="fw-bold text-success mb-0">{approvedCount}</h4>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 rounded-4 p-3">
              <div className="text-muted small">Rejected</div>
              <h4 className="fw-bold text-danger mb-0">{rejectedCount}</h4>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="d-flex gap-3 flex-wrap mb-4">
          <div style={{ position: "relative", flex: "1 1 240px" }}>
            <i
              className="fa-solid fa-magnifying-glass"
              style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "gray" }}
            ></i>
            <input
              type="text"
              placeholder="Search by employee name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: "8px 8px 8px 35px",
                width: "100%",
                borderRadius: "8px",
                border: "1.5px solid #dee2e6",
              }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "8px 16px", borderRadius: "8px", border: "1.5px solid #dee2e6" }}
          >
            <option value="All">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* Table */}
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-header bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
            <h6 className="fw-bold mb-0">All Leave Applications</h6>
            <small className="text-muted">{filtered.length} records</small>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-muted">
                <tr>
                  <th className="ps-4">Employee</th>
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((leave) => {
                    const emp = leave.employee || leave.employeeId;
                    const leaveId = leave._id || leave.id;
                    const isProcessing = String(processing) === String(leaveId);

                    return (
                      <tr key={leaveId}>
                        <td className="ps-4 fw-medium">
                          <div>{emp ? `${emp.firstName || ""} ${emp.lastName || ""}`.trim() : "—"}</div>
                          {emp?.department && (
                            <div className="text-muted small">{emp.department}</div>
                          )}
                        </td>
                        <td>
                          <span className="badge bg-primary-subtle text-primary px-2 py-1">
                            {leave.type}
                          </span>
                        </td>
                        <td className="small">
                          {format(new Date(leave.startDate), "MMM dd")} —{" "}
                          {format(new Date(leave.endDate), "MMM dd, yyyy")}
                        </td>
                        <td className="text-muted small" style={{ maxWidth: "200px" }}>
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
                        <td className="text-center">
                          {leave.status === "PENDING" ? (
                            <div className="d-flex justify-content-center gap-2">
                              <button
                                disabled={Boolean(processing)}
                                onClick={() => handleStatusUpdate(leaveId, "APPROVED")}
                                className="btn btn-sm btn-outline-success px-3"
                                title="Approve Leave"
                              >
                                {isProcessing ? (
                                  <span className="spinner-border spinner-border-sm me-1"></span>
                                ) : (
                                  <i className="fa-solid fa-check me-1"></i>
                                )}
                                Approve
                              </button>
                              <button
                                disabled={Boolean(processing)}
                                onClick={() => handleStatusUpdate(leaveId, "REJECTED")}
                                className="btn btn-sm btn-outline-danger px-3"
                                title="Reject Leave"
                              >
                                {isProcessing ? (
                                  <span className="spinner-border spinner-border-sm me-1"></span>
                                ) : (
                                  <i className="fa-solid fa-xmark me-1"></i>
                                )}
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-muted small">
                              {leave.status === "APPROVED" ? (
                                <span className="text-success small fw-medium">
                                  <i className="fa-solid fa-check-double me-1"></i>Approved
                                </span>
                              ) : (
                                <span className="text-danger small fw-medium">
                                  <i className="fa-solid fa-ban me-1"></i>Rejected
                                </span>
                              )}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      <i className="fa-regular fa-calendar-xmark fs-3 mb-2 d-block"></i>
                      No leave applications found.
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

export default AdminLeavePage;
