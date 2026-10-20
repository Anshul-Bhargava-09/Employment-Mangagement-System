import { useState, useEffect } from "react";
import { format } from "date-fns";
import { dummyAttendanceData } from "../../assets/assets.jsx";
import API_BASE_URL from "../../config/api";

function AdminAttendancePage() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("ems_token");
        const res = await fetch(`${API_BASE_URL}/api/attendance?limit=100`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const result = await res.json();
          setRecords(result.data || []);
        } else {
          setRecords(dummyAttendanceData);
        }
      } catch {
        setRecords(dummyAttendanceData);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const filtered = records.filter((r) => {
    const name = r.employeeId
      ? `${r.employeeId.firstName || ""} ${r.employeeId.lastName || ""}`.toLowerCase()
      : "";
    const matchSearch = name.includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPresent = records.filter((r) => r.status === "PRESENT" || r.status === "LATE").length;
  const totalLate = records.filter((r) => r.status === "LATE").length;

  return (
    <>
      <div className="main-content mt-3">
        <h3>Attendance Management</h3>
        <p className="text-muted">View and monitor all employee attendance records</p>
      </div>

      {/* Summary Cards */}
      <div className="main-content">
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 rounded-4 p-3">
              <div className="text-muted small">Total Records</div>
              <h4 className="fw-bold text-primary mb-0">{records.length}</h4>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 rounded-4 p-3">
              <div className="text-muted small">Present</div>
              <h4 className="fw-bold text-success mb-0">{totalPresent}</h4>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 rounded-4 p-3">
              <div className="text-muted small">Late</div>
              <h4 className="fw-bold text-warning mb-0">{totalLate}</h4>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 rounded-4 p-3">
              <div className="text-muted small">Absent</div>
              <h4 className="fw-bold text-danger mb-0">{records.filter((r) => r.status === "ABSENT").length}</h4>
            </div>
          </div>
        </div>

        {/* Filter Row */}
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
              style={{ padding: "8px 8px 8px 35px", width: "100%", borderRadius: "8px", border: "1.5px solid #dee2e6" }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "8px 16px", borderRadius: "8px", border: "1.5px solid #dee2e6" }}
          >
            <option value="All">All Status</option>
            <option value="PRESENT">Present</option>
            <option value="LATE">Late</option>
            <option value="ABSENT">Absent</option>
          </select>
        </div>

        {/* Table */}
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-header bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
            <h6 className="fw-bold mb-0">Attendance Records</h6>
            <small className="text-muted">{filtered.length} records</small>
          </div>
          {loading ? (
            <div className="text-center py-5">
              <span className="spinner-border text-primary"></span>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small text-muted">
                  <tr>
                    <th className="ps-4">Employee</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Hours</th>
                    <th>Day Type</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map((record) => (
                      <tr key={record._id}>
                        <td className="ps-4 fw-medium">
                          {record.employeeId
                            ? `${record.employeeId.firstName || ""} ${record.employeeId.lastName || ""}`.trim()
                            : "—"}
                          {record.employeeId?.department && (
                            <div className="text-muted small">{record.employeeId.department}</div>
                          )}
                        </td>
                        <td>{format(new Date(record.date), "MMM dd, yyyy")}</td>
                        <td>
                          <span
                            className={`badge px-2 py-1 ${
                              record.status === "PRESENT"
                                ? "bg-success-subtle text-success"
                                : record.status === "LATE"
                                ? "bg-warning-subtle text-warning"
                                : "bg-danger-subtle text-danger"
                            }`}
                          >
                            {record.status}
                          </span>
                        </td>
                        <td>{record.checkIn ? format(new Date(record.checkIn), "hh:mm a") : "—"}</td>
                        <td>{record.checkOut ? format(new Date(record.checkOut), "hh:mm a") : "—"}</td>
                        <td className="fw-semibold">
                          {record.workingHours ? `${record.workingHours} hrs` : "—"}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              record.dayType === "Full Day"
                                ? "bg-success"
                                : record.dayType === "Half Day"
                                ? "bg-warning text-dark"
                                : record.dayType === "Short Day"
                                ? "bg-danger"
                                : "bg-secondary"
                            }`}
                          >
                            {record.dayType || "—"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-muted small">
                        No attendance records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminAttendancePage;
