import { useContext } from "react";
import LoginContext from "../Context/LoginContext";
import AdminDashboard from "./AdminDashboard.jsx";
import ClientDashboard from "./ClientDashboard.jsx";
import LabourDashboard from "./LabourDashboard.jsx";
import SupervisorDashboard from "./SupervisorDashboard.jsx";
export default function DashboardInner() {
  const { loggedInUser } = useContext(LoginContext);

  const role = loggedInUser?.UserRole;

  if (role === "Admin") {
    return <AdminDashboard />;
  }

  if (role === "supervisor") {
    return <SupervisorDashboard />;
  }

  if (role === "Client") {
    return <ClientDashboard />;
  }

  if (role === "labour") {
    return <LabourDashboard />;
  }

  return <div>Unauthorized</div>;
}
