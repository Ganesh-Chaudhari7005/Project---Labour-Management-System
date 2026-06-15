import { useContext } from "react";
import { Navigate , useNavigate} from "react-router-dom";
import LoginContext from "../Context/LoginContext";


function ProtectedRoute({ children }) {
  const {loggedInUser} = useContext(LoginContext);
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();
  if(!token){
    return <Navigate to="/system-login" replace />;
  }

  return children;
}

export default ProtectedRoute;
