import { useState, useEffect, useCallback } from 'react';
import { Transaction, UserProfile, FinancialStats } from '../types';
import { db, auth, isFirebaseReady } from './firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, setDoc, doc, getDoc } from 'firebase/firestore';

export function useStore() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Auth observer
  useEffect(() => {
    if (!auth) return;
    return auth.onAuthStateChanged((user: any) => {
      setCurrentUser(user);
      if (!user) setLoading(false);
    });
  }, []);

  // Fetch Profile & Transactions
  useEffect(() => {
    if (!currentUser || !isFirebaseReady()) {
      // Fallback to localStorage for guest/no-firebase mode
      const saved = localStorage.getItem('gestao_financeira_data');
      if (saved) {
        const { transactions: t, profile: p } = JSON.parse(saved);
        setTransactions(t.map((item: any) => ({ ...item, date: new Date(item.date) })));
        setProfile(p);
      }
      setLoading(false);
      return;
    }

    setLoading(true);

    // Profile listener
    const profileRef = doc(db, 'userProfiles', currentUser.uid);
    const unsubProfile = onSnapshot(profileRef, (doc) => {
      if (doc.exists()) {
        setProfile(doc.data() as UserProfile);
      } else {
        // Init default profile
        const defaultProfile = { userId: currentUser.uid, salaryReserve: 0, updatedAt: new Date() };
        setDoc(profileRef, defaultProfile);
        setProfile(defaultProfile);
      }
    });

    // Transactions listener
    const q = query(collection(db, 'transactions'), where('userId', '==', currentUser.uid));
    const unsubTransactions = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Transaction[];
      
      // Sort by date descending
      setTransactions(data.sort((a, b) => b.date.getTime() - a.date.getTime()));
      setLoading(false);
    });

    return () => {
      unsubProfile();
      unsubTransactions();
    };
  }, [currentUser]);

  const addTransaction = async (data: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => {
    if (currentUser && isFirebaseReady()) {
      await addDoc(collection(db, 'transactions'), {
        ...data,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
      });
    } else {
      const newT = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        userId: 'guest',
        createdAt: new Date(),
      };
      const updated = [newT, ...transactions];
      setTransactions(updated);
      localStorage.setItem('gestao_financeira_data', JSON.stringify({ transactions: updated, profile }));
    }
  };

  const deleteTransaction = async (id: string) => {
    if (currentUser && isFirebaseReady()) {
      const { deleteDoc, doc: fireDoc } = await import('firebase/firestore');
      await deleteDoc(fireDoc(db, 'transactions', id));
    } else {
      const updated = transactions.filter(t => t.id !== id);
      setTransactions(updated);
      localStorage.setItem('gestao_financeira_data', JSON.stringify({ transactions: updated, profile }));
    }
  };

  const clearAllTransactions = async () => {
    if (currentUser && isFirebaseReady()) {
      const { writeBatch, doc: fireDoc } = await import('firebase/firestore');
      const batch = writeBatch(db);
      transactions.forEach(t => {
        batch.delete(fireDoc(db, 'transactions', t.id));
      });
      await batch.commit();
    } else {
      setTransactions([]);
      localStorage.setItem('gestao_financeira_data', JSON.stringify({ transactions: [], profile }));
    }
  };

  const updateProfile = async (newProfile: Partial<UserProfile>) => {
    if (currentUser && isFirebaseReady()) {
      await setDoc(doc(db, 'userProfiles', currentUser.uid), {
        ...profile,
        ...newProfile,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } else {
      const updated = { ...profile, ...newProfile } as UserProfile;
      setProfile(updated);
      localStorage.setItem('gestao_financeira_data', JSON.stringify({ transactions, profile: updated }));
    }
  };

  const stats: FinancialStats = {
    totalIncome: transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0),
    totalExpenses: transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0),
    totalSales: transactions.filter(t => t.type === 'sale').reduce((acc, t) => acc + t.amount, 0),
    get netBalance() { return (this.totalIncome + this.totalSales) - this.totalExpenses },
    get reserveProgress() { 
      const reserve = profile?.salaryReserve || 0;
      if (reserve === 0) return 0;
      return Math.min(100, (this.netBalance / reserve) * 100);
    }
  };

  return { currentUser, transactions, profile, stats, loading, addTransaction, deleteTransaction, clearAllTransactions, updateProfile };
}
