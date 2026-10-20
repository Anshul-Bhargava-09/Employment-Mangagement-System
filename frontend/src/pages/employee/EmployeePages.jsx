import { Route, Routes } from "react-router-dom";
import EmployeeDashboardPage from "./EmployeeDashboardPage.jsx";
import EmployeeAttendancePage from "./EmployeeAttendancePage.jsx";
import EmployeeLeavePage from "./EmployeeLeavePage.jsx";
import EmployeePayslipsPages from "./EmployeePayslipsPage.jsx";
import EmployeeSettingsPage from "./EmployeeSettingsPage.jsx";
import Sidebar from "../../components/Sidebar.jsx";
import PrintPayslip from "../../components/PrintPayslip.jsx";

function EmployeePages() {
      return (
    <>
    <Sidebar role="employee" />

    <div className="">
        <Routes>
            <Route path="/dashboard" element={<EmployeeDashboardPage />} />
            <Route path="/attendance" element={<EmployeeAttendancePage />} />
            <Route path="/leave" element={<EmployeeLeavePage />} />
            <Route path="/payslips" element={<EmployeePayslipsPages />} />
            <Route path="/settings" element={<EmployeeSettingsPage />} />
            <Route path="/payslip/:id" element={<PrintPayslip/>}/>
        </Routes>
    </div>
</>
  );
}

export default EmployeePages;