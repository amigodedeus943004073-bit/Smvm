import { useState, FormEvent } from 'react';
import { TransactionType } from '../types';
import { Plus, X } from 'lucide-react';

interface TransactionFormProps {
  onAdd: (data: any) => void;
  onClose: () => void;
}

export function TransactionForm({ onAdd, onClose }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !category) return;
    
    onAdd({
      type,
      amount: parseFloat(amount),
      description,
      category,
      date: new Date(), // Data automática: Hoje
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl border border-zinc-100">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 tracking-tighter italic uppercase">Novo Registo</h2>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Registo automático para hoje</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-2 p-1 bg-zinc-100 rounded-2xl">
            {(['income', 'expense', 'sale'] as TransactionType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 py-3 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  type === t 
                  ? 'bg-white text-zinc-900 shadow-sm' 
                  : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {t === 'income' ? 'Entrada' : t === 'expense' ? 'Saída' : 'Venda'}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Valor em Kwanza</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ex: 1500,00"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-zinc-900 font-mono text-lg"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">O que é este registo?</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Venda de pão, Pagamento internet..."
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Classificação</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-zinc-900 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2371717a%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[right_1.25rem_center] bg-no-repeat"
                required
              >
                <option value="">Escolha uma categoria...</option>
                <option value="Vendas">📦 Vendas / Negócio</option>
                <option value="Salário">💰 Salário / Pró-labore</option>
                <option value="Alimentação">🍴 Alimentação</option>
                <option value="Transporte">🚗 Transporte</option>
                <option value="Reserva">🏦 Reserva de Salário</option>
                <option value="Outros">⚙️ Outros</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-zinc-900 text-white rounded-2xl py-5 font-black uppercase tracking-widest shadow-xl shadow-zinc-900/20 hover:bg-zinc-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
          >
            <Plus size={20} strokeWidth={3} />
            Gravar Dados
          </button>
        </form>
      </div>
    </div>
  );
}
