// taskRoutes.js
const express = require('express');
const router = express.Router();
const { createTask, updateTask, deleteTask,getTask  } = require('../controllers/taskController');
//const taskController = require('../controllers/taskController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { validateTask } = require('../middleware/validationMiddleware');

// Create a new task
router.post('/',authenticateUser,createTask);

// Update a tas.
router.put('/:id',updateTask);

// Delete a task
router.delete('/:id',deleteTask);

// Get tasks with pagination and sorting
router.get('/', authenticateUser, async (req, res) => {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
  
      const tasks = await getTasks(req.user._id, parseInt(page), parseInt(limit), sortOptions);
      res.status(200).json(tasks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
module.exports = router;
