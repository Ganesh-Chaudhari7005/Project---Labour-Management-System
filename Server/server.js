import express from 'express'
import mysql from 'mysql2/promise'
import { HandleLogin } from './HandleLogin.js';
import cors from 'cors'
import { HandleProfileUpdate } from './HandleProfileUpdate.js';
import FetchUsers from './FetchUsers.js';
import RemoveUser from './RemoveUser.js';
const app = express();

app.use(express.json());
app.use(cors());

 

app.post("/login", async(req,res)=>{
    let {username, userPassword} = req.body;
    let result = await HandleLogin(username, userPassword)
    res.json(result)
    
    // res.json(result);
})

app.post("/update-profile", async(req,res)=>{
    let {
      profilename,
      profileEmail,
      profilePhone,
      profileAddr,
      currentUser,
    } = req.body;
    
    let profileUpdateRes = await HandleProfileUpdate(
      profilename,
      profileEmail,
      profilePhone,
      profileAddr,
      currentUser,
    );
    res.json(profileUpdateRes);
})

app.post("/remove-user", async(req, res)=>{
    let {remusername} = req.body;
    console.log(remusername);
    
    let removeStatus = await RemoveUser(remusername);
    console.log(removeStatus);
    
    res.json(removeStatus);
})

app.get("/fetch-users",async(req, res)=>{
    let AllUsers = await FetchUsers();
    res.json(AllUsers);
})

app.listen(3000, ()=>console.log("Server Running on Port : 3000"));