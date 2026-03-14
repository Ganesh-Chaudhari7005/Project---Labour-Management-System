import React from 'react'
import { Outlet } from 'react-router-dom';
export default function ProjectManagement() {
  return (
    <div className="h-100 w-100 admin-comp-def global-page-anim">
      <Outlet />
    </div>
  );
}
