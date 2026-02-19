import { useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useTransactions } from '../../context/TransactionContext';
import TransactionList from '../../components/TransactionList/TransactionList';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

function Transactions() {
  const { darkMode } = useTheme();
  const { transactions } = useTransactions();
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const calYear = calendarDate.getFullYear();
  const calMonth = calendarDate.getMonth();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay();
  const monthName = calendarDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const today = new Date();
  const isToday = (day) => today.getFullYear() === calYear && today.getMonth() === calMonth && today.getDate() === day;
  const formatDayKey = (day) => `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const dayMap = useMemo(() => {
    const map = {};
    transactions.forEach(t => {
      const d = t.date;
      if (!map[d]) map[d] = { income: false, expense: false };
      if (t.type === 'income') map[d].income = true;
      else map[d].expense = true;
    });
    return map;
  }, [transactions]);

  const prevMonth = () => { setCalendarDate(new Date(calYear, calMonth - 1, 1)); setSelectedDate(null); };
  const nextMonth = () => { setCalendarDate(new Date(calYear, calMonth + 1, 1)); setSelectedDate(null); };
  const goToday = () => { setCalendarDate(new Date()); setSelectedDate(null); };

  const handleDayClick = (day) => {
    const key = formatDayKey(day);
    setSelectedDate(selectedDate === key ? null : key);
  };

  const selectedLabel = selectedDate
    ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  const cardClass = `rounded-2xl p-5 ${darkMode
    ? 'bg-[#16161e] border border-[#1e1e2a]'
    : 'bg-white border border-slate-200 shadow-sm'
  }`;

  return (
    <div className={`min-h-screen px-4 sm:px-6 lg:px-10 pt-20 pb-6 sm:py-8 ${darkMode ? 'bg-[#0c0c14]' : 'bg-slate-50'}`}>
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            All Transactions
          </h1>
          <p className={`mt-1 text-sm ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            View, search and filter all your transactions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Calendar Sidebar — pure date filter */}
          <div className="lg:col-span-1">
            <div className={`${cardClass} sticky top-8`}>
              {/* Month nav */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt size={12} className={darkMode ? 'text-slate-500' : 'text-slate-400'} />
                  <h3 className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    {monthName}
                  </h3>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={goToday} className={`px-2 py-1 rounded-lg text-[9px] font-semibold transition-all cursor-pointer ${darkMode ? 'bg-[#1e1e2a] text-slate-400 hover:text-slate-200' : 'bg-slate-100 text-slate-500 hover:text-slate-700'}`}>
                    Today
                  </button>
                  <button onClick={prevMonth} className={`w-9 h-9 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${darkMode ? 'hover:bg-[#1e1e2a] text-slate-500 hover:text-slate-300' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'}`}>
                    <FaChevronLeft size={9} />
                  </button>
                  <button onClick={nextMonth} className={`w-9 h-9 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${darkMode ? 'hover:bg-[#1e1e2a] text-slate-500 hover:text-slate-300' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'}`}>
                    <FaChevronRight size={9} />
                  </button>
                </div>
              </div>

              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-0.5 mb-1">
                {weekdays.map((d, i) => (
                  <div key={i} className={`text-center text-[9px] font-bold uppercase tracking-widest py-1.5 ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Day grid */}
              <div className="grid grid-cols-7 gap-0.5">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`e-${i}`} className="aspect-square" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const key = formatDayKey(day);
                  const data = dayMap[key];
                  const hasIncome = data?.income;
                  const hasExpense = data?.expense;
                  const todayBool = isToday(day);
                  const isSelected = selectedDate === key;

                  return (
                    <button
                      key={day}
                      onClick={() => handleDayClick(day)}
                      className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? darkMode
                            ? 'bg-slate-700 ring-2 ring-slate-500 scale-105'
                            : 'bg-slate-800 ring-2 ring-slate-600 scale-105'
                          : todayBool
                            ? darkMode
                              ? 'bg-[#1e1e2a] ring-1 ring-slate-600'
                              : 'bg-slate-100 ring-1 ring-slate-300'
                            : darkMode
                              ? 'hover:bg-[#1a1a24]'
                              : 'hover:bg-slate-50'
                      }`}
                    >
                      <span className={`text-[10px] font-semibold leading-none ${
                        isSelected
                          ? 'text-white'
                          : todayBool
                            ? darkMode ? 'text-slate-200' : 'text-slate-800'
                            : darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {day}
                      </span>
                      {(hasIncome || hasExpense) && (
                        <div className="flex gap-px mt-0.5">
                          {hasIncome && <span className="w-1 h-1 rounded-full bg-emerald-500" />}
                          {hasExpense && <span className="w-1 h-1 rounded-full bg-red-500" />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Dot legend */}
              <div className={`flex items-center justify-center gap-4 mt-3 pt-3 border-t ${darkMode ? 'border-[#1e1e2a]' : 'border-slate-100'}`}>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className={`text-[9px] font-medium ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Income</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span className={`text-[9px] font-medium ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Expense</span>
                </div>
              </div>

              {/* Active date filter badge */}
              {selectedDate && (
                <div className={`mt-4 flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${darkMode ? 'bg-slate-800/60 border border-slate-700/50' : 'bg-slate-100 border border-slate-200'}`}>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt size={10} className="text-blue-500" />
                    <span className={`text-[10px] font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{selectedLabel}</span>
                  </div>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className={`w-5 h-5 rounded-md flex items-center justify-center cursor-pointer transition-colors ${darkMode ? 'text-slate-500 hover:text-white hover:bg-slate-600' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'}`}
                  >
                    <FaTimes size={8} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Transaction List */}
          <div className="lg:col-span-3">
            <TransactionList title="Transactions" filterDate={selectedDate} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transactions;
