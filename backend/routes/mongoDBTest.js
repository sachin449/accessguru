import express from 'express';
import axios from 'axios';

const router = express.Router();

const CREDENTIALS = {
    PROJECT_ID: '66a34e211a8d9b31f43b13a5',
    PUBLIC_KEY: 'xzobpiqn',
    PRIVATE_KEY: '3342db9e-c521-4035-9371-e9d263897f3a'
};


router.get('/test-connection', async (req, res) => {
    try {
        console.log('Attempting connection with:', {
            projectId: CREDENTIALS.PROJECT_ID,
            publicKey: CREDENTIALS.PUBLIC_KEY
        });

        const response = await axios({
            method: 'GET',
            url: `https://cloud.mongodb.com/api/atlas/v1.0/groups/${CREDENTIALS.PROJECT_ID}/clusters`,
            auth: {
                username: CREDENTIALS.PUBLIC_KEY,
                password: CREDENTIALS.PRIVATE_KEY
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });

        res.json({
            success: true,
            message: 'Successfully connected to MongoDB Atlas',
            data: response.data
        });

    } catch (error) {
        console.error('Connection Test Error:', {
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url
        });

        res.status(error.response?.status || 500).json({
            success: false,
            message: 'Connection test failed',
            error: error.response?.data || error.message
        });
    }
});


router.get('/database-users', async (req, res) => {
    try {
        const response = await axios({
            method: 'GET',
            url: `https://cloud.mongodb.com/api/atlas/v1.0/groups/${CREDENTIALS.PROJECT_ID}/databaseUsers`,
            auth: {
                username: CREDENTIALS.PUBLIC_KEY,
                password: CREDENTIALS.PRIVATE_KEY
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });

        res.json({
            success: true,
            message: 'Successfully retrieved database users',
            users: response.data
        });

    } catch (error) {
        res.status(error.response?.status || 500).json({
            success: false,
            message: 'Failed to retrieve database users',
            error: error.response?.data || error.message
        });
    }
});


router.patch('/update-password', async (req, res) => {
    try {
        const { username, newPassword } = req.body;
        if (!username || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Username and new password are required'
            });
        }

        const response = await axios({
            method: 'PATCH',
            url: `https://cloud.mongodb.com/api/atlas/v1.0/groups/${CREDENTIALS.PROJECT_ID}/databaseUsers/${username}`,
            auth: {
                username: CREDENTIALS.PUBLIC_KEY,
                password: CREDENTIALS.PRIVATE_KEY
            },
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                password: newPassword
            }
        });

        res.json({
            success: true,
            message: 'Password updated successfully',
            username
        });

    } catch (error) {
        console.error('Password Update Error:', {
            status: error.response?.status,
            data: error.response?.data
        });

        res.status(error.response?.status || 500).json({
            success: false,
            message: 'Failed to update password',
            error: error.response?.data || error.message
        });
    }
});

export default router;