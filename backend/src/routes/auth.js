const express = require('express');
const authRouter = express.Router();

const {
  validateSignUpData,
  validateLoginData,
} = require('../utils/validation');
const User = require('../models/user');
const bcrypt = require('bcrypt');

authRouter.post('/signup', async (req, res) => {
  try {
    const { name, emailId, password } = req.body;
    validateSignUpData(req);
    if (!emailId || emailId.trim() === '') {
      return res.status(400).send('Email is required');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Store the data
    const user = new User({
      name,
      emailId,
      password: passwordHash,
    });

    const createdUser = await user.save();
    const token = await createdUser.getJWT();
    res.cookie('token', token, { expires: new Date(Date.now() + 604800000) });
    res.send({ message: 'User Created Successfully', data: createdUser });
  } catch (err) {
    console.log('Error Creating user ' + err.message);
    res.status(400).send(err.message);
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;
    validateLoginData(req);
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("User doesn't exist");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to false for local HTTP development
        sameSite: 'None', // This is required for cross-origin requests
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });
      res.send(user);
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post('/logout', async (req, res) => {
  res
    .cookie('token', null, {
      expires: new Date(Date.now()),
    })
    .send('Logout successful!!');
});

module.exports = authRouter;
