import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

// Get employees
// GET /api/employees
export const getEmployees = async (req, res) => {
  try {
    const { department, includeDeleted } = req.query;

    const where = {};

    if (department && department !== "All") {
      where.department = department;
    }

    // Default to active employees unless explicitly requesting deleted/all
    if (includeDeleted === "only") {
      where.isDeleted = true;
    } else if (includeDeleted !== "true") {
      where.isDeleted = { $ne: true };
    }

    const employees = await Employee.find(where)
      .sort({ createdAt: -1 })
      .populate("userId", "email role")
      .lean();

    const result = employees.map((emp) => ({
      ...emp,
      id: emp._id.toString(),
      user: emp.userId
        ? {
            email: emp.userId.email,
            role: emp.userId.role,
          }
        : null,
    }));

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch employees" });
  }
};

// Get single employee by ID
// GET /api/employees/:id
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id).populate("userId", "email role").lean();
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    return res.json({
      ...employee,
      id: employee._id.toString(),
      user: employee.userId
        ? {
            email: employee.userId.email,
            role: employee.userId.role,
          }
        : null,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch employee" });
  }
};

// Create employee
// POST /api/employees
export const createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      basicSalary,
      allowances,
      deductions,
      joinDate,
      password,
      role,
      bio,
    } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashed,
      role: role || "EMPLOYEE",
    });

    const employee = await Employee.create({
      userId: user._id,
      firstName,
      lastName,
      email,
      phone,
      position,
      department: department || "Engineering",
      basicSalary: Number(basicSalary) || 0,
      allowances: Number(allowances) || 0,
      deductions: Number(deductions) || 0,
      joinDate: new Date(joinDate),
      bio: bio || "",
    });

    return res.status(201).json({ success: true, employee });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }

    console.error("Create employee error:", error);

    return res.status(500).json({ error: "Failed to create employee" });
  }
};

// Update employees
// PUT /api/employees/:id
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      basicSalary,
      allowances,
      deductions,
      password,
      role,
      bio,
      employmentStatus,
      isDeleted,
    } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    const updateData = {
      firstName: firstName ?? employee.firstName,
      lastName: lastName ?? employee.lastName,
      email: email ?? employee.email,
      phone: phone ?? employee.phone,
      position: position ?? employee.position,
      department: department ?? employee.department,
      basicSalary: basicSalary !== undefined ? Number(basicSalary) : employee.basicSalary,
      allowances: allowances !== undefined ? Number(allowances) : employee.allowances,
      deductions: deductions !== undefined ? Number(deductions) : employee.deductions,
      employmentStatus: employmentStatus ?? employee.employmentStatus,
      bio: bio !== undefined ? bio : employee.bio,
    };

    if (isDeleted !== undefined) {
      updateData.isDeleted = isDeleted;
      if (isDeleted === false && !employmentStatus) {
        updateData.employmentStatus = "ACTIVE";
      }
    }

    const updatedEmp = await Employee.findByIdAndUpdate(id, updateData, { new: true });

    // Update user record if email, role, or password changed
    const userUpdate = {};
    if (email) userUpdate.email = email;
    if (role) userUpdate.role = role;
    if (password && password.trim().length > 0) {
      userUpdate.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(userUpdate).length > 0 && employee.userId) {
      await User.findByIdAndUpdate(employee.userId, userUpdate);
    }

    return res.json({
      success: true,
      employee: updatedEmp,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }

    console.error("Update employee error:", error);
    return res.status(500).json({ error: "Failed to update employee" });
  }
};

// Soft delete employee
// DELETE /api/employees/:id
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    employee.isDeleted = true;
    employee.employmentStatus = "INACTIVE";

    await employee.save();

    return res.json({
      success: true,
      message: "Employee moved to previous employees history",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to delete employee",
    });
  }
};