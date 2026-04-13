import express from "express";
import { HandleLogin } from "./HandleLogin.js";
import cors from "cors";
import { HandleProfileUpdate } from "./HandleProfileUpdate.js";
import FetchUsers from "./FetchUsers.js";
import RemoveUser from "./RemoveUser.js";
import { AddUserHandler } from "./AddNewUsersHandler.js";
import multer from "multer";
import path, { dirname } from "path";
import AddLabourHandlerFunction from "./AddLabourHandler.js";
import FetchLabours from "./FetchLabours.js";
import { fileURLToPath } from "url";
import { GetProfilePictureHandler } from "./GetProfilePictureHandler.js";
import { authenticateToken } from "./middleware/authenticate.js";
import RemoveLabour from "./RemoveLabour.js";
import { HandleCreateProject } from "./createProjectService.js";
import FetchProjects from "./FetchProjects.js";
import GetProjectDetails from "./GetProjectDetails.js";
import FetchEquipments from "./FetchAllEquipments.js";
import { AddEquipment } from "./HandleEquipmentManagement.js";
import FetchInStockEquipments from "./FetchInStockEquipments.js";
import LabourEquipAssignDetails from "./LabourEquipAssignDetails.js";
import { AssignEquipments } from "./AssignEquipment.js";
import { UnAssignEquipments } from "./UnAssignEquipment.js";
import RemoveEquipment from "./RemoveEquipment.js";
import { insertAttendance } from "./HandleInsertAttendance.js";
import { getReportData } from "./ReportHandler.js";
import { log } from "console";
import GetProjectStatus from "./GetProjectStatus.js";
import { SaveBill } from "./SaveBillHandler.js";
import GetPendingBillInfo from "./FetchBillDetails.js";
import GetClietInfo_BillNo from "./GetClientInfo-BillNo.js";
import GetPastBills from "./GetPastBillsHandler.js";
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//uncomment during deployment
// app.use(express.static(path.join(__dirname, 'dist')));
// app.use((req, res, next) => {
//   if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
//     return next(); // let API routes handle it
//   }
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile-pictures");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const billStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/bills"); // 📁 new folder
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-Invoice.pdf";
    cb(null, uniqueName);
  },
});

const uploadBill = multer({ storage: billStorage });

app.post("/create-bill", uploadBill.single("pdf"), async (req, res) => {
  try {
    const file = req.file;

    const data = JSON.parse(req.body.data);

    const filePath = file.path.replace(/\\/g, "/"); 
    let saveStatus = await SaveBill(data, filePath);
 

    res.json({
      success: true,
      message: "Bill saved successfully",
      filePath,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,  
      message: "Error saving bill",
    });
  }
});
app.post("/login", async (req, res) => {
  let { loginUserEmail, loginUserPassword } = req.body;
  let result = await HandleLogin(loginUserEmail, loginUserPassword);
  res.json(result);
});

app.get("/me", authenticateToken, async (req, res) => {
  const user = req.user.userId;
  res.json({ user });
});

app.post("/download-File", async (req, res) => {
  const fp = req.body.filepath;
  const fn = path.basename(fp);
  console.log(fp);
  console.log(fn);

  res.download(fp, (err)=>{
    console.log(err);
    
  })
  
}); 
app.post(
  "/add-Labour",
  authenticateToken,
  upload.single("LabPhoto"),
  async (req, res) => {
    let filepath = null;
    if (req.file) {
      filepath = req.file.path.replace(/\\/g, "/");
    }
    let {
      LabName,
      LabEmail,
      LabContact,
      LabAddr,
      LabWage,
      LabGen,
      Labdob,
      LabAccess,
      LabType,
    } = req.body;

    console.log(
      LabName,
      LabEmail,
      LabContact,
      LabAddr,
      LabWage,
      LabGen,
      Labdob,
      filepath,
      LabAccess,
    );

    let addLabRes = await AddLabourHandlerFunction(
      LabName,
      LabEmail,
      LabContact,
      LabAddr,
      LabWage,
      LabGen,
      Labdob,
      LabAccess,
      filepath,
      LabType,
    );

    res.json(addLabRes);
  },
);
app.post(
  "/update-profile",
  authenticateToken,
  upload.single("profileimage"),
  async (req, res) => {
    let filepath = null;

    if (req.file) {
      filepath = req.file.path.replace(/\\/g, "/");
    }
    console.log(filepath);

    let {
      profilename,
      profileEmail,
      profilePhone,
      profileAddr,
      currentUserEmail,
      roleInfo,
    } = req.body;

    let profileUpdateRes = await HandleProfileUpdate(
      profilename,
      profileEmail,
      profilePhone,
      profileAddr,
      currentUserEmail,
      roleInfo,
      filepath,
    );
    res.json(profileUpdateRes);
  },
);

app.post("/remove-user", authenticateToken ,async (req, res) => {
  let { remuseremail, role } = req.body;

  let removeStatus = await RemoveUser(remuseremail, role);
  console.log(removeStatus);

  res.json(removeStatus);
});

app.get("/fetch-users", async (req, res) => {
  let AllUsers = await FetchUsers();
  res.json(AllUsers);
});

app.post("/getProject-details",authenticateToken, async(req, res)=>{
  
  let projectid = req.body.id;

console.log("id is",projectid);

  let sendres= await GetProjectDetails(projectid);
  res.json(sendres); 
});

app.post("/create-project", async (req, res) => {

    const { finalData } = req.body;
    
    let functionRes = await HandleCreateProject(finalData);
    res.json(functionRes);
});

app.post("/remove-labour", async(req, res)=>{ 
  let {email} = req.body;
  let removeStatus = await RemoveLabour(email);
  res.json(removeStatus); 
  
})

app.post("/add-equipments" , authenticateToken , async(req, res)=>{
    let { finalEquipment, selectedQuantity} = req.body;

    let sendres = await AddEquipment(
      finalEquipment,
      selectedQuantity,
    );
    res.json(sendres);
}); 

app.get("/get-all-equipments-list", async(req, res)=>{
  let AllEquipments = await FetchEquipments();
  res.json(AllEquipments);
});

app.get("/fetch-labours", async(req, res)=>{
  let AllLabours = await FetchLabours();
  res.json(AllLabours);
});


app.get("/fetch-projects", async (req, res) => {
  let AllProjects = await FetchProjects();
  res.json(AllProjects);
});

app.post("/add-new-user", async (req, res) => {
  let { addUName, addUEmail, addUPass, addURole } = req.body;
  console.log(addURole);

  let AddUserStatus = await AddUserHandler(
    addUName,
    addUEmail,
    addUPass,
    addURole,
  );

  res.json(AddUserStatus);
});

app.post("/getProfilePicture", async (req, res) => {
  let { email, role } = req.body;
  let responce_result = await GetProfilePictureHandler(email, role);
  res.json(responce_result);
});

app.get("/get-Lab-Equip-Info", async(req, res)=>{
  const allLabourList = await FetchLabours();
  const allEquipments =await FetchInStockEquipments();

  res.json({allLabourList, allEquipments});
});

app.get("/get-inStock-equipList", async (req, res) => {
  const allEquipments = await FetchInStockEquipments();

  res.json({allEquipments});
});

app.post("/Selected-Lab-Equip-Det", async(req, res)=>{
  let { selectedLabour } = req.body;

  let LabourEquipDet = await LabourEquipAssignDetails(selectedLabour);

  res.json(LabourEquipDet);
});


app.post("/assign-equip", async(req,res)=>{
  let { selectedLabour, selectedEquip, quantity } = req.body;

  let AssignRes =  await AssignEquipments(selectedLabour,selectedEquip, quantity);

  res.json(AssignRes);

});

app.post("/un-assign-equip", async (req, res) => {
  let { selectedLabour, selectedEquip, quantity } = req.body;

  let UnAssignRes = await UnAssignEquipments(
    selectedLabour,
    selectedEquip,
    quantity,
  );

  res.json(UnAssignRes);
});


app.post("/remove-equipments", authenticateToken, async(req, res)=>{
  let { selectedEquip, selectedQuantity } = req.body;
  let removeRes = await RemoveEquipment(selectedEquip, selectedQuantity);

  res.json(removeRes);
});


app.post("/add-attendance", async (req, res) => {
  try {
    const data = req.body;

    // optional validation
    if (!data.labour || !data.status || !data.date) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const result = await insertAttendance(data);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

app.post("/get-report", async (req, res) => {
  try {
    const data = req.body;

    const result = await getReportData(data);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
     
app.post("/get-project-status" ,async(req, res)=>{
  const {id} =  req.body;
  if(!id){
    return res.json({success : false, message : "Id not available"})
  }else{
    let resStatus = await GetProjectStatus(id);
    
    res.json(resStatus);
  }
  
})

app.post("/getPastBill-details", async(req, res)=>{
  let {works} = req.body;
  let { projectID } = req.body;
  let pastInfo = await GetPendingBillInfo(works, projectID);

  res.json(pastInfo);
  
});

app.post("/get-ClientInfo-BillNo", async(req,res)=>{
  let {projectid} = req.body;

  let resdet = await GetClietInfo_BillNo(projectid);

  res.json(resdet);

});

app.post("/get-past-bills", async(req, res)=>{
  let { id } = req.body;

    let AllBill = await GetPastBills(id);

    res.json(AllBill);
});
app.listen(3000, () => console.log("Server Running on Port : 3000"));
