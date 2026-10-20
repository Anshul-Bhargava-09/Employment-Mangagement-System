import { useCallback, useEffect } from "react";
import { useState } from "react";
import { dummyLeaveData } from "../../assets/assets";
import Loader from "../../components/Loader";
import Card from "../../components/Card";
import { format } from "date-fns";
import "./AdminPages.css";
function AdminLeavePage() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const [processing, setProcessing] = useState(null);

  const handleStatusUpdate = async (id, status) => {
    setProcessing(id);
  };

  const fetchLeaves = useCallback(() => {
    setLeaves(dummyLeaveData);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  if (loading) return <Loader />;

  const approvedLeaves = leaves.filter((l) => l.status === "APPROVED");
  const sickCount = approvedLeaves.filter((l) => l.type === "SICK").length;
  const casualCount = approvedLeaves.filter((l) => l.type === "CASUAL").length;
  const annualCount = approvedLeaves.filter((l) => l.type === "ANNUAL").length;

 

  return (
    <>
      <div className="main-content">
        <h2>Leave Management</h2>
        <p className="ms-4">Manage leave application</p>
      </div>

      <div className="main-content">
        <div className="card shadow-sm border-1">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover custom-table table-striped align-middle ">
                <thead className="table ">
                  <tr className="p-2">
                    <th>employee</th>
                    <th>type</th>
                    <th>Dates</th>
                    <th>reason</th>
                    <th>status</th>
                    <th>actions</th>
                  </tr>
                </thead>

                {leaves.length > 0 ? (
                  <tbody>
                    {leaves.map((leave) => (
                      <tr key={leave._id || leave.id}>
                        <td>
                          {leave.employee?.firstName} {leave.employee?.lastName}
                        </td>
                        <td>{leave.type}</td>
                        <td>
                          {format(new Date(leave.startDate), "MMM dd")}-
                          {format(new Date(leave.endDate), "MMM dd yyyy")}
                        </td>
                        <td>{leave.reason}</td>
                        <td>
                          <span
                            className={`badge ${
                              leave.status === "APPROVED"
                                ? "bg-success"
                                : leave.status === "REJECTED"
                                  ? "bg-danger"
                                  : leave.status === "PENDING"
                                    ? "bg-warning text-dark"
                                    : "bg-secondary"
                            }`}
                          >
                            {leave.status}
                          </span>
                        </td>
                        <td>
                          {leave.status === "PENDING" && (
                            <div className="d-flex justify-content-center gap-2">
                              <button
                                disabled={!!processing}
                                onClick={() =>
                                  handleStatusUpdate(
                                    leave.id || leave._id,
                                    "APPROVED",
                                  )
                                }
                                className="btn btn-sm border border-success text-success"
                              >
                                {processing === (leave._id || leave.id) ? (
                                  <i className="fa-solid fa-spinner fa-spin"></i>
                                ) : (
                                  <i className="fa-solid fa-check"></i>
                                )}
                              </button>

                              <button
                                onClick={() =>
                                  handleStatusUpdate(
                                    leave.id || leave._id,
                                    "REJECTED",
                                  )
                                }
                                disabled={!!processing}
                                className="btn btn-sm border border-danger text-danger"
                              >
                                {processing === (leave._id || leave.id) ? (
                                  <i className="fa-solid fa-spinner fa-spin"></i>
                                ) : (
                                  <i className="fa-solid fa-xmark"></i>
                                )}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  <div className="text-center py-5">
                    <h5 className="text-secondary">No Leave Requests Found</h5>
                    <p className="text-muted">
                      You haven't applied for any leave yet.
                    </p>
                  </div>
                )}

                
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminLeavePage;
