import { Transaction } from '../types';
import { formatDate, formatCurrency } from '../lib/utils';
import { TrendingUp, TrendingDown, ShoppingBag, Trash2 } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete?: (id: string) => void;
}

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="py-12 text-center text-zinc-400">
        <p>Nenhuma transação encontrada.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((t) => (
        <div 
          key={t.id} 
          className="group flex items-center justify-between p-4 bg-white border border-zinc-100 rounded-xl hover:border-zinc-300 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-lg ${
              t.type === 'income' ? 'bg-green-50 text-green-600' : 
              t.type === 'sale' ? 'bg-blue-50 text-blue-600' : 
              'bg-red-50 text-red-600'
            }`}>
              {t.type === 'income' ? <TrendingUp size={18} /> : 
               t.type === 'sale' ? <ShoppingBag size={18} /> : 
               <TrendingDown size={18} />}
            </div>
            <div>
              <p className="font-semibold text-zinc-900 leading-tight">{t.description}</p>
              <div className="flex gap-2 items-center text-xs text-zinc-500 mt-1">
                <span className="bg-zinc-100 px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter">{t.category}</span>
                <span>•</span>
                <span>{formatDate(t.date)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`font-mono font-bold ${
              t.type === 'income' || t.type === 'sale' ? 'text-green-600' : 'text-red-600'
            }`}>
              {t.type === 'expense' ? '-' : '+'}{formatCurrency(t.amount)}
            </div>
            {onDelete && (
              <button 
                onClick={() => {
                  if (window.confirm("Deseja apagar este registo?")) onDelete(t.id);
                }}
                className="p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
