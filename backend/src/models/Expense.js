const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: [
      'Food',
      'Transportation',
      'Housing',
      'Utilities',
      'Entertainment',
      'Healthcare',
      'Shopping',
      'Travel',
      'Education',
      'Personal',
      'Gifts',
      'Other',
    ],
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Expense = new mongoose.model('Expense', ExpenseSchema);
module.exports = Expense;
