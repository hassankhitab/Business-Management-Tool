import React, { useState, useEffect } from 'react';
import { X, HardHat, Phone, DollarSign, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Worker, WorkerRole } from '../types';

interface WorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  workerToEdit?: Worker | null;
}

const ROLES: WorkerRole[] = [
  'Mason',
  'Electrician',
  'Plumber',
  'Helper',
  'Carpenter',
  'Steel Fixer',
  'Painter',
  'Site Supervisor',
];

export const WorkerModal: React.FC<WorkerModalProps> = ({
  isOpen,
  onClose,
  workerToEdit,
}) => {
  const { addWorker, updateWorker, settings } = useApp();

  const [name, setName] = useState('');
  const [role, setRole] = useState<WorkerRole>('Mason');
  const [phone, setPhone] = useState('');
  const [dailyWage, setDailyWage] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (workerToEdit) {
      setName(workerToEdit.name);
      setRole(workerToEdit.role);
      setPhone(workerToEdit.phone);
      setDailyWage(workerToEdit.dailyWage.toString());
      setStatus(workerToEdit.status);
      setNotes(workerToEdit.notes || '');
    } else {
      setName('');
      setRole('Mason');
      setPhone('');
      setDailyWage('2200');
      setStatus('Active');
      setNotes('');
    }
    setErrors({});
  }, [workerToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const err: Record<string, string> = {};
    if (!name.trim()) err.name = 'Worker name is required';
    if (!dailyWage || Number(dailyWage) <= 0) err.dailyWage = 'Valid daily wage is required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: name.trim(),
      role,
      phone: phone.trim(),
      dailyWage: Number(dailyWage),
      status,
      notes: notes.trim(),
    };

    if (workerToEdit) {
      updateWorker(workerToEdit.id, payload);
    } else {
      addWorker(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-bold">
              <HardHat className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {workerToEdit ? 'Edit Worker Profile' : 'Register New Site Worker'}
              </h3>
              <p className="text-xs text-slate-300">Set trade role & daily wage rate</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Ghulam Rasool"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Trade Role *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as WorkerRole)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Daily Wage ({settings.currencySymbol}) *
              </label>
              <input
                type="number"
                placeholder="e.g. 2500"
                value={dailyWage}
                onChange={(e) => setDailyWage(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
              />
              {errors.dailyWage && (
                <p className="text-xs text-rose-600 mt-1">{errors.dailyWage}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="e.g. +92 333 1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Skill Specialty / Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Senior bricklayer, works on Al-Noor Villa..."
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
              {workerToEdit ? 'Save Changes' : 'Register Worker'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
