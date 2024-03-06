// index.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const db = require("./config/db")
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const logRequest = require("./utils/logger");
const Task = require('./models/task');
const User = require("./models/task")

require('dotenv').config();


const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3000;


// Middleware
app.use(express.json());
app.use(logRequest);

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);



 

// Socket.io implementation
io.on('connection', (socket) => {
  console.log('A user connected');

  // Notify users when a new task is assigned
  socket.on('newTask', (task) => {
    socket.broadcast.emit('newTask', task);
  });

  // Notify users when an existing task is updated
  socket.on('updateTask', (task) => {
    socket.broadcast.emit('updateTask', task);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
