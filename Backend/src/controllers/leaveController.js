import Employee from "../models/Employee.js";
import LeaveApplication from "../models/LeaveApplication.js";
import mongoose from "mongoose";

// Helper function to resolve employee document for current session or requested employeeId
const findEmployeeForUser = async (session, requestedEmployeeId = null) => {
  // If admin provided an employeeId
  if (session.role === "ADMIN" && requestedEmployeeId) {
    if (mongoose.Types.ObjectId.isValid(requestedEmployeeId)) {
      const emp = await Employee.findById(requestedEmployeeId);
      if (emp) return emp;
    }
  }

  // 1. Try finding by userId as ObjectId or string
  if (session.userId) {
    let emp = await Employee.findOne({ userId: session.userId });
    if (emp) return emp;

    if (mongoose.Types.ObjectId.isValid(session.userId)) {
      emp = await Employee.findOne({ userId: new mongoose.Types.ObjectId(session.userId) });
      if (emp) return emp;
    }
  }

  // 2. Try finding by email
  if (session.email) {
    const emp = await Employee.findOne({ email: session.email.toLowerCase() });
    if (emp) return emp;
  }

  // 3. If session role is ADMIN and no employee found, look for or create a default Admin employee profile or pick first admin
  if (session.role === "ADMIN") {
    let adminEmp = await Employee.findOne({ email: session.email || "admin@example.com" });
    if (!adminEmp) {
      adminEmp = await Employee.create({
        userId: session.userId,
        firstName: session.firstName || "Admin",
        lastName: session.lastName || "User",
        email: session.email || "admin@example.com",
        phone: "0000000000",
        position: "Administrator",
        department: "Human Resources",
        basicSalary: 0,
        allowances: 0,
        deductions: 0,
        employmentStatus: "ACTIVE",
        isDeleted: false,
        joinDate: new Date(),
        bio: "System Administrator",
      });
    } else if (adminEmp.isDeleted || adminEmp.employmentStatus !== "ACTIVE") {
      adminEmp.isDeleted = false;
      adminEmp.employmentStatus = "ACTIVE";
      await adminEmp.save();
    }
    return adminEmp;
  }

  return null;
};

// Create leave
// POST /api/leave
export const createLeave = async (req, res) => {
  try {
    const session = req.session;

    const employee = await findEmployeeForUser(session, req.body.employeeId);

    if (!employee) {
      return res.status(404).json({
        error: "Employee profile not found. Please contact administrator.",
      });
    }

    if (employee.isDeleted) {
      return res.status(403).json({
        error: "Your account is deactivated. You cannot apply for leave.",
      });
    }

    // If employment status was INACTIVE but isDeleted is false, auto-activate
    if (employee.employmentStatus === "INACTIVE" && !employee.isDeleted) {
      employee.employmentStatus = "ACTIVE";
      await employee.save();
    }

    const { type, startDate, endDate, reason } = req.body;

    if (!type || !startDate || !endDate || !reason) {
      return res.status(400).json({
        error: "Missing required fields (type, start date, end date, reason)",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        error: "Invalid start or end date format",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDay = new Date(start);
    startDay.setHours(0, 0, 0, 0);

    const endDay = new Date(end);
    endDay.setHours(0, 0, 0, 0);

    if (startDay < today) {
      return res.status(400).json({
        error: "Leave start date cannot be in the past",
      });
    }

    if (endDay < startDay) {
      return res.status(400).json({
        error: "End date cannot be before start date",
      });
    }

    const leave = await LeaveApplication.create({
      employeeId: employee._id,
      type,
      startDate: start,
      endDate: end,
      reason,
      status: "PENDING",
    });

    return res.json({
      success: true,
      data: leave,
    });
  } catch (error) {
    console.error("Create leave error:", error);
    return res.status(500).json({
      error: error.message || "Failed to create leave application",
    });
  }
};

// Get leaves
// GET /api/leave
export const getLeaves = async (req, res) => {
  try {
    const session = req.session;
    const isAdmin = session.role === "ADMIN";

    if (isAdmin) {
      const status = req.query.status;
      const where = status ? { status } : {};

      const leaves = await LeaveApplication.find(where)
        .populate("employeeId")
        .sort({ createdAt: -1 });

      const data = leaves.map((l) => {
        const obj = l.toObject();

        return {
          ...obj,
          id: obj._id.toString(),
          employee: obj.employeeId,
          employeeId: obj.employeeId?._id?.toString(),
        };
      });

      return res.json({ data });
    } else {
      const employee = await findEmployeeForUser(session);

      if (!employee) {
        return res.status(404).json({
          error: "Employee profile not found",
        });
      }

      const leaves = await LeaveApplication.find({
        employeeId: employee._id,
      }).sort({ createdAt: -1 });

      return res.json({
        data: leaves,
        employee: {
          ...employee.toObject ? employee.toObject() : employee,
          id: employee._id.toString(),
        },
      });
    }
  } catch (error) {
    console.error("Get leaves error:", error);
    return res.status(500).json({
      error: "Failed to fetch leaves",
    });
  }
};

// Update leave status
// PATCH /api/leave/:id
export const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) {
      return res.status(400).json({
        error: "Invalid status",
      });
    }

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid leave ID format",
      });
    }

    const leave = await LeaveApplication.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: "after" }
    ).populate("employeeId");

    if (!leave) {
      return res.status(404).json({
        error: "Leave request not found",
      });
    }

    const leaveObj = leave.toObject();

    return res.json({
      success: true,
      data: {
        ...leaveObj,
        id: leaveObj._id.toString(),
        employee: leaveObj.employeeId,
      },
    });
  } catch (error) {
    console.error("Update leave status error:", error);
    return res.status(500).json({
      error: "Failed to update leave status",
    });
  }
};