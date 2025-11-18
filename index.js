import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import cookieParser from "cookie-parser";




dotenv.config();


const app = express();
app.use(cookieParser());
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the server! Hello" });
});


import healthCheckRoutes from "./routes/healthcheck.routes.js";
app.use("/api/v1/healthcheck", healthCheckRoutes);

import authRoutes from "./routes/auth.routes.js";
app.use("/api/v1/auth", authRoutes
);

import mobileversionRoutes from "./routes/post-management.routes.js";
app.use("/api/v1/sms/post", mobileversionRoutes);

import getversionRoutes from "./routes/get-management.routes.js";
app.use("/api/v1/sms/get", getversionRoutes);

import mobileRoutes from "./routes/auth.mobile.routes.js";
app.use("/api/v1/mobile", mobileRoutes);

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port} url: http://localhost:${port}`);
    });
}).catch((error) => {
    console.error(error);
    process.exit(1);
});

