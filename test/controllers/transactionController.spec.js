const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../your-express-app'); // Import your Express app instance
const { Account } = require('../models/accountModel');
const { Transaction } = require('../models/transactionModel');

// Mocking dependencies
jest.mock('bcrypt');
jest.mock('../models/userModel');

describe('transactionController Tests', () => {
    // Mock data for testing
    const mockUserAccountId = mongoose.Types.ObjectId();
    const mockTransactionId = mongoose.Types.ObjectId();

    // Mock data for request bodies
    const fundAccountRequestBody = {
        amount: 100,
        transactionType: 'CREDIT',
        narration: 'Funding account',
    };

    const withdrawFundsRequestBody = {
        amount: 50,
        transactionType: 'DEBIT',
        narration: 'Withdrawing funds',
    };

    const transferFundsRequestBody = {
        amount: 30,
        narration: 'Transferring funds',
        recipientId: mongoose.Types.ObjectId(),
    };

    // Mock data for models
    const mockUserAccount = {
        _id: mockUserAccountId,
        user: mongoose.Types.ObjectId(),
        reference: '12345',
        account_balance: 200,
    };

    const mockTransaction = {
        _id: mockTransactionId,
        user: {
            _id: mockUserAccountId,
        },
        amount: 100,
        transactionType: 'CREDIT',
        narration: 'Funding account',
    };

    // Mock Account.findOne to resolve with user account data
    Account.findOne = jest.fn();

    // Mock Account.findOneAndUpdate to resolve with updated user account data
    Account.findOneAndUpdate = jest.fn();

    // Mock Transaction.save to resolve with mock transaction data
    Transaction.prototype.save = jest.fn();

    // Set up before each test
    beforeEach(() => {
        // Reset mocks and set default return values
        Account.findOne.mockReset();
        Account.findOne.mockResolvedValue(mockUserAccount);
        Account.findOneAndUpdate.mockReset();
        Transaction.prototype.save.mockReset();
        Transaction.prototype.save.mockResolvedValue(mockTransaction);
    });

    // Test for fundAccount function
    describe('fundAccount', () => {
        it('should fund the user account and return updated account and transaction data', async () => {
            // Mock request parameters
            const req = {
                params: { id: mockUserAccountId },
                body: fundAccountRequestBody,
            };

            // Mock response object
            const res = {
                send: jest.fn(),
            };

            // Execute the fundAccount function
            await fundAccount(req, res);

            // Assert Account.findOne and Transaction.save were called with the correct arguments
            expect(Account.findOne).toHaveBeenCalledWith({ user: mockUserAccountId });
            expect(Transaction.prototype.save).toHaveBeenCalledWith();

            // Assert Account.findOneAndUpdate was called with the correct arguments
            expect(Account.findOneAndUpdate).toHaveBeenCalledWith(
                { user: mockUserAccountId },
                { $set: { account_balance: mockUserAccount.account_balance + fundAccountRequestBody.amount } },
                { new: true }
            );

            // Assert response was sent with the correct data
            expect(res.send).toHaveBeenCalledWith({
                userAccount: {
                    _id: mockUserAccount._id,
                    user: mockUserAccount.user,
                    reference: mockUserAccount.reference,
                    account_balance: mockUserAccount.account_balance + fundAccountRequestBody.amount,
                },
                userTransaction: mockTransaction,
            });
        });

        // Add more test cases for edge cases, validation errors, etc.
    });

    // Test for withdrawFunds function
    describe('withdrawFunds', () => {
        it('should withdraw funds from the user account and return updated account and transaction data', async () => {
            // Mock request parameters
            const req = {
                params: { id: mockUserAccountId },
                body: withdrawFundsRequestBody,
            };

            // Mock response object
            const res = {
                send: jest.fn(),
                status: jest.fn().mockReturnThis(),
            };

            // Execute the withdrawFunds function
            await withdrawFunds(req, res);

            // Assert Account.findOne, Transaction.save, and Account.findOneAndUpdate were called with the correct arguments
            expect(Account.findOne).toHaveBeenCalledWith({ user: mockUserAccountId });
            expect(Transaction.prototype.save).toHaveBeenCalledWith();
            expect(Account.findOneAndUpdate).toHaveBeenCalledWith(
                { user: mockUserAccountId },
                { $set: { account_balance: mockUserAccount.account_balance - withdrawFundsRequestBody.amount } },
                { new: true }
            );

            // Assert response was sent with the correct data
            expect(res.send).toHaveBeenCalledWith({
                userAccount: {
                    _id: mockUserAccount._id,
                    user: mockUserAccount.user,
                    reference: mockUserAccount.reference,
                    account_balance: mockUserAccount.account_balance - withdrawFundsRequestBody.amount,
                },
                userTransaction: mockTransaction,
            });
        });

        // Add more test cases for edge cases, validation errors, etc.
    });

    // Test for transferFunds function
    describe('transferFunds', () => {
        it('should transfer funds between accounts and return updated sender and recipient accounts along with transaction data', async () => {
            // Mock request parameters
            const req = {
                params: { id: mockUserAccountId },
                body: transferFundsRequestBody,
            };

            // Mock response object
            const res = {
                send: jest.fn(),
                status: jest.fn().mockReturnThis(),
            };

            // Mock Account.findOne for recipient account
            Account.findOne.mockResolvedValueOnce({
                _id: transferFundsRequestBody.recipientId,
                user: mongoose.Types.ObjectId(),
                reference: '67890',
                account_balance: 150,
            });

            // Execute the transferFunds function
            await transferFunds(req, res);

            // Assert Account.findOne, Transaction.save, and Account.findOneAndUpdate were called with the correct arguments
            expect(Account.findOne).toHaveBeenCalledWith({ user: mockUserAccountId });
            expect(Account.findOne).toHaveBeenCalledWith({ user: transferFundsRequestBody.recipientId });
            expect(Transaction.prototype.save).toHaveBeenCalledWith();
            expect(Account.findOneAndUpdate).toHaveBeenCalledWith(
                { user: mockUserAccountId },
                { $set: { account_balance: mockUserAccount.account_balance - transferFundsRequestBody.amount } },
                { new: true }
            );
            expect(Account.findOneAndUpdate).toHaveBeenCalledWith(
                { user: transferFundsRequestBody.recipientId },
                { $set: { account_balance: 150 + transferFundsRequestBody.amount } },
                { new: true }
            );

            // Assert response was sent with the correct data
            expect(res.send).toHaveBeenCalledWith({
                senderAccount: {
                    _id: mockUserAccount._id,
                    user: mockUserAccount.user,
                    reference: mockUserAccount.reference,
                    account_balance: mockUserAccount.account_balance - transferFundsRequestBody.amount,
                },
                recipientAccount: {
                    _id: transferFundsRequestBody.recipientId,
                    user: transferFundsRequestBody.recipientId,
                    reference: '67890',
                    account_balance: 150 + transferFundsRequestBody.amount,
                },
                senderTransaction: mockTransaction,
                recipientTransaction: expect.any(Object),
            });
        });

        // Add more test cases for edge cases, validation errors, etc.
    });

    // Add more tests as needed

    // After all tests, close the database connection
    afterAll(async () => {
        await mongoose.connection.close();
    });
});
