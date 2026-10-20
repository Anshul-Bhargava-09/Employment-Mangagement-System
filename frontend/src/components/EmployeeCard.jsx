import "./EmployeeCard.css";
import { Link } from "react-router-dom";

function EmployeeCard({ employee }) {
  return (
    <div className="employee-card">

      <div className="card-top">

         {/* Hover Icons */}
      <div className="card-icons">
        <Link to ="/employee_form"
          style={{ textDecoration: "none" }}>
        <button className="icon-btn edit-btn" type="button" >
          <i className="fa-solid fa-pen"></i>
        </button>
        </Link>

        <button className="icon-btn delete-btn">
          <i className="fa-solid fa-trash"></i>
        </button>
      </div>

        <div className="department">
          {employee.department}
        </div>

        <div className="avatar">
          {employee.firstName[0]}{employee.lastName[0]}
        </div>

      </div>

      <div className="card-bottom">
        <h4>{employee.firstName} {employee.lastName}</h4>
        <p>{employee.position}</p>
      </div>

    </div>
  );
}

export default EmployeeCard;

