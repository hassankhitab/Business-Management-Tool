import React, { useState, useEffect } from 'react';
import { X, Building2, Calendar, MapPin, DollarSign, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Project, ProjectStatus } from '../types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: Project | null;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  projectToEdit,
}) => {
  const { addProject, updateProject, clients, settings } = useApp();

  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientId, setClientId] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [contractValue, setContractValue] = useState('');
  const [budget, setBudget] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('In Progress');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name);
      setClientName(projectToEdit.clientName);
      setClientId(projectToEdit.clientId || '');
      setLocation(projectToEdit.location);
      setStartDate(projectToEdit.startDate);
      setEndDate(projectToEdit.endDate);
      setContractValue(projectToEdit.contractValue.toString());
      setBudget(projectToEdit.budget.toString());
      setStatus(projectToEdit.status);
      setNotes(projectToEdit.notes || '');
    } else {
      setName('');
      setClientName('');
      setClientId('');
      setLocation('');
      setStartDate(new Date().toISOString().split('T')[0]);
      // 6 months default end date
      const d = new Date();
      d.setMonth(d.getMonth() + 6);
      setEndDate(d.toISOString().split('T')[0]);
      setContractValue('');
      setBudget('');
      setStatus('In Progress');
      setNotes('');
    }
    setErrors({});
  }, [projectToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const err: Record<string, string> = {};
    if (!name.trim()) err.name = 'Project name is required';
    if (!clientName.trim()) err.clientName = 'Client name is required';
    if (!location.trim()) err.location = 'Project site location is required';
    if (!startDate) err.startDate = 'Start date is required';
    if (!endDate) err.endDate = 'Target completion date is required';
    if (!contractValue || Number(contractValue) <= 0)
      err.contractValue = 'Valid contract value is required';
    if (!budget || Number(budget) <= 0) err.budget = 'Valid allocated budget is required';

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: name.trim(),
      clientName: clientName.trim(),
      clientId: clientId || undefined,
      location: location.trim(),
      startDate,
      endDate,
      contractValue: Number(contractValue),
      budget: Number(budget),
      status,
      notes: notes.trim(),
    };

    if (projectToEdit) {
      updateProject(projectToEdit.id, payload);
    } else {
      addProject(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {projectToEdit ? 'Edit Construction Project' : 'New Construction Project'}
              </h3>
              <p className="text-xs text-slate-500">Track milestones, budget cap, and contract revenue</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Project Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Project Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Al-Noor Residential Villa (G+1)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-medium"
            />
            {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
          </div>

          {/* Client Selection / Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Client Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Tariq Mehmood"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              {errors.clientName && (
                <p className="text-xs text-rose-600 mt-1">{errors.clientName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Existing Client Match
              </label>
              <select
                value={clientId}
                onChange={(e) => {
                  setClientId(e.target.value);
                  const found = clients.find((c) => c.id === e.target.value);
                  if (found) setClientName(found.name);
                }}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                <option value="">-- Link to Client Ledger (Optional) --</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.company ? `(${c.company})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Site Location / Address *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="e.g. Plot 42, Block C, DHA Phase 6"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            {errors.location && <p className="text-xs text-rose-600 mt-1">{errors.location}</p>}
          </div>

          {/* Contract Value & Allocated Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Contract Value ({settings.currencySymbol}) *
              </label>
              <input
                type="number"
                placeholder="e.g. 24000000"
                value={contractValue}
                onChange={(e) => setContractValue(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
              />
              <span className="text-[11px] text-slate-500">Agreed price billed to client</span>
              {errors.contractValue && (
                <p className="text-xs text-rose-600 mt-1">{errors.contractValue}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Allocated Budget ({settings.currencySymbol}) *
              </label>
              <input
                type="number"
                placeholder="e.g. 18500000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
              />
              <span className="text-[11px] text-slate-500">Target spending ceiling</span>
              {errors.budget && <p className="text-xs text-rose-600 mt-1">{errors.budget}</p>}
            </div>
          </div>

          {/* Dates & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Start Date *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.startDate && (
                <p className="text-xs text-rose-600 mt-1">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target End Date *
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.endDate && <p className="text-xs text-rose-600 mt-1">{errors.endDate}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Project Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                <option value="In Progress">In Progress</option>
                <option value="Planning">Planning</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Project Notes & Scope Details
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Grey structure, MEP piping, milestone payment schedule..."
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
              className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md transition-all active:scale-[0.98]"
            >
              {projectToEdit ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
