  import React, { useContext, useEffect, useState } from 'react'
  import LoginContext from '../Context/LoginContext'

  export default function Dashboard() {
      let { loggedInUser}  = useContext(LoginContext);
      console.log("Logged user:", loggedInUser);
      const permissions = {
        Admin : ['Manage Users', 'Projects' ,'Manage Labours', 'Attendance', 'Manage Equipment', 'CMS'],
        Supervisor : ['Manage Labours', 'Attendance', 'Manage Equipment', 'CMS'],
        Labour : ['View Attendance', 'Profile']
      }

     const allowedFeatures = permissions[loggedInUser?.Role] || [];
    return (
      <div className="dash-cont-outer">
        <div className="container-fluid h-100">
          <div className="h-100">
            <div className="row h-100">
              <div className="col-lg-2 h-100">
                <div className="navfeature">
                  {allowedFeatures.map((feature, index) => {
                    return (
                      <button className="dash-nav-btn" key={index}>
                        {feature}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="col-lg-10">
                <div className="dash-login-info">
                  <p className='loginusername'>Welcome {loggedInUser.UserName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
