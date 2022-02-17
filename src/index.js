const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const port = 8000;
const routes = require('./routes');
const db = require('./config/db');

dotenv.config();

// Connect db
db.connect();


const app = express();
app.use(cors());

// public dir
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// HTTP logger
app.use(morgan('combined'));
// Routes init
routes(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})