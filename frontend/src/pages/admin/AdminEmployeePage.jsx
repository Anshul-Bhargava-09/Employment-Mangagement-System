import { useCallback, useEffect, useState } from "react";
import { dummyEmployeeData, DEPARTMENTS } from "../../assets/assets";
import EmployeeCard from "../../components/EmployeeCard";
import "./AdminPages.css"
import { Link } from "react-router-dom";

function AdminEmployeePage() {


  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectdepartment, setSelectDepartment] = useState("All");

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setEmployees(dummyEmployeeData);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [selectdepartment]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((employee) => {

    const fullName =
`${employee.firstName} ${employee.lastName}`.toLowerCase();

  const matchSearch = 
   fullName.includes(search.toLowerCase());

  const matchDepartment =
    selectdepartment === "All" ||
    employee.department === selectdepartment;

  return matchSearch && matchDepartment;

});

  return (
    <>
      {/* Header section */}
      <div className="main-content justify-content-between  d-flex mt-3">
        <div>
          <h3>Employees</h3>
          <p>Manage your team members</p>
        </div>
        <div>
         <Link to ="/employee_form">
          <button
            type="button"
            className="btn btn-primary  signIn-btn "
            style={{ width: "150px" }}
          >
            + Add Employees
          </button>
         </Link>
        </div>
      </div>
      {/* Input search box */}
      <div className="main-content d-flex justify-content-between">
        <div style={{ position: "relative", width: "80%" }}>
          <i
            className="fa-solid fa-magnifying-glass"
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "gray",
            }}
          ></i>

          <input
            type="text"
            placeholder="Search item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "8px 8px 8px 35px", // left padding for icon
              width: "100%",
              marginRight: "10px",
            }}
          />
        </div>
        <div className="ms-3">
          <select
            value={selectdepartment}
            onChange={(e) => setSelectDepartment(e.target.value)}
            style={{ padding: "10px", border: "1.5px solid blue" }}
          >
            <option value="All">All Departments</option>
             {DEPARTMENTS.map((deptName)=>(
              <option key={deptName} value={deptName}>{deptName}</option>
             ))}
          </select>
        </div>
      </div>

      {/* Emplyoess data */}
       
      <div className="cards-container main-content">

        {filteredEmployees.map((employee, index) => (
          <EmployeeCard
            key={employee.id}
            employee = {employee}
          />
        ))}

      </div>
    
    </>
  );
}

export default AdminEmployeePage;
