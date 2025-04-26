import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Plus, Trash2, Filter, ArrowLeft } from 'lucide-react';
import EmptyState from './EmptyState';
import axios from 'axios';
import ExpensesSummary from './ExpenseSummary';
import AddExpenseForm from './AddExpense';

const ExpenseForm = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
    const [currentView, setCurrentView] = useState("showSummary");
    const [expenseToEdit, setExpenseToEdit] = useState(null);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/expenses`, { withCredentials: true });
            setExpenses(res.data);
        } catch (err) {
            console.log('Error fetching expenses:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleSaved = () => {
        fetchExpenses();
        setCurrentView("showSummary");
        setExpenseToEdit(null);
    };

    const handleEdit = (expense) => {
        setExpenseToEdit(expense);
        setCurrentView("editExpense");
    };

    const uniqueCategories = [...new Set(expenses.map(expense => expense.category))];

    const filteredExpenses = filterCategory
        ? expenses.filter(expense => expense.category === filterCategory)
        : expenses;

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedExpenses = [...filteredExpenses].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/expenses/${id}`, { withCredentials: true });
                setExpenses(expenses.filter(expense => expense._id !== id));
            } catch (err) {
                console.log('Error deleting expense:', err);
                alert('Failed to delete expense');
            }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return null;
        }
        return sortConfig.direction === 'asc' 
            ? <span className="ml-1">↑</span> 
            : <span className="ml-1">↓</span>;
    };

    if (loading && currentView === "showSummary") {
        return <div className="text-center py-10">Loading expenses...</div>;
    }

    if (currentView === "addExpense" || currentView === "editExpense") {
        return (
            <AddExpenseForm
                onCancel={() => {
                    setCurrentView("showSummary");
                    setExpenseToEdit(null);
                }}
                expenseToEdit={expenseToEdit}
                onSaved={handleSaved}
            />
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Your Expenses</h1>
                <button
                    onClick={() => setCurrentView("addExpense")}
                    className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Expense
                </button>
            </div>

            {expenses.length > 0 ? (
                <>
                    <ExpensesSummary expenses={sortedExpenses} />

                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                            <h2 className="text-lg font-medium text-gray-900">Recent Transactions</h2>
                            <div className="flex items-center space-x-2">
                                <Filter className="h-5 w-5 text-gray-500" />
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="block w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                >
                                    <option value="">All Categories</option>
                                    {uniqueCategories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th 
                                            scope="col" 
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSort('date')}
                                        >
                                            <div className="flex items-center space-x-1">
                                                <span>Date</span>
                                                {getSortIcon('date')}
                                            </div>
                                        </th>
                                        <th 
                                            scope="col" 
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSort('category')}
                                        >
                                            <div className="flex items-center space-x-1">
                                                <span>Category</span>
                                                {getSortIcon('category')}
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th 
                                            scope="col" 
                                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSort('amount')}
                                        >
                                            <div className="flex items-center justify-end space-x-1">
                                                <span>Amount</span>
                                                {getSortIcon('amount')}
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sortedExpenses.map((expense) => (
                                        <motion.tr 
                                            key={expense._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                            whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatDate(expense.date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {expense.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {expense.description}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                                                {formatCurrency(expense.amount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(expense)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(expense._id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <EmptyState setCurrentView={setCurrentView} />
            )}
        </motion.div>
    );
};

export default ExpenseForm;