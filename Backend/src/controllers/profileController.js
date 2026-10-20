import Employee from "../models/Employee.js";

// Get profile
// GET /api/profile
export const getProfile = async (req, res) => {
    try {
        const session = req.session;
        const employee = await Employee.findOne({userId: session.userId})

        if(!employee) {
            // Authenticated user is not an employee - return admin profile
            return res.json({
                firstName: "Admin",
                lastName: "",
                email: session.email,
            })
        }
        return res.json(employee)
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch profile" });
    }
}

// Update profile
// PUT /api/profile
export const updateProfile = async (req, res) => {
    try {
        const session = req.session;
        const employee = await Employee.findOne({userId: session.userId});
        if(!employee) {
            // Admin profile update
            return res.json({ success: true, message: "Profile updated" });
        }
        if (employee.isDeleted){
            return res.status(403).json({error: "Your account is deactivated. You cannot update your profile."});
        }
        
        const updates = {};
        if (req.body.bio !== undefined) updates.bio = req.body.bio;
        if (req.body.phone !== undefined) updates.phone = req.body.phone;

        await Employee.findByIdAndUpdate(employee._id, updates);
        return res.json({ success: true, message: "Profile updated successfully" });
     } catch (error) {
        return res.status(500).json({ error: "Failed to update profile" });
    }
}