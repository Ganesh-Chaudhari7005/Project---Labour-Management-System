import React, { useEffect, useState } from "react";
import { useApi  } from "../Components/ApiCaller";
import LoginContext from "./LoginContext";
import { ApiRoute } from "../Components/ApiConfig";
import { Outlet } from "react-router-dom";
const LoginContextProvider = ({children}) =>{
    const callApi = useApi();
    const [loggedInUser, setLoggedInUser] = useState(null);


    useEffect(()=>{
          const token = sessionStorage.getItem("token");

          const user = sessionStorage.getItem("user");

        if(user){
          setLoggedInUser(JSON.parse(user));
        }
    },[])
    // console.log("userloggedin:",loggedInUser);
    
    return (
      <LoginContext.Provider value={{ loggedInUser, setLoggedInUser }}>
          {children}
      </LoginContext.Provider>
    );
}   

export default LoginContextProvider;