import React, { useState } from 'react';
import {
  Contact,
  Building2,
  User,
  Plus,
  Search,
  AlertTriangle,
  Clock,
  CheckCircle2,
  DollarSign,
  Phone,
  FileText,
  Edit2,
  Trash2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Party, PartyType } from '../types';
import { PartyModal } from '../components/PartyModal';
import { PartyPaymentModal } from '../components/PartyPaymentModal';
import { PartyLedgerModal } from '../components/PartyLedgerModal';

export const PartiesView: React.FC = () => {
  const {
    clients,
    vendors,
    formatCurrency,
    deleteParty,
    selectedPartyId,
    setSelectedPartyId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<PartyType>('client');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [isPartyModalOpen, setIsPartyModalOpen] = useState(false);
  const [partyToEdit, setPartyToEdit] = useState<Party | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [partyForPayment, setPartyForPayment] = useState<Party | null>(null);

  const currentList = activeTab === 'client' ? clients : vendors;

  // Filter list
  const filteredList = currentList.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchComp = (p.company || '').toLowerCase().includes(q);
      const matchPhone = p.phone.toLowerCase().includes(q);
      if (!matchName && !matchComp && !matchPhone) return false;
    }
    return true;
  });

  // KPI calculations
  const totalBilled = currentList.reduce((sum, p) => sum + p.totalBilled, 0);
  const totalPaid = currentList.reduce((sum, p) => sum + p.totalPaid, 0);
  const totalOutstanding = currentList.reduce(
    (sum, p) => sum + Math.max(0, p.totalBilled - p.totalPaid),
    0
  );
  const totalOverdue = currentList
    .filter((p) => p.status === 'Overdue')
    .reduce((sum, p) => sum + Math.max(0, p.totalBilled - p.totalPaid), 0);

  return (
    <div className="space-y-6">
      {/* Tab Switcher & Main Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl max-w-fit">
          <button
            onClick={() => setActiveTab('client')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'client'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Clients & Invoices ({clients.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('vendor')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'vendor'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Suppliers & Vendors ({vendors.length})</span>
          </button>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            setPartyToEdit(null);
            setIsPartyModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{activeTab === 'client' ? '+ Add Client' : '+ Add Supplier / Vendor'}</span>
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">
            {activeTab === 'client' ? 'Total Invoiced' : 'Total Billed by Suppliers'}
          </span>
          <div className="text-base sm:text-lg font-bold font-mono text-slate-900 mt-1 truncate">
            {formatCurrency(totalBilled)}
          </div>
          <span className="text-[11px] text-slate-400">Total contractual billing</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">
            {activeTab === 'client' ? 'Total Collected' : 'Total Paid to Suppliers'}
          </span>
          <div className="text-base sm:text-lg font-bold font-mono text-emerald-600 mt-1 truncate">
            {formatCurrency(totalPaid)}
          </div>
          <span className="text-[11px] text-slate-400">Settled to date</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">
            {activeTab === 'client' ? 'Pending Receivables' : 'Pending Payables'}
          </span>
          <div className="text-base sm:text-lg font-bold font-mono text-amber-600 mt-1 truncate">
            {formatCurrency(totalOutstanding)}
          </div>
          <span className="text-[11px] text-slate-400">
            {activeTab === 'client' ? 'Owed to contractor' : 'Contractor owes'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Overdue Amount</span>
          <div className="text-base sm:text-lg font-bold font-mono text-rose-600 mt-1 truncate">
            {formatCurrency(totalOverdue)}
          </div>
          <span className="text-[11px] text-slate-400">Past agreed due date</span>
        </div>
      </div>

      {/* Filter Row: Search & Status */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'client' ? 'clients' : 'suppliers'} by name, company, or phone...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Status segmented buttons */}
        <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 text-xs overflow-x-auto">
          {['all', 'Unpaid', 'Partial', 'Overdue', 'Paid'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st === 'all' ? 'All Accounts' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Accounts Grid */}
      {filteredList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
            {activeTab === 'client' ? <User className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
          </div>
          <h3 className="text-base font-bold text-slate-900">No accounts match search</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or status filter, or add a new record.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredList.map((party) => {
            const balance = Math.max(0, party.totalBilled - party.totalPaid);

            return (
              <div
                key={party.id}
                className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md ${
                  party.status === 'Overdue'
                    ? 'border-rose-300 ring-1 ring-rose-200'
                    : 'border-slate-200'
                }`}
              >
                {/* Card Top */}
                <div className="p-5 space-y-4">
                  {/* Status & Edit */}
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        party.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : party.status === 'Overdue'
                          ? 'bg-rose-100 text-rose-800 flex items-center gap-1'
                          : party.status === 'Partial'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {party.status === 'Overdue' && <AlertTriangle className="w-3 h-3" />}
                      <span>{party.status}</span>
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setPartyToEdit(party);
                          setIsPartyModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                        title="Edit Account"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete account for "${party.name}"?`)) {
                            deleteParty(party.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                        title="Delete Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Name & Company */}
                  <div>
                    <h3
                      onClick={() => setSelectedPartyId(party.id)}
                      className="text-base font-bold text-slate-900 hover:text-orange-600 transition-colors cursor-pointer line-clamp-1"
                    >
                      {party.name}
                    </h3>
                    {party.company && (
                      <p className="text-xs text-slate-500 font-medium truncate">{party.company}</p>
                    )}
                  </div>

                  {/* Phone & Due Date */}
                  <div className="space-y-1 text-xs text-slate-500 pt-1 border-t border-slate-100">
                    {party.phone && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{party.phone}</span>
                      </div>
                    )}
                    {party.dueDate && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Due: {party.dueDate}</span>
                      </div>
                    )}
                  </div>

                  {/* Financial Breakdown */}
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>{activeTab === 'client' ? 'Total Invoiced:' : 'Total Billed:'}</span>
                      <span className="font-mono font-semibold text-slate-900">
                        {formatCurrency(party.totalBilled)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>{activeTab === 'client' ? 'Received:' : 'Paid Out:'}</span>
                      <span className="font-mono font-semibold text-emerald-600">
                        {formatCurrency(party.totalPaid)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200 font-bold">
                      <span className="text-slate-900">Outstanding:</span>
                      <span
                        className={`font-mono text-sm ${
                          balance > 0 ? 'text-amber-600' : 'text-emerald-700'
                        }`}
                      >
                        {formatCurrency(balance)}
                      </span>
                    </div>
                  </div>

                  {party.notes && (
                    <p className="text-[11px] text-slate-500 italic line-clamp-2">{party.notes}</p>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="p-3.5 bg-slate-50 border-t border-slate-100 rounded-b-2xl flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedPartyId(party.id)}
                    className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-slate-200/60"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Ledger</span>
                  </button>

                  <button
                    onClick={() => {
                      setPartyForPayment(party);
                      setIsPaymentModalOpen(true);
                    }}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 py-1 px-2.5 rounded-lg hover:bg-orange-50 font-mono"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>{activeTab === 'client' ? 'Receive Money' : 'Pay Bill'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Party Modal (Add/Edit) */}
      <PartyModal
        isOpen={isPartyModalOpen}
        onClose={() => {
          setIsPartyModalOpen(false);
          setPartyToEdit(null);
        }}
        defaultType={activeTab}
        partyToEdit={partyToEdit}
      />

      {/* Record Payment Modal */}
      <PartyPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setPartyForPayment(null);
        }}
        party={partyForPayment}
      />

      {/* Party Ledger Modal */}
      <PartyLedgerModal
        partyId={selectedPartyId}
        onClose={() => setSelectedPartyId(null)}
        onRecordPayment={(p) => {
          setSelectedPartyId(null);
          setPartyForPayment(p);
          setIsPaymentModalOpen(true);
        }}
      />
    </div>
  );
};
