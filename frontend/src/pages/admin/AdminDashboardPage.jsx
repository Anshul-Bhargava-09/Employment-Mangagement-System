import { useEffect, useState } from "react";
import Card from "../../components/Card";
import Sidebar from "../../components/Sidebar";
import { dummyAdminDashboardData } from "../../assets/assets";

function AdminDashboardPage() {
     const [data,setData] = useState(null);
      const [loading,setLoading] = useState(true);
    
      useEffect(()=>{
       setData(dummyAdminDashboardData);
       console.log(data);
       setTimeout(()=>{
        setLoading(false);
       },1000)
      },[])
    
      if(loading) return <p>Loading</p>
      if(!data) return <p>Failed to load the Data</p>
      console.log(data);

       const cards =[
    {
      icon:<i class="fa-solid fa-user-group"></i>,
      value:data.totalEmployees,
      title: "Total Employees",
    },
     {
      icon:<i class="fa-solid fa-building"></i>,
      value:data.totalDepartments,
      title: "Departments",
    },
{      icon:<i class="fa-regular fa-calendar"></i>,
      value:data.todayAttendance,
      title: "Total Attendance",
    },
    {
      icon:<i class="fa-regular fa-file"></i>,
      value:data.pendingLeaves,
      title: "Pending Leaves",
    },
]
    return ( 
        <>
         <div className="main-content mt-3">
      <h3>Dashboard</h3>
      <p>Welcome back, Admin- here's your overview</p>
     </div>

      <div className="cards-container main-content ">
         {cards.map((c,indx)=>(
          <Card key={indx} title={c.title} value={c.value} icon = {c.icon}/>
         ))}
      </div>
        </>
     );
}

export default AdminDashboardPage;