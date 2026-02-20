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
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />

      <Route path = '/admin' element={<Login/>}/>
      <Route path="admin/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>

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
