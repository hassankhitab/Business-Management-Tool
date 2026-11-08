import React, { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Building2,
  ArrowUpDown,
  CreditCard,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Transaction } from '../types';
import { TransactionModal } from '../components/TransactionModal';

export const TransactionsView: React.FC = () => {
  const {
    transactions,
    projects,
    formatCurrency,
    deleteTransaction,
    exportTransactionsToCSV,
    isAddExpenseOpen,
    setIsAddExpenseOpen,
    isAddIncomeOpen,
    setIsAddIncomeOpen,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Available categories
  const allCategories = Array.from(new Set(transactions.map((t) => t.category)));

  // Filter & Sort logic
  const filteredTransactions = transactions
    .filter((t) => {
      if (filterType !== 'all' && t.type !== filterType) return false;
      if (filterProject !== 'all' && t.projectId !== filterProject) return false;
      if (filterCategory !== 'all' && t.category !== filterCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const proj = projects.find((p) => p.id === t.projectId);
        const matchVendor = t.vendorOrPayer.toLowerCase().includes(q);
        const matchCategory = t.category.toLowerCase().includes(q);
        const matchRef = (t.reference || '').toLowerCase().includes(q);
        const matchNotes = (t.notes || '').toLowerCase().includes(q);
        const matchProj = (proj?.name || '').toLowerCase().includes(q);
        if (!matchVendor && !matchCategory && !matchRef && !matchNotes && !matchProj)
          return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });

  // Calculate filtered totals
  const filteredIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const filteredExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const filteredNet = filteredIncome - filteredExpense;

  return (
    <div className="space-y-6">
      {/* Top Filter & Action Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search vendor, payer, reference, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={exportTransactionsToCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs whitespace-nowrap"
            title="Download CSV Spreadsheet"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsAddIncomeOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all whitespace-nowrap"
          >
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
            <span>+ Income</span>
          </button>

          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs transition-all whitespace-nowrap"
          >
            <ArrowUpRight className="w-4 h-4 text-white" />
            <span>+ Expense</span>
          </button>
        </div>
      </div>

      {/* Filter Row: Type, Project, Category, Sort */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Type Filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Flow Type
          </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Flows (In & Out)</option>
            <option value="income">Income Only (Receipts)</option>
            <option value="expense">Expenses Only (Disbursements)</option>
          </select>
        </div>

        {/* Project Filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Project Site
          </label>
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 truncate"
          >
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Category
          </label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 truncate"
          >
            <option value="all">All Categories</option>
            {allCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Sort Order
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="date-desc">Date (Newest First)</option>
            <option value="date-asc">Date (Oldest First)</option>
            <option value="amount-desc">Amount (Highest First)</option>
            <option value="amount-asc">Amount (Lowest First)</option>
          </select>
        </div>
      </div>

      {/* Filtered Metrics Strip */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900">
            {filteredTransactions.length} records shown
          </span>
          {(filterType !== 'all' || filterProject !== 'all' || filterCategory !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setFilterType('all');
                setFilterProject('all');
                setFilterCategory('all');
                setSearchQuery('');
              }}
              className="text-orange-600 hover:underline font-semibold ml-2 cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 sm:gap-6 font-mono font-bold">
          <div>
            <span className="text-[11px] text-slate-500 font-sans font-medium block">
              Filtered Inflow
            </span>
            <span className="text-emerald-600">+{formatCurrency(filteredIncome)}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-sans font-medium block">
              Filtered Outflow
            </span>
            <span className="text-rose-600">-{formatCurrency(filteredExpense)}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-sans font-medium block">
              Net Balance
            </span>
            <span className={filteredNet >= 0 ? 'text-slate-900' : 'text-rose-600'}>
              {formatCurrency(filteredNet)}
            </span>
          </div>
        </div>
      </div>

      {/* Transactions Table / List */}
      {filteredTransactions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No transactions found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No income or expense entries match your current search or filter combination.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsAddExpenseOpen(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl"
            >
              + Record Expense
            </button>
            <button
              onClick={() => setIsAddIncomeOpen(true)}
              className="px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200"
            >
              + Record Income
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5">Type & Category</th>
                  <th className="px-4 py-3.5">Project Site</th>
                  <th className="px-4 py-3.5">Vendor / Client</th>
                  <th className="px-4 py-3.5">Payment Method</th>
                  <th className="px-4 py-3.5 text-right">Amount</th>
                  <th className="px-4 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((tx) => {
                  const isIncome = tx.type === 'income';
                  const proj = projects.find((p) => p.id === tx.projectId);

                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Date */}
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap font-medium">
                        {tx.date}
                      </td>

                      {/* Type & Category */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`p-1 rounded-md shrink-0 ${
                              isIncome ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {isIncome ? (
                              <ArrowDownLeft className="w-3.5 h-3.5" />
                            ) : (
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            )}
                          </span>
                          <div>
                            <span className="font-bold text-slate-900 block">{tx.category}</span>
                            <span className="text-[10px] text-slate-600 uppercase font-semibold">
                              {tx.type}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Project */}
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-800 line-clamp-1">
                          {proj?.name || 'Unassigned Site'}
                        </span>
                        <span className="text-[11px] text-slate-600 line-clamp-1">
                          {proj?.location}
                        </span>
                      </td>

                      {/* Vendor / Client */}
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-900 block">
                          {tx.vendorOrPayer}
                        </span>
                        {tx.notes && (
                          <span className="text-[11px] text-slate-600 line-clamp-1 italic">
                            {tx.notes}
                          </span>
                        )}
                      </td>

                      {/* Method & Ref */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-medium text-slate-700 block">
                          {tx.paymentMethod}
                        </span>
                        {tx.reference && (
                          <span className="text-[11px] font-mono text-slate-600">
                            Ref: {tx.reference}
                          </span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <span
                          className={`font-mono font-bold text-sm ${
                            isIncome ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5 opacity-80 group-hover:opacity-100">
                          <button
                            onClick={() => {
                              setTransactionToEdit(tx);
                              setIsEditModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Transaction"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Delete this transaction?')) {
                                deleteTransaction(tx.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Transaction"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Add Expense Modal */}
      <TransactionModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        defaultType="expense"
      />

      {/* Quick Add Income Modal */}
      <TransactionModal
        isOpen={isAddIncomeOpen}
        onClose={() => setIsAddIncomeOpen(false)}
        defaultType="income"
      />

      {/* Edit Modal */}
      <TransactionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setTransactionToEdit(null);
        }}
        transactionToEdit={transactionToEdit}
      />
    </div>
  );
};
