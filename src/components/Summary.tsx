import { FinancialStats } from '../types';
import { Card } from './ui/Card';
import { TrendingUp, TrendingDown, ShoppingBag, Target } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

interface SummaryProps {
  stats: FinancialStats;
  reserveTarget: number;
}

export function Summary({ stats, reserveTarget }: SummaryProps) {
  const cards = [
    {
      title: 'Entradas',
      value: stats.totalIncome,
      icon: <TrendingUp className="text-green-500" />,
      color: 'text-green-600'
    },
    {
      title: 'Vendas',
      value: stats.totalSales,
      icon: <ShoppingBag className="text-blue-500" />,
      color: 'text-blue-600'
    },
    {
      title: 'Saídas',
      value: stats.totalExpenses,
      icon: <TrendingDown className="text-red-500" />,
      color: 'text-red-600'
    },
    {
      title: 'Saldo Líquido',
      value: stats.netBalance,
      icon: <Target className="text-zinc-500" />,
      color: stats.netBalance >= 0 ? 'text-zinc-900' : 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div key={idx}>
          <Card className="flex flex-col gap-1">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{card.title}</span>
              {card.icon}
            </div>
            <div className={`text-2xl font-bold font-mono tracking-tighter ${card.color}`}>
              {formatCurrency(card.value)}
            </div>
            {card.title === 'Saldo Líquido' && reserveTarget > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-[10px] font-bold text-zinc-400 mb-1">
                  <span>RESERVA: {formatCurrency(reserveTarget)}</span>
                  <span>{Math.round(stats.reserveProgress)}%</span>
                </div>
                <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-zinc-900 transition-all duration-500" 
                    style={{ width: `${stats.reserveProgress}%` }}
                  />
                </div>
              </div>
            )}
          </Card>
        </div>
      ))}
    </div>
  );
}
