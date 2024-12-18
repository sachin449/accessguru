import express from 'express';
import axios from 'axios'; // For GitHub account validation
import Employee from '../models/Employee.js';

const router = express.Router();

// Create a new employee with GitHub account validation
router.post('/', async (req, res) => {
  try {
    const { name, email, platforms } = req.body;

    // 1. Validate platforms array
    if (!Array.isArray(platforms)) {
      return res.status(400).json({ message: 'Platforms must be an array.' });
    }

    // 2. Validate each platform and check for GitHub accounts
    const validatedPlatforms = [];
    for (const platform of platforms) {
      if (!platform.platformName || !platform.accountId) {
        return res
          .status(400)
          .json({ message: 'Each platform must include platformName and accountId.' });
      }

      if (platform.platformName === 'GitHub') {
        // Call GitHub API to validate accountId (username)
        const githubApiUrl = `https://api.github.com/users/${platform.accountId}`;
        try {
          await axios.get(githubApiUrl);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            return res.status(404).json({
              message: `GitHub account '${platform.accountId}' does not exist.`,
            });
          }
          return res.status(500).json({
            message: 'Error validating GitHub account.',
            error: error.message,
          });
        }
      }

      validatedPlatforms.push({
        platformName: platform.platformName,
        accountId: platform.accountId,
        status: platform.status || 'active',
      });
    }

    // 3. Save the new employee with validated platforms
    const employee = new Employee({ name, email, platforms: validatedPlatforms });
    await employee.save();

    res.status(201).json({ message: 'Employee added successfully.', employee });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();

    // Convert ObjectIds to strings
    const formattedEmployees = employees.map((employee) => {
      const formattedEmployee = employee.toObject();
      formattedEmployee._id = formattedEmployee._id.toString();

      // Format platform IDs as well
      if (formattedEmployee.platforms) {
        formattedEmployee.platforms = formattedEmployee.platforms.map((platform) => {
          platform._id = platform._id.toString();
          return platform;
        });
      }

      return formattedEmployee;
    });

    res.status(200).json(formattedEmployees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an employee
router.put('/:id', async (req, res) => {
  try {
    const { name, email, platforms } = req.body;

    // Validate platforms array
    const validatedPlatforms = platforms.map((platform) => {
      if (!platform.platformName || !platform.accountId) {
        throw new Error('Each platform must include platformName and accountId.');
      }
      return {
        platformName: platform.platformName,
        accountId: platform.accountId,
        status: platform.status || 'active',
      };
    });

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, email, platforms: validatedPlatforms },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    res.status(200).json({ message: 'Employee updated successfully.', employee });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an employee (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    employee.deletedAt = new Date();
    employee.status = 'deleted';
    await employee.save();

    res.status(200).json({ message: 'Employee marked as deleted.', employee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
