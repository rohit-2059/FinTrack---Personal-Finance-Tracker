import { useTransactions } from '../../context/TransactionContext';
import { useTheme } from '../../context/ThemeContext';
import { FaWallet, FaArrowUp, FaArrowDown } from 'react-icons/fa';

function SummaryCards() {
  const { balance, income, expenses } = useTransactions();
  const { darkMode } = useTheme();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const cards = [
    {
      label: 'Total Balance',
      value: balance,
      icon: FaWallet,
      valueColor: balance >= 0 ? (darkMode ? 'text-emerald-400' : 'text-emerald-600') : (darkMode ? 'text-red-400' : 'text-red-600'),
    },
    {
      label: 'Total Income',
      value: income,
      icon: FaArrowUp,
      valueColor: darkMode ? 'text-emerald-400' : 'text-emerald-600',
    },
    {
      label: 'Total Expenses',
      value: expenses,
      icon: FaArrowDown,
      valueColor: darkMode ? 'text-red-400' : 'text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`rounded-xl p-5 transition-colors duration-200 ${
              darkMode
                ? 'bg-[#16161e] border border-[#1e1e2a]'
                : 'bg-white border border-slate-200'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
              }`}>
                <Icon size={16} />
              </div>
              <div>
                <p className={`text-xs font-medium uppercase tracking-wider mb-0.5 ${
                  darkMode ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  {card.label}
                </p>
                <p className={`text-xl font-semibold tracking-tight ${card.valueColor}`}>
                  {formatCurrency(card.value)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SummaryCards;
