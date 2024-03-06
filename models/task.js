// task.js
const mongoose = require('mongoose');
const db = require("../config/db")

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  completed: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
