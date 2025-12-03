const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow your frontend to connect

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // In production, set your frontend URL
    methods: ['GET', 'POST']
  }
});

const waitingUsers = []; // Users waiting for random chat
const pairedUsers = new Map(); // socket.id -> partner socket

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle finding a random partner
  socket.on('find_random', () => {
    if (waitingUsers.length > 0) {
      const partnerSocket = waitingUsers.shift();
      pairedUsers.set(socket.id, partnerSocket);
      pairedUsers.set(partnerSocket.id, socket);

      socket.emit('system_message', 'You are now connected to a random user!');
      partnerSocket.emit('system_message', 'You are now connected to a random user!');
    } else {
      waitingUsers.push(socket);
      socket.emit('system_message', 'Waiting for a random user...');
    }
  });

  // Handle sending messages
  socket.on('send_message', (message) => {
    const partner = pairedUsers.get(socket.id);
    if (partner) {
      partner.emit('receive_message', message);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    // Remove from waiting queue
    const index = waitingUsers.indexOf(socket);
    if (index !== -1) waitingUsers.splice(index, 1);

    // Notify partner
    const partner = pairedUsers.get(socket.id);
    if (partner) {
      partner.emit('system_message', 'Your partner disconnected.');
      pairedUsers.delete(partner.id);
    }

    pairedUsers.delete(socket.id);
  });
});

server.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
