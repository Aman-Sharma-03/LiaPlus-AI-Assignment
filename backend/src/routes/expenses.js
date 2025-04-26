const express = require('express');
const expenseRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const Expense = require('../models/Expense');

expenseRouter.post('/expenses', userAuth, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { amount, category, description, date } = req.body;

    const expense = new Expense({
      userId,
      amount,
      category,
      description,
      date,
    });

    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    console.log('Error');
    if (err instanceof Error) {
      console.log(err.message);
      res.status(500).json({ error: err.message });
    } else {
      console.log(err);
      res.status(500).json({ error: 'Unknown error' });
    }
  }
});
expenseRouter.get('/expenses', userAuth, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    console.log(userId);
    const filter = userId ? { userId } : {};
    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    console.log('Error');
    if (err instanceof Error) {
      console.log(err.message);
      res.status(500).json({ error: err.message });
    } else {
      console.log(err);
      res.status(500).json({ error: 'Unknown error' });
    }
  }
});
expenseRouter.put('/expenses/:id', userAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedExpense = await Expense.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedExpense) {
      return res.status(404).send('Expense not found');
    }

    res.status(200).json(updatedExpense);
  } catch (err) {
    console.log('Error');
    if (err instanceof Error) {
      console.log(err.message);
      res.status(500).json({ error: err.message });
    } else {
      console.log(err);
      res.status(500).json({ error: 'Unknown error' });
    }
  }
});
expenseRouter.delete('/expenses/:id', userAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedExpense = await Expense.findByIdAndDelete(id);

    if (!deletedExpense) {
      return res.status(404).send('Expense Not Found');
    }

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: message });
  }
});

module.exports = expenseRouter;
