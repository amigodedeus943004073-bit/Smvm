import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Transaction } from '../types';
import { formatCurrency } from '../lib/utils';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MainChartProps {
  transactions: Transaction[];
}

export function MainChart({ transactions }: MainChartProps) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const data = days.map(day => {
    const dayTransactions = transactions.filter(t => isSameDay(new Date(t.date), day));
    const income = dayTransactions
      .filter(t => t.type === 'income' || t.type === 'sale')
      .reduce((acc, t) => acc + t.amount, 0);
    const expense = dayTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    
    return {
      name: format(day, 'EEE', { locale: ptBR }),
      income,
      expense,
      balance: income - expense
    };
  });

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#71717a', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            hide
          />
          <Tooltip 
            cursor={{ fill: '#f4f4f5' }}
            contentStyle={{ borderRadius: '12px', border: '1px solid #e5e5e5', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => formatCurrency(value)}
          />
          <Bar dataKey="income" radius={[4, 4, 0, 0]} fill="#22c55e" barSize={20} />
          <Bar dataKey="expense" radius={[4, 4, 0, 0]} fill="#ef4444" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
