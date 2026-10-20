import { useState, useEffect } from "react";

function GeneratePayslips({
  show,
  onClose,
  onGenerate,
  employees,
}) {
  const today = new Date();

  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const [formData, setFormData] = useState({
    employeeId: "",
    month: currentMonth,
    year: currentYear,
    basicSalary: "",
    allowances: "",
    deductions: "",
  });

  const [netSalary, setNetSalary] = useState(0);

  useEffect(() => {
    const basic = Number(formData.basicSalary) || 0;
    const allowance = Number(formData.allowances) || 0;
    const deduction = Number(formData.deductions) || 0;

    setNetSalary(basic + allowance - deduction);
  }, [
    formData.basicSalary,
    formData.allowances,
    formData.deductions,
  ]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const employee = employees.find(
      (emp) => emp._id === formData.employeeId
    );

    const newPayslip = {
      id: Date.now(),
      employee,
      month: Number(formData.month),
      year: Number(formData.year),
      basicSalary: Number(formData.basicSalary),
      allowances: Number(formData.allowances),
      deductions: Number(formData.deductions),
      netSalary,
    };

    onGenerate(newPayslip);

    onClose();
  };

  if (!show) return null;

  return (
    <>
      <div
        className="modal fade show"
        style={{
          display: "block",
          background: "rgba(0,0,0,.25)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header bg-primary text-white">
              <h5>Generate Payslip</h5>

              <button
                className="btn-close btn-close-white"
                onClick={onClose}
              ></button>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="modal-body">

                <div className="mb-3">

                  <label>Employee</label>

                  <select
                    className="form-select"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Employee
                    </option>

                    {employees.map((emp) => (
                      <option
                        key={emp._id}
                        value={emp._id}
                      >
                        {emp.firstName} {emp.lastName}  ({emp.position})
                      </option>
                    ))}

                  </select>

                </div>

                <div className="row">

                  <div className="col-md-6 mb-3">

                    <label>Month</label>

                    <select
                      className="form-select"
                      name="month"
                      value={formData.month}
                      onChange={handleChange}
                    >
                      {[
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ].map((m, i) => (
                        <option key={i} value={i + 1}>
                          {m}
                        </option>
                      ))}
                    </select>

                  </div>

                  <div className="col-md-6 mb-3">

                    <label>Year</label>

                    <input
                      className="form-control"
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                    />

                  </div>

                </div>

                <div className="mb-3">

                  <label>Basic Salary</label>

                  <input
                    type="number"
                    className="form-control"
                    name="basicSalary"
                    value={formData.basicSalary}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="mb-3">

                  <label>Allowances</label>

                  <input
                    type="number"
                    className="form-control"
                    name="allowances"
                    value={formData.allowances}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="mb-3">

                  <label>Deductions</label>

                  <input
                    type="number"
                    className="form-control"
                    name="deductions"
                    value={formData.deductions}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="alert alert-success">
                  <strong>
                    Net Salary :
                  </strong>{" "}
                  ₹{netSalary.toLocaleString()}
                </div>

              </div>

              <div className="modal-footer">

                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={onClose}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary"
                  type="submit"
                >
                  Generate Payslip
                </button>

              </div>

            </form>

          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  );
}

export default GeneratePayslips;