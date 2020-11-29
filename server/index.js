const { configuracion } = require('./config/config');
const { conexionDB } = require('./config/conexion');
const path = require('path');

configuracion(4000, '30d', 'holajeje');

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname, '../public')));

app.use(require('./routes/index'));

conexionDB();

app.listen(process.env.PORT, () =>
  console.log('Escuchando puerto: ', process.env.PORT)
);
