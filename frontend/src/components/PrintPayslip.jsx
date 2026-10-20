import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import Loader from "./Loader";
import jsPDF from "jspdf";
import API_BASE_URL from "../config/api";


function PrintPayslip() {

  const { id } = useParams();

  const [payslip, setPayslip] = useState(null);
  const [loading, setLoading] = useState(true);


  // =========================
  // FIND PAYSLIP
  // =========================

  useEffect(() => {
    const fetchPayslip = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("ems_token");
        const res = await fetch(`${API_BASE_URL}/api/payslips/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setPayslip(data);
        } else {
          setPayslip(null);
        }
      } catch {
        setPayslip(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPayslip();
    }
  }, [id]);


  // =========================
  // DOWNLOAD PDF
  // =========================

  const downloadPayslip = () => {

    if (!payslip) {
      return;
    }


    const doc = new jsPDF();


    // =========================
    // EMPLOYEE DATA
    // =========================

    const employeeName =
      payslip.employeeName ||
      payslip.employee?.name ||
      "Employee";


    const employeeId =
      payslip.employeeId ||
      payslip.employee?._id ||
      payslip.employee?.id ||
      "N/A";


    const position =
      payslip.position ||
      payslip.employee?.position ||
      "Employee";


    const email =
      payslip.email ||
      payslip.employee?.email ||
      "N/A";


    const period = format(
      new Date(
        payslip.year,
        payslip.month - 1
      ),
      "MMMM yyyy"
    );


    const basicSalary =
      Number(payslip.basicSalary) || 0;


    const allowances =
      Number(payslip.allowances) || 0;


    const deductions =
      Number(payslip.deductions) || 0;


    const netSalary =
      Number(payslip.netSalary) ||
      basicSalary + allowances - deductions;


    // =========================
    // PDF HEADER
    // =========================

    doc.setFont("helvetica", "bold");

    doc.setFontSize(24);

    doc.text(
      "PAYSLIP",
      105,
      25,
      {
        align: "center",
      }
    );


    doc.setFont("helvetica", "normal");

    doc.setFontSize(11);

    doc.text(
      period,
      105,
      34,
      {
        align: "center",
      }
    );


    doc.line(
      20,
      42,
      190,
      42
    );


    // =========================
    // EMPLOYEE DETAILS
    // =========================

    doc.setFont("helvetica", "bold");

    doc.setFontSize(11);


    doc.text(
      "EMPLOYEE NAME",
      20,
      58
    );


    doc.text(
      "POSITION",
      110,
      58
    );


    doc.setFont("helvetica", "normal");


    doc.text(
      employeeName,
      20,
      68
    );


    doc.text(
      position,
      110,
      68
    );


    doc.setFont("helvetica", "bold");


    doc.text(
      "EMAIL",
      20,
      83
    );


    doc.text(
      "PERIOD",
      110,
      83
    );


    doc.setFont("helvetica", "normal");


    doc.text(
      email,
      20,
      93
    );


    doc.text(
      period,
      110,
      93
    );


    // =========================
    // SALARY TABLE
    // =========================

    doc.setFont("helvetica", "bold");

    doc.text(
      "DESCRIPTION",
      25,
      115
    );


    doc.text(
      "AMOUNT",
      160,
      115
    );


    doc.line(
      20,
      120,
      190,
      120
    );


    doc.setFont("helvetica", "normal");


    // Basic Salary

    doc.text(
      "Basic Salary",
      25,
      135
    );

    doc.text(
      `Rs. ${basicSalary.toLocaleString("en-IN")}`,
      160,
      135
    );

    // Allowances
    doc.text(
      "Allowances",
      25,
      150
    );

    doc.text(
      `+Rs. ${allowances.toLocaleString("en-IN")}`,
      160,
      150
    );

    // Deductions
    doc.text(
      "Deductions",
      25,
      165
    );

    doc.text(
      `-Rs. ${deductions.toLocaleString("en-IN")}`,
      160,
      165
    );

    // =========================
    // NET SALARY
    // =========================
    doc.line(
      20,
      175,
      190,
      175
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);

    doc.text(
      "Net Salary",
      25,
      190
    );

    doc.text(
      `Rs. ${netSalary.toLocaleString("en-IN")}`,
      160,
      190
    );


    // =========================
    // FOOTER
    // =========================

    doc.setFont("helvetica", "normal");

    doc.setFontSize(9);


    doc.text(
      "This is a computer-generated payslip.",
      105,
      215,
      {
        align: "center",
      }
    );


    // =========================
    // DOWNLOAD
    // =========================

    const fileName =
      `${employeeName}-${period}-Payslip.pdf`;


    doc.save(fileName);

  };


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return <Loader />;

  }


  // =========================
  // PAYSLIP NOT FOUND
  // =========================

  if (!payslip) {

    return (

      <div className="container py-5">

        <div className="card border-0 shadow-sm">

          <div className="card-body text-center py-5">

            <i className="fa-solid fa-file-circle-xmark text-danger fa-3x mb-3"></i>

            <h3 className="fw-bold">
              Payslip Not Found
            </h3>

            <p className="text-muted mb-0">
              The payslip you are looking for does not exist.
            </p>

          </div>

        </div>

      </div>

    );

  }


  // =========================
  // DATA
  // =========================

  const employeeName =
    payslip.employeeName ||
    payslip.employee?.name ||
    "Employee";


  const employeeId =
    payslip.employeeId ||
    payslip.employee?._id ||
    payslip.employee?.id ||
    "N/A";


  const position =
    payslip.position ||
    payslip.employee?.position ||
    "Employee";


  const email =
    payslip.email ||
    payslip.employee?.email ||
    "N/A";


  const period = format(
    new Date(
      payslip.year,
      payslip.month - 1
    ),
    "MMMM yyyy"
  );


  const basicSalary =
    Number(payslip.basicSalary) || 0;


  const allowances =
    Number(payslip.allowances) || 0;


  const deductions =
    Number(payslip.deductions) || 0;


  const netSalary =
    Number(payslip.netSalary) ||
    basicSalary + allowances - deductions;


  // =========================
  // PAGE
  // =========================

  return (

    <div className="container py-5">


      {/* ========================= */}
      {/* PAYSLIP CARD */}
      {/* ========================= */}

      <div
        className="card border-0 shadow-sm mx-auto"
        style={{
          maxWidth: "850px",
        }}
      >

        <div className="card-body p-4 p-md-5">


          {/* ========================= */}
          {/* HEADER */}
          {/* ========================= */}

          <div className="text-center">

            <h1 className="fw-bold mb-1">
              PAYSLIP
            </h1>

            <p className="text-muted mb-0">
              {period}
            </p>

          </div>


          <hr className="my-4" />


          {/* ========================= */}
          {/* EMPLOYEE DETAILS */}
          {/* ========================= */}

          <div className="row g-4 mb-4">


            {/* NAME */}

            <div className="col-md-6">

              <small className="text-uppercase text-muted">
                Employee Name
              </small>

              <h6 className="fw-bold mt-2 mb-0">
                {employeeName}
              </h6>

            </div>


            {/* POSITION */}

            <div className="col-md-6">

              <small className="text-uppercase text-muted">
                Position
              </small>

              <h6 className="fw-bold mt-2 mb-0">
                {position}
              </h6>

            </div>


            {/* EMAIL */}

            <div className="col-md-6">

              <small className="text-uppercase text-muted">
                Email
              </small>

              <h6 className="fw-bold mt-2 mb-0">
                {email}
              </h6>

            </div>


            {/* PERIOD */}

            <div className="col-md-6">

              <small className="text-uppercase text-muted">
                Period
              </small>

              <h6 className="fw-bold mt-2 mb-0">
                {period}
              </h6>

            </div>


          </div>


          {/* ========================= */}
          {/* SALARY TABLE */}
          {/* ========================= */}

          <div className="table-responsive border rounded-3 overflow-hidden">

            <table className="table mb-0 align-middle">


              {/* HEADER */}

              <thead className="table-light">

                <tr>

                  <th className="px-4 py-3">
                    DESCRIPTION
                  </th>

                  <th className="px-4 py-3 text-end">
                    AMOUNT
                  </th>

                </tr>

              </thead>


              {/* BODY */}

              <tbody>


                {/* BASIC SALARY */}
                <tr>
                  <td className="px-4 py-3">
                    Basic Salary
                  </td>
                  <td className="px-4 py-3 text-end fw-semibold">
                    ₹{basicSalary.toLocaleString("en-IN")}
                  </td>
                </tr>

                {/* ALLOWANCES */}
                <tr>
                  <td className="px-4 py-3">
                    Allowances
                  </td>
                  <td className="px-4 py-3 text-end fw-semibold text-success">
                    +₹{allowances.toLocaleString("en-IN")}
                  </td>
                </tr>

                {/* DEDUCTIONS */}
                <tr>
                  <td className="px-4 py-3">
                    Deductions
                  </td>
                  <td className="px-4 py-3 text-end fw-semibold text-danger">
                    -₹{deductions.toLocaleString("en-IN")}
                  </td>
                </tr>
              </tbody>

              {/* NET SALARY */}
              <tfoot>
                <tr className="table-light">
                  <th className="px-4 py-4">
                    Net Salary
                  </th>
                  <th className="px-4 py-4 text-end fs-5 text-primary">
                    ₹{netSalary.toLocaleString("en-IN")}
                  </th>
                </tr>
              </tfoot>


            </table>

          </div>


          {/* ========================= */}
          {/* PAID STATUS */}
          {/* ========================= */}

          <div className="text-center mt-4">

            <span className="badge text-bg-success px-3 py-2">

              <i className="fa-solid fa-circle-check me-1"></i>

              PAID

            </span>

          </div>


          {/* ========================= */}
          {/* DOWNLOAD BUTTON */}
          {/* ========================= */}

          <div className="text-center mt-4">

            <button
              type="button"
              className="btn btn-primary px-4 py-2"
              onClick={downloadPayslip}
            >

              <i className="fa-solid fa-download me-2"></i>

              Download Payslip

            </button>

          </div>


          {/* ========================= */}
          {/* FOOTER */}
          {/* ========================= */}

          <div className="text-center mt-3">

            <small className="text-muted">

              This is a computer-generated payslip.

            </small>

          </div>


        </div>

      </div>

    </div>

  );
}


export default PrintPayslip;