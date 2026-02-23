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
import AddUser from './Components/ViewAllUser.jsx';
import ViewAllUsers from './Components/ViewAllUser.jsx';
import AddUsers from './Components/AddUsers.jsx';
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />

      <Route path="/admin" element={<Login />} />
      {/* <Route path="admin/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/> */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route path="project" element={<Project />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="manage-users" element={<UserManagement />}>
          <Route index element={<ViewAllUsers />} />
          <Route path="add-user" element={<AddUsers />} />
        </Route>
        <Route path="manage-equipments" element={<EquipmentManagement />} />
        <Route path="cms" element={<CMS />} />
        <Route path="profile" element={<Profile />} />
        <Route path="manage-labours" element={<LabourManagement />} />
      </Route>
    </>,
  ),
);

createRoot(document.getElementById("root")).render(
  <>
    <StrictMode>
      <LoginContextProvider>
        <RouterProvider router={router} />
      </LoginContextProvider>
    </StrictMode>
  </>,
);
