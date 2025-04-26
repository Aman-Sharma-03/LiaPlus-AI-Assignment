const express = require('express');
const bodyParser = require('body-parser');
const { connectDB } = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require('./routes/auth');
const expenseRouter = require('./routes/expenses');
const profileRouter = require('./routes/profile');

const app = express();

require('dotenv').config();

const allowedOrigins = [
  'http://localhost:5173',
  'https://expense-tracker-frontend-git-main-aman-sharmas-projects.vercel.app',
  'https://expensetracker.jaii.in',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Add this manually to be super safe 👇
app.use((req, res, next) => {
  if (allowedOrigins.includes(req.headers.origin)) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  next();
});

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', expenseRouter);
app.use('/', profileRouter);

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log('Server running at port: ', PORT, '...');
    });
    console.log('Database connection established...');
  })
  .catch((err) => {
    console.log('Database cannot be connected!!' + err);
  });
