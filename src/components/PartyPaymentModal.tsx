import React, { useState, useEffect } from 'react';
import { X, DollarSign, Building2, CreditCard } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Party, PaymentMethod } from '../types';

interface PartyPaymentModalProps {
  party: Party | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PartyPaymentModal: React.FC<PartyPaymentModalProps> = ({
  party,
  isOpen,
  onClose,
}) => {
  const { projects, recordPartyPayment, formatCurrency, settings } = useApp();

  const [amount, setAmount] = useState('');
  const [projectId, setProjectId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Bank Transfer');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (party) {
      const balance = Math.max(0, party.totalBilled - party.totalPaid);
      setAmount(balance > 0 ? balance.toString() : '');
      setProjectId(projects[0]?.id || '');
      setNotes(`Payment settlement for ${party.name}`);
      setError('');
    }
  }, [party, projects, isOpen]);

  if (!isOpen || !party) return null;

  const balance = Math.max(0, party.totalBilled - party.totalPaid);
  const isClient = party.type === 'client';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid payment amount');
      return;
    }
    if (!projectId) {
      setError('Please select an associated project site');
      return;
    }

    recordPartyPayment(
      party.id,
      Number(amount),
      projectId,
      paymentMethod,
      notes.trim()
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        <div
          className={`px-6 py-4 border-b text-white flex items-center justify-between ${
            isClient ? 'bg-emerald-800 border-emerald-900' : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${
                isClient ? 'bg-emerald-600' : 'bg-orange-600'
              }`}
            >
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isClient ? 'Receive Client Payment' : 'Pay Supplier Bill'}
              </h3>
              <p className="text-xs text-slate-300 truncate max-w-[240px]">
                {party.name} {party.company ? `(${party.company})` : ''}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-300 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-xs text-rose-600 font-bold">{error}</p>}

          {/* Current balance card */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 block">Current Outstanding Balance:</span>
              <span className="text-[11px] text-slate-400">
                Billed: {formatCurrency(party.totalBilled)} | Paid: {formatCurrency(party.totalPaid)}
              </span>
            </div>
            <span
              className={`font-mono font-bold text-sm ${
                balance > 0 ? 'text-amber-600' : 'text-emerald-600'
              }`}
            >
              {formatCurrency(balance)}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Payment Amount ({settings.currencySymbol}) *
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Associated Project Site *
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Transaction Notes / Receipt Reference
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-md ${
                isClient
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              {isClient ? 'Record Receipt' : 'Record Payout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
