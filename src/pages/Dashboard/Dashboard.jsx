import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import SummaryCards from '../../components/SummaryCards/SummaryCards';
import TransactionList from '../../components/TransactionList/TransactionList';
import Charts from '../../components/Charts/Charts';
import TransactionForm from '../../components/TransactionForm/TransactionForm';
import { FaPlus } from 'react-icons/fa';

function Dashboard() {
  const { darkMode } = useTheme();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="px-4 sm:px-6 lg:px-10 pt-20 pb-6 sm:py-8 max-w-[1400px]">
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Dashboard
        </h1>
        <p className={`mt-1 text-sm ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          Track your finances at a glance
        </p>
      </div>

      <SummaryCards />
      <Charts />
      <TransactionList limit={5} showFilters={false} title="Recent Transactions" />

      {/* Floating Add Button */}
      <button
        className={`fixed bottom-6 right-4 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-12 sm:h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 z-50 shadow-lg ${
          darkMode
            ? 'bg-white text-slate-900 hover:bg-slate-100'
            : 'bg-slate-900 text-white hover:bg-slate-800'
        }`}
        onClick={() => setShowModal(true)}
      >
        <FaPlus size={16} />
      </button>

      {showModal && (
        <TransactionForm
          isModal={true}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;
