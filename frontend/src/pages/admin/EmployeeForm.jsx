function EmployeeForm() {
    return (  
        <>
         <div className=" container main-content mt-4">
      <h2>Add New Employee</h2>
      <p>Create a user account and a employee profile</p>

      <form>
        <div className="mb-3">
          <label>First Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter First Name"
          />
        </div>

        <div className="mb-3">
          <label>Last Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Last Name"
          />
        </div>

        <button className="btn btn-primary">
          Save Employee
        </button>
      </form>
    </div>
        </>
    );
}

export default EmployeeForm;