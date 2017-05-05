const fs = require('fs');
const Promise = require('bluebird');
const mongoose = require('mongoose');

const db = mongoose.connection;
const dbLog = fs.createWriteStream(__dirname + '/log/db.log', {flags: 'a'});

db.once('open', () => {
  dbLog.write(`[${new Date()}] Connected to DB\n`);
});
db.on('error', (err) => {
  dbLog.write(`[${new Date()}] Error: ${err}\n`);
});

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/esp8266_conference');

module.exports = mongoose;