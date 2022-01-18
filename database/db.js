let mongoose = require('mongoose');
const readLine = require('readline');

const db_url = 'mongodb+srv://admin:admin@product-hkdj8.mongodb.net/classroom?retryWrites=true&w=majority';
//const mongodb_url = 'mongodb://localhost:27017/classroom';

const connect = () => {
  setTimeout(() => mongoose.connect(db_url, {useNewUrlParser: true, useUnifiedTopology: true}), 1000);
}
mongoose.connection.on('connected', () => {
  console.log('connected');
});

mongoose.connection.on('error', err => {
  console.log('error: ' + err);
  return connect();
});

mongoose.connection.on('disconnected', () => {
  console.log('disconnected');
});

connect();