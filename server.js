const express = require("express");
const app = express();

require('dotenv').config()
require('./startup/db')()
require('./startup/routes')(app)

const port = process.env.PORT;

app.use(
    express.urlencoded({ extended: true })
);
const server = app.listen(port, () =>
    console.log(`Listening on port ${port}...`)
);

module.exports = server;