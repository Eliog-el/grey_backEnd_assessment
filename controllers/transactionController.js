const { Account } = require('../models/accountModel');
const { Transaction } = require('../models/transactionModel');
const { User, validate } = require('../models/userModel');
const { requestTimeout } = require('../server');

const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

module.exports = {
  fundAccount: async (req, res) => {
    const { amount, transactionType, narration } = req.body;
    const { id } = req.params;

    try {
      let userAccount = await Account.findOne({ user: id });

      const userTransaction = new Transaction({
        amount: amount,
        transactionType,
        user: {
          _id: id,
        },
        narration: narration,
      });

      userTransaction.save();

      const currentBalance = userAccount.account_balance || 0; // Handle potential NaN or undefined
      const newBalance = currentBalance + parseFloat(amount); // Ensure amount is parsed as a float

      // Use findOneAndUpdate for atomic operation
      const updatedAccount = await Account.findOneAndUpdate(
        { user: id },
        { $set: { account_balance: newBalance } },
        { new: true }
      );

      return res.send({ userAccount: updatedAccount, userTransaction });

    } catch (error) {
      console.error('Error in fundAccount:', error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  },

  withdrawFunds: async (req, res) => {
    const { amount, transactionType, narration } = req.body;
    const { id } = req.params;

    try {
      let userAccount = await Account.findOne({ user: id });

      if (!userAccount) {
        return res.status(404).send({ error: 'User account not found' });
      }

      if (userAccount.account_balance < amount) {
        return res.status(400).send({ error: 'Insufficient funds for withdrawal' });
      }

      const userTransaction = new Transaction({
        amount: amount,
        transactionType: 'DEBIT',
        user: {
          _id: id,
        },
        narration: narration,
      });

      userTransaction.save();

      const newBalance = userAccount.account_balance - amount;

      // Use findOneAndUpdate for atomic operation
      const updatedAccount = await Account.findOneAndUpdate(
        { user: id },
        { $set: { account_balance: newBalance } },
        { new: true }
      );

      return res.send({ userAccount: updatedAccount, userTransaction });
    } catch (error) {
      console.error('Error in withdrawFunds:', error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  },

  transferFunds: async (req, res) => {
    const { amount, narration, recipientId } = req.body;
    const { id: senderId } = req.params;

    try {
      // Check if sender and recipient accounts exist
      const [senderAccount, recipientAccount] = await Promise.all([
        Account.findOne({ user: senderId }),
        Account.findOne({ user: recipientId }),
      ]);

  

      if (!senderAccount || !recipientAccount) {
        return res.status(404).send({ error: 'Sender or recipient account not found' });
      }

      if (senderAccount.account_balance < amount) {
        return res.status(400).send({ error: 'Insufficient funds for transfer' });
      }

      // Create debit transaction for sender
      const senderTransaction = new Transaction({
        amount: amount,
        transactionType: 'DEBIT',
        user: { _id: senderId },
        narration: narration,
      });
      senderTransaction.save();

      // Create credit transaction for recipient
      const recipientTransaction = new Transaction({
        amount: amount,
        transactionType: 'CREDIT',
        user: { _id: recipientId },
        recipient: recipientId, // Store recipient's user ID
        narration: narration,
      });
      recipientTransaction.save();

      // Update account balances
      const newSenderBalance = senderAccount.account_balance - amount;
      const newRecipientBalance = recipientAccount.account_balance + amount;

      // Use findOneAndUpdate for atomic operation
      await Promise.all([
        Account.findOneAndUpdate(
          { user: senderId },
          { $set: { account_balance: newSenderBalance } },
          { new: true }
        ),
        Account.findOneAndUpdate(
          { user: recipientId },
          { $set: { account_balance: newRecipientBalance } },
          { new: true }
        ),
      ]);

      return res.send({
        senderAccount: { _id: senderAccount._id, account_balance: newSenderBalance },
        recipientAccount: { _id: recipientAccount._id, account_balance: newRecipientBalance },
        senderTransaction,
        recipientTransaction,
      });
    } catch (error) {
      console.error('Error in transferFunds:', error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  },
};





