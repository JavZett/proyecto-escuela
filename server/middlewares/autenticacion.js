const jwt = require('jsonwebtoken');

function verificaToken(req, res, next) {
  let token = req.get('token');
  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: 'Token no válido',
        },
      });
    }
    req.usuario = decoded.usuario;
    next();
  });
}

function verificaRol() {
  const usuario = req.usuario.role;

  if (usuario === 'ADMIN_ROLE') {
    next();
  } else {
    res.json({
      ok: false,
      err: {
        message: 'El usuario no es administrador',
      },
    });
  }
}

module.exports = { verificaToken, verificaRol };
