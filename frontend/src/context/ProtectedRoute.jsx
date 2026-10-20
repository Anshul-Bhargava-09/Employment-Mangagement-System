import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Loader from "../components/Loader";

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === "ADMIN" ? "/admin/dashboard" : "/employee/dashboard"} replace />;
  }

  return children;
};
