 const fs = require('fs');
 module.exports = {
     key: fs.readFileSync('./key.pem', 'utf8'),
     cert: fs.readFileSync('./server.crt', 'utf8')
         // key: fs.readFileSync('privkey.pem', 'utf8'),
         // cert: fs.readFileSync('fullchain.pem', 'utf8')
 };