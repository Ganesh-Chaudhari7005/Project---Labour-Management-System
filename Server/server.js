import express from 'express'
import mysql from 'mysql2/promise'
import { HandleLogin } from './HandleLogin.js';
import cors from 'cors'
import { HandleProfileUpdate } from './HandleProfileUpdate.js';
import FetchUsers from './FetchUsers.js';
import RemoveUser from './RemoveUser.js';
import { AddUserHandler } from './AddNewUsersHandler.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from "url";

const app = express();

app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile-pictures"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });


app.post("/login", async(req,res)=>{
    let { loginUserEmail, loginUserPassword } = req.body;
    let result = await HandleLogin(loginUserEmail, loginUserPassword);
    res.json(result)
})

app.post("/update-profile", upload.single("profileimage"), async(req,res)=>{
    let filepath = null;

    if(req.file){
      filepath = req.file.path.replace(/\\/g, "/");  
    } 
    console.log(filepath);
      
    let {
      profilename,
      profileEmail,
      profilePhone,
      profileAddr,
      currentUserEmail,
      roleInfo
    } = req.body;
    
    let profileUpdateRes = await HandleProfileUpdate(
      profilename,
      profileEmail,
      profilePhone,
      profileAddr,
      currentUserEmail,
      roleInfo,
      filepath
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