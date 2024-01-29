const mongoose = require("mongoose");
const validator = require("validator");
const Joi = require("joi");
const { randomUUID } = require('crypto');

const { userSchema, User } = require('./userModel')


const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: User,
    },

    transactionType: {
        type: String,
        enum: ['CREDIT', 'DEBIT'],
        // required: true,
    },

    narration: {
        type: String,
        // required: true,
        minlenght: 3,
        maxlength: 50,
    },
    amount: {
        type: Number,
        trim: true,
    },

    transaction_date: {
        type: Date
    },

    reference: {
        type: String,
        trim: true,
        minlength: 5,
        maxlength: 255,
    },

    bank_code: {
        type: String
    },

    account_number: {
        type: String
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    transaction_to: {
        type: String
    },

},
    { timeStamps: true }
);


const Transaction = mongoose.model("Transaction", transactionSchema);



exports.Transaction = Transaction;

