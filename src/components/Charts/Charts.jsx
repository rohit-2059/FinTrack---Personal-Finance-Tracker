import { useMemo } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { useTheme } from '../../context/ThemeContext';
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
import { FaChartPie, FaChartBar } from 'react-icons/fa';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

function Charts() {
  const { transactions } = useTransactions();
  const { darkMode } = useTheme();

  const pieData = useMemo(() => {
    const categoryColors = {
      Food: '#f97316',
      Transport: '#3b82f6',
      Shopping: '#ec4899',
      Entertainment: '#8b5cf6',
      Bills: '#ef4444',
      Salary: '#10b981',
      Investment: '#06b6d4',
      Freelance: '#14b8a6',
      Gift: '#f59e0b',
      Other: '#6b7280'
    };
    
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryTotals = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
      return acc;
    }, {});

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    const backgroundColor = labels.map(cat => categoryColors[cat] || '#6b7280');

    return {
      labels,
      datasets: [{
        data,
        backgroundColor,
        borderWidth: 0,
        hoverOffset: 10
      }]
    };
  }, [transactions]);

  const barData = useMemo(() => {
    const last6Months = [];
    const monthlyData = { income: [], expense: [] };

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      last6Months.push(monthYear);

      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate >= monthStart && tDate <= monthEnd;
      });

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      const expense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      monthlyData.income.push(income);
      monthlyData.expense.push(expense);
    }

    return {
      labels: last6Months,
      datasets: [
        {
          label: 'Income',
          data: monthlyData.income,
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderRadius: 8,
          borderSkipped: false,
        },
        {
          label: 'Expenses',
          data: monthlyData.expense,
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderRadius: 8,
          borderSkipped: false,
        }
      ]
    };
  }, [transactions]);

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          color: darkMode ? '#d1d5db' : '#4b5563',
          font: {
            size: 12,
            weight: 500
          }
        }
      },
      tooltip: {
        backgroundColor: darkMode ? '#1e1e2f' : 'white',
        titleColor: darkMode ? '#f3f4f6' : '#1f2937',
        bodyColor: darkMode ? '#d1d5db' : '#4b5563',
        borderColor: darkMode ? '#3d3d52' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `₹${value.toLocaleString('en-IN')} (${percentage}%)`;
          }
        }
      }
    }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          color: darkMode ? '#d1d5db' : '#4b5563',
          font: {
            size: 12,
            weight: 500
          }
        }
      },
      tooltip: {
        backgroundColor: darkMode ? '#1e1e2f' : 'white',
        titleColor: darkMode ? '#f3f4f6' : '#1f2937',
        bodyColor: darkMode ? '#d1d5db' : '#4b5563',
        borderColor: darkMode ? '#3d3d52' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ₹${context.raw.toLocaleString('en-IN')}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: darkMode ? '#9ca3af' : '#6b7280'
        }
      },
      y: {
        grid: {
          color: darkMode ? '#3d3d52' : '#f3f4f6'
        },
        ticks: {
          color: darkMode ? '#9ca3af' : '#6b7280',
          callback: (value) => `₹${value.toLocaleString('en-IN')}`
        }
      }
    }
  };

  const hasExpenses = transactions.some(t => t.type === 'expense');
  const hasData = transactions.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      {/* Pie Chart */}
      <div className={`rounded-xl p-5 ${darkMode
        ? 'bg-[#16161e] border border-[#1e1e2a]'
        : 'bg-white border border-slate-200'
      }`}>
        <div className={`flex items-center gap-2.5 mb-4 pb-3 border-b ${darkMode ? 'border-[#1e1e2a]' : 'border-slate-100'}`}>
          <FaChartPie size={14} className={darkMode ? 'text-slate-500' : 'text-slate-400'} />
          <h3 className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Spending by Category
          </h3>
        </div>
        <div className="relative flex items-center justify-center h-[280px]">
          {hasExpenses ? (
            <Pie data={pieData} options={pieOptions} />
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <FaChartPie size={32} className={`mb-2 ${darkMode ? 'text-slate-700' : 'text-slate-200'}`} />
              <p className={`text-xs ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>No expense data to display</p>
            </div>
          )}
        </div>
      </div>

      {/* Bar Chart */}
      <div className={`rounded-xl p-5 ${darkMode
        ? 'bg-[#16161e] border border-[#1e1e2a]'
        : 'bg-white border border-slate-200'
      }`}>
        <div className={`flex items-center gap-2.5 mb-4 pb-3 border-b ${darkMode ? 'border-[#1e1e2a]' : 'border-slate-100'}`}>
          <FaChartBar size={14} className={darkMode ? 'text-slate-500' : 'text-slate-400'} />
          <h3 className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Income vs Expenses (Last 6 Months)
          </h3>
        </div>
        <div className="relative flex items-center justify-center h-[280px]">
          {hasData ? (
            <Bar data={barData} options={barOptions} />
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <FaChartBar size={32} className={`mb-2 ${darkMode ? 'text-slate-700' : 'text-slate-200'}`} />
              <p className={`text-xs ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>No transaction data to display</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Charts;
