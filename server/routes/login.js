const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const app = express();

app.post('/login', async (req, res) => {
  const body = req.body;
  try {
    const usuario = await User.findOne({ correo: body.correo });
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuarioo o contraseña incorrectos',
        },
      });
    }
    if (!bcrypt.compareSync(body.password, usuario.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario o contraseñaa incorrectos',
        },
      });
    }
    const token = jwt.sign({ usuario }, process.env.SEED, {
      expiresIn: process.env.CADUCIDAD_TOKEN,
    });
    res.json({ ok: true, usuario, token });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      err,
    });
  }
});

module.exports = app;
