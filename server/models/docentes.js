const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;
const docenteShema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligartorio'],
    unique: true,
  },
  correo: {
    type: String,
    required: [true, 'El correo es necesario'],
    unique: true,
  },
  materias: [{ type: Schema.Types.ObjectId, ref: 'Materias', default: '' }],
  fechaRegistro: {
    type: String,
    default: moment().format('LL'),
    required: false,
  },
  estado: {
    type: Boolean,
    required: false,
    default: true,
  },
});

module.exports = mongoose.model('Docente', docenteShema);
