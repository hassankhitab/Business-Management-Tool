import React, { useState } from 'react';
import { X, Calendar, User, Building2, Clock, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedWorkerId?: string;
}

export const AttendanceModal: React.FC<AttendanceModalProps> = ({
  isOpen,
  onClose,
  preselectedWorkerId,
}) => {
  const { workers, projects, logAttendance, formatCurrency, settings } = useApp();

  const [workerId, setWorkerId] = useState(preselectedWorkerId || workers[0]?.id || '');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [daysWorked, setDaysWorked] = useState('1');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const selectedWorker = workers.find((w) => w.id === workerId);
  const wageRate = selectedWorker ? selectedWorker.dailyWage : 0;
  const totalCalculated = Number(daysWorked || 0) * wageRate;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerId) {
      setError('Please choose a worker');
      return;
    }
    if (!projectId) {
      setError('Please choose a project site');
      return;
    }
    if (!daysWorked || Number(daysWorked) <= 0) {
      setError('Days worked must be greater than 0');
      return;
    }

    logAttendance({
      workerId,
      projectId,
      date,
      daysWorked: Number(daysWorked),
      dailyWage: wageRate,
      totalDue: totalCalculated,
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Log Site Attendance & Work</h3>
              <p className="text-xs text-slate-300">Auto-calculates wages due by daily rate</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-xs text-rose-600 font-bold">{error}</p>}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Select Worker *
            </label>
            <select
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.role}) — {formatCurrency(w.dailyWage)}/day
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Project Site *
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Days / Shifts Worked *
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                placeholder="1, 6, 0.5"
                value={daysWorked}
                onChange={(e) => setDaysWorked(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono font-bold"
              />
              <span className="text-[10px] text-slate-500">e.g. 1 for full day, 6 for week</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Log Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Auto-Calculation Banner */}
          <div className="p-3.5 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-600 block">Calculated Wage Due:</span>
              <span className="text-[11px] text-slate-500">
                {daysWorked || 0} days × {formatCurrency(wageRate)}
              </span>
            </div>
            <span className="text-base font-black font-mono text-orange-700">
              {formatCurrency(totalCalculated)}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Task Notes / Specific Work Done
            </label>
            <input
              type="text"
              placeholder="e.g. Columns shuttering, boundary wall masonry..."
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
              Log Attendance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
