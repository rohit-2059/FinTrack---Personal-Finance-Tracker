import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTransactions } from '../../context/TransactionContext';
import { FaEnvelope, FaEdit, FaSave, FaTimes, FaCalendarAlt, FaLock, FaFileExcel, FaFilePdf, FaEye, FaEyeSlash, FaCheck } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

function Profile() {
  const { currentUser, updateUserProfile, changePassword } = useAuth();
  const { darkMode } = useTheme();
  const { transactions } = useTransactions();

  // Name editing
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [nameLoading, setNameLoading] = useState(false);
  const [nameMessage, setNameMessage] = useState('');

  // Password change
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMessage, setPwdMessage] = useState('');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);

  // Export
  const [exportMessage, setExportMessage] = useState('');

  const handleSaveName = async () => {
    if (!displayName.trim()) { setNameMessage('Name cannot be empty'); return; }
    try {
      setNameLoading(true);
      await updateUserProfile({ displayName: displayName.trim() });
      setNameMessage('Name updated successfully!');
      setEditing(false);
      setTimeout(() => setNameMessage(''), 3000);
    } catch {
      setNameMessage('Failed to update name');
    } finally {
      setNameLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setPwdMessage('');
    if (!currentPwd) { setPwdMessage('Enter your current password'); return; }
    if (newPwd.length < 6) { setPwdMessage('New password must be at least 6 characters'); return; }
    if (newPwd !== confirmPwd) { setPwdMessage('Passwords do not match'); return; }
    try {
      setPwdLoading(true);
      await changePassword(currentPwd, newPwd);
      setPwdMessage('Password changed successfully!');
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
      setShowPasswordForm(false);
      setTimeout(() => setPwdMessage(''), 3000);
    } catch (error) {
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setPwdMessage('Current password is incorrect');
      } else {
        setPwdMessage('Failed to change password. Try again.');
      }
    } finally {
      setPwdLoading(false);
    }
  };

  const getJoinDate = () => {
    if (currentUser?.metadata?.creationTime) {
      return new Date(currentUser.metadata.creationTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    return 'N/A';
  };


  const getExportData = () => {
    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(t => ({
        Date: t.date,
        Title: t.title,
        Category: t.category,
        Type: t.type.charAt(0).toUpperCase() + t.type.slice(1),
        Amount: parseFloat(t.amount)
      }));
  };

  const exportToPDF = () => {
    const data = getExportData();
    if (data.length === 0) { setExportMessage('No transactions to export'); setTimeout(() => setExportMessage(''), 3000); return; }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('FinTrack - Transaction Report', 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, 14, 28);
    doc.text(`Total transactions: ${data.length}`, 14, 34);

    autoTable(doc, {
      startY: 42,
      head: [['Date', 'Title', 'Category', 'Type', 'Amount (₹)']],
      body: data.map(row => [
        row.Date,
        row.Title,
        row.Category,
        row.Type,
        row.Amount.toLocaleString('en-IN')
      ]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [30, 30, 42], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 250] },
    });

    doc.save('FinTrack_Transactions.pdf');
    setExportMessage('PDF downloaded!');
    setTimeout(() => setExportMessage(''), 3000);
  };

  const exportToExcel = () => {
    const data = getExportData();
    if (data.length === 0) { setExportMessage('No transactions to export'); setTimeout(() => setExportMessage(''), 3000); return; }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');

    // Column widths
    ws['!cols'] = [{ wch: 12 }, { wch: 25 }, { wch: 15 }, { wch: 10 }, { wch: 12 }];

    XLSX.writeFile(wb, 'FinTrack_Transactions.xlsx');
    setExportMessage('Excel downloaded!');
    setTimeout(() => setExportMessage(''), 3000);
  };

  const cardClass = `rounded-2xl p-6 ${darkMode
    ? 'bg-[#16161e] border border-[#1e1e2a]'
    : 'bg-white border border-slate-200 shadow-sm'
  }`;

  const inputClass = `w-full px-4 py-3 rounded-xl border text-base transition-all ${darkMode
    ? 'bg-[#111118] border-[#1e1e2a] text-slate-200 placeholder-slate-600 focus:border-slate-500'
    : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-slate-400'
  } focus:outline-none focus:ring-2 focus:ring-slate-500/20`;

  return (
    <div className={`min-h-screen px-4 sm:px-6 lg:px-10 pt-20 pb-6 sm:py-8 ${darkMode ? 'bg-[#0c0c14]' : 'bg-slate-50'}`}>
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Settings</h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            Manage your account and export data
          </p>
        </div>

        {/* Global messages */}
        {(nameMessage || pwdMessage || exportMessage) && (
          <div className={`mb-5 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
            (nameMessage + pwdMessage + exportMessage).includes('success') || (nameMessage + pwdMessage + exportMessage).includes('downloaded')
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500'
              : 'bg-red-500/10 border border-red-500/20 text-red-500'
          }`}>
            {(nameMessage + pwdMessage + exportMessage).includes('success') || (nameMessage + pwdMessage + exportMessage).includes('downloaded')
              ? <FaCheck size={12} /> : <FaTimes size={12} />}
            {nameMessage || pwdMessage || exportMessage}
          </div>
        )}

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Profile Info Card */}
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-5">
            <FaEdit size={13} className={darkMode ? 'text-slate-500' : 'text-slate-400'} />
            <h2 className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>Profile Information</h2>
          </div>

          {/* Avatar + basic info */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0 ${darkMode
              ? 'bg-gradient-to-br from-slate-700 to-slate-800 text-slate-200'
              : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600'
            }`}>
              {(currentUser?.displayName || currentUser?.email || 'U')[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className={`text-base font-semibold truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {currentUser?.displayName || 'User'}
              </p>
              <div className={`flex items-center gap-1.5 text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                <FaEnvelope size={10} />
                <span className="truncate">{currentUser?.email}</span>
              </div>
              <div className={`flex items-center gap-1.5 text-xs mt-0.5 ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                <FaCalendarAlt size={9} />
                <span>Member since {getJoinDate()}</span>
              </div>
            </div>
          </div>

          {/* Name field */}
          <div className="mb-1">
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Display Name
            </label>
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                  disabled={nameLoading}
                  className={inputClass}
                />
                <button
                  className="h-[46px] px-4 rounded-xl bg-emerald-600 text-white text-sm font-medium flex items-center gap-2 hover:bg-emerald-700 transition-all cursor-pointer flex-shrink-0"
                  onClick={handleSaveName}
                  disabled={nameLoading}
                >
                  <FaSave size={12} />
                  Save
                </button>
                <button
                  className={`h-[46px] px-3 rounded-xl flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${darkMode
                    ? 'bg-[#1e1e2a] text-slate-400 hover:bg-[#252530]'
                    : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                  }`}
                  onClick={() => { setEditing(false); setDisplayName(currentUser?.displayName || ''); }}
                >
                  <FaTimes size={13} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  {currentUser?.displayName || 'Not set'}
                </p>
                <button
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${darkMode
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-[#1e1e2a]'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                  }`}
                  onClick={() => setEditing(true)}
                >
                  <FaEdit size={10} />
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* Email (read-only) */}
          <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-[#1e1e2a]' : 'border-slate-100'}`}>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Email Address
            </label>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {currentUser?.email}
            </p>
            <p className={`text-[10px] mt-1 ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
              Email cannot be changed
            </p>
          </div>
        </div>

        {/* Change Password Card */}
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-5">
            <FaLock size={13} className={darkMode ? 'text-slate-500' : 'text-slate-400'} />
            <h2 className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>Change Password</h2>
          </div>

          {!showPasswordForm && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${darkMode
                ? 'bg-slate-700/30 border border-slate-700/50'
                : 'bg-slate-100 border border-slate-200'
              }`}>
                <FaLock size={24} className={darkMode ? 'text-slate-500' : 'text-slate-400'} />
              </div>
              <p className={`text-sm mb-2 text-center ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Password Security
              </p>
              <p className={`text-xs mb-6 text-center max-w-xs ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                Update your password regularly to keep your account secure. Use at least 6 characters.
              </p>
              <button
                className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${darkMode
                  ? 'bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-600'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
                onClick={() => setShowPasswordForm(true)}
              >
                Change Password
              </button>
            </div>
          )}

          {showPasswordForm && (
            <div className="mt-5 space-y-4">
              {/* Current Password */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPwd ? 'text' : 'password'}
                    value={currentPwd}
                    onChange={(e) => setCurrentPwd(e.target.value)}
                    placeholder="Enter current password"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer ${darkMode ? 'text-slate-600 hover:text-slate-400' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {showCurrentPwd ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPwd ? 'text' : 'password'}
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPwd(!showNewPwd)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer ${darkMode ? 'text-slate-600 hover:text-slate-400' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {showNewPwd ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  placeholder="Re-enter new password"
                  className={inputClass}
                />
              </div>

              {/* Password strength hint */}
              {newPwd && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          newPwd.length >= i * 3
                            ? newPwd.length >= 12 ? 'bg-emerald-500' : newPwd.length >= 8 ? 'bg-yellow-500' : 'bg-red-500'
                            : darkMode ? 'bg-[#1e1e2a]' : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-[10px] font-medium ${
                    newPwd.length >= 12 ? 'text-emerald-500' : newPwd.length >= 8 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {newPwd.length >= 12 ? 'Strong' : newPwd.length >= 8 ? 'Medium' : 'Weak'}
                  </span>
                </div>
              )}

              {/* Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-all cursor-pointer disabled:opacity-50"
                  onClick={handleChangePassword}
                  disabled={pwdLoading}
                >
                  {pwdLoading ? 'Updating...' : 'Update Password'}
                </button>
                <button
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${darkMode
                    ? 'bg-[#1e1e2a] text-slate-400 hover:bg-[#252530]'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                  onClick={() => {
                    setShowPasswordForm(false);
                    setCurrentPwd('');
                    setNewPwd('');
                    setConfirmPwd('');
                    setPwdMessage('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Export Transactions Card */}
        <div className={`${cardClass} lg:col-span-2`}>
          <div className="flex items-center gap-2 mb-2">
            <FaFileExcel size={13} className={darkMode ? 'text-slate-500' : 'text-slate-400'} />
            <h2 className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>Export Transactions</h2>
          </div>
          <p className={`text-xs mb-5 ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
            Download all {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} as PDF or Excel
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={exportToPDF}
              className={`flex-1 flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${darkMode
                ? 'bg-[#1e1e2a] text-slate-300 border border-[#2a2a3a] hover:bg-[#252530]'
                : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
              }`}
            >
              <FaFilePdf size={16} />
              Export as PDF
            </button>
            <button
              onClick={exportToExcel}
              className={`flex-1 flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${darkMode
                ? 'bg-[#1e1e2a] text-slate-300 border border-[#2a2a3a] hover:bg-[#252530]'
                : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
              }`}
            >
              <FaFileExcel size={16} />
              Export as Excel
            </button>
          </div>
        </div>

        </div>{/* end grid */}
      </div>
    </div>
  );
}

export default Profile;
