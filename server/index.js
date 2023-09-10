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
    console.log(usersOnline);
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

            console.log(usersInGame);
        };
        if (prevRoom == 'Game') {
            usersInGame = usersInGame.filter((item) => item !== socket.id);
            console.log(usersInGame);

        };
        io.emit('usersInGame', usersInGame);
        console.log("El socket " + socket.id + " se ha cambiado de la sala" + prevRoom + " a la " + nextRoom);

    });

    socket.on('disconnect', function () {
        usersInGame = usersInGame.filter((item) => item !== socket.id);
        console.log(usersInGame);
        console.log("Se ha desconectado un cliente");
        usersOnline = usersOnline.filter((item) => item !== socket.id);
        io.emit('usersOnline', usersOnline);
        io.emit('usersInGame', usersInGame);

    });

    socket.broadcast.emit('chat_message', {
        usuario: 'INFO',
        mensaje: 'Se ha conectado un nuevo usuario'
    });

    socket.broadcast.emit('usersOnline', usersOnline);
    socket.broadcast.emit('usersInGame', usersInGame);

    socket.on('usersOnline', (data) => {
        io.emit('usersOnline', usersOnline);
    });

    socket.on('usersInGame', (data) => {
        io.emit('usersInGame', usersInGame);
    });

    socket.on('chat_message', (data) => {
        io.emit('chat_message', data);
    });
});

server.listen(3000);