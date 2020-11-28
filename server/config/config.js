const bcrypt = require('bcrypt');

function configuracion(
  puerto,
  caducidad,
  seed,
  dbLocal,
  entorno = 'desarrollo'
) {
  let urlDataBase;

  seed = bcrypt.hashSync(seed, 10);

  process.env.PORT = process.env.PORT || puerto;
  process.env.NODE_ENV = process.env.NODE_ENV || entorno;
  process.env.CADUCIDAD_TOKEN = caducidad;
  process.env.SEED = process.env.SEED || seed;

  if (process.env.NODE_ENV === entorno) {
    urlDataBase = dbLocal;
  } else {
    urlDataBase = process.env.MONGO_URI;
  }
  process.env.urlDataBase = urlDataBase;
}

module.exports = { configuracion };
