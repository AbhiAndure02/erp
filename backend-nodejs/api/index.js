import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import env from "dotenv";

// Import your routes
import authRoutes from "./routes/auth.routes.js";
import registerAuth from "./routes/register.routes.js";
import projectRoutes from "./routes/project.route.js";
import activityRoutes from "./routes/activity.routes.js";
import eventRoutes from "./routes/event.routes.js";
import finaceRoutes from "./routes/finace.routes.js";

// Load environment variables
env.config();

// Get the current directory path (fix for __dirname in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the frontend dist folder
app.use(express.static(path.join(__dirname, 'dist')));

const PORT = process.env.PORT || 3000;

// Connect to MongoDB before starting the server
mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
    
    // Start server only after DB connection is established
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
    process.exit(1);
  });

// API Routes (must come first)
app.get('/', (req, res) => {
  res.send("Hello World");
});

// Your API routes
app.use('/api/auth', authRoutes);
app.use('/api/registers', registerAuth);
app.use('/api/project', projectRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/finance', finaceRoutes);

// Error handler middleware (should be after all other middleware/routes)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  res.status(statusCode).json({ 
    success: false,
    statusCode,
    message
  });
});
