import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./db/bbConection.js";

dotenv.config();
const app = express();
// cors configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));

// Routes
import healthCheckRoutes from "./routes/healthCheck.routes.js";
import authRoutes from "./routes/auth.routes.js";

app.use("/api/v1/healthcheck", healthCheckRoutes);
app.use("/api/v1/auth", authRoutes);



const port = process.env.PORT || 3000;
connectDB()
.then(() => {
    app.listen(port, () => {
        console.log(`✅Server is running on port ${port}`);
    })
})
.catch((error) => {
    console.error("❌Failed to connect to MongoDB:", error);
    process.exit(1); // Exit the process with failure
});
// basic configuration





export default app;