import React, { useState } from 'react';
import {
  X,
  Building2,
  Calendar,
  MapPin,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Plus,
  Edit2,
  Trash2,
  Clock,
  User,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Project } from '../types';

interface ProjectDetailModalProps {
  projectId: string | null;
  onClose: () => void;
  onEdit: (project: Project) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  projectId,
  onClose,
  onEdit,
}) => {
  const {
    projects,
    transactions,
    getProjectStats,
    formatCurrency,
    setIsAddExpenseOpen,
    setIsAddIncomeOpen,
    deleteTransaction,
  } = useApp();

  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  if (!projectId) return null;

  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;

  const stats = getProjectStats(project.id);

  const projectTransactions = transactions.filter((t) => {
    if (t.projectId !== project.id) return false;
    if (filterType !== 'all' && t.type !== filterType) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center font-bold text-white shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white truncate">
                  {project.name}
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    project.status === 'Completed'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : project.status === 'In Progress'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {project.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 truncate flex items-center gap-2 mt-0.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Client: {project.clientName}</span>
                <span>·</span>
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{project.location}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onEdit(project)}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Edit Project"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Over 90% Budget Alert Banner */}
          {stats.isNearLimit && (
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 shadow-xs ${
                stats.isOverBudget
                  ? 'bg-rose-50 border-rose-300 text-rose-900'
                  : 'bg-rose-50/90 border-rose-200 text-rose-900'
              }`}
            >
              <div className="p-2 bg-rose-100 text-rose-600 rounded-lg shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold">
                  {stats.isOverBudget
                    ? '⚠️ CRITICAL: Project Budget Exceeded!'
                    : '⚠️ Budget Warning: Spending Exceeded 90% of Budget Limit'}
                </h4>
                <p className="text-xs text-rose-800 mt-0.5">
                  Total site expenditures have reached{' '}
                  <span className="font-bold">{stats.percentSpent.toFixed(1)}%</span> of allocated
                  budget. Total spent: {formatCurrency(stats.spent)} out of budget{' '}
                  {formatCurrency(stats.budget)}.
                  {stats.balanceRemaining > 0
                    ? ` Remaining safety buffer: ${formatCurrency(stats.balanceRemaining)}.`
                    : ` Deficit: ${formatCurrency(Math.abs(stats.balanceRemaining))}.`}
                </p>
              </div>
            </div>
          )}

          {/* Budget vs Actual Spent Progress Card */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Budget Utilization
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl sm:text-2xl font-black font-mono text-slate-900">
                    {formatCurrency(stats.spent)}
                  </span>
                  <span className="text-sm text-slate-500 font-mono">
                    / {formatCurrency(stats.budget)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`text-xl font-bold font-mono ${
                    stats.isNearLimit ? 'text-rose-600 font-black' : 'text-slate-800'
                  }`}
                >
                  {stats.percentSpent.toFixed(1)}%
                </span>
                <p className="text-[11px] text-slate-500">
                  {stats.balanceRemaining >= 0
                    ? `Buffer left: ${formatCurrency(stats.balanceRemaining)}`
                    : `Over budget by: ${formatCurrency(Math.abs(stats.balanceRemaining))}`}
                </p>
              </div>
            </div>

            {/* Giant Progress Bar */}
            <div className="w-full bg-slate-200 rounded-full h-3.5 overflow-hidden">
              <div
                style={{ width: `${Math.min(100, stats.percentSpent)}%` }}
                className={`h-full rounded-full transition-all duration-500 ${
                  stats.isOverBudget
                    ? 'bg-rose-600'
                    : stats.isNearLimit
                    ? 'bg-rose-500'
                    : stats.percentSpent > 70
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
              />
            </div>
          </div>

          {/* 4 Financial Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500">Contract Value</span>
              <p className="text-sm sm:text-base font-bold font-mono text-slate-900 mt-1 truncate">
                {formatCurrency(project.contractValue)}
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500">Total Invoiced / Received</span>
              <p className="text-sm sm:text-base font-bold font-mono text-emerald-600 mt-1 truncate">
                {formatCurrency(stats.income)}
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500">Total Spent</span>
              <p className="text-sm sm:text-base font-bold font-mono text-rose-600 mt-1 truncate">
                {formatCurrency(stats.spent)}
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500">Net Site Profit</span>
              <p
                className={`text-sm sm:text-base font-bold font-mono mt-1 truncate ${
                  stats.profit >= 0 ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {formatCurrency(stats.profit)}
              </p>
            </div>
          </div>

          {/* Schedule & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-slate-50/70 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 font-medium block">Start Date</span>
              <span className="font-semibold text-slate-800">{project.startDate}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Target Handover</span>
              <span className="font-semibold text-slate-800">{project.endDate}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Scope / Notes</span>
              <span className="text-slate-700 line-clamp-2">{project.notes || 'No extra notes recorded.'}</span>
            </div>
          </div>

          {/* Transactions section */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-200">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Project Transactions History</h4>
                <p className="text-xs text-slate-500">
                  {projectTransactions.length} records associated with this site
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Filter toggle */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      filterType === 'all' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-600'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterType('income')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      filterType === 'income' ? 'bg-white shadow-xs text-emerald-700 font-bold' : 'text-slate-600'
                    }`}
                  >
                    Income
                  </button>
                  <button
                    onClick={() => setFilterType('expense')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      filterType === 'expense' ? 'bg-white shadow-xs text-rose-700 font-bold' : 'text-slate-600'
                    }`}
                  >
                    Expenses
                  </button>
                </div>

                <button
                  onClick={() => setIsAddExpenseOpen(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Entry</span>
                </button>
              </div>
            </div>

            {/* Transactions table / cards */}
            {projectTransactions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-xs">No transactions found matching the filter.</p>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {projectTransactions.map((tx) => {
                  const isIncome = tx.type === 'income';
                  return (
                    <div
                      key={tx.id}
                      className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`p-1.5 rounded-lg shrink-0 ${
                            isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                          }`}
                        >
                          {isIncome ? (
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{tx.vendorOrPayer}</p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <span>{tx.date}</span>
                            <span>·</span>
                            <span>{tx.category}</span>
                            <span>·</span>
                            <span>{tx.paymentMethod}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className={`font-mono font-bold text-xs sm:text-sm ${
                            isIncome ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
                        </span>
                        <button
                          onClick={() => deleteTransaction(tx.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">JALEEL BUILDER — Site Accounting</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
};
