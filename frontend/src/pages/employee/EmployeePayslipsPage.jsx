import { useCallback, useEffect, useState } from "react";
import { dummyPayslipData } from "../../assets/assets.jsx";
import Loader from "../../components/Loader";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";


function EmployeePayslipsPage() {

  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();


  // =========================
  // FETCH PAYSLIPS
  // =========================

  const fetchPayslips = useCallback(async () => {

    setPayslips(dummyPayslipData);

    setTimeout(() => {
      setLoading(false);
    }, 1000);

  }, []);


  useEffect(() => {

    fetchPayslips();

  }, [fetchPayslips]);


  // =========================
  // LOADING
  // =========================

  if (loading) {
    return <Loader />;
  }


  return (
    <>

      {/* ========================= */}
      {/* PAGE HEADER */}
      {/* ========================= */}

      <div className="main-content d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2 className="mb-1">
            Payslips
          </h2>

          <p className="text-muted mb-0">
            Your payslips history
          </p>

        </div>

      </div>


      {/* ========================= */}
      {/* PAYSLIP TABLE */}
      {/* ========================= */}

      <div className="main-content">

        <div className="card shadow-sm border-0">

          <div className="card-body">

            <div className="table-responsive">

              <table className="table table-hover table-striped align-middle mb-0">

                {/* TABLE HEADER */}

                <thead className="table-light">

                  <tr>

                    <th>
                      Period
                    </th>

                    <th>
                      Basic Salary
                    </th>

                    <th>
                      Net Salary
                    </th>

                    <th className="text-center">
                      Action
                    </th>

                  </tr>

                </thead>


                {/* TABLE BODY */}

                <tbody>

                  {payslips.length > 0 ? (

                    payslips.map((payslip) => {

                      const payslipId =
                        payslip._id || payslip.id;


                      return (

                        <tr key={payslipId}>

                          {/* PERIOD */}

                          <td>

                            <span className="fw-semibold">

                              {format(
                                new Date(
                                  payslip.year,
                                  payslip.month - 1
                                ),
                                "MMMM yyyy"
                              )}

                            </span>

                          </td>


                          {/* BASIC SALARY */}

                          <td>

                            $
                            {payslip.basicSalary?.toLocaleString() || "0"}

                          </td>


                          {/* NET SALARY */}

                          <td>

                            <span className="fw-semibold">

                              $
                              {payslip.netSalary?.toLocaleString() || "0"}

                            </span>

                          </td>


                          {/* ACTION */}

                          <td className="text-center">

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              onClick={() =>
                                navigate(
                                  `/payslip/${payslipId}`
                                )
                              }
                            >

                              <i className="fa-solid fa-download me-2"></i>

                              View Payslip

                            </button>

                          </td>

                        </tr>

                      );

                    })

                  ) : (

                    /* ========================= */
                    /* NO PAYSLIPS */
                    /* ========================= */

                    <tr>

                      <td
                        colSpan="4"
                        className="text-center py-5"
                      >

                        <i className="fa-solid fa-file-invoice-dollar fa-2x text-muted mb-3"></i>

                        <h5 className="text-secondary">
                          No Payslips Found
                        </h5>

                        <p className="text-muted mb-0">
                          You don't have any payslips yet.
                        </p>

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

    </>
  );
}


export default EmployeePayslipsPage;