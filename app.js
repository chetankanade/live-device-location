const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
// const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// app.use(cors());
// Set EJS as the view engine
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));



// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('send-location', (data) => {

        io.emit('receive-location', { id: socket.id, ...data });
    });

    socket.on('disconnect', () => {
        io.emit('user-disconnected', socket.id);
    });
});

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
