const mongoose = require('mongoose');
async function conexionDB() {
  try {
    await mongoose.connect(
      'mongodb+srv://zetta:olaolaola315@cluster0.cek1n.mongodb.net/proyectoEscuela?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }
    );
    console.log('Conexión exitosa');
  } catch (err) {
    console.log(err);
    // console.log('Esperando conexión...');
    // conexionDB();
  }
}
module.exports = { conexionDB };
