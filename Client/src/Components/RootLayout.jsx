import React from "react";
import { Outlet } from "react-router-dom";
import LoginContextProvider from "../Context/LoginContextProviider";

const RootLayout = () => {
  return (
    <LoginContextProvider>
      <Outlet />
    </LoginContextProvider>
  );
};

export default RootLayout;
