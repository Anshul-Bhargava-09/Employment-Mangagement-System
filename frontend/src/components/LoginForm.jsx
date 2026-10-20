import LoginLeft from "./LoginLeft";
import { Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useState } from "react";

function LoginForm({ role, title, subtitle }) {
    let[formData , setFormData] = useState({
        email:"",
        password:"",
    });

   let handleInputChange =(event)=>{
    let fieldName = event.target.name;
    let newValue = event.target.value;

    setFormData((curData)=>{
        return{...curData ,[fieldName]:newValue};
    })
   };

   let handleSubmit = (event)=>{
    event.preventDefault();
    console.log(formData);

    setFormData({
         email:"",
        password:"",
    });
   }

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <LoginLeft />

          <div className="col-6">
            <div className="loginForm">
              <Link
                to="/"
                style={{ textDecoration: "none", fontWeight: "bolder" }}
              >
                <KeyboardBackspaceIcon /> Back to portals
              </Link>
              <h3 className="mt-4">{title}</h3>
              <p>{subtitle}</p>
              <div>
                <form onSubmit={handleSubmit}>
                  <div className="mt-5 mr-5">
                    <h6 className="text-muted">Email address</h6>
                    <TextField
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      name="email"
                      label="Email"
                      variant="outlined"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "0.7rem",
                        },
                      }}
                    />
                  </div>
                  <div className="mt-4">
                    <h6 className="text-muted">Password</h6>
                    <TextField
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      name="password"
                      label="Password"
                      variant="outlined"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "0.7rem",
                        },
                      }}
                    />
                  </div>
                  <div className="mt-3">
                    <button type="submit" className="btn btn-primary btn-lg signIn-btn">
                      Sign in
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginForm;
