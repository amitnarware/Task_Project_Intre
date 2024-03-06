const Task = require('../models/task');
const mongoose = require('mongoose');

                 //// get task
async function getTasks(userId, page, limit, sortOptions) {
  const tasks = await Task.find({ userId })
    .sort(sortOptions)
    .limit(limit)
    .skip((page - 1) * limit)
    .exec();

  const totalTasks = await Task.countDocuments({ userId });
  const totalPages = Math.ceil(totalTasks / limit);

  return {
    tasks,
    totalPages,
    currentPage: page
  };
}

             ///  Crete task
async function createTask(req, res){
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { title, description, dueDate } = req.body;
    const task = new Task({ title, description, dueDate, userId: req.user._id });
    await task.save({ session });

    // Emit newTask event to all connected clients
    io.emit('newTask', task);
    res.status(201).json({ message: 'Task created successfully', task });
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
}

          //  Update task
async function updateTask(req, res){
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { title, description, dueDate, completed } = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, { title, description, dueDate, completed }, { new: true, session });

    // Emit updateTask event to all connected clients
    io.emit('updateTask', task);

    res.status(200).json({ message: 'Task updated successfully', task });
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
}

async function deleteTask(req, res){
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await Task.findByIdAndDelete(req.params.id, { session });
    res.status(200).json({ message: 'Task deleted successfully' });
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
}

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};

