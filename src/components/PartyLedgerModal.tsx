import React from 'react';
import {
  X,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  DollarSign,
  Printer,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Party } from '../types';

interface PartyLedgerModalProps {
  partyId: string | null;
  onClose: () => void;
  onRecordPayment: (party: Party) => void;
}

export const PartyLedgerModal: React.FC<PartyLedgerModalProps> = ({
  partyId,
  onClose,
  onRecordPayment,
}) => {
  const { clients, vendors, transactions, projects, formatCurrency } = useApp();

  if (!partyId) return null;

  const party =
    clients.find((c) => c.id === partyId) || vendors.find((v) => v.id === partyId);

  if (!party) return null;

  const isClient = party.type === 'client';
  const balance = Math.max(0, party.totalBilled - party.totalPaid);

  // Associated transactions
  const partyTransactions = transactions.filter(
    (t) =>
      t.partyId === party.id ||
      t.vendorOrPayer.toLowerCase().includes(party.name.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center font-bold text-white shrink-0">
              {isClient ? <User className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">{party.name}</h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    party.status === 'Paid'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : party.status === 'Overdue'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {party.status}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {isClient ? 'Client Account Statement' : 'Supplier / Vendor Account Statement'}
                {party.company && ` · ${party.company}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Overdue Alert banner */}
          {party.status === 'Overdue' && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl flex items-center gap-3 text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <div>
                <span className="font-bold">Overdue Payment Notice: </span>
                <span>
                  Outstanding amount of {formatCurrency(balance)} was due on {party.dueDate}.
                </span>
              </div>
            </div>
          )}

          {/* Ledger Balance Summary Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-medium text-slate-500 block">
                {isClient ? 'Total Invoiced' : 'Total Billed'}
              </span>
              <span className="text-sm sm:text-base font-bold font-mono text-slate-900 mt-1 block truncate">
                {formatCurrency(party.totalBilled)}
              </span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-medium text-slate-500 block">
                {isClient ? 'Total Received' : 'Total Paid Out'}
              </span>
              <span className="text-sm sm:text-base font-bold font-mono text-emerald-600 mt-1 block truncate">
                {formatCurrency(party.totalPaid)}
              </span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-medium text-slate-500 block">
                Outstanding Balance
              </span>
              <span
                className={`text-sm sm:text-base font-bold font-mono mt-1 block truncate ${
                  balance > 0 ? 'text-amber-600' : 'text-emerald-700'
                }`}
              >
                {formatCurrency(balance)}
              </span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
            {party.phone && (
              <div>
                <span className="text-slate-500 block font-medium">Phone</span>
                <span className="font-semibold text-slate-800">{party.phone}</span>
              </div>
            )}
            {party.dueDate && (
              <div>
                <span className="text-slate-500 block font-medium">Due Date</span>
                <span className="font-semibold text-slate-800">{party.dueDate}</span>
              </div>
            )}
            {party.address && (
              <div>
                <span className="text-slate-500 block font-medium">Address</span>
                <span className="text-slate-800">{party.address}</span>
              </div>
            )}
          </div>

          {/* Transactions Statement */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-t border-slate-200 pt-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Associated Ledger History</h4>
                <p className="text-xs text-slate-500">
                  {partyTransactions.length} recorded payments & disbursements
                </p>
              </div>

              {balance > 0 && (
                <button
                  onClick={() => onRecordPayment(party)}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg flex items-center gap-1 shadow-2xs"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>{isClient ? 'Record Receipt' : 'Record Payment'}</span>
                </button>
              )}
            </div>

            {partyTransactions.length === 0 ? (
              <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs">
                No individual transactions logged under this account yet.
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {partyTransactions.map((tx) => {
                  const proj = projects.find((p) => p.id === tx.projectId);
                  const isIncome = tx.type === 'income';

                  return (
                    <div
                      key={tx.id}
                      className="p-3 flex items-center justify-between gap-3 text-xs hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`p-1.5 rounded-lg shrink-0 ${
                            isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                          }`}
                        >
                          {isIncome ? (
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">
                            {tx.category} · {proj?.name || 'Site'}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {tx.date} · {tx.paymentMethod} {tx.reference ? `(${tx.reference})` : ''}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`font-mono font-bold whitespace-nowrap ${
                          isIncome ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">JALEEL BUILDER — Account Ledger</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
