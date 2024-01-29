const mongoose = require("mongoose");
const validator = require("validator");

const { userSchema, User } = require('./userModel')


const AccountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: User,
    },

    reference: {
        type: String,
        trim: true,
        minlength: 5,
        maxlength: 255,
    },

    account_balance: {
        type: Number,
        required: true,
        trim: true
    },

},
    { timeStamps: true }
);



const Account = mongoose.model("Account", AccountSchema);




exports.Account = Account;
