const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();
const port = 8000;
const routes = require('./routes');
const db = require('./config/db');

// Connect db
db.connect();

// public dir
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

// HTTP logger
app.use(morgan('combined'));

// Routes init
routes(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})