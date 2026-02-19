import { useState } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { useTheme } from '../../context/ThemeContext';
import { FaEdit, FaTrash, FaTimes, FaCheck, FaShoppingBag, FaCar, FaUtensils, FaFilm, FaFileInvoice, FaBriefcase, FaChartLine, FaEllipsisH } from 'react-icons/fa';

const categoryIcons = {
  Food: FaUtensils,
  Transport: FaCar,
  Shopping: FaShoppingBag,
  Entertainment: FaFilm,
  Bills: FaFileInvoice,
  Salary: FaBriefcase,
  Investment: FaChartLine,
  Other: FaEllipsisH
};

function TransactionItem({ transaction }) {
  const { updateTransaction, deleteTransaction } = useTransactions();
  const { darkMode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: transaction.title,
    amount: transaction.amount,
    category: transaction.category,
    date: transaction.date,
    type: transaction.type
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleSave = async () => {
    try {
      await updateTransaction(transaction.id, editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTransaction(transaction.id);
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const IconComponent = categoryIcons[transaction.category] || FaEllipsisH;

  const inputClass = `w-full px-3 py-2 rounded-lg border text-base transition-all ${darkMode
    ? 'bg-[#111118] border-[#1e1e2a] text-slate-200 focus:border-slate-500'
    : 'bg-white border-slate-200 text-slate-800 focus:border-slate-400'
  } focus:outline-none`;

  if (isEditing) {
    return (
      <div className={`flex flex-col gap-3 p-4 rounded-lg border ${darkMode ? 'bg-[#111118] border-slate-600' : 'bg-slate-50 border-slate-300'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            placeholder="Title"
            className={inputClass}
          />
          <input
            type="number"
            value={editData.amount}
            onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
            placeholder="Amount"
            className={inputClass}
          />
          <select
            value={editData.category}
            onChange={(e) => setEditData({ ...editData, category: e.target.value })}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Bills">Bills</option>
            <option value="Salary">Salary</option>
            <option value="Investment">Investment</option>
            <option value="Other">Other</option>
          </select>
          <select
            value={editData.type}
            onChange={(e) => setEditData({ ...editData, type: e.target.value })}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input
            type="date"
            value={editData.date}
            onChange={(e) => setEditData({ ...editData, date: e.target.value })}
            className={inputClass}
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button
            className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-all cursor-pointer"
            onClick={handleSave}
          >
            <FaCheck size={12} />
          </button>
          <button
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${darkMode
              ? 'bg-[#1e1e2a] text-slate-400 hover:bg-[#252530]'
              : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
            }`}
            onClick={() => setIsEditing(false)}
          >
            <FaTimes size={12} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3.5 px-3.5 py-3 rounded-lg transition-all group ${isDeleting ? 'opacity-0 translate-x-full' : ''} ${darkMode
      ? 'hover:bg-[#1a1a24]'
      : 'hover:bg-slate-50'
    }`}>
      {/* Icon */}
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${darkMode
        ? 'bg-slate-800 text-slate-400'
        : 'bg-slate-100 text-slate-500'
      }`}>
        <IconComponent size={14} />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-medium truncate ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
          {transaction.title}
        </h4>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-[10px] px-1.5 py-0.5 rounded ${darkMode ? 'bg-[#1e1e2a] text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
            {transaction.category}
          </span>
          <span className={`text-[10px] ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
            {formatDate(transaction.date)}
          </span>
        </div>
      </div>

      {/* Amount */}
      <span className={`text-sm font-semibold flex-shrink-0 ${transaction.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
        {transaction.type === 'income' ? '+' : '-'}
        {formatCurrency(transaction.amount)}
      </span>

      {/* Actions */}
      <div className="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <button
          className={`w-9 h-9 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${darkMode
            ? 'text-slate-500 hover:bg-[#1e1e2a] hover:text-slate-300'
            : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
          }`}
          onClick={() => setIsEditing(true)}
        >
          <FaEdit size={11} />
        </button>
        <button
          className={`w-9 h-9 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${darkMode
            ? 'text-slate-500 hover:bg-red-500/10 hover:text-red-400'
            : 'text-slate-400 hover:bg-red-50 hover:text-red-500'
          }`}
          onClick={() => {
            setIsDeleting(true);
            setTimeout(handleDelete, 300);
          }}
        >
          <FaTrash size={11} />
        </button>
      </div>
    </div>
  );
}

export default TransactionItem;
