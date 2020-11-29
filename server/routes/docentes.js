const express = require('express');
const _ = require('underscore');
const Docente = require('../models/docentes');
const app = express();

app.get('/docentes', (req, res) => {
  const desde = Number(req.query.desde) || 0;
  const limite = Number(req.query.limite) || 5;

  Docente.find({ estado: true }, 'nombre correo')
    .skip(desde)
    .limit(limite)
    .exec((err, docentes) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          error: err,
        });
      } else {
        Docente.countDocuments((err, conteo) => {
          res.json({
            ok: true,
            registrados: conteo,
            mostrados: docentes.length,
            docentes,
          });
        });
      }
    });
});

app.get('/docentes/:id', async (req, res) => {
  try {
    const docente = await Docente.findById(req.params.id);
    res.json({
      ok: true,
      docente,
    });
  } catch (err) {
    return res.status(400).json({
      ok: false,
      message: 'Docente no encontrado',
      error: err,
    });
  }
});

app.post('/registro-docente', async (req, res) => {
  const docenteReg = new Docente({
    nombre: req.body.nombre,
    correo: req.body.correo,
    materias: req.body.materias,
  });

  try {
    const docente = await docenteReg.save();
    res.json({ ok: true, docente });
  } catch (err) {
    return res.status(400).json({
      ok: false,
      error: err,
    });
  }
});

app.put('/docente/:id', async (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['materias', 'correo']);

  try {
    const docente = await Docente.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
      context: 'query',
    });
    res.json({
      ok: true,
      docente,
    });
  } catch (err) {
    return res.status(400).json({
      ok: false,
      error: err,
    });
  }
});

app.delete('/docente/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const docenteBorrado = await Docente.findByIdAndRemove(id);
    if (!docenteBorrado) {
      return res.status(400).json({
        ok: false,
        error: {
          message: 'Docente no encontrado',
        },
      });
    }
    res.json({
      ok: true,
      docente: docenteBorrado,
    });
  } catch (err) {
    return res.status(400).json({
      ok: false,
      error: err,
    });
  }
});

module.exports = app;
