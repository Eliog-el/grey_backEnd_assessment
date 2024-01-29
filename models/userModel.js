const mongoose = require("mongoose");
const validator = require("validator");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const passwordComplexity = require("joi-password-complexity");
const mongooseIntlPhoneNumber = require('mongoose-intl-phone-number');

const { randomUUID } = require('crypto');

const complexityOption = {
    min: 5,
    max: 250,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4,
};


const userSchema = new mongoose.Schema({

    first_name: {
        type: String,
        required: true,
        minlenght: 3,
        maxlength: 50,
    },
    last_name: {
        type: String,
        required: true,
        minlenght: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        },
    },
    phone_number: {
        type: String,
        required: [true, 'User phone number required']
    },

    address: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
    },

    password: {
        type: String,
        required: true,
        minLength: 7,
        maxlength: 1024,
        trim: true,
        validate(value) {
            if (value.includes("password")) {
                throw new Error('Password cannot contain "password"');
            }
        },
    },
    
},

    { timestamps: true }
);

userSchema.plugin(mongooseIntlPhoneNumber, {
    hook: 'validate',
    phoneNumberField: 'phone_number',
    nationalFormatField: 'nationalFormat',
    // internationalFormat: 'internationalFormat',
    // countryCodeField: 'NG',
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id },
        process.env.jwtPrivateKey
    );
    return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
    const schema = Joi.object({
        first_name: Joi.string().min(3).max(50).required(),
        last_name: Joi.string().min(3).max(50).required(),
        phone_number: Joi.string().required(),
        email: Joi.string().min(3).max(255).required().email(),
        password: passwordComplexity(complexityOption).required(),
        confirm_password: passwordComplexity(complexityOption).required(),
        address: Joi.string().min(3).max(255).required(),
        reference: Joi.string().min(3).max(50).message('name of reference is required')
    });

    return schema.validate(user);
}

exports.User = User;
exports.userSchema = userSchema
exports.validate = validateUser;
