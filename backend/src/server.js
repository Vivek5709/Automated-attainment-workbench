require("dotenv").config();

const express = require("express");
const prisma = require("./config/prisma");

const teacherRoutes = require("./routes/teacher.routes");
const courseOutcomeRoutes = require("./routes/courseOutcome.routes");
const subjectRoutes = require("./routes/subject.routes");
const departmentRoutes = require("./routes/department.routes");
const programOutcomeRoutes = require("./routes/programOutcome.routes");
const programSpecificOutcomeRoutes = require("./routes/programSpecificOutcome.routes");
const coPoMappingRoutes = require("./routes/coPoMapping.routes");
const studentMarkRoutes = require("./routes/studentMark.routes");
const attainmentRoutes = require("./routes/attainment.routes");
const authRoutes = require("./routes/auth.routes");

const errorHandler = require("./middleware/errorHandler");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/course-outcomes", courseOutcomeRoutes);
app.use("/api/program-outcomes", programOutcomeRoutes);
app.use("/api/program-specific-outcomes", programSpecificOutcomeRoutes);
app.use("/api/co-po-mappings", coPoMappingRoutes);
app.use("/api/student-marks", studentMarkRoutes);
app.use("/api/attainment", attainmentRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({
            success: true,
            message: "CO-PO Backend is running",
            database: "connected"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});

// ─── Centralized Error Handler (must be last) ─────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});