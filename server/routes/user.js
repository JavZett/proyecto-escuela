const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { verificaToken, verificaRol } = require('../middlewares/autenticacion');
const app = express();

app.get('/users', (req, res) => {
  const desde = Number(req.query.desde) || 0;
  const limite = Number(req.query.limite) || 5;

  User.find({ estado: true }, 'usuario correo')
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          error: err,
        });
      } else {
        User.countDocuments({ estado: true }, (err, conteo) => {
          res.json({
            ok: true,
            registrados: conteo,
            mostrados: usuarios.length,
            usuarios,
          });
        });
      }
    });
});

app.get('/users/:id', async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id);
    res.json({
      ok: true,
      usuario,
    });
  } catch (err) {
    return res.status(400).json({
      ok: false,
      message: 'Usuario no encontrado',
      error: err,
    });
  }
});

app.post('/registro', async (req, res) => {
  const usuarioReg = new User({
    usuario: req.body.usuario,
    correo: req.body.correo,
    password: bcrypt.hashSync(req.body.password, 10),
    role: req.body.role,
  });

  try {
    const usuario = await usuarioReg.save();
    const token = jwt.sign({ usuario }, process.env.SEED, {
      expiresIn: process.env.CADUCIDAD_TOKEN,
    });
    res.json({ ok: true, usuario, token });
  } catch (err) {
    return res.status(400).json({
      ok: false,
      error: err,
    });
  }
});

app.put('/user/:id', verificaToken, async (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['usuario', 'correo', 'password']);

  try {
    const usuario = await User.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
      context: 'query',
    });
    res.json({
      ok: true,
      usuario,
    });
  } catch (err) {
    return res.status(400).json({
      ok: false,
      error: err,
    });
  }
});

app.delete('/user/:id', [verificaToken, verificaRol], async (req, res) => {
  const id = req.params.id;
  try {
    const usuarioBorrado = await User.findByIdAndUpdate(id, {
      estado: false,
      runValidators: true,
    });
    if (usuarioBorrado.estado === false) {
      return res.status(400).json({
        ok: false,
        error: {
          message: 'Usuario no encontrado',
        },
      });
    }
    res.json({
      ok: true,
      usuario: usuarioDesactivado,
    });
  } catch (err) {
    return res.status(400).json({
      ok: false,
      error: err,
    });
  }
});

module.exports = app;
