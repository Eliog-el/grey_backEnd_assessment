const _ = require("lodash");
const bcrypt = require('bcrypt');

const { User, validate } = require('../models/userModel');
const { Account } = require('../models/accountModel');

function betweenRandomNumber(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}

module.exports = {
    createUser: async (req, res) => {
        const { first_name, last_name, email, phone_number, address, reference, password, confirm_password } = req.body

        try {
            const { error } = validate(req.body);
            if (error) return res.status(400).send(error.details[0].message);

            let user = await User.findOne({ email });
            if (user) return res.status(400).send({ message: "User already registered." });

            if (password !== confirm_password) return res.status(400).send({ message: "Password confirmation doesn't match" });


            user = new User(
                _.pick(req.body, ["first_name", "last_name", "email", "phone_number", 'address', "password"])
            );


            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);

            const account = new Account({
                user: {
                    _id: user._id,
                },
                account_balance: 0.0,
                reference: reference
            })

            await account.save();
            await user.save();

            // const token = user.generateAuthToken();
            // res.header('x-auth-token', token).send(_.pick(user, ['_id', 'first_name', 'last_name', 'email', 'phone_number', 'address']));

            res.status(201).send({ message: 'User created!!!', user });

        } catch (error) {
            console.error('Error in fundAccount:', error);
            res.status(500).send({ error: 'Internal Server Error' });
        }


    },

    signIn: async (req, res) => {

        try {
            let user = await User.findOne({ email: req.body.email });
            if (!user) return res.status(400).send({ message: "Invalid email or password!" });


            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) return res.status(400).send("Invalid email or password.");

            const token = user.generateAuthToken();
            res.send({ token });

        } catch (error) {
            console.error('Error in fundAccount:', error);
            res.status(500).send({ error: 'Internal Server Error' });
        }
    }

}