import { Plus, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const EmptyState = ({setCurrentView}) => {
  return (
    <motion.div 
      className="bg-white shadow rounded-lg py-12 px-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto h-16 w-16 bg-blue-100 flex items-center justify-center rounded-full">
        <DollarSign className="h-8 w-8 text-blue-600" />
      </div>
      <h3 className="mt-6 text-xl font-medium text-gray-900">No expenses yet</h3>
      <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
        Start tracking your expenses by adding your first expense. You'll be able to categorize, analyze, and manage your finances better.
      </p>
      <div className="mt-6">
        <button
          onClick={() => setCurrentView("addExpense")}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Your First Expense
        </button>
      </div>
    </motion.div>
  );
};

export default EmptyState;