import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "bootstrap/dist/css/bootstrap.min.css";
import {BrowserRouter, createBrowserRouter, createRoutesFromElements , Route, RouterProvider} from 'react-router-dom'
import Login from './Components/Login.jsx';
import Home from './Components/Website/Home.jsx';
import LoginContextProvider from './Context/LoginContextProviider';
import ProtectedRoute from './Components/ProtectRoute.jsx'
import Dashboard from './Components/Dashboard.jsx';
import Project from './Components/Project.jsx';
import Attendance from './Components/Attendance.jsx';
import UserManagement from './Components/UserManagement.jsx';
import EquipmentManagement from './Components/EquipmentManagement.jsx';
import CMS from './Components/CMS.jsx';
import Profile from './Components/Profile.jsx';
import LabourManagement from './Components/LabourManagement.jsx';
import ViewAllUsers from './Components/ViewAllUser.jsx';
import AddUsers from './Components/AddUsers.jsx';
import CreateProject from './Components/CreateProject.jsx';
import ProjectManagement from './Components/ProjectManagement.jsx';
import RootLayout from './Components/RootLayout.jsx';
import AddLabour from './Components/AddLabour.jsx';
import ViewAllLabour from './Components/ViewAllLabour.jsx';
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
        <Route element={<RootLayout />}>

      <Route path="/" element={<Home />} />

      <Route path="/admin" element={<Login />} />
      <Route path="admin/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route path="project-management" element={<ProjectManagement />}>
          <Route index element={<Project/>}/>
          <Route path="create-project" element={<CreateProject/>}/>
        </Route>
        <Route path="attendance" element={<Attendance />} />
        <Route path="manage-users" element={<UserManagement />}>
          <Route index element={<ViewAllUsers />} />
          <Route path="add-user" element={<AddUsers />} />
        </Route>
        <Route path="manage-equipments" element={<EquipmentManagement />} />
        <Route path="cms" element={<CMS />} />
        <Route path="profile" element={<Profile />} />
        <Route path="manage-labours" element={<LabourManagement />}>
          <Route index element={<ViewAllLabour/>}/>
          <Route path='add-labour' element={<AddLabour/>}/>
        </Route>
      </Route>
</Route>
    </>,
  ),
);

createRoot(document.getElementById("root")).render(
  <>
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
  </>,
);
