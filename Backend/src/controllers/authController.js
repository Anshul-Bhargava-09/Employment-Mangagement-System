import User from "../models/User.js";
import Employee from "../models/Employee.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Login for employee and admin
// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password, role_type } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    if (role_type === "admin" && user.role !== "ADMIN") {
      return res.status(401).json({
        error: "Not authorized as admin",
      });
    }

    if (role_type === "employee" && user.role !== "EMPLOYEE") {
      return res.status(401).json({
        error: "Not authorized as employee",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    let employeeInfo = {
      firstName: user.role === "ADMIN" ? "Admin" : "",
      lastName: "",
    };

    if (user.role === "EMPLOYEE") {
      const emp = await Employee.findOne({ userId: user._id });
      if (emp) {
        employeeInfo.firstName = emp.firstName || "";
        employeeInfo.lastName = emp.lastName || "";
      }
    }

    const payload = {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
      firstName: employeeInfo.firstName,
      lastName: employeeInfo.lastName,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      user: payload,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      error: "Login failed",
    });
  }
};


// Get session for employee and admin
// GET /api/auth/session

export const session = async (req, res) => {
  try {
    const session = req.session;
    let firstName = session.firstName || (session.role === "ADMIN" ? "Admin" : "");
    let lastName = session.lastName || "";

    if (!firstName && session.role === "EMPLOYEE") {
      const emp = await Employee.findOne({ userId: session.userId });
      if (emp) {
        firstName = emp.firstName || "";
        lastName = emp.lastName || "";
      }
    }

    return res.json({
      user: {
        ...session,
        firstName,
        lastName,
      },
    });
  } catch (error) {
    return res.json({
      user: req.session,
    });
  }
};

// Change password for employee and admin
// POST /api/auth/change-password
export const changePassword = async (req, res) => {
    try {
        const session = req.session;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "Both passwords are required" });
        }

        const user = await User.findById(session.userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) return res.status(400).json({ error: "Current password is incorrect" });

        const hashed = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(session.userId, { password: hashed });

        return res.json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: "Failed to change password" });
    }
}