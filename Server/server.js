import express from 'express'
import mysql from 'mysql2/promise'
import { HandleLogin } from './HandleLogin.js';
import cors from 'cors'
const app = express();

app.use(express.json());
app.use(cors());

 

app.post("/login", async(req,res)=>{
    let {username, userPassword} = req.body;
    let result = await HandleLogin(username, userPassword)
    res.json(result)
    
    // res.json(result);
})

app.listen(3000, ()=>console.log("Server Running on Port : 3000"));