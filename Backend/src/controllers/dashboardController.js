
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import LeaveApplication from "../models/LeaveApplication.js";
import Payslip from "../models/Payslips.js";

// Get dashboard for employee and admin
// GET /api/dashboard
export const getDashboard = async (req, res) => {
    try {
        const session = req.session;

        if (!session) {
            return res.status(401).json({
                error: "Unauthorized"
            });
        }

        if (session.role === "ADMIN") {
            const today = new Date();
            const startOfDay = new Date(today);
            startOfDay.setHours(0, 0, 0, 0);

            const startOfTomorrow = new Date(startOfDay);
            startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

            const [
                totalEmployees,
                todayAttendance,
                pendingLeaves
            ] = await Promise.all([
                Employee.countDocuments({
                    isDeleted: { $ne: true }
                }),

                Attendance.countDocuments({
                    date: {
                        $gte: startOfDay,
                        $lt: startOfTomorrow
                    }
                }),

                LeaveApplication.countDocuments({
                    status: "PENDING"
                })
            ]);

            return res.json({
                role: "ADMIN",
                totalEmployees,
                totalDepartments: DEPARTMENTS.length,
                todayAttendance,
                pendingLeaves
            });
        } else {
            const employee = await Employee.findOne({
                userId: session.userId
            }).lean();

            if (!employee) {
                return res.status(404).json({
                    error: "Employee not found"
                });
            }

            const today = new Date();

            const startOfMonth = new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            );

            const startOfNextMonth = new Date(
                today.getFullYear(),
                today.getMonth() + 1,
                1
            );

            const [
                currentMonthAttendance,
                pendingLeaves,
                latestPayslip
            ] = await Promise.all([
                Attendance.countDocuments({
                    employeeId: employee._id,
                    date: {
                        $gte: startOfMonth,
                        $lt: startOfNextMonth
                    }
                }),

                LeaveApplication.countDocuments({
                    employeeId: employee._id,
                    status: "PENDING"
                }),

                Payslip.findOne({
                    employeeId: employee._id
                })
                    .sort({ createdAt: -1 })
                    .lean()
            ]);

            return res.json({
                role: "EMPLOYEE",
                employee: {
                    ...employee,
                    id: employee._id.toString()
                },
                currentMonthAttendance,
                pendingLeaves,
                latestPayslip: latestPayslip
                    ? {
                        ...latestPayslip,
                        id: latestPayslip._id.toString()
                    }
                    : null
            });
        }
    } catch (error) {
        console.error("Dashboard error:", error);

        return res.status(500).json({
            error: "Failed"
        });
    }
};
