# LiaPlus AI Assignment – Expense Tracker App

Hi, I'm Aman Sharma 👋  
This repository contains the full-stack Expense Tracker application built as part of the LiaPlus AI assignment.

The goal of this project is to provide users with a seamless way to track their expenses, visualize spending patterns, and manage finances efficiently through a modern web interface.

---

## Setup - Steps to setup this repo in your local env

### Backend

- Clone the repository and open the LiaPlus-AI-Assignment inside terminal
- Move inside backend(cd backend) and then do npm install to install the dependencies
- Example env's are the original env's, make sure to copy .env.example to .env
- Now type npm run dev in terminal to run the server

### Frontend

- Clone the repository adn open the LiaPlus-AI-Assignment inside terminal.
- Move inside frontend (cd frontend) and then do yarn to install the dependencies.
- No need to setup .env, for the ease I have used API_URL directly
- Now type yarn dev to run the frontend

## 🚀 Features

### ✅ Core Features

- User Authentication using httpOnly cookies(can't be accessed using js on frontend)
- Add, edit, and delete expense records
- List of all expenses
- Responsive and user-friendly interface
- Data visualization using charts (pie chart, bar chart)

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Chart.js (or similar for visualization), Tailwind CSS (optional for styling)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (or PostgreSQL)
- **Others**: REST API, Data Visualization

### 📊 Visualization

- Pie chart to show category-wise expense distribution
- Bar chart for monthly expense summary
