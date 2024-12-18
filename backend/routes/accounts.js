const express = require('express');
const axios = require('axios');
const Employee = require('../models/Employee');
const Platform = require('../models/Platform');

const router = express.Router();

// Add Employee to GitHub Repository
router.post('/:employeeId/platform/GitHub/add', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { repoOwner, repoName } = req.body;

    // 1. Input Validation
    if (!repoOwner || !repoName) {
      return res.status(400).json({ message: 'Repository owner and name are required.' });
    }

    // 2. Fetch Employee Details
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    // 3. Fetch GitHub Platform Configuration
    const platform = await Platform.findOne({ name: 'GitHub' });
    if (!platform || !platform.credentials || !platform.credentials.apiKey) {
      return res.status(404).json({ message: 'GitHub integration not properly configured.' });
    }

    // 4. Extract Employee's GitHub Account
    const githubAccount = employee.platforms.find(p => p.platformName === 'GitHub');
    if (!githubAccount || !githubAccount.accountId) {
      return res.status(404).json({ message: 'GitHub account not linked to this employee.' });
    }
    const accountId = githubAccount.accountId; // Use the GitHub username for API calls

    // 5. Construct GitHub API URL
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/collaborators/${accountId}`;

    // 6. Call GitHub API to Add Collaborator
    try {
      const response = await axios.put(
        apiUrl,
        {}, // Empty body
        {
          headers: {
            Authorization: `Bearer ${platform.credentials.apiKey}`,
          },
        }
      );

      // 7. Success Response
      return res.status(200).json({
        message: `Employee ${accountId} added as collaborator to ${repoName}`,
        githubResponse: response.data,
      });
    } catch (error) {
      // GitHub API Error Handling
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          return res.status(404).json({ message: `GitHub account '${accountId}' not found.` });
        } else if (status === 403) {
          return res.status(403).json({ message: 'Invalid GitHub token or insufficient permissions.' });
        }
      }
      throw error; // If unknown error, let it propagate
    }
  } catch (error) {
    // General Error Handling
    console.error(error);
    return res.status(500).json({ message: 'Error adding collaborator', error: error.message });
  }
});

// Remove Employee from GitHub Repository
router.delete('/:employeeId/platform/GitHub/remove', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { repoOwner, repoName } = req.body;

    // 1. Input Validation
    if (!repoOwner || !repoName) {
      return res.status(400).json({ message: 'Repository owner and name are required.' });
    }

    // 2. Fetch Employee Details
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    // 3. Fetch GitHub Platform Configuration
    const platform = await Platform.findOne({ name: 'GitHub' });
    if (!platform || !platform.credentials || !platform.credentials.apiKey) {
      return res.status(404).json({ message: 'GitHub integration not properly configured.' });
    }

    // 4. Extract Employee's GitHub Account
    const githubAccount = employee.platforms.find(p => p.platformName === 'GitHub');
    if (!githubAccount || !githubAccount.accountId) {
      return res.status(404).json({ message: 'GitHub account not linked to this employee.' });
    }
    const accountId = githubAccount.accountId; // Use the GitHub username for API calls

    // 5. Construct GitHub API URL
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/collaborators/${accountId}`;

    // 6. Call GitHub API to Remove Collaborator
    try {
      await axios.delete(apiUrl, {
        headers: {
          Authorization: `Bearer ${platform.credentials.apiKey}`,
        },
      });

      // 7. Success Response
      return res.status(200).json({
        message: `Employee ${accountId} removed from ${repoName}`,
      });
    } catch (error) {
      // GitHub API Error Handling
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          return res.status(404).json({ message: `GitHub account '${accountId}' not found.` });
        } else if (status === 403) {
          return res.status(403).json({ message: 'Invalid GitHub token or insufficient permissions.' });
        }
      }
      throw error;
    }
  } catch (error) {
    // General Error Handling
    console.error(error);
    return res.status(500).json({ message: 'Error removing collaborator', error: error.message });
  }
});

module.exports = router;
