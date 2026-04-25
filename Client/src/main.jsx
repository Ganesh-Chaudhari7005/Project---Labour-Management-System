import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Login from "./Components/Login.jsx";
import Home from "./Components/Website/Home.jsx";
import LoginContextProvider from "./Context/LoginContextProviider";
import ProtectedRoute from "./Components/ProtectRoute.jsx";
import Dashboard from "./Components/Dashboard.jsx";
import Project from "./Components/Project.jsx";
import Attendance from "./Components/Attendance.jsx";
import UserManagement from "./Components/UserManagement.jsx";
import EquipmentManagement from "./Components/EquipmentManagement.jsx";
import CMS from "./Components/CMS.jsx";
import Profile from "./Components/Profile.jsx";
import LabourManagement from "./Components/LabourManagement.jsx";
import ViewAllUsers from "./Components/ViewAllUser.jsx";
import AddUsers from "./Components/AddUsers.jsx";
import CreateProject from "./Components/CreateProject.jsx";
import ProjectManagement from "./Components/ProjectManagement.jsx";
import RootLayout from "./Components/RootLayout.jsx";
import AddLabour from "./Components/AddLabour.jsx";
import ViewAllLabour from "./Components/ViewAllLabour.jsx";
import ManageProject from "./Components/ManageProject.jsx";
import AssignLabours from "./Components/AssignLabours.jsx";
import ProjectDetails from "./Components/ProjectDetails.jsx";
import EquipmentsDash from "./Components/EquipmentsDash.jsx";
import AddEquipment from "./Components/AddEquipment";
import AssignEquipment from "./Components/AssignEquipment.jsx";
import RemoveEquipment from "./Components/RemoveEquipment.jsx";
import RecordAttendance from "./Components/RecordAttendance.jsx";
import AttendanceReport from "./Components/Attendancereport.jsx";
import ProjectStatus from "./Components/ProjectStatus.jsx";
import GenerateBill from "./Components/GenerateBill.jsx";
import RazorpayTest from "./Components/RazorpayTest.jsx";
import ViewPastProjectBills from "./Components/ViewPastProjectBills.jsx";
import AboutUs from "./Components/Website/AboutUs.jsx";
import Services from "./Components/Website/Services.jsx";
import PreviousWork from "./Components/Website/PreviousWork.jsx";
import ContactUs from "./Components/Website/ContactUs.jsx";
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<RootLayout />}>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="services" element={<Services />} />
          <Route path="photo-gallery" element={<PreviousWork />} />
          <Route path="contact-us" element={<ContactUs />} />
        </Route>

        <Route path="/admin" element={<Login />} />
        <Route
          path="admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="project-management" element={<ProjectManagement />}>
            <Route index element={<Project />} />
            <Route path="create-project" element={<CreateProject />} />

            <Route path="manage-project/:id" element={<ManageProject />}>
              <Route index element={<ProjectDetails />} />
              <Route path="assign-labours" element={<AssignLabours />} />
              <Route path="project-status" element={<ProjectStatus />} />
              <Route path="generate-bill" element={<GenerateBill />} />
              <Route
                path="view-past-bills"
                element={<ViewPastProjectBills />}
              />
            </Route>
          </Route>
          <Route path="test-payment" element={<RazorpayTest />} />

          <Route path="Attendance" element={<Attendance />}>
            <Route index element={<RecordAttendance />} />
            <Route path="attendance-report" element={<AttendanceReport />} />
          </Route>
          <Route path="manage-users" element={<UserManagement />}>
            <Route index element={<ViewAllUsers />} />
            <Route path="add-user" element={<AddUsers />} />
          </Route>
          <Route path="manage-equipments" element={<EquipmentManagement />}>
            <Route index element={<EquipmentsDash />} />
            <Route path="add-equipment" element={<AddEquipment />} />
            <Route path="remove-equipment" element={<RemoveEquipment />} />
            <Route path="assign-equipments" element={<AssignEquipment />} />
          </Route>
          <Route path="cms" element={<CMS />} />
          <Route path="profile" element={<Profile />} />
          <Route path="manage-labours" element={<LabourManagement />}>
            <Route index element={<ViewAllLabour />} />
            <Route path="add-labour" element={<AddLabour />} />
          </Route>
        </Route>
      </Route>
    </>,
  ),
);

createRoot(document.getElementById("root")).render(
  <>
    <RouterProvider router={router} />
  </>,
);
