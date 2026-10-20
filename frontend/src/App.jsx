import { Route, Routes } from "react-router-dom";

import EmployeePages from "./pages/employee/EmployeePages";
import AdminPages from "./pages/admin/AdminPages";

import LoginLandingPage from "./LoginLandingPage";
import LoginForm from "./components/LoginForm";

import Sidebar from "./components/Sidebar";
import EmployeeForm from "./pages/admin/EmployeeForm";

import PrintPayslip from "./components/PrintPayslip";


function App() {

  return (
    <Routes>

      {/* ========================= */}
      {/* LOGIN */}
      {/* ========================= */}

      <Route
        path="/"
        element={<LoginLandingPage />}
      />

      <Route
        path="/login/admin"
        element={
          <LoginForm
            role="admin"
            title="Admin Portal"
            subtitle="Signing to manage the organization"
          />
        }
      />

      <Route
        path="/login/employee"
        element={
          <LoginForm
            role="employee"
            title="Employee Portal"
            subtitle="Signing to access your account"
          />
        }
      />


      {/* ========================= */}
      {/* SIDEBAR */}
      {/* ========================= */}

      <Route
        path="/side"
        element={<Sidebar />}
      />


      {/* ========================= */}
      {/* EMPLOYEE */}
      {/* ========================= */}

      <Route
        path="/employee/*"
        element={<EmployeePages />}
      />


      {/* ========================= */}
      {/* ADMIN */}
      {/* ========================= */}

      <Route
        path="/admin/*"
        element={<AdminPages />}
      />


      {/* ========================= */}
      {/* EMPLOYEE FORM */}
      {/* ========================= */}

      <Route
        path="/employee_form"
        element={<EmployeeForm />}
      />


      {/* ========================= */}
      {/* PRINT PAYSLIP */}
      {/* ========================= */}
      {/* 
          IMPORTANT:
          This route is OUTSIDE EmployeePages.
          Therefore Sidebar will NOT appear here.
      */}

      <Route
        path="/payslip/:id"
        element={<PrintPayslip />}
      />

    </Routes>
  );
}

export default App;