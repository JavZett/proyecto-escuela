const express = require('express');
const _ = require('underscore');
const Materia = require('../models/materias');
const app = express();

app.get('/materias', (req, res) => {
  const desde = Number(req.query.desde) || 0;
  const limite = Number(req.query.limite) || 5;

  Materia.find({ estado: true }, 'nombre')
    .skip(desde)
    .limit(limite)
    .exec((err, materias) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          error: err,
        });
      } else {
        Materia.countDocuments((err, conteo) => {
          res.json({
            ok: true,
            registrados: conteo,
            mostrados: materias.length,
            materias,
          });
        });
      }
    });
});

app.get('/materia/:id', async (req, res) => {
  try {
    const materia = await Materia.findById(req.params.id);
    res.json({
      ok: true,
      materia,
    });
  } catch (err) {
    return res.status(400).json({
      ok: false,
      message: 'Materia no encontrada',
      error: err,
    });
  }
});

app.post('/registro-materia', async (req, res) => {
  const materiaReg = new Materia({
    nombre: req.body.nombre,
  });

  try {
    const materia = await materiaReg.save();
    res.json({ ok: true, materia });
  } catch (err) {
    return res.status(400).json({
      ok: false,
      error: err,
    });
  }
});

app.put('/materia/:id', async (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['nombre']);

  try {
    const materia = await Materia.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
      context: 'query',
    });
    res.json({
      ok: true,
      materia,
    });
  } catch (err) {
    return res.status(400).json({
      ok: false,
      error: err,
    });
  }
});

app.delete('/materia/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const materiaBorrada = await Materia.findByIdAndRemove(id);
    if (!materiaBorrada) {
      return res.status(400).json({
        ok: false,
        error: {
          message: 'Materia no encontrada',
        },
      });
    }
    res.json({
      ok: true,
      materia: materiaBorrada,
    });
  } catch (err) {
    return res.status(400).json({
      ok: false,
      error: err,
    });
  }
});

module.exports = app;
