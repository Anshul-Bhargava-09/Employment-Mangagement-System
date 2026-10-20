import { useEffect, useState } from "react";
import Card from "../../components/Card";
import API_BASE_URL from "../../config/api";
import { dummyEmployeeDashboardData } from "../../assets/assets.jsx";

function EmployeeDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("ems_token");
        const res = await fetch(`${API_BASE_URL}/api/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const result = await res.json();
          setData(result);
        } else {
          setData(dummyEmployeeDashboardData);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        setData(dummyEmployeeDashboardData);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>Failed to load the Data</p>;

  const cards = [
    {
      icon: <i className="fa-regular fa-calendar"></i>,
      value: data.currentMonthAttendance ?? 0,
      title: "Days Present",
    },
    {
      icon: <i className="fa-regular fa-file"></i>,
      value: data.pendingLeaves ?? 0,
      title: "Pending Leaves",
    },
    {
      icon: <i className="fa-solid fa-indian-rupee-sign"></i>,
      value: data.latestPayslip ? `₹${data.latestPayslip.netSalary?.toLocaleString("en-IN")}` : "N/A",
      title: "Latest Payslip",
    },
  ];

  return (
    <>
      <div className="main-content mt-3">
        <h3>Welcome, {data.employee?.firstName || "Employee"}!</h3>
        <p>
          {data.employee?.position || ""}{data.employee?.department ? ` — ${data.employee.department}` : ""}
        </p>
      </div>

      <div className="cards-container main-content">
        {cards.map((c, indx) => (
          <Card key={indx} title={c.title} value={c.value} icon={c.icon} />
        ))}
      </div>
    </>
  );
}

export default EmployeeDashboardPage;
