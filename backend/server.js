import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import employeeRoutes from './routes/employeeRoutes.js';
import platformRoutes from './routes/platforms.js';
import accountRoutes from './routes/accounts.js'; 
import mongoDBAccountRoutes from './routes/mongoDBAccounts.js';
import mongoDBTestRoutes from './routes/mongoDBTest.js';



dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());


connectDB();

app.use('/api/employees', employeeRoutes);
app.use('/api/platforms', platformRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/mongodb', mongoDBAccountRoutes);
app.use('/api/mongodb-test', mongoDBTestRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
