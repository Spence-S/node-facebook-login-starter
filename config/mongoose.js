const mongoose = require('mongoose');

// Set default promise library
mongoose.Promise = global.Promise;

// connect db
mongoose.connect('mongodb://localhost/ppplayground');

// show errors and indicate success
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connected to db!');
});

module.exports = mongoose;
