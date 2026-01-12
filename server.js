const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join Room
    socket.on('join_room', (roomName) => {
        socket.join(roomName);
        console.log(`${socket.id} joined room: ${roomName}`);
    });

    // Send Message
    socket.on('send_message', (data) => {
        // data: { room, message, sender, msgId }
        // Print the message to the terminal:
        console.log(`[MESSAGE] Room: ${data.room} | Sender: ${data.sender} | Content: ${data.message}`);
        // Then broadcast it to the room:
        io.to(data.room).emit('receive_message', data);
    });

    // Typing Status
    socket.on('typing', (data) => {
        // Broadcast "typing" status to everyone in the room except the sender
        socket.to(data.room).emit('display_typing', data);
    });

    // Read Receipt
    socket.on('message_read', (data) => {
        // Notify the sender that the message has been read
        socket.to(data.room).emit('update_read_status', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});