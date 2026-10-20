import { useCallback, useEffect, useState } from "react";
import { dummyEmployeeData, dummyPayslipData } from "../../assets/assets";
import Loader from "../../components/Loader";
import { format } from "date-fns";
import GeneratePayslips from "../../components/GeneratePayslips";

function AdminPayslipsPage() {
  const [payslips, setPayslips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal,setShowModal] = useState(false)

  const fetchPayslips = useCallback(async () => {
    setPayslips(dummyPayslipData);
    setTimeout(() => {
      setLoading(false);
    }, [1000]);
  }, []);

  useEffect(() => {
    fetchPayslips();
  }, [fetchPayslips]);

  useEffect(() => {
    setEmployees(dummyEmployeeData);
  },[]);

  const handleGeneratePayslip = (newPayslip) => {
  setPayslips((prev) => [...prev, newPayslip]);
};

  if (loading) return <Loader />;

  return (
    <>
      <div className="main-content d-flex justify-content-between align-items-center">
        <div>
          <h2 className="mb-1">Payslips</h2>
          <p className=" text-muted mb-0">
            Generate and manage employees payslips
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          type="button"
          className="btn btn-primary signIn-btn"
          style={{ width: "170px" }}
        >
          + Generate Payslips
        </button>
      </div>

      <div className="main-content">
        <div className="card shadow-sm border-1">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover custom-table table-striped align-middle ">
                <thead className="table ">
                  <tr className="p-2">
                    <th>employee</th>
                    <th>period</th>
                    <th>basic salary</th>
                    <th>Net salary</th>
                    <th>action</th>
                  </tr>
                </thead>

                {payslips.length > 0 ? (
                  <tbody>
                    {payslips.map((payslip) => (
                      <tr key={payslip._id || payslip.id}>
                        <td>
                          {payslip.employee?.firstName}{" "}
                          {payslip.employee?.lastName}
                        </td>
                        <td>
                          {format(
                            new Date(payslip.year, payslip.month - 1),
                            "MMMM yyyy",
                          )}
                        </td>
                        <td>${payslip.basicSalary?.toLocaleString()}</td>

                        <td>${payslip.netSalary?.toLocaleString()}</td>

                        <td>
                          <button
                            type="button"
                            className="btn "
                            style={{
                              background: "none",
                              border: "none",
                              padding: 0,
                              cursor: "pointer",
                            }}
                          >
                            <i
                              className="fa-solid fa-download fa-xl"
                              style={{ color: "#74C0FC" }}
                            ></i>
                          </button>
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
