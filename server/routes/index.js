const express = require('express');
const app = express();

app.use(require('./user'));
app.use(require('./login'));
app.use(require('./spotiToken'));
app.use(require('./docentes'));
app.use(require('./materias'));
app.use(require('./carreras'));

module.exports = app;
