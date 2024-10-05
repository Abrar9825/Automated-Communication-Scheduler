import express from 'express'
import dotenv from 'dotenv'
import Connect_db from './config/db.js';
import TaskRoutes from './router/schedule.router.js'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

// middle Ware Without it String Can't Parse it allow to get data usig req.body
app.use(express.json())

// routes
app.use('/api/schedules', TaskRoutes);


// ports
app.listen(PORT, () => {
    Connect_db()
    console.log(`Server started on ${PORT}`);
});