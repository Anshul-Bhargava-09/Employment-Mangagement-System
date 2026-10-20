import { useState, useEffect } from "react";
import { format } from "date-fns";
import API_BASE_URL from "../../config/api";

function EmployeeAttendancePage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [todayRecord, setTodayRecord] = useState(null);
  const [history, setHistory] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [message, setMessage] = useState(null);

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Attendance Records
  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem("ems_token");
      const res = await fetch(`${API_BASE_URL}/api/attendance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const result = await res.json();
        setHistory(result.data || []);
        setTodayRecord(result.today || null);
      }
    } catch (err) {
      console.error("Failed to load attendance", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // Clock In / Out Action
  const handleClockAction = async () => {
    setSubmitting(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("ems_token");
      const res = await fetch(`${API_BASE_URL}/api/attendance`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({
          type: "success",
          text:
            data.type === "CHECK_IN"
              ? "Clock In recorded successfully!"
              : "Clock Out recorded successfully!",
        });
        fetchAttendance();
      } else {
        setMessage({
          type: "danger",
          text: data.error || "Failed to log attendance.",
        });
      }
    } catch {
      setMessage({ type: "danger", text: "Network error occurred." });
    } finally {
      setSubmitting(false);
    }
  };

  const isCheckedIn = !!todayRecord?.checkIn;
  const isCheckedOut = !!todayRecord?.checkOut;

  const presentCount = history.filter(
    (h) => h.status === "PRESENT" || h.status === "LATE"
  ).length;
  const totalHours = history
    .reduce((sum, h) => sum + (h.workingHours || 0), 0)
    .toFixed(1);

  return (
    <>
      <div className="main-content">
        {/* Simple Clean Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <h2 className="fw-bold mb-1">Attendance</h2>
            <p className="text-muted mb-0">Record your daily work shift and track hours</p>
          </div>

          <div className="text-end">
            <span className="badge bg-light text-dark border px-3 py-2 fs-6 font-monospace">
              <i className="fa-regular fa-clock me-2 text-primary"></i>
              {format(currentTime, "hh:mm:ss a")} &bull; {format(currentTime, "EEE, MMM dd")}
            </span>
          </div>
        </div>

        {/* Feedback Alert */}
        {message && (
          <div
            className={`alert alert-${message.type} alert-dismissible fade show rounded-3 mb-4`}
            role="alert"
          >
            {message.text}
            <button
              type="button"
              className="btn-close"
              onClick={() => setMessage(null)}
            ></button>
          </div>
        )}

        {/* Clean Clock In / Out Banner */}
        <div className="card shadow-sm border-0 rounded-4 mb-4">
          <div className="card-body p-4">
            <div className="row align-items-center g-3">
              <div className="col-md-7">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className={`rounded-circle d-flex align-items-center justify-content-center text-white ${
                      !isCheckedIn
                        ? "bg-primary"
                        : !isCheckedOut
                        ? "bg-warning"
                        : "bg-success"
                    }`}
                    style={{ width: "54px", height: "54px", minWidth: "54px" }}
                  >
                    <i
                      className={`fa-solid ${
                        !isCheckedIn
                          ? "fa-arrow-right-to-bracket"
                          : !isCheckedOut
                          ? "fa-business-time"
                          : "fa-check"
                      } fs-5`}
                    ></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">
                      {!isCheckedIn
                        ? "Start Your Work Day"
                        : !isCheckedOut
                        ? "You are Currently Checked In"
                        : "Work Day Completed"}
                    </h5>
                    <div className="text-muted small">
                      {todayRecord?.checkIn
                        ? `Checked In at ${format(new Date(todayRecord.checkIn), "hh:mm a")}`
                        : "Not checked in yet today"}
                      {todayRecord?.checkOut
                        ? ` &bull; Checked Out at ${format(new Date(todayRecord.checkOut), "hh:mm a")}`
                        : ""}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="col-md-5 text-md-end">
                {!isCheckedOut ? (
                  <button
                    disabled={submitting}
                    onClick={handleClockAction}
                    className={`btn px-4 py-2 rounded-3 fw-semibold ${
                      !isCheckedIn ? "btn-primary" : "btn-warning text-dark"
                    }`}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving...
                      </>
                    ) : !isCheckedIn ? (
                      <>
                        <i className="fa-solid fa-arrow-right-to-bracket me-2"></i>
                        Clock In
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-arrow-right-from-bracket me-2"></i>
                        Clock Out
                      </>
                    )}
                  </button>
                ) : (
                  <span className="badge bg-success-subtle text-success border border-success px-3 py-2 rounded-pill fs-7">
                    <i className="fa-solid fa-check me-1"></i> Shift Finished Today
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2 Lightweight Stat Badges */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 rounded-4 p-3 bg-white">
              <div className="text-muted small">Days Present</div>
              <h4 className="fw-bold mb-0 text-primary">{presentCount}</h4>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 rounded-4 p-3 bg-white">
              <div className="text-muted small">Total Hours Logged</div>
              <h4 className="fw-bold mb-0 text-success">{totalHours} hrs</h4>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 rounded-4 p-3 bg-white">
              <div className="text-muted small">Check-in Status</div>
              <h6 className="fw-bold mb-0 mt-1">
                <span
                  className={`badge ${
                    todayRecord?.status === "PRESENT"
                      ? "bg-success"
                      : todayRecord?.status === "LATE"
                      ? "bg-warning text-dark"
                      : "bg-secondary"
                  }`}
                >
                  {todayRecord?.status || "Pending"}
                </span>
              </h6>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card shadow-sm border-0 rounded-4 p-3 bg-white">
              <div className="text-muted small">Shift Duration</div>
              <h6 className="fw-bold mb-0 mt-1">
                {todayRecord?.workingHours ? `${todayRecord.workingHours} hrs` : "In Progress"}
              </h6>
            </div>
          </div>
        </div>

        {/* Clean, Simple Attendance Table */}
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-header bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
            <h6 className="fw-bold mb-0">Attendance Log</h6>
            <small className="text-muted">{history.length} records</small>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-muted">
                <tr>
                  <th className="ps-4">Date</th>
                  <th>Status</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Hours</th>
                </tr>
              </thead>
              <tbody>
                {history.length > 0 ? (
                  history.map((record) => (
                    <tr key={record._id || record.date}>
                      <td className="ps-4 fw-medium">
                        {format(new Date(record.date), "MMM dd, yyyy")}
                      </td>
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
                      <td>
                        {record.checkIn
                          ? format(new Date(record.checkIn), "hh:mm a")
                          : "—"}
                      </td>
                      <td>
                        {record.checkOut
                          ? format(new Date(record.checkOut), "hh:mm a")
                          : "—"}
                      </td>
                      <td className="fw-semibold">
                        {record.workingHours ? `${record.workingHours} hrs` : "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted small">
                      No attendance records found yet.
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

export default EmployeeAttendancePage;