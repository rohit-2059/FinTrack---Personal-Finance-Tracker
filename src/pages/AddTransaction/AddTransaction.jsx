import { useTheme } from '../../context/ThemeContext';
import { useTransactions } from '../../context/TransactionContext';
import TransactionForm from '../../components/TransactionForm/TransactionForm';
import { FaArrowDown, FaArrowUp, FaLightbulb } from 'react-icons/fa';

function AddTransaction() {
  const { darkMode } = useTheme();
  const { transactions, balance, income, expenses } = useTransactions();

  const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  const lastDebits = sorted.filter(t => t.type === 'expense').slice(0, 5);
  const lastCredits = sorted.filter(t => t.type === 'income').slice(0, 5);

  const tips = [
    'Track every expense, no matter how small.',
    'Set a monthly budget and stick to it.',
    'Review your spending weekly.',
    'Categorize to find areas to cut back.',
  ];

  return (
    <div className={`h-screen flex flex-col px-4 sm:px-6 lg:px-10 pt-20 sm:pt-8 max-w-[1400px] overflow-hidden ${darkMode ? 'bg-[#0c0c14]' : 'bg-slate-50'}`}>
      {/* Header — fixed */}
      <div className="mb-6 flex-shrink-0">
        <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Add Transaction
        </h1>
        <p className={`mt-1 text-sm ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          Record your income or expense
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 pb-6">
        {/* Form — takes 2 columns, scrollable */}
        <div className="lg:col-span-2 overflow-y-auto scrollbar-hide">
          <TransactionForm />
        </div>

        {/* Sidebar — scrollable, hidden on mobile */}
        <div className="hidden lg:flex flex-col gap-5 overflow-y-auto scrollbar-hide">
          {/* Quick Stats */}
          <div className={`rounded-xl p-5 ${darkMode ? 'bg-[#16161e] border border-[#1e1e2a]' : 'bg-white border border-slate-200'}`}>
            <h3 className={`text-xs font-semibold uppercase tracking-wider mb-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Current Balance
            </h3>
            <p className={`text-3xl font-bold mb-4 ${balance >= 0 ? (darkMode ? 'text-emerald-400' : 'text-emerald-600') : 'text-red-500'}`}>
              ₹{Math.abs(balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className={`rounded-lg p-3 ${darkMode ? 'bg-emerald-500/5 border border-emerald-500/10' : 'bg-emerald-50 border border-emerald-100'}`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <FaArrowUp size={9} className={darkMode ? 'text-emerald-400' : 'text-emerald-600'} />
                  <span className={`text-[10px] font-medium uppercase ${darkMode ? 'text-emerald-400/70' : 'text-emerald-600/70'}`}>Income</span>
                </div>
                <p className={`text-sm font-semibold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  ₹{income.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className={`rounded-lg p-3 ${darkMode ? 'bg-red-500/5 border border-red-500/10' : 'bg-red-50 border border-red-100'}`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <FaArrowDown size={9} className={darkMode ? 'text-red-400' : 'text-red-600'} />
                  <span className={`text-[10px] font-medium uppercase ${darkMode ? 'text-red-400/70' : 'text-red-600/70'}`}>Expenses</span>
                </div>
                <p className={`text-sm font-semibold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                  ₹{expenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Debits */}
          <div className={`rounded-xl p-5 ${darkMode ? 'bg-[#16161e] border border-[#1e1e2a]' : 'bg-white border border-slate-200'}`}>
            <div className="flex items-center gap-2 mb-4">
              <FaArrowDown size={10} className={darkMode ? 'text-red-400' : 'text-red-500'} />
              <h3 className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Last 5 Debits
              </h3>
            </div>
            {lastDebits.length === 0 ? (
              <p className={`text-xs ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>No expenses yet</p>
            ) : (
              <div className="space-y-2.5">
                {lastDebits.map((t) => (
                  <div key={t.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        darkMode ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'
                      }`}>
                        <FaArrowDown size={9} />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-medium truncate ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t.title}</p>
                        <p className={`text-[10px] ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>{t.category}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold flex-shrink-0 ml-2 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                      -₹{t.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Credits */}
          <div className={`rounded-xl p-5 ${darkMode ? 'bg-[#16161e] border border-[#1e1e2a]' : 'bg-white border border-slate-200'}`}>
            <div className="flex items-center gap-2 mb-4">
              <FaArrowUp size={10} className={darkMode ? 'text-emerald-400' : 'text-emerald-500'} />
              <h3 className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Last 5 Credits
              </h3>
            </div>
            {lastCredits.length === 0 ? (
              <p className={`text-xs ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>No income yet</p>
            ) : (
              <div className="space-y-2.5">
                {lastCredits.map((t) => (
                  <div key={t.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        <FaArrowUp size={9} />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-medium truncate ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t.title}</p>
                        <p className={`text-[10px] ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>{t.category}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold flex-shrink-0 ml-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      +₹{t.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tips */}
          <div className={`rounded-xl p-5 mb-1 ${darkMode ? 'bg-[#16161e] border border-[#1e1e2a]' : 'bg-white border border-slate-200'}`}>
            <div className="flex items-center gap-2 mb-3">
              <FaLightbulb size={11} className={darkMode ? 'text-amber-400/70' : 'text-amber-500'} />
              <h3 className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Quick Tips
              </h3>
            </div>
            <ul className="space-y-2">
              {tips.map((tip, i) => (
                <li key={i} className={`text-xs leading-relaxed pl-3 border-l-2 ${darkMode ? 'text-slate-400 border-[#1e1e2a]' : 'text-slate-500 border-slate-200'}`}>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTransaction;
