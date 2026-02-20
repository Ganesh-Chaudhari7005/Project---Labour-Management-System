import React, { useState } from "react";

import LoginContext from "./LoginContext";

const LoginContextProvider = ({children}) =>{
    const [loggedInUser, setLoggedInUser] = useState(null);
    return (
      <LoginContext.Provider value={{ loggedInUser, setLoggedInUser }}>
        {children}
      </LoginContext.Provider>
    );
}   

export default LoginContextProvider;