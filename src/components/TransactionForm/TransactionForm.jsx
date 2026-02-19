import { useState, useRef, useEffect } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/style.css';
import {
  FaPlus, FaTimes, FaArrowDown, FaArrowUp, FaCheck, FaCalendarAlt, FaChevronLeft, FaChevronRight,
  FaUtensils, FaBus, FaShoppingBag, FaGamepad, FaFileInvoiceDollar, FaEllipsisH,
  FaMoneyBillWave, FaChartLine, FaLaptopCode, FaGift
} from 'react-icons/fa';

const categoryIcons = {
  Food: FaUtensils,
  Transport: FaBus,
  Shopping: FaShoppingBag,
  Entertainment: FaGamepad,
  Bills: FaFileInvoiceDollar,
  Salary: FaMoneyBillWave,
  Investment: FaChartLine,
  Freelance: FaLaptopCode,
  Gift: FaGift,
  Other: FaEllipsisH,
};

function TransactionForm({ isModal = false, onClose }) {
  const { addTransaction } = useTransactions();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const calendarRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: 'Other',
    customCategory: '',
    date: new Date()
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  const categories = {
    expense: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Other'],
    income: ['Salary', 'Investment', 'Freelance', 'Gift', 'Other']
  };

  // Close calendar on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };
    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCalendar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'type' && { category: 'Other', customCategory: '' })
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Please enter a title');
      return;
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (formData.category === 'Other' && !formData.customCategory.trim()) {
      setError('Please specify the category');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const finalCategory = formData.category === 'Other' && formData.customCategory.trim()
        ? formData.customCategory.trim()
        : formData.category;

      await addTransaction({
        title: formData.title.trim(),
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: finalCategory,
        date: format(formData.date, 'yyyy-MM-dd')
      });
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (isModal && onClose) {
          onClose();
        } else {
          navigate('/');
        }
      }, 1500);
      
      setFormData({
        title: '',
        amount: '',
        type: 'expense',
        category: 'Other',
        customCategory: '',
        date: new Date()
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
      setError('Failed to add transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full px-4 py-3.5 rounded-xl border text-base transition-all ${darkMode
    ? 'bg-[#111118] border-[#1e1e2a] text-slate-200 placeholder-slate-600 focus:border-slate-500'
    : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-slate-400'
  } focus:outline-none disabled:opacity-50`;

  const labelClass = `block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`;

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!isModal && (
        <h2 className={`text-lg font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
          Add New Transaction
        </h2>
      )}
      
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          <FaTimes size={12} />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm">
          <FaCheck size={12} />
          Transaction added successfully!
        </div>
      )}

      {/* Type Selector */}
      <div>
        <label className={labelClass}>Type</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className={`flex items-center justify-center gap-2.5 py-4 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              formData.type === 'expense'
                ? darkMode
                  ? 'bg-red-500/10 text-red-400 border-2 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.08)]'
                  : 'bg-red-50 text-red-600 border-2 border-red-300'
                : darkMode
                  ? 'bg-[#111118] text-slate-500 border border-[#1e1e2a] hover:border-[#2a2a3a]'
                  : 'bg-slate-50 text-slate-400 border border-slate-200 hover:border-slate-300'
            }`}
            onClick={() => handleChange({ target: { name: 'type', value: 'expense' } })}
          >
            <FaArrowDown size={14} />
            Expense
          </button>
          <button
            type="button"
            className={`flex items-center justify-center gap-2.5 py-4 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              formData.type === 'income'
                ? darkMode
                  ? 'bg-emerald-500/10 text-emerald-400 border-2 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.08)]'
                  : 'bg-emerald-50 text-emerald-600 border-2 border-emerald-300'
                : darkMode
                  ? 'bg-[#111118] text-slate-500 border border-[#1e1e2a] hover:border-[#2a2a3a]'
                  : 'bg-slate-50 text-slate-400 border border-slate-200 hover:border-slate-300'
            }`}
            onClick={() => handleChange({ target: { name: 'type', value: 'income' } })}
          >
            <FaArrowUp size={14} />
            Income
          </button>
        </div>
      </div>

      {/* Title & Amount side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Grocery Shopping"
            disabled={loading}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Amount (₹)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            disabled={loading}
            className={inputClass}
          />
        </div>
      </div>

      {/* Category Grid */}
      <div>
        <label className={labelClass}>Category</label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {categories[formData.type].map(cat => {
            const Icon = categoryIcons[cat] || FaEllipsisH;
            const isSelected = formData.category === cat;
            const isExpense = formData.type === 'expense';
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, category: cat, ...(cat !== 'Other' && { customCategory: '' }) }))}
                className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-[11px] font-medium transition-all cursor-pointer ${
                  isSelected
                    ? isExpense
                      ? darkMode
                        ? 'bg-red-500/10 text-red-400 border-2 border-red-500/30'
                        : 'bg-red-50 text-red-600 border-2 border-red-300'
                      : darkMode
                        ? 'bg-emerald-500/10 text-emerald-400 border-2 border-emerald-500/30'
                        : 'bg-emerald-50 text-emerald-600 border-2 border-emerald-300'
                    : darkMode
                      ? 'bg-[#111118] text-slate-500 border border-[#1e1e2a] hover:border-[#2a2a3a] hover:text-slate-400'
                      : 'bg-slate-50 text-slate-400 border border-slate-200 hover:border-slate-300 hover:text-slate-600'
                }`}
              >
                <Icon size={16} />
                {cat}
              </button>
            );
          })}
        </div>

        {/* Custom category input when "Other" is selected */}
        {formData.category === 'Other' && (
          <div className="mt-3">
            <input
              type="text"
              name="customCategory"
              value={formData.customCategory}
              onChange={handleChange}
              placeholder="What type of category? e.g. Healthcare, Education..."
              disabled={loading}
              className={inputClass}
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Date — Calendar Picker */}
      <div>
        <label className={labelClass}>Date</label>
        <div className="relative" ref={calendarRef}>
          <button
            type="button"
            onClick={() => setShowCalendar(!showCalendar)}
            className={`${inputClass} flex items-center justify-between cursor-pointer text-left`}
          >
            <span>{format(formData.date, 'EEEE, MMMM d, yyyy')}</span>
            <FaCalendarAlt size={14} className={darkMode ? 'text-slate-500' : 'text-slate-400'} />
          </button>

          {showCalendar && (
            <div className={`absolute z-50 bottom-full mb-2 rounded-xl shadow-2xl border p-4 ${
              darkMode
                ? 'bg-[#16161e] border-[#1e1e2a] shadow-black/40'
                : 'bg-white border-slate-200 shadow-slate-200/60'
            }`}>
              <DayPicker
                mode="single"
                selected={formData.date}
                onSelect={(day) => {
                  if (day) {
                    setFormData(prev => ({ ...prev, date: day }));
                    setShowCalendar(false);
                  }
                }}
                defaultMonth={formData.date}
                showOutsideDays
                classNames={{
                  root: 'rdp-custom',
                  months: 'flex flex-col',
                  month_caption: `flex items-center justify-center text-sm font-semibold mb-3 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`,
                  nav: 'flex items-center justify-between absolute top-4 left-4 right-4',
                  button_previous: `w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${darkMode ? 'text-slate-400 hover:bg-[#1e1e2a] hover:text-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`,
                  button_next: `w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${darkMode ? 'text-slate-400 hover:bg-[#1e1e2a] hover:text-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`,
                  weekdays: `grid grid-cols-7 mb-1`,
                  weekday: `text-center text-[10px] font-semibold uppercase tracking-wider py-2 ${darkMode ? 'text-slate-600' : 'text-slate-400'}`,
                  weeks: '',
                  week: 'grid grid-cols-7',
                  day: `relative text-center p-0`,
                  day_button: `w-10 h-10 rounded-lg text-sm transition-all cursor-pointer mx-auto flex items-center justify-center ${darkMode ? 'text-slate-300 hover:bg-[#1e1e2a]' : 'text-slate-700 hover:bg-slate-100'}`,
                  selected: `!bg-white !text-slate-900 font-bold ${darkMode ? '!bg-white !text-slate-900' : '!bg-slate-900 !text-white'}`,
                  today: `font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`,
                  outside: `opacity-30`,
                  disabled: 'opacity-20 cursor-not-allowed',
                }}
                components={{
                  Chevron: ({ orientation }) =>
                    orientation === 'left'
                      ? <FaChevronLeft size={12} />
                      : <FaChevronRight size={12} />,
                }}
              />
              <div className={`mt-3 pt-3 border-t flex items-center justify-between ${darkMode ? 'border-[#1e1e2a]' : 'border-slate-100'}`}>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, date: new Date() }));
                    setShowCalendar(false);
                  }}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    darkMode ? 'text-slate-400 hover:bg-[#1e1e2a] hover:text-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                  }`}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setShowCalendar(false)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    darkMode ? 'text-slate-400 hover:bg-[#1e1e2a] hover:text-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit */}
      <button 
        type="submit" 
        disabled={loading}
        className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${darkMode
          ? 'bg-white text-slate-900 hover:bg-slate-100'
          : 'bg-slate-900 text-white hover:bg-slate-800'
        }`}
      >
        {loading ? (
          <span className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
        ) : (
          <>
            <FaPlus size={13} />
            Add Transaction
          </>
        )}
      </button>
    </form>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
        <div className={`relative w-full max-w-xl my-8 p-6 rounded-xl ${darkMode
          ? 'bg-[#16161e] border border-[#1e1e2a]'
          : 'bg-white border border-slate-200'
        }`} onClick={e => e.stopPropagation()}>
          <button
            className={`absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${darkMode
              ? 'text-slate-500 hover:bg-[#1e1e2a] hover:text-slate-300'
              : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
            }`}
            onClick={onClose}
          >
            <FaTimes size={14} />
          </button>
          <h2 className={`text-lg font-semibold mb-5 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
            Add New Transaction
          </h2>
          {formContent}
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-6 ${darkMode
      ? 'bg-[#16161e] border border-[#1e1e2a]'
      : 'bg-white border border-slate-200'
    }`}>
      {formContent}
    </div>
  );
}

export default TransactionForm;
