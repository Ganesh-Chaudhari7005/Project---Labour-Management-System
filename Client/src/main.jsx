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
import PhotoGallery from "./Components/PhotoGallery.jsx";
import Carousel from "./Components/Carousel.jsx";
import ServiceRequestsAdmin from "./Components/ServiceRequestsAdmin.jsx";
import Tiles404Page from "./Components/HandlePageNotFound.jsx";
import AdminTestimonials from "./Components/ManageTestimonials.jsx";
import DashboardInner from "./Components/DashboardInner.jsx";
import WageManagement from "./Components/WageManagement.jsx";
import ForgotPassword from "./Components/ForgotPassword.jsx";
import ResetPassword from "./Components/ResetPassword.jsx";
import ViewPDF from "./Components/ViewPDF.jsx";
import ClientBilling from "./Components/ClientBillingCont.jsx";
import BillPendingClient from "./Components/BillPendingClient.jsx";
import BillPaidClient from "./Components/BillPaidClient.jsx";
import BillReceiptsClient from "./Components/BillReceiptsClient.jsx";
import AllBillClient from "./Components/AllBillClient.jsx";
import ClientReportIssues from "./Components/ClientReportIssues.jsx";
import ClientFeedback from "./Components/ClientFeedback.jsx";
import ClientProjects from "./Components/ClientProjects.jsx";
import ProjectContClient from "./Components/ProjectContClient.jsx";
import ProjectStatusClient from "./Components/ProjectStatusClient.jsx";
import SupervisorManagement from "./Components/SupervisorManagement.jsx";
import ViewAllSupervisors from "./Components/ViewAllSupervisors.jsx";
import AddSupervisor from "./Components/AddSupervisor.jsx";
import AssignSupervisor from "./Components/AssignSupervisor.jsx";
import AttendanceContSup from "./Components/AttendanceConpSup.jsx";
import SaveAttendanceSupervisor from "./Components/SaveAttendanceSupervisor.jsx";
import AttendanceSup from "./Components/AttendanceSup.jsx";
import SupAllocatedProjects from "./Components/SupAllocatedProjects.jsx";
import SupProjectCont from "./Components/SupProjectCont.jsx";
import ManageProjectWork from "./Components/ManageProjectWork.jsx";
import AttendanceReportLabour from "./Components/AttendanceReportLabour.jsx";
import ReportIssues from "./Components/ReportIssues.jsx";
import SiteIssueCont from "./Components/SiteIssueCont.jsx";
import SupReportIssues from "./Components/SupReportIssues.jsx";
import AllLabSup from "./Components/AllLabSup.jsx";
import SupMangLabCont from "./Components/SupMangLabCont.jsx";
import RemoveLabSup from "./Components/RemoveLabSup.jsx";
import ErrorBoundary from "./Components/ErrorBoundary";
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<RootLayout />}>
        <Route path="*" element={<Tiles404Page />} />
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
        ></Route>
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {" "}
          <Route path="view-pdf" element={<ViewPDF />} />
          <Route index element={<DashboardInner />} />
          <Route path="dash" element={<DashboardInner />} />{" "}
          <Route path="project-management" element={<ProjectManagement />}>
            <Route index element={<Project />} />
            <Route path="create-project" element={<CreateProject />} />

            <Route path="manage-project/:id" element={<ManageProject />}>
              <Route path="project-details" element={<ProjectDetails />} />
              <Route index element={<ProjectStatus />} />
              <Route path="manage-prj-work" element={<ManageProjectWork />} />
              <Route path="generate-bill" element={<GenerateBill />} />
              <Route
                path="view-past-bills"
                element={<ViewPastProjectBills />}
              />
              <Route path="project-issues-cp" element={<SiteIssueCont />} />
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
          <Route path="cms" element={<CMS />}>
            <Route index element={<Carousel />} />
            <Route path="admin-photo-gallery" element={<PhotoGallery />} />
            <Route path="manage-testimonials" element={<AdminTestimonials />} />
            <Route
              path="service-req-admin"
              element={<ServiceRequestsAdmin />}
            />
          </Route>
          <Route path="profile" element={<Profile />} />
          <Route path="manage-wages" element={<WageManagement />} />
          <Route path="manage-labours" element={<LabourManagement />}>
            <Route index element={<ViewAllLabour />} />
            <Route path="add-labour" element={<AddLabour />} />
            <Route path="assign-labours" element={<AssignLabours />} />
          </Route>
          <Route path="manage-supervisors" element={<SupervisorManagement />}>
            <Route index element={<ViewAllSupervisors />} />
            <Route path="add-supervisor" element={<AddSupervisor />} />
            <Route path="assign-supervisor" element={<AssignSupervisor />} />
          </Route>
          <Route path="billing" element={<ClientBilling />}>
            <Route index element={<BillPendingClient />} />
            <Route path="client-paid-bills" element={<BillPaidClient />} />
            <Route path="client-all-bills" element={<AllBillClient />} />
            <Route
              path="client-bill-receipts"
              element={<BillReceiptsClient />}
            />
          </Route>
          <Route path="report-issues" element={<ClientReportIssues />} />
          <Route path="feedback" element={<ClientFeedback />} />
          <Route path="your-projects" element={<ClientProjects />} />
          <Route path="view-project-client/:id" element={<ProjectContClient />}>
            <Route index element={<ProjectStatusClient />} />
          </Route>
          <Route path="Report-Site-Issues" element={<SupReportIssues />} />
          <Route path="labour-attendance" element={<AttendanceContSup />}>
            <Route index element={<SaveAttendanceSupervisor />} />
            <Route
              path="attendance-report-sup"
              element={<AttendanceReport />}
            />
          </Route>
          <Route path="man-lab-sup-site" element={<AllLabSup />}/>
            
          <Route path="sites-allocated" element={<SupAllocatedProjects />} />
          <Route path="sup-alc-prj/:id" element={<SupProjectCont />}>
            <Route index element={<ProjectStatus />} />
            <Route path="project-details-sup" element={<ProjectDetails />} />
          </Route>
          <Route
            path="lab-attendance-report"
            element={<AttendanceReportLabour />}
          />
          <Route path="report-issue" element={<ReportIssues />} />
        </Route>
      </Route>
    </>,
  ),
);

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <RouterProvider router={router} />
  </ErrorBoundary>
);
