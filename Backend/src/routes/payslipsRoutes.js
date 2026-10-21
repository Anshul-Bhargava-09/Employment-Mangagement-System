import { Router } from "express";
import { protect, protectAdmin } from "../middleware/authMiddleware.js";
import { createPayslip, getPayslipById, getPayslips, deletePayslip } from "../controllers/payslipsController.js";


const payslipRouter = Router();

payslipRouter.post("/",protect,protectAdmin,createPayslip);
payslipRouter.get("/",protect,getPayslips);
payslipRouter.get("/:id",protect,getPayslipById);
payslipRouter.delete("/:id",protect,protectAdmin,deletePayslip);

export default payslipRouter;