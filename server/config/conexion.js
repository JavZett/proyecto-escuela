const mongoose = require('mongoose');
async function conexionDB() {
  try {
    await mongoose.connect(process.env.urlDataBase, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('Conexión exitosa');
  } catch (err) {
    console.log(err);
    console.log('Esperando conexión...');
    conexionDB();
  }
}
module.exports = { conexionDB };
