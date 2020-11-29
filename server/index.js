const { configuracion } = require('./config/config');
const { conexionDB } = require('./config/conexion');

configuracion(4000, '30d', 'holajeje');

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(require('./routes/index'));

conexionDB();

app.listen(process.env.PORT, () =>
  console.log('Escuchando puerto: ', process.env.PORT)
);

// console.log(
//   `Caducidad: ${process.env.CADUCIDAD_TOKEN} Token ${process.env.SEED}`
// );
