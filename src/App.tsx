/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useStore } from './lib/store';
import { Summary } from './components/Summary';
import { MainChart } from './components/MainChart';
import { TransactionList } from './components/TransactionList';
import { TransactionForm } from './components/TransactionForm';
import { Card } from './components/ui/Card';
import { 
  Plus, 
  Settings, 
  LayoutDashboard, 
  ListOrdered, 
  LogIn, 
  LogOut,
  Wallet,
  Menu,
  X
} from 'lucide-react';
import { auth, signInWithPopup, googleProvider, signOut } from './lib/firebase';
import { formatCurrency } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { 
    currentUser, 
    transactions, 
    profile, 
    stats, 
    loading, 
    addTransaction, 
    deleteTransaction,
    clearAllTransactions,
    updateProfile 
  } = useStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [newReserve, setNewReserve] = useState<string>('');

  const handleLogin = async () => {
    if (googleProvider) {
      await signInWithPopup(auth, googleProvider);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="w-12 h-12 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser && googleProvider) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center text-white mb-8 shadow-xl">
          <Wallet size={40} />
        </div>
        <h1 className="text-4xl font-black text-zinc-900 tracking-tighter mb-4 italic">
          GP FINANCEIRO
        </h1>
        <p className="text-zinc-500 max-w-sm mb-12">
          Gestão de vendas, entradas e saídas em Angola com cálculo de reserva salarial.
        </p>
        <button 
          onClick={handleLogin}
          className="bg-zinc-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition-transform shadow-lg"
        >
          <LogIn size={24} />
          Entrar com Google
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-12">
      {/* Header Simplificado */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white">
              <Wallet size={16} />
            </div>
            <span className="font-black tracking-tighter text-lg">GP FINANCEIRO</span>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-bold text-zinc-400">
             <button onClick={() => setShowSettingsModal(true)} className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-900">
               <Settings size={18} />
             </button>
             <button onClick={handleLogout} className="p-2 hover:bg-zinc-100 rounded-lg">
               <LogOut size={18} />
             </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Saudação e Data */}
        <div className="mt-4">
          <h1 className="text-2xl font-black text-zinc-900 tracking-tighter uppercase italic">
            Gestão Diária
          </h1>
          <p className="text-zinc-500 text-sm">Resumo financeiro e registros de hoje.</p>
        </div>

        {/* Resumo Financeiro (Estatísticas Principais) */}
        <Summary stats={stats} reserveTarget={profile?.salaryReserve || 0} />

        {/* Bloco de Ações e Gráfico em uma única aba */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Gráfico de Evolução */}
            <Card title="Evolução da Semana" icon={<LayoutDashboard size={16} className="text-zinc-400" />}>
              <div className="mt-4">
                <MainChart transactions={transactions} />
              </div>
            </Card>

            {/* Histórico Recente (Listagem Unificada) */}
            <Card title="Últimos Lançamentos" icon={<ListOrdered size={16} className="text-zinc-400" />}>
              <div className="max-h-[600px] overflow-y-auto pr-1">
                <TransactionList transactions={transactions} onDelete={deleteTransaction} />
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Botão de Cadastro Rápido (Sempre Visível) */}
            <div className="bg-zinc-900 text-white rounded-3xl p-6 shadow-xl shadow-zinc-900/10 active:scale-95 transition-all cursor-pointer" onClick={() => setShowAddModal(true)}>
              <div className="flex items-center justify-between mb-4">
                <Plus className="bg-white/20 rounded-full p-1" size={32} />
                <span className="text-[10px] font-black tracking-widest uppercase opacity-60">Novo Fluxo</span>
              </div>
              <h3 className="text-xl font-bold leading-tight">Registrar Entrada ou Saída</h3>
              <p className="text-white/60 text-xs mt-2 uppercase tracking-tighter">Clique para adicionar valores</p>
            </div>

            {/* Widget de Reserva Simplificado */}
            <Card className="bg-white border-zinc-200" title="Reserva Salarial">
               <div className="space-y-4">
                 <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Meta Definida</span>
                    <p className="text-lg font-black text-zinc-900 font-mono tracking-tighter">
                      {formatCurrency(profile?.salaryReserve || 0)}
                    </p>
                 </div>
                 <div className="pt-2 border-t border-zinc-50">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Progresso Atual</span>
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-sm font-black text-zinc-900">{Math.round(stats.reserveProgress)}%</span>
                    </div>
                    <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                      <div className="h-full bg-zinc-900 transition-all" style={{ width: `${stats.reserveProgress}%` }} />
                    </div>
                 </div>
                 <button 
                  onClick={() => setShowSettingsModal(true)}
                  className="w-full py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:bg-zinc-100 transition-colors"
                 >
                   Alterar Meta
                 </button>
               </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de Registro */}
      <AnimatePresence>
        {showAddModal && (
          <TransactionForm 
            onAdd={addTransaction} 
            onClose={() => setShowAddModal(false)} 
          />
        )}
      </AnimatePresence>

      {/* Modal de Configurações (Reserva) */}
      <AnimatePresence>
        {showSettingsModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-xl tracking-tighter italic uppercase">Meta de Reserva</h3>
                <button onClick={() => setShowSettingsModal(false)}><X size={20} /></button>
              </div>
              <p className="text-zinc-500 text-sm mb-6">Defina o valor em Kwanza que deseja reservar mensalmente do seu saldo.</p>
              
              <div className="space-y-4">
                <input 
                  type="number" 
                  value={newReserve}
                  onChange={(e) => setNewReserve(e.target.value)}
                  placeholder="Ex: 50000"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-zinc-900 outline-none font-mono"
                />
                <button 
                  onClick={() => {
                    if (newReserve) {
                      updateProfile({ salaryReserve: parseFloat(newReserve) });
                      setNewReserve('');
                      setShowSettingsModal(false);
                    }
                  }}
                  className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold shadow-lg"
                >
                  Salvar Alteração
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-zinc-100">
                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">Zona de Perigo</h4>
                <button 
                  onClick={() => {
                    if (window.confirm("Tem certeza que deseja apagar todos os registos? Esta ação não pode ser desfeita.")) {
                      clearAllTransactions();
                      setShowSettingsModal(false);
                    }
                  }}
                  className="w-full py-4 border border-red-200 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                >
                  Limpar Todo o Histórico
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

