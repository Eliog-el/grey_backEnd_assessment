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

// userSchema.methods.generateAuthToken = function () {
//   const token = jwt.sign(
//     { _id: this._id, isAdmin: this.isAdmin },
//     config.get("jwtPrivateKey")
//   );
//   return token;
// };

const Transaction = mongoose.model("Transaction", transactionSchema);

// function validateUser(user) {
//     const schema = Joi.object({
//         first_name: Joi.string().min(3).max(50).required(),
//         last_name: Joi.string().min(3).max(50).required(),
//         phone_number: Joi.string.required(),
//         email: Joi.string().min(3).max(255).required().email(),
//         password: passwordComplexity(complexityOption).required(),
//     });

//     return schema.validate(user);
// }


exports.Transaction = Transaction;
// exports.validate = validateUser;

/**
 * user_uuid
transaction_type
narration
amount
transaction_date
reference
balance
bank_code
account_number
transaction_to
created_at
updated_at
 * 
 */