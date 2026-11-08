import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowDownLeft,
  ArrowUpRight,
  DollarSign,
  Calendar,
  Building2,
  Tag,
  CreditCard,
  FileText,
  User,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  Transaction,
  IncomeCategory,
  ExpenseCategory,
  PaymentMethod,
} from '../types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'income' | 'expense';
  transactionToEdit?: Transaction | null;
}

const INCOME_CATEGORIES: IncomeCategory[] = [
  'Client Payment',
  'Advance',
  'Milestone Payment',
  'Retention Release',
  'Other Income',
];

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Materials',
  'Labor',
  'Equipment Rental',
  'Fuel/Transport',
  'Subcontractor',
  'Permits/Fees',
  'Utilities',
  'Miscellaneous',
];

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'expense',
  transactionToEdit,
}) => {
  const {
    projects,
    clients,
    vendors,
    addTransaction,
    updateTransaction,
    settings,
  } = useApp();

  const [type, setType] = useState<'income' | 'expense'>(defaultType);
  const [projectId, setProjectId] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [reference, setReference] = useState<string>('');
  const [vendorOrPayer, setVendorOrPayer] = useState<string>('');
  const [partyId, setPartyId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (transactionToEdit) {
      setType(transactionToEdit.type);
      setProjectId(transactionToEdit.projectId);
      setCategory(transactionToEdit.category);
      setAmount(transactionToEdit.amount.toString());
      setDate(transactionToEdit.date);
      setPaymentMethod(transactionToEdit.paymentMethod);
      setReference(transactionToEdit.reference || '');
      setVendorOrPayer(transactionToEdit.vendorOrPayer);
      setPartyId(transactionToEdit.partyId || '');
      setNotes(transactionToEdit.notes || '');
    } else {
      setType(defaultType);
      setProjectId(projects[0]?.id || '');
      setCategory(defaultType === 'income' ? 'Milestone Payment' : 'Materials');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('Bank Transfer');
      setReference('');
      setVendorOrPayer('');
      setPartyId('');
      setNotes('');
    }
    setErrors({});
  }, [transactionToEdit, defaultType, isOpen, projects]);

  if (!isOpen) return null;

  const validate = () => {
    const err: Record<string, string> = {};
    if (!projectId) err.projectId = 'Please select a construction project';
    if (!category) err.category = 'Category is required';
    if (!amount || Number(amount) <= 0) err.amount = 'Valid positive amount is required';
    if (!date) err.date = 'Date is required';
    if (!vendorOrPayer.trim())
      err.vendorOrPayer = type === 'income' ? 'Client / Payer name is required' : 'Vendor / Supplier / Payee is required';

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      type,
      projectId,
      category: category as IncomeCategory | ExpenseCategory,
      amount: Number(amount),
      date,
      paymentMethod,
      reference: reference.trim(),
      vendorOrPayer: vendorOrPayer.trim(),
      partyId: partyId || undefined,
      notes: notes.trim(),
    };

    if (transactionToEdit) {
      updateTransaction(transactionToEdit.id, payload);
    } else {
      addTransaction(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between text-white ${
            type === 'income' ? 'bg-emerald-800 border-emerald-900' : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${
                type === 'income' ? 'bg-emerald-600' : 'bg-orange-600'
              }`}
            >
              {type === 'income' ? (
                <ArrowDownLeft className="w-4 h-4" />
              ) : (
                <ArrowUpRight className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {transactionToEdit
                  ? `Edit ${type === 'income' ? 'Income' : 'Expense'}`
                  : `Record New ${type === 'income' ? 'Income' : 'Expense'}`}
              </h3>
              <p className="text-xs text-slate-300">
                {type === 'income' ? 'Client milestone or advance deposit' : 'Material, labor, or machinery cost'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Switcher (Only if not editing) */}
          {!transactionToEdit && (
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setType('expense');
                  setCategory('Materials');
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  type === 'expense'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Expense (Money Out)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setType('income');
                  setCategory('Milestone Payment');
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  type === 'income'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ArrowDownLeft className="w-3.5 h-3.5" />
                <span>Income (Money In)</span>
              </button>
            </div>
          )}

          {/* Project Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Construction Project *
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              <option value="">-- Select Project --</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.status})
                </option>
              ))}
            </select>
            {errors.projectId && (
              <p className="text-xs text-rose-600 mt-1">{errors.projectId}</p>
            )}
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Amount ({settings.currencySymbol}) *
              </label>
              <input
                type="number"
                placeholder="e.g. 250000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono font-bold"
              />
              {errors.amount && <p className="text-xs text-rose-600 mt-1">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.date && <p className="text-xs text-rose-600 mt-1">{errors.date}</p>}
            </div>
          </div>

          {/* Category & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                {type === 'income'
                  ? INCOME_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))
                  : EXPENSE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
              </select>
              {errors.category && (
                <p className="text-xs text-rose-600 mt-1">{errors.category}</p>
              )}
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
          </div>

          {/* Vendor / Client / Payee */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {type === 'income' ? 'Client / Payer Name *' : 'Vendor / Supplier / Payee *'}
              </label>
              {/* Optional Quick Link to Party */}
              <select
                value={partyId}
                onChange={(e) => {
                  setPartyId(e.target.value);
                  const list = type === 'income' ? clients : vendors;
                  const match = list.find((p) => p.id === e.target.value);
                  if (match) setVendorOrPayer(match.name);
                }}
                className="text-[11px] text-orange-600 bg-transparent border-0 underline cursor-pointer focus:outline-none"
              >
                <option value="">Quick select from {type === 'income' ? 'Clients' : 'Vendors'}</option>
                {(type === 'income' ? clients : vendors).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              placeholder={
                type === 'income'
                  ? 'e.g. Tariq Mehmood / Apex Real Estate'
                  : 'e.g. Falcon Cement Mills / Ittehad Steel'
              }
              value={vendorOrPayer}
              onChange={(e) => setVendorOrPayer(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.vendorOrPayer && (
              <p className="text-xs text-rose-600 mt-1">{errors.vendorOrPayer}</p>
            )}
          </div>

          {/* Reference / Cheque No */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Reference / Cheque # / Bill Invoice (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. CHQ-99104, INV-2026-88, HBL-FT-441"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-xs"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description / Site Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. 500 bags cement delivered for 2nd floor columns..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-md transition-all active:scale-[0.98] ${
                type === 'income'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              {transactionToEdit ? 'Save Changes' : `Record ${type === 'income' ? 'Income' : 'Expense'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
