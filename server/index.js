const http = require('http');

const server = http.createServer();

const io = require('socket.io')(server, {
    cors: { origin: '*' }
});

let usersOnline = [];
let usersInGame = [];


io.on('connection', (socket) => {

    console.log('Se ha conectado un cliente');

    if (!usersOnline.includes(socket.id)) {
        usersOnline.push(socket.id);
    }

    io.emit('usersOnline', usersOnline);
    io.emit('usersInGame', usersInGame);

    socket.on('join', (room) => {
        socket.join(room);
    });

    socket.on('switch', (data) => {
        const { prevRoom, nextRoom } = data;

        if (prevRoom) socket.leave(prevRoom);
        if (nextRoom) socket.join(nextRoom);

        if (nextRoom === 'Game') {

            if (!usersInGame.includes(socket.id)) {
                usersInGame.push(socket.id);
            }
        };

        if (prevRoom === 'Game') {

            usersInGame = usersInGame.filter((item) => item !== socket.id);
        };

        io.emit('usersInGame', usersInGame);

    });

    socket.on('disconnect', function () {

        usersInGame = usersInGame.filter((item) => item !== socket.id);
        usersOnline = usersOnline.filter((item) => item !== socket.id);

        io.emit('usersOnline', usersOnline);
        io.emit('usersInGame', usersInGame);

    });

    socket.broadcast.emit('chatMessage', {
        usuario: 'INFO',
        mensaje: `Se ha conectado el usuario ${socket.id}`
    });

    socket.on('usersOnline', (data) => {
        io.emit('usersOnline', usersOnline);
    });

    socket.on('usersInGame', (data) => {
        io.emit('usersInGame', usersInGame);
    });

    socket.on('chatMessage', (data) => {
        io.emit('chatMessage', data);
    });
});

server.listen(3000, () => {
    console.log("Servidor en el puerto:", 3000)
});