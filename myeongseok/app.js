require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { AppDataSource } = require('./src/models/data-source.js');
const { routes } = require('./src/routes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use(routes);

const startServer = async () => {
  const PORT = process.env.PORT;

  await AppDataSource.initialize()
    .then(() => {
      console.log('DATA SOURCE HAS BEEN INITIALIZED!');
    })
    .catch((err) => {
      console.error('ERROR DURING DATA SOURCE INITIALIZATION', err);
    });

  app.listen(PORT, () => {
    console.log(`LISTENING ON PORT ${PORT}`);
  });
};

startServer();
