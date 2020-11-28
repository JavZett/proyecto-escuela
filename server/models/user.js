const mongoose = require('mongoose');

const rolesValidos = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: 'Error, {VALUE} es un rol váldio',
};

const Shema = mongoose.Schema;
const userShema = new Shema({
  usuario: {
    type: String,
    required: [true, 'El usuario es obligartorio'],
    unique: true,
  },
  correo: {
    type: String,
    required: [true, 'El correo es necesario'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
  },
  estado: {
    type: Boolean,
    default: true,
  },
  rol: {
    type: String,
    default: 'USER_ROLE',
    enum: rolesValidos,
  },
});

userShema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;

  return userObject;
};

module.exports = mongoose.model('User', userShema);
