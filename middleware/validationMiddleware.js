// validationMiddleware.js
exports.validateTask = (req, res, next) => {
  const { title, description, dueDate } = req.body;
  if (!title || !description || !dueDate) {
    return res.status(400).json({ error: 'Title, description, and due date are required fields' });
  }
  next();
};
