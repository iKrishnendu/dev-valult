const cors = require("cors");
const express = require("express");

const categoryRoutes = require("./routes/categoryRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const subjectRoutes = require("./routes/subjectRoutes");

const app = express();

const normalizeOrigin = (value) => (value ? value.replace(/\/$/, "") : "");
const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173"]
  .filter(Boolean)
  .map(normalizeOrigin);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const normalizedOrigin = normalizeOrigin(origin);

      if (
        allowedOrigins.includes(normalizedOrigin) ||
        normalizedOrigin.includes("vercel.app") // allow preview deployments
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/subjects", subjectRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/resources", resourceRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

app.use((error, _req, res, _next) => {
  if (error?.code === 11000) {
    return res
      .status(409)
      .json({ message: "A record with that name already exists." });
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error.";

  return res.status(statusCode).json({ message });
});

module.exports = app;
