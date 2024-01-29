const userController = require('../controllers/userController');

// Mocking dependencies
jest.mock('bcrypt');
jest.mock('../models/userModel');
jest.mock('../models/accountModel');

// Import necessary modules after mocking
const { User, validate } = require('../models/userModel');
const { Account } = require('../models/accountModel');
const bcrypt = require('bcrypt');

describe('userController Tests', () => {

    describe('createUser', () => {
        it('should create a new user and account', async () => {
            // Mock data for request body
            const reqBody = {
                first_name: 'John',
                last_name: 'Doe',
                email: 'john.doe@example.com',
                phone_number: '+1234567890',
                address: '123 Main St',
                reference: 'ABC123',
                password: 'SecurePwd',
                confirm_password: 'SecurePwd',
            };

            // Mocked User.findOne to return null, indicating user does not exist
            User.findOne.mockResolvedValueOnce(null);

            // Mocked bcrypt.genSalt and bcrypt.hash
            bcrypt.genSalt.mockResolvedValue('salt');
            bcrypt.hash.mockResolvedValue('hashedPassword');

            // Mocked Account.save
            Account.prototype.save.mockResolvedValueOnce();

            // Mocked User.save
            User.prototype.save.mockResolvedValueOnce();

            // Mocked response object
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };

            // Execute the createUser function
            await userController.createUser({ body: reqBody }, res);

            // Assert that the appropriate functions were called with the correct arguments
            expect(User.findOne).toHaveBeenCalledWith({ email: reqBody.email });
            expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
            expect(bcrypt.hash).toHaveBeenCalledWith(reqBody.password, 'salt');
            expect(Account).toHaveBeenCalledWith({
                user: {
                    _id: expect.anything(),
                },
                account_balance: 0.0,
                reference: reqBody.reference,
            });
            expect(Account.prototype.save).toHaveBeenCalled();
            expect(User.prototype.save).toHaveBeenCalled();

            // Assert that the response status and send functions were called
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith({ message: 'User created!!!', user: expect.anything() });
        });

        // Add more test cases for edge cases, validation errors, etc.
    });

    describe('signIn', () => {
        it('should sign in a user and return a token', async () => {
            // Mock data for request body
            const reqBody = {
                email: 'john.doe@example.com',
                password: 'SecurePwd',
            };

            // Mocked User.findOne to return a user
            User.findOne.mockResolvedValueOnce({
                _id: 'userId',
                email: reqBody.email,
                password: 'hashedPassword',
                generateAuthToken: jest.fn().mockReturnValue('fakeToken'),
            });

            // Mocked bcrypt.compare
            bcrypt.compare.mockResolvedValueOnce(true);

            // Mocked response object
            const res = {
                send: jest.fn(),
            };

            // Execute the signIn function
            await userController.signIn({ body: reqBody }, res);

            // Assert that the appropriate functions were called with the correct arguments
            expect(User.findOne).toHaveBeenCalledWith({ email: reqBody.email });
            expect(bcrypt.compare).toHaveBeenCalledWith(reqBody.password, 'hashedPassword');
            expect(res.send).toHaveBeenCalledWith({ token: 'fakeToken' });
        });

        // Add more test cases for invalid email/password, user not found, etc.
    });

});