import express from 'express';
import axios from 'axios';
import Employee from '../models/Employee.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(verifyToken);

// Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    
    const formattedEmployees = employees.map((employee) => {
      const formattedEmployee = employee.toObject();
      formattedEmployee._id = formattedEmployee._id.toString();

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

// Create new employee
router.post('/', async (req, res) => {
  try {
    const { name, email, platforms } = req.body;

    if (!Array.isArray(platforms)) {
      return res.status(400).json({ message: 'Platforms must be an array.' });
    }

    const validatedPlatforms = [];
    for (const platform of platforms) {
      if (!platform.platformName || !platform.accountId) {
        return res
          .status(400)
          .json({ message: 'Each platform must include platformName and accountId.' });
      }

      if (platform.platformName === 'GitHub') {
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

    const employee = new Employee({
      name,
      email,
      platforms: validatedPlatforms
    });
    await employee.save();

    res.status(201).json({ message: 'Employee added successfully.', employee });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update employee
router.put('/:id', async (req, res) => {
  try {
    const { name, email, platforms } = req.body;

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
      {
        name,
        email,
        platforms: validatedPlatforms
      },
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

// Delete employee
router.delete('/:id', async (req, res) => {
  try {
    const result = await Employee.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    res.status(200).json({ message: 'Employee deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;