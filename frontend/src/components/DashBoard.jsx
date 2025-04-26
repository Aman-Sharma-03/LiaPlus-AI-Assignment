import React from 'react'
import Header from './Header'
import ExpenseForm from './ExpenseForm'

const DashBoard = () => {
  return (
    <div className='px-10'>
      <Header />
      <ExpenseForm />
    </div>
  )
}

export default DashBoard