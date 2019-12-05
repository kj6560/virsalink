const credentials = require('./credentials');
const express = require('express');
var redis = require("redis");
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var bodyParser = require('body-parser');
var client = redis.createClient();
const app = express();
var mysql = require('mysql');
var conn = mysql.createConnection({
    host: "192.168.168.244",
    user: "rem",
    password: "admin123",
    database: "virsalink"
});

let server;
let port;
if (credentials.key && credentials.cert) {
    const https = require('https');
    server = https.createServer(credentials, app);
    port = 8080;
} else {
    const http = require('http');
    server = http.createServer(app);
    port = 3000;
}
const io = require('socket.io')(server);
const RoomService = require('./RoomService')(io);
io.sockets.on('connection', RoomService.listen);

io.sockets.on('error', e => console.log(e));
app.use(express.static(__dirname + '/public'));
app.get('*', function(req, res) {

    res.sendFile(`${__dirname}/public/index.html`);

    //res.sendFile(`${__dirname}/public/index.html`);

});
server.on('close', function() {
    console.log(' Stopping ...');
});

process.on('SIGINT', function() {
    server.close();
});
server.listen(port, () => console.log(`Server is running on port ${port}`));