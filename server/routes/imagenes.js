const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Imagen = require('../models/imagenes');
const fs = require('fs');
const path = require('path');

app.use(fileUpload({ useTempFiles: true }));

app.post('/imagen/:nombre', async (req, res) => {
  const nombre = req.params.nombre;
  if (!req.files) {
    return res.status(400).json({
      ok: false,
      error: {
        message: 'No se ha seleccionado ningún archivo',
      },
    });
  }

  const imagen = req.files.imagen;
  const nombreCortado = imagen.name.split('.');
  const extesion = nombreCortado[nombreCortado.length - 1];
  const extValidas = ['png', 'jpg', 'jgeg', 'gif'];

  if (extValidas.indexOf(extesion) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        extension,
        message: `Las extenciones permitidas son: ${extValidas.join(', ')}`,
      },
    });
  }

  const miliDate = new Date().getMilliseconds();
  const nombreArchivo = `${nombre}-${miliDate}.${extesion}`;

  imagen.mv(`uploads/Carreras/${nombreArchivo}`, (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    imagen(nombre, res, nombreArchivo);
  });
});

async function imagen(nombre, res, nombreArchivo) {
  const imagenReg = new Imagen({
    nombre,
    img: nombreArchivo,
  });

  try {
    const imagen = imagenReg.save();
    borrarArchivo(imagen.img);
    res.json({ ok: true, imagen });
  } catch (err) {
    borrarArchivo(nombreArchivo);
    return res.status(400).json({
      ok: false,
      error: err,
    });
  }
}

function borrarArchivo(nombreImagen) {
  const pathImagen = path.resolve(
    __dirname,
    `../../uploads/Carreras/${nombreImagen}`
  );

  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen);
  }
}

module.exports = app;
