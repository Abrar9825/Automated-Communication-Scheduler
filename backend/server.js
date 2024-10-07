import express from 'express';
import dotenv from 'dotenv';
import Connect_db from './config/db.js';
import TaskRoutes from './router/schedule.router.js';
import cors from 'cors';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/schedules', TaskRoutes);
const __dirname = path.resolve(); // Correctly resolve the directory name

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "frontend", "dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html")); // Correctly resolve the file path
    });
}

// Start the server
app.listen(PORT, () => {
    Connect_db();
    console.log(`Server started on port http://localhost:${PORT}`);
});
