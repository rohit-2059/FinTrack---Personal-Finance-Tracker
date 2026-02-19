import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTransactions } from '../../context/TransactionContext';
import { useTheme } from '../../context/ThemeContext';
import TransactionItem from './TransactionItem';
import { FaSearch, FaSlidersH, FaInbox, FaArrowRight } from 'react-icons/fa';

function TransactionList({ limit, showFilters: enableFilters = true, title = 'Recent Transactions', filterDate = null }) {
  const { transactions, loading } = useTransactions();
  const { darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Salary', 'Investment', 'Other'];

  const filteredTransactions = transactions
    .filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
      const matchesDate = !filterDate || t.date === filterDate;
      return matchesSearch && matchesType && matchesCategory && matchesDate;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'amount') {
        return parseFloat(b.amount) - parseFloat(a.amount);
      }
      return 0;
    });

  const displayTransactions = limit ? filteredTransactions.slice(0, limit) : filteredTransactions;
  const hasMore = limit && filteredTransactions.length > limit;

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center p-12 rounded-xl ${darkMode
        ? 'bg-[#16161e] border border-[#1e1e2a]'
        : 'bg-white border border-slate-200'
      }`}>
        <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
        <p className={`mt-3 text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-5 ${darkMode
      ? 'bg-[#16161e] border border-[#1e1e2a]'
      : 'bg-white border border-slate-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          {title}
        </h2>
        <div className="flex items-center gap-2">
          {enableFilters && (
            <button
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${darkMode
                ? 'bg-[#1e1e2a] text-slate-400 hover:text-slate-300'
                : 'bg-slate-100 text-slate-500 hover:text-slate-700'
              }`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaSlidersH size={11} />
              Filters
            </button>
          )}
          {limit && (
            <Link
              to="/transactions"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${darkMode
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              View All
              <FaArrowRight size={9} />
            </Link>
          )}
        </div>
      </div>

      {/* Search */}
      {enableFilters && (
        <div className="relative mb-3">
          <FaSearch size={12} className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-600' : 'text-slate-400'}`} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-4 py-2.5 rounded-lg border text-base transition-all ${darkMode
              ? 'bg-[#111118] border-[#1e1e2a] text-slate-200 placeholder-slate-600 focus:border-slate-600'
              : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-slate-400'
            } focus:outline-none`}
          />
        </div>
      )}

      {/* Filters */}
      {enableFilters && showFilters && (
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg mb-3 ${darkMode ? 'bg-[#111118]' : 'bg-slate-50'}`}>
          <div>
            <label className={`block text-[10px] font-semibold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`w-full px-2.5 py-2 rounded-lg border text-xs cursor-pointer ${darkMode
                ? 'bg-[#16161e] border-[#1e1e2a] text-slate-300'
                : 'bg-white border-slate-200 text-slate-700'
              } focus:outline-none`}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label className={`block text-[10px] font-semibold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`w-full px-2.5 py-2 rounded-lg border text-xs cursor-pointer ${darkMode
                ? 'bg-[#16161e] border-[#1e1e2a] text-slate-300'
                : 'bg-white border-slate-200 text-slate-700'
              } focus:outline-none`}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={`block text-[10px] font-semibold uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`w-full px-2.5 py-2 rounded-lg border text-xs cursor-pointer ${darkMode
                ? 'bg-[#16161e] border-[#1e1e2a] text-slate-300'
                : 'bg-white border-slate-200 text-slate-700'
              } focus:outline-none`}
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
            </select>
          </div>
        </div>
      )}

      {/* Transaction list */}
      <div className={`flex flex-col gap-1.5 ${limit ? '' : 'max-h-[600px] overflow-y-auto pr-1'}`}>
        {displayTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <FaInbox size={28} className={`mb-2 ${darkMode ? 'text-slate-700' : 'text-slate-200'}`} />
            <h3 className={`text-sm font-medium mb-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              No transactions found
            </h3>
            <p className={`text-xs ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
              {enableFilters ? 'Try adjusting your filters or add a new transaction' : 'Add your first transaction to get started'}
            </p>
          </div>
        ) : (
          displayTransactions.map(transaction => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))
        )}
      </div>

      {/* Footer */}
      {displayTransactions.length > 0 && (
        <div className={`mt-3 pt-3 border-t flex items-center justify-between text-xs ${darkMode ? 'border-[#1e1e2a] text-slate-600' : 'border-slate-100 text-slate-400'}`}>
          <span>
            Showing {displayTransactions.length} of {transactions.length} transactions
          </span>
          {hasMore && (
            <Link
              to="/transactions"
              className={`flex items-center gap-1 font-medium transition-colors ${darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
            >
              See all <FaArrowRight size={8} />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default TransactionList;
