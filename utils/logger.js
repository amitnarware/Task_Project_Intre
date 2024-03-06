// logger.js
const fs = require('fs');

function logRequest(req, res, next) {
  const logMessage = `${new Date().toISOString()} - ${req.method} ${req.originalUrl}`;
  fs.appendFile('request.log', logMessage + '\n', (err) => {
    if (err) {
      console.error('Error logging request:', err);
    }
  });
  next();
}

module.exports = logRequest;
