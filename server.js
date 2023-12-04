const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });
const marked = require('marked');

// const io = socketIO(server);
var cors = require('cors');


// Express setup
app.use(express.static('client/build'));
app.use(cors());

//for CORS
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});



// Socket.io setup
io.on('connection', (socket) => {
  console.log('User connected');

  // Handle markdown changes
  socket.on('markdown', (data) => {
    // Convert markdown to HTML
    const html = marked(data);

    // Broadcast HTML to all clients
    io.emit('html', html);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3001;
//connect to server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});