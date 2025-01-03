import express from 'express';
import Platform from '../models/Platform.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();


router.use(verifyToken);

router.post('/', async (req, res) => {
  try {
    const { name, apiEndpoint, authMethod, credentials } = req.body;
    const platform = new Platform({ name, apiEndpoint, authMethod, credentials });
    await platform.save();
    res.status(201).json(platform);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const platforms = await Platform.find();
    res.status(200).json(platforms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Platform.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Platform deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;