const express = require('express');
const _ = require('underscore');
const Carrera = require('../models/carreras');
const app = express();

app.get('/carreras', (req, res) => {
  const desde = Number(req.query.desde) || 0;
  const limite = Number(req.query.limite) || 5;

  Carrera.find({ estado: true }, 'nombre descripcion fechaRegistro')
    .skip(desde)
    .limit(limite)
    .exec((err, carreras) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          error: err,
        });
      } else {
        Carrera.countDocuments((err, conteo) => {
          res.json({
            ok: true,
            registrados: conteo,
            mostrados: carreras.length,
            carreras,
          });
        });
      }
    });
});

app.get('/carrera/:id', async (req, res) => {
  try {
    const carrera = await Carrera.findById(req.params.id);
    res.json({
      ok: true,
      carrera,
    });
  } catch (err) {
    return res.status(400).json({
      ok: false,
      message: 'Carrera no encontrada',
      error: err,
    });
  }
});

app.post('/registro-carrera', async (req, res) => {
  const carreraReg = new Carrera({
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
  });

  try {
    const carrera = await carreraReg.save();
    res.json({ ok: true, carrera });
  } catch (err) {
    return res.status(400).json({
      ok: false,
      error: err,
    });
  }
});

app.put('/carrera/:id', async (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['nombre', 'img', 'descripcion']);

  try {
    const carrera = await Carrera.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
      context: 'query',
    });
    res.json({
      ok: true,
      carrera,
    });
  } catch (err) {
    return res.status(400).json({
      ok: false,
      error: err,
    });
  }
});

app.delete('/carrera/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const carreraBorrada = await Carrera.findByIdAndRemove(id);
    if (!carreraBorrada) {
      return res.status(400).json({
        ok: false,
        error: {
          message: 'Carrera no encontrada',
        },
      });
    }
    res.json({
      ok: true,
      carreraBorrada,
    });
  } catch (err) {
    return res.status(400).json({
      ok: false,
      error: err,
    });
  }
});

module.exports = app;
