import { Octokit } from '@octokit/rest';
import express from 'express';
import Platform from '../models/Platform.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(verifyToken);

// Add Collaborator
router.post('/add-collaborator', async (req, res) => {
  try {
    const { accountId, repoOwner, repoName, token } = req.body;

    if (!accountId || !repoOwner || !repoName || !token) {
      return res.status(400).json({ message: 'GitHub username, repository owner, repository name, and token are required.' });
    }

    const octokit = new Octokit({ auth: token });

    await octokit.rest.repos.addCollaborator({
      owner: repoOwner,
      repo: repoName,
      username: accountId,
      permission: 'push', 
    });

    res.status(200).json({ message: `GitHub user ${accountId} added to ${repoName}.` });
  } catch (error) {
    console.error(error);
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Error adding collaborator.' });
  }
});

router.delete('/remove-collaborator', async (req, res) => {
  try {
    const { accountId, repoOwner, repoName, token } = req.body;

    if (!accountId || !repoOwner || !repoName || !token) {
      return res.status(400).json({ message: 'GitHub username, repository owner, repository name, and token are required.' });
    }

    const octokit = new Octokit({ auth: token });

    await octokit.rest.repos.removeCollaborator({
      owner: repoOwner,
      repo: repoName,
      username: accountId,
    });

    res.status(200).json({ message: `GitHub user ${accountId} removed from ${repoName}.` });
  } catch (error) {
    console.error(error);
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'Error removing collaborator.' });
  }
});

export default router;