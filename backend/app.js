const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const subjectRoutes = require("./routes/subjectRoutes");

const app = express();

/*  CORS CONFIG  */

const normalizeOrigin = (value) => (value ? value.replace(/\/$/, "") : "");

const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173"]
  .filter(Boolean)
  .map(normalizeOrigin);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests like Postman, curl (no origin)
      if (!origin) return callback(null, true);

      const normalizedOrigin = normalizeOrigin(origin);

      if (
        allowedOrigins.includes(normalizedOrigin) ||
        (normalizedOrigin && normalizedOrigin.includes("vercel.app"))
      ) {
        return callback(null, true);
      }

      console.error("CORS blocked:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }),
);

/*  MIDDLEWARE  */

app.use(express.json());

/*  ROUTES  */

// Health check (important for Render + uptime monitor)
app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/resources", resourceRoutes);

/*  404 HANDLER  */

app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.originalUrl}`,
  });
});

/*  ERROR HANDLER  */

app.use((error, _req, res, _next) => {
  console.error("Error:", error.message);

  // Mongo duplicate key error
  if (error?.code === 11000) {
    return res.status(409).json({
      message: "Duplicate entry already exists.",
    });
  }

  res.status(error.statusCode || 500).json({
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
