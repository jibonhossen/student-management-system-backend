import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import healthCheckRoutes from "./routes/healthcheck.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // for parsing application/json

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the server!" });
});

app.use("/api/healthcheck", healthCheckRoutes);

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port} url: http://localhost:${port}`);
    });
}).catch((error) => {
    console.error(error);
    process.exit(1);
});