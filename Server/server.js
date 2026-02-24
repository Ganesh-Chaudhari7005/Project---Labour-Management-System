import express from 'express'
import mysql from 'mysql2/promise'
import { HandleLogin } from './HandleLogin.js';
import cors from 'cors'
import { HandleProfileUpdate } from './HandleProfileUpdate.js';
import FetchUsers from './FetchUsers.js';
import RemoveUser from './RemoveUser.js';
import { AddUserHandler } from './AddNewUsersHandler.js';
const app = express();

app.use(express.json());
app.use(cors());

 

app.post("/login", async(req,res)=>{
    let { loginUserEmail, loginUserPassword } = req.body;
    let result = await HandleLogin(loginUserEmail, loginUserPassword);
    res.json(result)
    
    // res.json(result);
})

app.post("/update-profile", async(req,res)=>{
    let {
      profilename,
      profileEmail,
      profilePhone,
      profileAddr,
      currentUserEmail,
    } = req.body;
    
    let profileUpdateRes = await HandleProfileUpdate(
      profilename,
      profileEmail,
      profilePhone,
      profileAddr,
      currentUserEmail,
    );
    res.json(profileUpdateRes);
})

app.post("/remove-user", async(req, res)=>{
    let { remuseremail } = req.body;
    
    let removeStatus = await RemoveUser(remuseremail);
    console.log(removeStatus);
    
    res.json(removeStatus);
})

app.get("/fetch-users",async(req, res)=>{
    let AllUsers = await FetchUsers();
    res.json(AllUsers);
})


app.post("/add-new-user", async (req, res)=>{
    let { addUName, addUEmail, addUNumber, addUPass, addURole } = req.body;
    console.log(addURole);
    
    let AddUserStatus = await AddUserHandler(
      addUName,
      addUEmail,
      addUNumber,
      addUPass,
      addURole,
    );

    res.json(AddUserStatus);
})
app.listen(3000, ()=>console.log("Server Running on Port : 3000"));