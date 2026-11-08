import React, { useState, useEffect } from 'react';
import { X, Building2, User, Phone, Mail, Calendar, DollarSign } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Party, PartyType, PaymentStatus } from '../types';

interface PartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: PartyType;
  partyToEdit?: Party | null;
}

export const PartyModal: React.FC<PartyModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'client',
  partyToEdit,
}) => {
  const { addParty, updateParty, settings } = useApp();

  const [type, setType] = useState<PartyType>(defaultType);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [totalBilled, setTotalBilled] = useState('');
  const [totalPaid, setTotalPaid] = useState('0');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (partyToEdit) {
      setType(partyToEdit.type);
      setName(partyToEdit.name);
      setCompany(partyToEdit.company || '');
      setPhone(partyToEdit.phone);
      setEmail(partyToEdit.email || '');
      setAddress(partyToEdit.address || '');
      setTotalBilled(partyToEdit.totalBilled.toString());
      setTotalPaid(partyToEdit.totalPaid.toString());
      setDueDate(partyToEdit.dueDate);
      setNotes(partyToEdit.notes || '');
    } else {
      setType(defaultType);
      setName('');
      setCompany('');
      setPhone('');
      setEmail('');
      setAddress('');
      setTotalBilled('');
      setTotalPaid('0');
      // 14 days default due date
      const d = new Date();
      d.setDate(d.getDate() + 14);
      setDueDate(d.toISOString().split('T')[0]);
      setNotes('');
    }
    setErrors({});
  }, [partyToEdit, defaultType, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const err: Record<string, string> = {};
    if (!name.trim()) err.name = 'Contact / Representative name is required';
    if (!totalBilled || Number(totalBilled) < 0)
      err.totalBilled = 'Valid billed / invoice amount is required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const billed = Number(totalBilled);
    const paid = Number(totalPaid);
    const now = new Date();

    let status: PaymentStatus = 'Unpaid';
    if (paid >= billed && billed > 0) {
      status = 'Paid';
    } else if (paid > 0) {
      status = 'Partial';
    } else if (dueDate && new Date(dueDate) < now) {
      status = 'Overdue';
    }

    const payload = {
      type,
      name: name.trim(),
      company: company.trim() || undefined,
      phone: phone.trim(),
      email: email.trim() || undefined,
      address: address.trim() || undefined,
      totalBilled: billed,
      totalPaid: paid,
      dueDate,
      status,
      notes: notes.trim() || undefined,
    };

    if (partyToEdit) {
      updateParty(partyToEdit.id, payload);
    } else {
      addParty(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-bold">
              {type === 'client' ? <User className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {partyToEdit
                  ? `Edit ${type === 'client' ? 'Client' : 'Supplier / Vendor'}`
                  : `Add New ${type === 'client' ? 'Client' : 'Supplier / Vendor'}`}
              </h3>
              <p className="text-xs text-slate-300">
                {type === 'client' ? 'Accounts receivable ledger' : 'Accounts payable ledger'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!partyToEdit && (
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setType('client')}
                className={`py-1.5 text-xs font-bold rounded-lg ${
                  type === 'client' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Client (Receivable)
              </button>
              <button
                type="button"
                onClick={() => setType('vendor')}
                className={`py-1.5 text-xs font-bold rounded-lg ${
                  type === 'vendor' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Supplier / Vendor (Payable)
              </button>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Contact / Company Name *
            </label>
            <input
              type="text"
              placeholder={type === 'client' ? 'e.g. Tariq Mehmood' : 'e.g. Falcon Cement Mills'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
            />
            {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Company / Trade Name
              </label>
              <input
                type="text"
                placeholder="e.g. Mehmood Textiles"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="e.g. +92 321 0000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Total Billed ({settings.currencySymbol}) *
              </label>
              <input
                type="number"
                placeholder="e.g. 15000000"
                value={totalBilled}
                onChange={(e) => setTotalBilled(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono font-bold"
              />
              {errors.totalBilled && (
                <p className="text-xs text-rose-600 mt-1">{errors.totalBilled}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Already Paid ({settings.currencySymbol})
              </label>
              <input
                type="number"
                placeholder="e.g. 10000000"
                value={totalPaid}
                onChange={(e) => setTotalPaid(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Payment Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                City / Address
              </label>
              <input
                type="text"
                placeholder="e.g. DHA Lahore"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Account Notes / Payment Terms
            </label>
            <textarea
              rows={2}
              placeholder="e.g. 30-day payment term, milestone 3 grey structure..."
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
              className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md"
            >
              {partyToEdit ? 'Save Changes' : 'Save Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
