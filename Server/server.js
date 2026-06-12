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
import { pool } from "./Sharedpool.js";

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

  let rows;

  [rows] = await pool.execute(`select ID from supervisors where Email=?`, [
    email,
  ]);

  let ID = rows[0].ID;
  console.log(ID);

  res.json(ID);
});

app.get("/check-sup-assign/:ID", async (req, res) => {
  let { ID } = req.params;
  console.log(ID);

  let rows;

  [rows] = await pool.execute(
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

  let fetchedRows;

  try {
    [fetchedRows] = await pool.execute(
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

  let fetchedRows;

  try {
    [fetchedRows] = await pool.execute(
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

app.get("/get-project-count", async (req, res) => {
  try {
    let [getTotalounts] = await pool.execute(`select * from projects`);
    let [completedCount] = await pool.execute(
      `select * from projects where Status='Completed'`,
    );
    let [pendingCount] = await pool.execute(
      `select * from projects where Status='Pending'`,
    );
    // console.log(getTotalounts);
    res.json({
      TotalProjectCount: getTotalounts.length,
      CompletedCount: completedCount.length,
      PendingCount: pendingCount.length,
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/get-client-project-count/:ID", async (req, res) => {
  const { ID } = req.params;

  try {
    let [getTotalounts] = await pool.execute(
      `select * from projects where ClientID=?`,
      [ID],
    );
    let [completedCount] = await pool.execute(
      `select * from projects where ClientID=? and Status='Completed'`,
      [ID],
    );
    let [pendingCount] = await pool.execute(
      `select * from projects where ClientID=? and Status='Pending'`,
      [ID],
    );
    // console.log(getTotalounts);
    res.json({
      TotalProjectCount: getTotalounts.length,
      CompletedCount: completedCount.length,
      PendingCount: pendingCount.length,
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/client-billing-summary/:ID", async (req, res) => {
  const { ID } = req.params;

  try {
    const [rows] = await pool.execute(
      `
     SELECT 
  COUNT(*) AS TotalBills,
  SUM(CASE WHEN b.Status = 'Paid' THEN 1 ELSE 0 END) AS PaidBills,
  SUM(CASE WHEN b.Status = 'Pending' THEN 1 ELSE 0 END) AS PendingBills
FROM all_bills b
JOIN projects p ON b.ProjectID = p.ProjectID
WHERE p.ClientID = ?;
    `,
      [ID],
    );
    let countDetails = rows[0];
    let [gettotalPaymentmonth] = await pool.execute(`SELECT 
  COALESCE(SUM(TotalAmount), 0) AS TotalPaidLast30Days
FROM all_bills
WHERE Status = 'Paid'
AND BillPaymentDate >= NOW() - INTERVAL 30 DAY;`);
    console.log(rows);

    let totalPaymentmonth = gettotalPaymentmonth[0];
    res.json({ countDetails, totalPaymentmonth });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

app.get("/get-labours-count", async (req, res) => {
  try {
    let [getTotalLabours] = await pool.execute(`select * from labours`);
    let [MisteriCount] = await pool.execute(
      `select * from labours where LabType='Misteri'`,
    );
    let [HelperCount] = await pool.execute(
      `select * from labours where LabType='Helper'`,
    );
    // console.log(getTotalounts);
    res.json({
      TotalLabourCount: getTotalLabours.length,
      MisteriCount: MisteriCount.length,
      HelperCount: HelperCount.length,
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/get-Users-count", async (req, res) => {
  try {
    let [getTotalUsers] = await pool.execute(`select * from users`);
    let [AdminCount] = await pool.execute(
      `select * from users where User_Role='Admin'`,
    );
    let [ClientUserCount] = await pool.execute(
      `select * from users where User_Role='Client'`,
    );

    let [SupUserCount] = await pool.execute(
      `select * from users where User_Role='supervisor'`,
    );

    let [LabUserCount] = await pool.execute(
      `select * from users where User_Role='supervisor'`,
    );
    // console.log(getTotalounts);
    res.json({
      TotalUsersCount: getTotalUsers.length,
      AdminCount: AdminCount.length,
      ClientUserCount: ClientUserCount.length,
      SupUserCount: SupUserCount.length,
      LabUserCount: LabUserCount.length,
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/get-sup-count", async (req, res) => {
  try {
    let [getTotalSup] = await pool.execute(`select * from supervisors`);

    res.json({
      TotalSupCount: getTotalSup.length,
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/get-last-30-days-payment", async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT
        COALESCE(SUM(TotalAmount), 0) AS TotalReceivedLast30Days
      FROM all_bills
      WHERE Status = 'Paid'
      AND BillPaymentDate >= CURDATE() - INTERVAL 30 DAY
    `);

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

app.get("/get-service-request-count", async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT COUNT(*) AS TotalRequests
      FROM servicerequestrecords
      WHERE RequestTime >= NOW() - INTERVAL 2 DAY
    `);

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

app.get("/get-issue-count", async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT COUNT(*) AS TotalIssues
      FROM reportissues
    `);

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

app.get("/get-monthly-payments", async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        BillID,
        BillNo,
        ProjectID,
        TotalAmount,
        BillPaymentDate,
        PaidBillReceipt,
        Status
      FROM all_bills
      WHERE Status = 'Paid'
      AND MONTH(BillPaymentDate) = MONTH(CURDATE())
      AND YEAR(BillPaymentDate) = YEAR(CURDATE())
      ORDER BY BillPaymentDate DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
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

app.get("/get-issue-count", async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT COUNT(*) AS TotalIssues
      FROM reportissues
    `);

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
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

  let FetchWorkList;

  [FetchWorkList] = await pool.execute(
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
    console.log(data);

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

app.post("/get-client-project-progress", async (req, res) => {
  const { ID } = req.body;

  try {
    const [rows] = await pool.execute(
      `
      SELECT 
        p.ProjectID,
        p.ProjectName,
        COALESCE(SUM(w.TotalArea), 0) AS TotalArea,
        COALESCE(SUM(w.CompletedArea), 0) AS CompletedArea,
        CASE 
          WHEN SUM(w.TotalArea) = 0 THEN 0
          ELSE ROUND((SUM(w.CompletedArea) / SUM(w.TotalArea)) * 100)
        END AS OverallPercentage
      FROM projects p
      LEFT JOIN work_details w 
        ON p.ProjectID = w.ProjectID
      WHERE p.ClientID = ?
      GROUP BY p.ProjectID, p.ProjectName
    `,
      [ID],
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

app.get("/get-new-bills", async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        BillID,
        BillNo,
        ProjectID,
        TotalAmount,
        billdate,
        Status
      FROM all_bills
      WHERE billdate >= NOW() - INTERVAL 1 DAY
      AND Status = 'Pending'
      ORDER BY billdate DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

app.get("/get-recent-paid-bills", async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        b.BillID,
        b.BillNo,
        p.ProjectName,
        b.TotalAmount,
        b.BillPaymentDate,
        b.PDFPath
      FROM all_bills b
      JOIN projects p ON b.ProjectID = p.ProjectID
      WHERE b.Status = 'Paid'
      ORDER BY b.BillPaymentDate DESC
      LIMIT 2
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
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
    }
  },
);

app.get("/photos", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM photogallery");

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
    const [rows] = await pool.execute("SELECT * FROM homecarousel");

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

    await pool.execute(
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

    // ✅ MYSQL UPDATE QUERY
    await pool.execute(
      "UPDATE razorpayorders SET status = ?, razorpay_payment_id = ? WHERE razorpay_order_id = ?",
      ["paid", razorpay_payment_id, razorpay_order_id],
    );

    await pool.execute(
      "UPDATE all_bills SET Status = ?, BillPaymentDate = CURDATE() WHERE BillID = ?",
      ["Paid", billid],
    );
    console.log("Payment verified & DB updated");

    // Fetch bill details
    const [billRows] = await pool.execute(
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

    await pool.execute(
      "UPDATE all_bills SET PaidBillReceipt=? where BillID=?",
      [receiptPath, billid],
    );

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
  res.json(ProjectList);
});

app.post("/get-sup-ProjectsList", async (req, res) => {
  let { supID } = req.body;
  console.log(supID);

  try {
    let [GetList] = await pool.execute(
      `select 
      projects.ProjectName,
      projects.ProjectID
      from projects
      join supervisor_assignments on projects.ProjectID = supervisor_assignments.ProjectID where supervisor_assignments.SupervisorID=?;`,
      [supID],
    );
    console.log(GetList);

    res.json({
      success: true,
      ProjectDetails: GetList,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/insertFeedback", insertFeedback);
app.post("/insertIssue", insertIssue);

app.get("/getALcPrjDetSup/:SupId", async (req, res) => {
  let { SupId } = req.params;
  console.log("calling");

  let getres = await FetchSupAllocatedPrjDet(SupId);

  res.json(getres);
});

app.get("/get-work-details/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;

    const [rows] = await pool.execute(
      `SELECT * 
     FROM work_details
     WHERE ProjectID = ?
     ORDER BY WorkID`,
      [projectId],
    );

    res.json(rows);
  } catch (err) {
    console.log(err);
  }
});

app.put("/update-total-area", async (req, res) => {
  try {
    const { WorkID, TotalArea } = req.body;

    await pool.execute(
      `UPDATE work_details
     SET TotalArea = ?
     WHERE WorkID = ?`,
      [TotalArea, WorkID],
    );

    res.json({
      success: true,
      message: "Area Updated",
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/add-project-work", async (req, res) => {
  try {
    const { ProjectID, works } = req.body;

    for (const work of works) {
      await pool.execute(
        `
        INSERT INTO work_details
        (
          ProjectID,
          WorkName,
          TotalArea,
          Rate
        )
        VALUES
        (?, ?, ?, ?)
        `,
        [ProjectID, work.WorkName, work.TotalArea, work.Rate],
      );
    }

    res.status(200).json({
      message: "Work Added Successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

app.get("/get-working-site/:LabourID", async (req, res) => {
  const { LabourID } = req.params;

  const [rows] = await pool.execute(
    `select 
    projects.ProjectID,
    projects.ProjectName
    from projects
    join labour_assignments on projects.ProjectID = labour_assignments.ProjectID where labour_assignments.LabourID = ?;`,
    [LabourID],
  );

  console.log(rows);
  res.json(rows);
});

app.post("/insert-Lab-Issue", async (req, res) => {
  const { ProjectID, LabourID, IssueDescription } = req.body;

  let [insertStatus] = await pool.execute(
    `INSERT INTO LabourIssues (ProjectID,LabourID,IssueDescription) values(?,?,?)`,
    [ProjectID, LabourID, IssueDescription],
  );

  if (insertStatus.affectedRows === 1) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.get("/get-labour-issues/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      `
      SELECT
        li.IssueID,
        li.ProjectID,
        li.LabourID,
        l.Name AS LabourName,
        li.IssueDescription,
        li.Status,
        li.CreatedAt
      FROM labourissues li
      INNER JOIN labours l
        ON li.LabourID = l.ID
      WHERE li.ProjectID = ?
      ORDER BY li.CreatedAt DESC
      `,
      [id],
    );

    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch issues",
    });
  }
});

app.get("/get-client-issues/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      `
      SELECT
        ri.IssueID,
        ri.ProjectID,
        ri.ClientID,
        c.Name AS ClientName,
        ri.IssueDescription,
        ri.Status,
        ri.CreatedAt
      FROM reportissues ri
      JOIN clients c
        ON ri.ClientID = c.ID
      WHERE ri.ProjectID = ?
      ORDER BY ri.CreatedAt DESC
      `,
      [id],
    );

    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch client issues",
    });
  }
});

app.put("/update-labour-issue-status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await pool.execute(
      `
      UPDATE LabourIssues
      SET Status = ?
      WHERE IssueID = ?
      `,
      [status, id],
    );

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.post("/insert-sup-Issue", async (req, res) => {
  try {
    const { project, description, SupId } = req.body;
    console.log(project, description, SupId);

    // Validation
    if (!project || !description || !SupId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Insert Query
    await pool.execute(
      `
      INSERT INTO SupervisorIssues (
        ProjectID,
        SupervisorID,
        IssueDescription
      )
      VALUES (?, ?, ?)
      `,
      [project, SupId, description],
    );

    return res.json({
      success: true,
      message: "Issue submitted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

app.get("/get-sup-issues/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      `
      SELECT
    ri.*,
    s.Name AS SupervisorName
FROM supervisorissues ri
JOIN supervisors s
    ON ri.SupervisorID = s.ID
WHERE ri.ProjectID =?
ORDER BY ri.CreatedAt DESC;
      `,
      [id],
    );

    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch client issues",
    });
  }
});

app.put("/update-client-issue-status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await pool.execute(
      `
      UPDATE reportissues
      SET Status = ?
      WHERE IssueID = ?
      `,
      [status, id],
    );

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.put("/update-supervisor-issue-status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await pool.execute(
      `
      UPDATE supervisorissues
      SET Status = ?
      WHERE IssueID = ?
      `,
      [status, id],
    );

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.get("/labour/dashboard/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Labour Info
    const [labour] = await pool.execute(
      `
      SELECT
        ID,
        Name,
        LabType,
        profileImgPath
      FROM labours
      WHERE ID = ?
      `,
      [id],
    );

    // Current Project
    const [project] = await pool.execute(
      `
      SELECT
        p.ProjectID,
        p.ProjectName,
        p.Address,
        p.Status,
        la.AssignDate
      FROM labour_assignments la
      JOIN projects p
      ON la.ProjectID = p.ProjectID
      WHERE la.LabourID = ?
      LIMIT 1
      `,
      [id],
    );

    // Current Month Summary
    const [summary] = await pool.execute(
      `
  SELECT
    COUNT(*) AS TotalDays,
    SUM(CASE WHEN status='P' THEN 1 ELSE 0 END) AS PresentDays,
    SUM(CASE WHEN status='A' THEN 1 ELSE 0 END) AS AbsentDays,
    COALESCE(SUM(Day_Total),0) AS TotalWages,
    COALESCE(SUM(advance),0) AS TotalAdvance
  FROM attendance
  WHERE labour_id = ?
  AND MONTH(date) = MONTH(CURDATE())
  AND YEAR(date) = YEAR(CURDATE())
  `,
      [id],
    );

    // Recent Work
    const [recentWork] = await pool.execute(
      `
      SELECT
        date,
        Work_Done,
        Day_Total
      FROM attendance
      WHERE labour_id=?
      AND Work_Done IS NOT NULL
      ORDER BY date DESC
      LIMIT 5
      `,
      [id],
    );

    const percentage =
      summary[0]?.TotalDays > 0
        ? ((summary[0].PresentDays / summary[0].TotalDays) * 100).toFixed(0)
        : 0;

    res.json({
      labour: labour[0] || null,
      project: project[0] || null,
      summary: summary[0],
      attendancePercentage: percentage,
      recentWork,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

app.post("/supervisor/attendance", async (req, res) => {
  try {
    const { SupervisorID, AttendanceDate, Status, Site } = req.body;

    console.log(req.body);

    await pool.execute(
      `
      INSERT INTO supervisor_attendance
      (
        SupervisorID,
        AttendanceDate,
        Status,
        Site
      )
      VALUES (?, ?, ?, ?)
      `,
      [SupervisorID, AttendanceDate, Status, Site],
    );

    res.json({
      success: true,
      message: "Attendance Saved Successfully",
    });
  } catch (err) {
    console.log(err);

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "Attendance already recorded",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

app.get("/supervisors", async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT
        ID,
        Name
      FROM supervisors
      ORDER BY Name
    `);

    res.json(rows);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

app.get("/supervisor/assigned-projects/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id);

    const [rows] = await pool.execute(
      `
      SELECT
        p.ProjectID,
        p.ProjectName
      FROM supervisor_assignments sa
      JOIN projects p
        ON sa.ProjectID = p.ProjectID
      WHERE sa.SupervisorID = ?
      ORDER BY p.ProjectName
      `,
      [id],
    );

    console.log("heeee", rows);

    res.json(rows);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

app.post("/supervisor-attendance-report", async (req, res) => {
  try {
    const { type, supervisorId, month, fromDate, toDate } = req.body;

    let query = `
      SELECT
        sa.*,
        s.Name
      FROM supervisor_attendance sa
      JOIN supervisors s
        ON sa.SupervisorID = s.ID
      WHERE 1=1
    `;

    const params = [];

    if (supervisorId) {
      query += ` AND sa.SupervisorID = ?`;
      params.push(supervisorId);
    }

    if (type === "current") {
      query += `
        AND MONTH(sa.AttendanceDate) = MONTH(CURDATE())
        AND YEAR(sa.AttendanceDate) = YEAR(CURDATE())
      `;
    }

    if (type === "month" && month) {
      query += `
        AND DATE_FORMAT(sa.AttendanceDate,'%Y-%m') = ?
      `;
      params.push(month);
    }

    if (type === "range" && fromDate && toDate) {
      query += `
        AND sa.AttendanceDate BETWEEN ? AND ?
      `;
      params.push(fromDate, toDate);
    }

    query += `
      ORDER BY sa.AttendanceDate DESC
    `;

    const [result] = await pool.execute(query, params);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching supervisor attendance report",
    });
  }
});

app.get("/supervisors-list", async (req, res) => {
  try {
    const [result] = await pool.execute(`
      SELECT ID, Name
      FROM supervisors
      ORDER BY Name
    `);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch supervisors",
    });
  }
});

app.get("/get-sup-asignedprj-count/:ID", async (req, res) => {
  let { ID } = req.params;

  const Query = "SELECT * FROM supervisor_assignments WHERE SupervisorID=?";

  const [result] = await pool.execute(Query, [ID]);

  let count;

  if (result.length > 0) {
    count = result.length;
    res.json({
      success: true,
      TotalSites: count,
    });
  } else {
    res.json({
      success: false,
      message: "No Sites Assigned Yet",
    });
  }
});

app.get("/get-totalLabour-count/:ID", async (req, res) => {
  let { ID } = req.params;

  const Query = `SELECT COUNT(*) AS TotalLabours
FROM labour_assignments la
JOIN supervisor_assignments sa
    ON la.ProjectID = sa.ProjectID
WHERE sa.SupervisorID = ?`;

  const [result] = await pool.execute(Query, [ID]);

  let count;

  if (result.length > 0) {
    count = result.length;
    res.json({
      success: true,
      TotalLabours: count,
    });
  } else {
    res.json({
      success: false,
      message: "No Labours Assigned Yet",
    });
  }
});

app.post("/get-sup-project-progress", async (req, res) => {
  const { ID } = req.body;

  try {
    const [rows] = await pool.execute(
      `
      SELECT
    p.ProjectID,
    p.ProjectName,
    COALESCE(SUM(w.TotalArea), 0) AS TotalArea,
    COALESCE(SUM(w.CompletedArea), 0) AS CompletedArea,
    CASE
        WHEN COALESCE(SUM(w.TotalArea), 0) = 0 THEN 0
        ELSE ROUND((SUM(w.CompletedArea) / SUM(w.TotalArea)) * 100)
    END AS OverallProgress
FROM supervisor_assignments sa
JOIN projects p
    ON sa.ProjectID = p.ProjectID
LEFT JOIN work_details w
    ON p.ProjectID = w.ProjectID
WHERE sa.SupervisorID = ?
GROUP BY p.ProjectID, p.ProjectName;;
    `,
      [ID],
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

app.use(express.static(path.join(__dirname, "../Client/dist")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../Client/dist/index.html"));
});
