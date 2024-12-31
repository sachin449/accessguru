// routes/mongoDBAccounts.js
import express from 'express';
import axios from 'axios';
import Platform from '../models/Platform.js';

const router = express.Router();

router.patch('/change-password', async (req, res) => {
    try {
        const { username, newPassword, projectId } = req.body;

        
        const mongoDBPlatform = await Platform.findOne({ name: 'MongoDB' });
        if (!mongoDBPlatform) {
            return res.status(404).json({ message: 'MongoDB platform credentials not found.' });
        }

        const { apiKey, publicKey } = mongoDBPlatform.credentials;

        
        const response = await axios({
            method: 'PATCH',
            url: `https://cloud.mongodb.com/api/atlas/v2/groups/${projectId}/databaseUsers/admin/${username}`,
            auth: {
                username: publicKey,
                password: apiKey
            },
            data: {
                password: newPassword
            }
        });

        res.status(200).json({ 
            message: `Password updated successfully for user ${username}`,
            status: 'success'
        });

    } catch (error) {
        console.error('MongoDB password change error:', error.response?.data || error);
        
        const errorMessage = error.response?.data?.error || error.message;
        const statusCode = error.response?.status || 500;

        res.status(statusCode).json({ 
            message: 'Failed to update MongoDB password',
            error: errorMessage,
            status: 'error'
        });
    }
});


router.post('/validate-user', async (req, res) => {
    try {
        const { username, projectId } = req.body;

        
        const mongoDBPlatform = await Platform.findOne({ name: 'MongoDB' });
        if (!mongoDBPlatform) {
            return res.status(404).json({ message: 'MongoDB platform credentials not found.' });
        }

        const { apiKey, publicKey } = mongoDBPlatform.credentials;

        
        const response = await axios({
            method: 'GET',
            url: `https://cloud.mongodb.com/api/atlas/v2/groups/${projectId}/databaseUsers/admin/${username}`,
            auth: {
                username: publicKey,
                password: apiKey
            }
        });

        res.status(200).json({ 
            message: 'MongoDB user exists',
            user: response.data,
            status: 'success'
        });

    } catch (error) {
        if (error.response?.status === 404) {
            return res.status(404).json({ 
                message: `MongoDB user ${req.body.username} not found`,
                status: 'error'
            });
        }

        res.status(500).json({ 
            message: 'Error validating MongoDB user',
            error: error.response?.data || error.message,
            status: 'error'
        });
    }
});

export default router;