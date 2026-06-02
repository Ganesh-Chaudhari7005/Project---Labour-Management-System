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
import FetchProjectsClient from "./FetchProjectsClient.js";
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
import { handlePhotoUpload } from "./HandlePhotoGalleryFileUpload.js";
import { handleCarouselPhotoUpload } from "./HandleHomeCarouselPhotoUpload.js";
import { db_details } from "./dbconfig.js";
import FetchSupAllocatedPrjDet from "./FetchSupAllocatedPrjDet.js";
import mysql from "mysql2/promise";
import { GetLabourWages, UpdateLabourWages } from "./WagesHandler.js";
import RemoveGalleryImage from "./HandleGallerPhotoDelete.js";
import RemoveCarouselImage from "./DeleteCarouselImageHandler.js";
import { insertServiceRequest } from "./serviceRequestController.js";
import { getServiceRequests } from "./FetchServiceRequests.js";
import insertFeedback from "./insertFeedback.js";
import { deleteServiceRequest } from "./serviceRequestController.js";
import GetProjectNames from "./getProjectNameList.js";
import insertIssue from "./insertIssue.js";
import FetchSupervisors from "./FetchSupervisor.js";
import RemoveSupervisor from "./RemoveSupervisor.js";
import {
  getSupervisors,
  assignSupervisor,
  getSupervisorAssignments,
  removeSupervisorAssignment,
} from "./SupervisorAssignmentHandler.js";
import {
  getTestimonials,
  addTestimonial,
  deleteTestimonial,
} from "./testimonialController.js";
import {
  getLabours,
  getProjects,
  assignLabour,
  getAssignments,
  removeAssignment,
} from "./LabourAssignmentController.js";
import generateInvoice from "./utils/generateinvoice.js";
import { ForgotPasswordHandler } from "./ForgotPasswordhandler.js";
import { ResetPasswordHandler } from "./ResetPasswordhandler.js";
import fs from "fs";
import GetCllientPendingBills from "./GetPendingBillClientHandler.js";
import GetCllientPaidBills from "./GetCllientPaidBills.js";
import { razorpay } from "./RazorPay/razorpay.js";
import crypto from "crypto";
import { RAZORPAY_SECRET } from "./RazorPay/razorpay.js";
import generateReceipt from "./generatereceipt.js";
import AddSupervisorHandler from "./AddSupervisorHandler.js";
import { url } from "inspector";
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

app.post("/create-bill", async (req, res) => {
  try {
    const data = req.body;

    console.log("Bill Data:", data);

    //  Generate PDF
    const pdfBuffer = await generateInvoice({
      ...data,
      date: new Date().toLocaleDateString(),
    });

    //  Create file name
    const fileName = `invoice-${Date.now()}.pdf`;

    //  Save path
    const filePath = `uploads/bills/${fileName}`;

    //  Save PDF to folder
    fs.writeFileSync(filePath, pdfBuffer);

    await SaveBill(data, filePath);

    res.json({
      success: true,
      message: "Bill Created Successfully",
      filePath,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Bill creation failed",
    });
  }
});

app.post("/getPaidBills", async (req, res) => {
  let { ClientID } = req.body;

  let Bills = await GetCllientPaidBills(ClientID);
  res.json(Bills);
});

app.post("/getPendingBill", async (req, res) => {
  console.log("Called");

  let { ClientID } = req.body;

  let Bills = await GetCllientPendingBills(ClientID);
  res.json(Bills);
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

  res.download(fp, (err) => {
    console.log(err);
  });
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
  "/add-Supervisor",
  authenticateToken,
  upload.single("SupervisorPhoto"),
  async (req, res) => {
    let filepath = null;

    if (req.file) {
      filepath = req.file.path.replace(/\\/g, "/");
    }

    let {
      SupervisorName,
      SupervisorEmail,
      SupervisorContact,
      SupervisorAddress,
      SupervisorSalary,
      SupervisorAccess,
    } = req.body;

    let addSupervisorRes = await AddSupervisorHandler(
      SupervisorName,
      SupervisorEmail,
      SupervisorContact,
      SupervisorAddress,
      SupervisorSalary,
      SupervisorAccess,
      filepath,
    );

    res.json(addSupervisorRes);
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

app.post("/remove-user", authenticateToken, async (req, res) => {
  let { remuseremail, role } = req.body;

  let removeStatus = await RemoveUser(remuseremail, role);
  console.log(removeStatus);

  res.json(removeStatus);
});

app.get("/fetch-users", async (req, res) => {
  let AllUsers = await FetchUsers();
  res.json(AllUsers);
});

app.post("/getProject-details", authenticateToken, async (req, res) => {
  let projectid = req.body.id;

  console.log("id is", projectid);

  let sendres = await GetProjectDetails(projectid);
  res.json(sendres);
});

app.post("/create-project", async (req, res) => {
  const { finalData } = req.body;

  let functionRes = await HandleCreateProject(finalData);
  res.json(functionRes);
});

app.post("/remove-labour", async (req, res) => {
  let { email } = req.body;
  let removeStatus = await RemoveLabour(email);
  res.json(removeStatus);
});

app.post("/remove-supervisor", async (req, res) => {
  let { email } = req.body;
  let removeStatus = await RemoveSupervisor(email);
  res.json(removeStatus);
});

app.post("/add-equipments", authenticateToken, async (req, res) => {
  let { finalEquipment, selectedQuantity } = req.body;

  let sendres = await AddEquipment(finalEquipment, selectedQuantity);
  res.json(sendres);
});

app.get("/get-all-equipments-list", async (req, res) => {
  let AllEquipments = await FetchEquipments();
  res.json(AllEquipments);
});

app.get("/fetch-labours", async (req, res) => {
  let AllLabours = await FetchLabours();
  res.json(AllLabours);
});

app.get("/fetch-supervisors", async (req, res) => {
  let AllSup = await FetchSupervisors();
  res.json(AllSup);
});

app.get("/supervisors", getSupervisors);

app.get("/supervisor-assignments", getSupervisorAssignments);
app.post("/assign-supervisor", assignSupervisor);
app.delete("/assign-supervisor", removeSupervisorAssignment);

app.get("/getsupID/:email", async (req, res) => {
  let { email } = req.params;
  let db;
  try {
    db = await mysql.createConnection(db_details);

    console.log("Database Connected Successfully");
  } catch (err) {
    console.log("Failed to Connect Database");
  }

  let rows;

  [rows] = await db.query(`select ID from supervisors where Email=?`, [email]);

  let ID = rows[0].ID;
  console.log(ID);

  res.json(ID);
});

app.get("/check-sup-assign/:ID", async (req, res) => {
  let { ID } = req.params;
  console.log(ID);

  let db;
  try {
    db = await mysql.createConnection(db_details);

    console.log("Database Connected Successfully");
  } catch (err) {
    console.log("Failed to Connect Database");
  }

  let rows;

  [rows] = await db.query(
    `select * from supervisor_assignments where SupervisorID=?`,
    [ID],
  );

  if (rows.length === 0) {
    res.json({
      success: false,
    });
  } else {
    res.json({
      success: true,
    });
  }
});

app.get("/getSupPrjsList-Att/:ID", async (req, res) => {
  let { ID } = req.params;

  let db;
  try {
    db = await mysql.createConnection(db_details);

    console.log("Database Connected Successfully");
  } catch (err) {
    console.log("Failed to Connect Database"); 
  }

  let fetchedRows;

  try {
    [fetchedRows] = await db.query(
      `select
 projects.ProjectName,
 projects.ProjectID
 from projects
 join supervisor_assignments
 on projects.ProjectID = supervisor_assignments.ProjectID
 where supervisor_assignments.SupervisorID =?`,
      [ID],
    );

    res.json({
      success: true,
      FetchedRows: fetchedRows,
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
    });
  }
});
app.get("/supAlcPrjList/:supAssignedPrjID", async (req, res) => {
  let { supAssignedPrjID } = req.params;

  let db;
  try {
    db = await mysql.createConnection(db_details);

    console.log("Database Connected Successfully");
  } catch (err) {
    console.log("Failed to Connect Database");
  }

  let fetchedRows;

  try {
    [fetchedRows] = await db.query(
      `select Name, LabType , labour_assignments.* from labours  join labour_assignments on labours.ID = labour_assignments.LabourID where labour_assignments.ProjectID=?`,
      [supAssignedPrjID],
    );

    res.json({
      success: true,
      FetchedRows: fetchedRows,
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
    });
  }
});

app.get("/get-project-count", async(req, res)=>{

  let db;
  try {
    db = await mysql.createConnection(db_details);

    console.log("Database Connected Successfully");
  } catch (err) {
    console.log("Failed to Connect Database");
  }

  try{
    let [getTotalounts] = await db.execute(`select * from projects`);
    let [completedCount] = await db.execute(`select * from projects where Status='Completed'`)
    let [pendingCount] = await db.execute(`select * from projects where Status='Pending'`)
    // console.log(getTotalounts);
    res.json({
      TotalProjectCount: getTotalounts.length,
      CompletedCount: completedCount.length,
      PendingCount: pendingCount.length,
    });
    
  }catch(err){
console.log(err);

  }finally{
      if(db) await db.end();
  }

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

app.get("/get-Lab-Equip-Info", async (req, res) => {
  const allLabourList = await FetchLabours();
  const allEquipments = await FetchInStockEquipments();

  res.json({ allLabourList, allEquipments });
});

app.get("/get-inStock-equipList", async (req, res) => {
  const allEquipments = await FetchInStockEquipments();

  res.json({ allEquipments });
});

app.post("/Selected-Lab-Equip-Det", async (req, res) => {
  let { selectedLabour } = req.body;

  let LabourEquipDet = await LabourEquipAssignDetails(selectedLabour);

  res.json(LabourEquipDet);
});

app.post("/assign-equip", async (req, res) => {
  let { selectedLabour, selectedEquip, quantity } = req.body;

  let AssignRes = await AssignEquipments(
    selectedLabour,
    selectedEquip,
    quantity,
  );

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

app.post("/remove-equipments", authenticateToken, async (req, res) => {
  let { selectedEquip, selectedQuantity } = req.body;
  let removeRes = await RemoveEquipment(selectedEquip, selectedQuantity);

  res.json(removeRes);
});

app.get("/get-assigned-prj-WorkDetails/:ID", async (req, res) => {
  const { ID } = req.params;

  let db;
  try {
    db = await mysql.createConnection(db_details);

    console.log("Database Connected Successfully");
  } catch (err) {
    console.log("Failed to Connect Database");
  }

  let FetchWorkList;

  [FetchWorkList] = await db.execute(
    `Select * from work_details where ProjectID=?`,
    [ID],
  );

  console.log(FetchWorkList);

  res.json({
    success: true,
    WorkList: FetchWorkList,
  });
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

    if (!data.workDone) {
      return res.status(400).json({
        success: false,
        message: "Enter Work Done",
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

app.post("/get-project-status", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.json({ success: false, message: "Id not available" });
  } else {
    let resStatus = await GetProjectStatus(id);

    res.json(resStatus);
  }
});

app.post("/getPastBill-details", async (req, res) => {
  let { works } = req.body;
  let { projectID } = req.body;
  let pastInfo = await GetPendingBillInfo(works, projectID);

  res.json(pastInfo);
});

app.post("/get-ClientInfo-BillNo", async (req, res) => {
  let { projectid } = req.body;

  let resdet = await GetClietInfo_BillNo(projectid);

  res.json(resdet);
});

app.post("/get-past-bills", async (req, res) => {
  let { id } = req.body;

  let AllBill = await GetPastBills(id);

  res.json(AllBill);
});
app.listen(3000, () => console.log("Server Running on Port : 3000"));

const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/photo-gallery");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const uploadPhoto = multer({ storage: photoStorage });

app.post("/upload-photo", uploadPhoto.array("photos", 10), async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const filePaths = files.map((file) => file.path.replace(/\\/g, "/"));

    // insert all into DB
    for (let path of filePaths) {
      await handlePhotoUpload(path);
    }

    res.json({
      success: true,
      message: "Photos uploaded successfully",
      paths: filePaths,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  } finally {
    if (db) await db.end();
  }
});

const photoStorageCarousel = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/home-carousel");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const uploadPhotoCarousel = multer({ storage: photoStorageCarousel });

app.post(
  "/upload-photo-carousel",
  uploadPhotoCarousel.array("photos", 10),
  async (req, res) => {
    try {
      const files = req.files;

      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      const filePaths = files.map((file) => file.path.replace(/\\/g, "/"));

      // insert all into DB
      for (let path of filePaths) {
        await handleCarouselPhotoUpload(path);
      }

      res.json({
        success: true,
        message: "Photos uploaded successfully",
        paths: filePaths,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Upload failed",
      });
    } finally {
      if (db) await db.end();
    }
  },
);

app.get("/photos", async (req, res) => {
  try {
    let db;
    try {
      db = await mysql.createConnection(db_details);
    } catch (err) {
      console.log("Failed to Connect Database");
      return {
        success: false,
        message: "Something went wrong. Please try again later.",
      };
    }
    const [rows] = await db.execute("SELECT * FROM photogallery");

    res.json({
      success: true,
      photos: rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching photos",
    });
  }
});

app.get("/carousel", async (req, res) => {
  try {
    let db;
    try {
      db = await mysql.createConnection(db_details);
    } catch (err) {
      console.log("Failed to Connect Database");
      return {
        success: false,
        message: "Something went wrong. Please try again later.",
      };
    }
    const [rows] = await db.execute("SELECT * FROM HomeCarousel");

    res.json({
      success: true,
      photos: rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching photos",
    });
  }
});

app.post("/delete-Photo", async (req, res) => {
  let { ID } = req.body;
  console.log(ID);

  let resDelete = await RemoveGalleryImage(ID);
  res.json(resDelete);
});

app.post("/delete-Photo-carousel", async (req, res) => {
  let { ID } = req.body;
  console.log(ID);

  let resDelete = await RemoveCarouselImage(ID);
  res.json(resDelete);
});

app.post("/fetch-projects-client", async (req, res) => {
  let { clientID } = req.body;
  console.log(clientID);

  let AllProjects = await FetchProjectsClient(clientID);
  res.json(AllProjects);
});

app.post("/insert-reqform-data", insertServiceRequest);

app.get("/get-service-requests", getServiceRequests);

app.delete("/delete-service-request/:id", deleteServiceRequest);

app.get("/testimonials", getTestimonials);

// ADD
app.post("/add-testimonials", addTestimonial);

// DELETE
app.delete("/testimonials/:id", deleteTestimonial);

app.get("/labours", getLabours);
app.get("/projects", getProjects);
app.get("/assignments", getAssignments);

// POST
app.post("/assign", assignLabour);

// DELETE
app.delete("/assign/:id", removeAssignment);

app.post("/forgot-password", async (req, res) => {
  let { email } = req.body;
  let resetres = ForgotPasswordHandler(email);
  res.json(resetres);
});

app.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const result = await ResetPasswordHandler(token, newPassword);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// app.post("/generate-bill-pdf", async (req, res) => {
//   try {
//     const data = req.body;
// console.log("data:", data);

//     const pdfBuffer = await generateInvoice({
//       ...data,
//       date: new Date().toLocaleDateString(),
//     });

//     res.set({
//       "Content-Type": "application/pdf",

//       "Content-Disposition": 'attachment; filename="invoice.pdf"',
//     });

//     res.send(pdfBuffer);
//   } catch (err) {
//     console.log(err);

//     res.status(500).json({
//       success: false,
//       message: "PDF generation failed",
//     });
//   }
// });
app.post("/getLabourWages", GetLabourWages);

app.post("/updateLabourWages", UpdateLabourWages);

app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    // 1. Create order in Razorpay
    const order = await razorpay.orders.create(options);

    // 2. Insert order into MySQL (IMPORTANT)
    let db;
    try {
      db = await mysql.createConnection(db_details);
      console.log("Database Connected Successfully");
    } catch (err) {
      console.log("Failed to Connect Database");
      return {
        success: false,
        message: "Something went wrong. Please try again later.",
      };
    }

    await db.execute(
      "INSERT INTO razorpayorders (razorpay_order_id, amount, status) VALUES (?, ?, ?)",
      [order.id, Number(options.amount), "created"],
    );

    res.json({
      success: true,
      order,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Order creation failed",
    });
  }
});

app.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      billid,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", RAZORPAY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.json({ success: false, message: "Invalid signature" });
    }
    let db;
    try {
      db = await mysql.createConnection(db_details);
      console.log("Database Connected Successfully");
    } catch (err) {
      console.log("Failed to Connect Database");
      return {
        success: false,
        message: "Something went wrong. Please try again later.",
      };
    }
    // ✅ MYSQL UPDATE QUERY
    await db.execute(
      "UPDATE razorpayorders SET status = ?, razorpay_payment_id = ? WHERE razorpay_order_id = ?",
      ["paid", razorpay_payment_id, razorpay_order_id],
    );

    await db.execute("UPDATE all_bills SET Status=? where BillID=?", [
      "Paid",
      billid,
    ]);
    console.log("Payment verified & DB updated");

    // Fetch bill details
    const [billRows] = await db.execute(
      "SELECT * FROM all_bills WHERE BillID=?",
      [billid],
    );

    const bill = billRows[0];
    console.log("bill:", bill);

    // Generate Receipt PDF
    const receiptPath = await generateReceipt({
      receiptNo: `RCPT-${Date.now()}`,

      billno: bill.BillNo,

      clientName: bill.ClientName,

      payment_id: razorpay_payment_id,

      order_id: razorpay_order_id,

      amount: bill.TotalAmount,

      paymentDate: new Date().toLocaleString("en-IN"),
    });

    console.log("path si", receiptPath);

    await db.execute("UPDATE all_bills SET PaidBillReceipt=? where BillID=?", [
      receiptPath,
      billid,
    ]);

    console.log("Receipt Generated:", receiptPath);
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

app.post("/getProjectsList", async (req, res) => {
  let { clientID } = req.body;
  console.log(clientID);
  let ProjectList = await GetProjectNames(clientID);
  console.log(ProjectList);

  res.json(ProjectList);
});

app.post("/insertFeedback", insertFeedback);
app.post("/insertIssue", insertIssue);

app.get("/getALcPrjDetSup/:SupId", async (req, res) => {
  let { SupId } = req.params;
  console.log("calling");

  let getres = await FetchSupAllocatedPrjDet(SupId);

  res.json(getres);
});
