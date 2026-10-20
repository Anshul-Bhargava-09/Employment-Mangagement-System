import "dotenv/config";
import connectDB from "./src/config/databs.js";
import User from "./src/models/User.js";
import bcrypt from "bcrypt";

const TemporaryPassword = "admin123";

async function registerAdmin() {
    try {
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

        if (!ADMIN_EMAIL) {
            console.error("Missing ADMIN_EMAIL env variable");
            process.exit(1);
        }

        await connectDB();

        const existingAdmin = await User.findOne({
            email: ADMIN_EMAIL
        });

        if (existingAdmin) {
            console.log(
                "User already exists as role",
                existingAdmin.role
            );
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(
            TemporaryPassword,
            10
        );

        const admin = await User.create({
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: "ADMIN"
        });

        console.log("Admin user created");
        console.log("Email:", admin.email);
        console.log("Password:", TemporaryPassword);
        console.log("Change the password after login.");

        process.exit(0);

    } catch (error) {
        console.error("Seed failed:", error);
        process.exit(1);
    }
}

registerAdmin();