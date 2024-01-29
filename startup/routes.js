const express = require('express');
const user = require('../routes/user')
const transaction = require('../routes/transaction')


module.exports = function (app) {
    app.use(express.json());

    app.use('/api/users', user)
    app.use('/api/transaction', transaction)

};

