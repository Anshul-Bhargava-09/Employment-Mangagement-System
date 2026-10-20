import { Router } from "express";
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
} from "../controllers/employeeController.js";
import { protect, protectAdmin } from "../middleware/authMiddleware.js";

const employeesRouter = Router();

employeesRouter.get("/", protect, protectAdmin, getEmployees);
employeesRouter.get("/:id", protect, protectAdmin, getEmployeeById);
employeesRouter.post("/", protect, protectAdmin, createEmployee);
employeesRouter.put("/:id", protect, protectAdmin, updateEmployee);
employeesRouter.delete("/:id", protect, protectAdmin, deleteEmployee);

export default employeesRouter;