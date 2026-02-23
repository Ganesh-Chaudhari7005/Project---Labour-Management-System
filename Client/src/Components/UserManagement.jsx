import { Outlet } from 'react-router-dom';
import { motion } from "framer-motion";

export default function UserManagement() {
  
  return (

    <div className="h-100 w-100 admin-comp-def global-page-anim">
      <Outlet/>
    </div>
  );
}
