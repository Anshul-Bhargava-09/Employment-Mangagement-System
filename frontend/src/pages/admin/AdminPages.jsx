import { Route, Routes } from "react-router-dom";
import AdminDashboardPage from "./AdminDashboardPage.jsx";
import AdminEmployeePage from "./AdminEmployeePage.jsx";
import AdminLeavePage from "./AdminLeavePage.jsx";
import AdminPayslipsPage from "./AdminPayslipsPage.jsx";
import AdminSettingsPage from "./AdminSettingsPage.jsx";
import AdminAttendancePage from "./AdminAttendancePage.jsx";
import Sidebar from "../../components/Sidebar.jsx";
import EmployeeForm from "./EmployeeForm.jsx";

function AdminPages() {
    return (  
       <>
    <Sidebar role="admin" />

    <div className="">
        <Routes>
            <Route path="/dashboard" element={<AdminDashboardPage />} />
            <Route path="/employees" element={<AdminEmployeePage />} />
            <Route path="/employees/new" element={<EmployeeForm />} />
            <Route path="/employees/edit/:id" element={<EmployeeForm />} />
            <Route path="/attendance" element={<AdminAttendancePage />} />
            <Route path="/leave" element={<AdminLeavePage />} />
            <Route path="/payslips" element={<AdminPayslipsPage />} />
            <Route path="/settings" element={<AdminSettingsPage />} />
        </Routes>
    </div>
</>
    );
}

export default AdminPages;