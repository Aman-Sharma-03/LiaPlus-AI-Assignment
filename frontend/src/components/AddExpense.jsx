import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import axios from "axios";

const categories = [
  'Food', 'Transportation', 'Housing', 'Utilities', 
  'Entertainment', 'Healthcare', 'Shopping', 'Travel', 
  'Education', 'Personal', 'Gifts', 'Other'
];

const AddExpenseForm = ({ onCancel, expenseToEdit, onSaved }) => {
  const isEditing = !!expenseToEdit;
  
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (expenseToEdit) {
      const date = new Date(expenseToEdit.date);
      const formattedDate = date.toISOString().split('T')[0];
      
      setFormData({
        amount: expenseToEdit.amount,
        category: expenseToEdit.category,
        description: expenseToEdit.description,
        date: formattedDate
      });
    }
  }, [expenseToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || '' : value,
    }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await axios.put(`${import.meta.env.VITE_API_URL}/expenses/${expenseToEdit._id}`, formData, {
          withCredentials: true
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/expenses`, formData, {
          withCredentials: true
        });
      }
      onSaved();
    } catch (error) {
      console.error('Failed to save expense:', error);
      setApiError(
        `Failed to save expense: ${error.response?.data?.message || error.message || 'Unknown error'}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <div className="flex items-center mb-6">
        <button 
          onClick={onCancel}
          className="mr-3 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Expense' : 'Add New Expense'}
        </h1>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-500 to-blue-600">
          <h2 className="text-lg leading-6 font-medium text-white">
            {isEditing ? 'Update expense details' : 'Enter the details for your new expense'}
          </h2>
        </div>
        
        {apiError && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{apiError}</p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6 space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">Rs</span>
                </div>
                <input
                    type="number"
                    name="amount"
                    id="amount"
                    step="1"
                    value={formData.amount}
                    onChange={handleChange}
                    className={`block w-full pl-12 pr-16 py-2.5 sm:text-sm rounded-md ${
                    errors.amount ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="0.00"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">INR</span>
                </div>
            </div>
            {errors.amount && (
              <p className="mt-2 text-sm text-red-600" id="amount-error">
                {errors.amount}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              id="category"
              value={formData.category}
              onChange={handleChange}
              className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
                errors.category ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
              }`}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-2 text-sm text-red-600">
                {errors.category}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-3 ${
                  errors.description ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                }`}
                placeholder="Enter a description"
              />
            </div>
            {errors.description && (
              <p className="mt-2 text-sm text-red-600">
                {errors.description}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <div className="mt-1">
              <input
                type="date"
                name="date"
                id="date"
                value={formData.date}
                onChange={handleChange}
                className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                  errors.date ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                }`}
              />
            </div>
            {errors.date && (
              <p className="mt-2 text-sm text-red-600">
                {errors.date}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditing ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                <>{isEditing ? 'Update Expense' : 'Save Expense'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AddExpenseForm;