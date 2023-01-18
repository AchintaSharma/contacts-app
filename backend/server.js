const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const serverConfig = require('./configs/server.config');
const dbConfig = require('./configs/db.config');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('strictQuery', false);
mongoose.connect(dbConfig.DB_URL);
const db = mongoose.connection;
db.on('error', () => {
  console.log('### Error while connecting to MongoDB ####');
});
db.once('open', () => {
  console.log('#### Connected to MongoDB ####');
})

require('./routes/contact.route')(app);

app.listen(serverConfig.PORT, () => {
  console.log(`#### Cotact app running on Server at Port No. : ${serverConfig.PORT} ####`);
})