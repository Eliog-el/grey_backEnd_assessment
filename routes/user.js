const mongoose = require("mongoose");
const express = require("express");

const router = express.Router();

const controller = require('../controllers/userController')



router.post('/createUser', controller.createUser)
router.post('/auth', controller.signIn)


module.exports = router;