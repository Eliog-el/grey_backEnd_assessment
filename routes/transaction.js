const mongoose = require("mongoose");
const express = require("express");
const Joi = require("joi");

const validate = require("../middleware/validate");

const router = express.Router();

const auth = require("../middleware/auth");
const controller = require('../controllers/transactionController');



router.post('/fundAccount/:id', [auth, validate(validateFundAndWithdraw)], controller.fundAccount)
router.post('/withdrawfunds/:id', [auth, validate(validateFundAndWithdraw)], controller.withdrawFunds)
router.post('/transferFunds/:id', [auth, validate(validateTransferFund)], controller.transferFunds)

function validateFundAndWithdraw(req) {
    const schema = Joi.object({
        amount: Joi.number().required().precision(3),
        transactionType: Joi.string().required(),
        narration: Joi.string().required(),
    });

    return schema.validate(req);
}

function validateTransferFund(req) {
    const schema = Joi.object({
        amount: Joi.number().required().precision(3),
        narration: Joi.string().required(),
        recipientId: Joi.string().required(),
    });

    return schema.validate(req);
}
module.exports = router;