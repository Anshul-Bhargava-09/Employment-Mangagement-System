import { useEffect, useState } from "react";
import Card from "../../components/Card";
import { dummyAdminDashboardData } from "../../assets/assets.jsx";
import API_BASE_URL from "../../config/api";

function AdminDashboardPage() {
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
          setData(dummyAdminDashboardData);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        setData(dummyAdminDashboardData);
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
      icon: <i className="fa-solid fa-user-group"></i>,
      value: data.totalEmployees,
      title: "Total Employees",
    },
    {
      icon: <i className="fa-solid fa-building"></i>,
      value: data.totalDepartments,
      title: "Departments",
    },
    {
      icon: <i className="fa-regular fa-calendar"></i>,
      value: data.todayAttendance,
      title: "Today's Attendance",
    },
    {
      icon: <i className="fa-regular fa-file"></i>,
      value: data.pendingLeaves,
      title: "Pending Leaves",
    },
  ];

  return (
    <>
      <div className="main-content mt-3">
        <h3>Dashboard</h3>
        <p>Welcome back, Admin — here&apos;s your overview</p>
      </div>

      <div className="cards-container main-content">
        {cards.map((c, indx) => (
          <Card key={indx} title={c.title} value={c.value} icon={c.icon} />
        ))}
      </div>
    </>
  );
}

export default AdminDashboardPage;