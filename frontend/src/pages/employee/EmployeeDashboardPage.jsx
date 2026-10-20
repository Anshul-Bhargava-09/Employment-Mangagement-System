import { useEffect, useState } from "react";
import Card from "../../components/Card";
import Sidebar from "../../components/Sidebar";
import { dummyEmployeeDashboardData } from "../../assets/assets";

function EmployeeDashboardPage() {
  const [data,setData] = useState(null);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
   setData(dummyEmployeeDashboardData);
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
      icon:<i class="fa-regular fa-calendar"></i>,
      value:data. currentMonthAttendance,
      title: "Days Present",
    },
    {
      icon:<i class="fa-regular fa-file"></i>,
      value:data. pendingLeaves,
      title: "Pending Leaves",
    },
     {
      icon:<i class="fa-solid fa-dollar-sign"></i>,
      value:data.latestPayslip.netSalary,
      title: "Latest payslips",
    },
  ]
  return (
    <>
     <div className="main-content mt-3">
      <h3>Welcome,{data.employee.firstName}!</h3>
      <p>{data.employee.position}-{data.employee.department}</p>
     </div>

      <div className="cards-container main-content ">
         {cards.map((c,indx)=>(
          <Card key={indx} title={c.title} value={c.value} icon = {c.icon}/>
         ))}
      </div>
    </>
  );
}

export default EmployeeDashboardPage;

{
  /* Main Content */
}
{
  /* <div className=" main-content">
        <h1 className="mt-4">Main Content</h1>
        <p>Your page content goes here...</p>
      </div> */
}
