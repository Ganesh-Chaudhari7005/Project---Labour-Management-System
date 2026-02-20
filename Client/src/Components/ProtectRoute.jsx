import { useContext } from "react";
import { Navigate } from "react-router-dom";
import LoginContext from "../Context/LoginContext";


function ProtectedRoute({ children }) {
  const {loggedInUser} = useContext(LoginContext);

  if (!loggedInUser) {
    return <Navigate to="/admin" />;
  }

  return children;
}

export default ProtectedRoute;
