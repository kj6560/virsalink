/** @type {SocketIO.Server} */
let _io;
const MAX_CLIENTS = 3000;
console.log('roomservice called');
/** @param {SocketIO.Socket} socket */
function listen(socket) {
    const io = _io;
    const rooms = io.nsps['/'].adapter.rooms;

    socket.on('join', function(room) {

        let numClients = 0;
        if (rooms[room]) {
            numClients = rooms[room].length;
        }
        console.log('number of clients: ' + numClients);
        if (numClients < MAX_CLIENTS) {
            console.log('numClients < MAX_CLIENTS');
            socket.on('ready', function() {

                socket.broadcast.to(room).emit('ready', socket.id);
                console.log('emitted ready to ' + socket.id);
            });
            socket.on('offer', function(id, message) {
                socket.to(id).emit('offer', socket.id, message);
                console.log('emitted offer to ' + socket.id);
            });
            socket.on('answer', function(id, message) {
                socket.to(id).emit('answer', socket.id, message);
            });
            socket.on('candidate', function(id, message) {
                socket.to(id).emit('candidate', socket.id, message);
                console.log('emitted candidate to ' + socket.id);
            });
            socket.on('disconnect', function() {
                socket.broadcast.to(room).emit('bye', socket.id);
            });
            socket.join(room);
            console.log('Number of Clients: ' + numClients);
        } else {
            socket.emit('full', room);
        }
    });
}

/** @param {SocketIO.Server} io */
module.exports = function(io) {
    _io = io;
    return { listen };
};