import { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

const TransactionContext = createContext();

export function useTransactions() {
  return useContext(TransactionContext);
}

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      // Reset state asynchronously to avoid direct setState in effect
      Promise.resolve().then(() => {
        setTransactions([]);
        setLoading(false);
      });
      return;
    }

    // Query without orderBy to avoid needing composite index
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transactionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort client-side by date descending
      transactionsData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(transactionsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching transactions:', error);
      // Show alert so user knows there's an issue
      alert('Error loading transactions: ' + error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  async function addTransaction(transaction) {
    if (!currentUser) return;
    
    return addDoc(collection(db, 'transactions'), {
      ...transaction,
      userId: currentUser.uid,
      createdAt: new Date().toISOString()
    });
  }

  async function updateTransaction(id, updates) {
    const transactionRef = doc(db, 'transactions', id);
    return updateDoc(transactionRef, updates);
  }

  async function deleteTransaction(id) {
    const transactionRef = doc(db, 'transactions', id);
    return deleteDoc(transactionRef);
  }

  // Calculate totals
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  const balance = income - expenses;

  const value = {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    income,
    expenses,
    balance
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}
