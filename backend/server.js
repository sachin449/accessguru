import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { initializeAdmin } from './controllers/auth.js';
import { connectDB } from './config/db.js';
import employeeRoutes from './routes/employeeRoutes.js';
import platformRoutes from './routes/platforms.js';
import accountRoutes from './routes/accounts.js'; 
import authRoutes from './routes/auth.js';  // Add this line

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

connectDB();
await initializeAdmin();
// Auth routes should come before protected routes
app.use('/api/auth', authRoutes);  // Add this line

// Protected routes
app.use('/api/employees', employeeRoutes);
app.use('/api/platforms', platformRoutes);
app.use('/api/accounts', accountRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));