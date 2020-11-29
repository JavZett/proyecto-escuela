const bcrypt = require('bcrypt');

function configuracion(puerto, caducidad, seed) {
  seed = bcrypt.hashSync(seed, 10);

  process.env.PORT = process.env.PORT || puerto;
  process.env.NODE_ENV = process.env.NODE_ENV;
  process.env.CADUCIDAD_TOKEN = caducidad;
  process.env.SEED = process.env.SEED || seed;
}

module.exports = { configuracion };
