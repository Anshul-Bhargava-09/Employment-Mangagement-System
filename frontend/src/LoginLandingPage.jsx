import LoginLeft from "./components/LoginLeft";
import WavingHandRoundedIcon from "@mui/icons-material/WavingHandRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import ArrowRightAltRoundedIcon from "@mui/icons-material/ArrowRightAltRounded";
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { Link } from "react-router-dom";

function LoginLandingPage() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <LoginLeft />

          <div className="col-12 col-md-6  " style={{padding:"80px" ,marginTop:"80px"}}>
            <h3>
              Welcome Back{" "}
              <WavingHandRoundedIcon
                sx={{ color: " #FFC83D", fontSize: "1.5rem" }}
              />
            </h3>
            <p style={{ opacity: "0.6" }}>
              Select your portal to securely access the system
            </p>
           <Link to="/login/admin " style={{textDecoration:"none"}}>
            <div>
              <button className="portal-btn">
                <div className="d-flex align-items-center">
                  <div className="icon-box">
                    <ManageAccountsRoundedIcon
                      sx={{ color: "#5B3DF5", fontSize: 32 }}
                    />
                  </div>

                  <div className="ms-3 text-start">
                    <h5 className="mb-1 fw-bold">Admin Portal</h5>
                    <p className="mb-0 text-secondary">
                      Access admin dashboard
                    </p>
                  </div>
                </div>

                <ArrowRightAltRoundedIcon
                  sx={{ color: "#5B3DF5", fontSize: 30 }}
                />
              </button>
             </div>
           </Link>
            <br /><br />
           <Link to="/login/employee" style={{textDecoration:"none"}}>
            <div>
              <button className="portal-btn">
                <div className="d-flex align-items-center">
                  <div className="icon-box">
                    <PersonRoundedIcon
                      sx={{ color: "#3B82F6", fontSize: 32 }}
                    />
                  </div>

                  <div className="ms-3 text-start">
                    <h5 className="mb-1 fw-bold">Employee Portal</h5>
                    <p className="mb-0 text-secondary">
                      Access employee dashboard
                    </p>
                  </div>
                </div>

                <ArrowRightAltRoundedIcon
                  sx={{ color: "#3B82F6", fontSize: 30 }}
                />
              </button>
            </div>
           </Link>
            <p >&copy; Great Stack.All rights reserves</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginLandingPage;
