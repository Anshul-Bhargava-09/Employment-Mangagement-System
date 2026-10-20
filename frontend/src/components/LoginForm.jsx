import LoginLeft from "./LoginLeft";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../config/api";

function LoginForm({ role, title, subtitle }) {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleInputChange = (event) => {
        const fieldName = event.target.name;
        const newValue = event.target.value;

        setFormData((curData) => ({
            ...curData,
            [fieldName]: newValue,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    role_type: role,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login failed");
                setLoading(false);
                return;
            }

            login(data.user, data.token);

            if (data.user.role === "ADMIN") {
                navigate("/admin/dashboard");
            } else {
                navigate("/employee/dashboard");
            }
        } catch (err) {
            console.error("Login request error:", err);
            setError("Server error. Please ensure backend is running.");
        } finally {
            setLoading(false);
        }
    };

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
                  {error && (
                    <div className="alert alert-danger mt-3 py-2" role="alert">
                      {error}
                    </div>
                  )}
                  <div className="mt-3">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg signIn-btn"
                      disabled={loading}
                    >
                      {loading ? "Signing in..." : "Sign in"}
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
