const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const employeeRoutes = require('./routes/employeeRoutes');
const platformRoutes = require('./routes/platforms'); 
const accountRoutes = require('./routes/accounts'); 

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/platforms', platformRoutes); 
app.use('/api/accounts', accountRoutes);  

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
