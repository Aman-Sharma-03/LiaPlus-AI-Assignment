import { useState } from 'react';
import { PieChart, BarChart, Wallet, TrendingUp } from 'lucide-react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const ExpensesSummary = ({ expenses }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const pieChartData = {
    labels: topCategories.map(([category]) => category),
    datasets: [
      {
        data: topCategories.map(([, amount]) => amount),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const monthlyTotals = {};
  expenses.forEach(expense => {
    const date = new Date(expense.date);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    monthlyTotals[monthYear] = (monthlyTotals[monthYear] || 0) + expense.amount;
  });

  const monthYearKeys = Object.keys(monthlyTotals).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
  }).slice(-6);

  const barChartData = {
    labels: monthYearKeys,
    datasets: [
      {
        label: 'Monthly Expenses',
        data: monthYearKeys.map(key => monthlyTotals[key]),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-5 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-medium text-gray-900">Expense Summary</h2>
            <p className="text-sm text-gray-500">Overview of your spending</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <p className="text-xl font-semibold text-blue-600">{formatCurrency(totalAmount)}</p>
          </div>
        </div>
      </div>
      
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Wallet className="h-4 w-4 mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'categories'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <PieChart className="h-4 w-4 mr-2" />
            Categories
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'trends'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Trends
          </button>
        </nav>
      </div>
      
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Top Spending Categories</h3>
              <div className="space-y-3">
                {topCategories.map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm text-gray-700">{category}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(amount)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Average Transaction</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatCurrency(totalAmount / (expenses.length || 1))}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Highest Expense</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatCurrency(Math.max(...expenses.map(e => e.amount), 0))}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Total Transactions</div>
                  <div className="text-lg font-semibold text-gray-900">{expenses.length}</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'categories' && (
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">Expenses by Category</h3>
            <Pie data={pieChartData} options={{ maintainAspectRatio: true }} />
          </div>
        )}
        
        {activeTab === 'trends' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">Monthly Expense Trends</h3>
            <Bar 
              data={barChartData} 
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpensesSummary;