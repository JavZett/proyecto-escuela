const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;
const imagen = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligartorio'],
    unique: true,
  },
  img: {
    type: String,
    required: [true, 'La imagen es obligatoria'],
  },
  estado: {
    type: Boolean,
    required: false,
    default: true,
  },
  fechaRegistro: {
    type: String,
    default: moment().format('LL'),
    required: false,
  },
});

module.exports = mongoose.model('Imagen', imagen);
