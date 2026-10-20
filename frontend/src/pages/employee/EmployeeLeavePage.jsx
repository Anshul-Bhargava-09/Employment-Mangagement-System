import { useCallback, useEffect } from "react";
import { useState } from "react";
import { dummyLeaveData } from "../../assets/assets";
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

  const fetchLeaves = useCallback(() => {
    setLeaves(dummyLeaveData);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const handleAddLeave = (leave) => {
  setLeaves((prev) => [...prev, leave]);
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
      icon: <i class="fa-regular fa-temperature-high"></i>,
    },
    {
      label: "Casual Leaves",
      value: casualCount,
      icon: <i class="fa-solid fa-umbrella-beach"></i>,
    },
    {
      label: "Annual Leaves",
      value: annualCount,
      icon: <i class="fa-solid fa-tree"></i>,
    },
  ];

  return (
    <>
      <div className="main-content d-flex justify-content-between align-items-center">
        <div>
          <h2 className="mb-1">Leave Management</h2>
          <p className="ms-4 text-muted mb-0">
            Your leave history and requests
          </p>
        </div>

        {!isDeleted && (
          <button
            onClick={() => setShowModal(true)}
            type="button"
            className="btn btn-primary signIn-btn"
            style={{ width: "170px" }}
          >
            + Apply For Leave
          </button>
        )}
      </div>
      <div className="cards-container main-content ">
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
      <LeaveFormModal
  show={showModal}
  onClose={() => setShowModal(false)}
  onAddLeave={handleAddLeave}
/>
    </>
  );
}

export default EmployeeLeavePage;
