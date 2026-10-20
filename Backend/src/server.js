import express from "express";
import cors from "cors";
import "dotenv/config";
import multer from 'multer';
import connectDB from "./config/databs.js";
import authRouter from "./routes/authRoutes.js";
import employeesRouter from "./routes/employeeRoutes.js";
import profileRouter from "./routes/profileRoutes.js";
import attendanceRouter from "./routes/attendanceRoutes.js";
import leaveRouter from "./routes/leavesRoutes.js";
import payslipRouter from "./routes/payslipsRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

await connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(multer().none());
app.use(express.urlencoded({ extended: true }));

// =========================
// API ROUTES
// =========================
app.use("/api/auth", authRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/profile", profileRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/leave", leaveRouter);
app.use("/api/payslips", payslipRouter);
app.use("/api/dashboard", dashboardRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});