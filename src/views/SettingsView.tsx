import React, { useState } from 'react';
import {
  Settings,
  HardHat,
  RotateCcw,
  Info,
  CheckCircle2,
  DollarSign,
  Coins,
  Shield,
  Building2,
  Save,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CurrencyCode } from '../types';
import { BrandLogo } from '../components/BrandLogo';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetToDemoData } = useApp();

  const [contractorName, setContractorName] = useState(settings.contractorName);
  const [companyName, setCompanyName] = useState(settings.companyName);
  const [currency, setCurrency] = useState<CurrencyCode>(settings.currency);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [address, setAddress] = useState(settings.address);
  const [isSaved, setIsSaved] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      contractorName: contractorName.trim(),
      companyName: companyName.trim(),
      currency,
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleConfirmReset = () => {
    resetToDemoData();
    setShowResetConfirm(false);
    // Refresh local form inputs
    setContractorName('Jaleel');
    setCompanyName('JALEEL BUILDER');
    setCurrency('PKR');
    setPhone('+92 300 8492011');
    setEmail('jaleel.builder@zameertanoli.com');
    setAddress('Suite 402, Builders Commercial Complex, Main Boulevard, Lahore');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Save feedback banner */}
      {isSaved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 text-xs font-bold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Preferences updated and saved to localStorage successfully!</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">Contractor & Company Profile</h3>
          <p className="text-xs text-slate-500">Configure your business identity and regional currency preferences</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Contractor Name *
            </label>
            <input
              type="text"
              value={contractorName}
              onChange={(e) => setContractorName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
            />
            <span className="text-[11px] text-slate-500">Shown in sidebar profile and printed statements</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Company / Brand Title *
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold"
            />
            <span className="text-[11px] text-slate-500">App title: JALEEL BUILDER</span>
          </div>
        </div>

        {/* Currency Selector */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-orange-600" />
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Accounting Currency Symbol
            </label>
          </div>
          <p className="text-xs text-slate-500">
            Select the currency format for all site budgets, invoices, wages, and financial dashboards.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
            {[
              { code: 'PKR', symbol: 'Rs.', label: 'Pakistani Rupee (PKR - Rs.)' },
              { code: 'USD', symbol: '$', label: 'US Dollar (USD - $)' },
              { code: 'EUR', symbol: '€', label: 'Euro (EUR - €)' },
              { code: 'AED', symbol: 'AED', label: 'UAE Dirham (AED)' },
              { code: 'SAR', symbol: 'SAR', label: 'Saudi Riyal (SAR)' },
            ].map((c) => (
              <button
                type="button"
                key={c.code}
                onClick={() => setCurrency(c.code as CurrencyCode)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  currency === c.code
                    ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-mono font-bold text-sm">{c.symbol}</div>
                <div
                  className={`text-[11px] font-medium mt-0.5 ${
                    currency === c.code ? 'text-orange-100' : 'text-slate-500'
                  }`}
                >
                  {c.code}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Contact Phone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Official Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Office / Headquarter Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Company Preferences</span>
          </button>
        </div>
      </form>

      {/* Demo Data Management */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Demo Data Controls</h3>
          <p className="text-xs text-slate-500">
            Reset all projects, transactions, workers, and supplier ledgers back to the original demo state.
          </p>
        </div>

        <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <p className="font-bold text-amber-900">Restore Initial Demo Dataset</p>
            <p className="text-amber-800 text-[11px] mt-0.5">
              This repopulates the 3 demo building sites (Al-Noor Villa, Gulshan Plaza, Road Repair), 30 sample transactions, 8 site workers, overdue payment alerts, and supplier ledgers.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 text-xs font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 border border-amber-300 rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 shadow-md space-y-4">
        <div className="flex items-center gap-3">
          <BrandLogo size="md" />
          <div>
            <h3 className="text-base font-extrabold text-white">About JALEEL BUILDER</h3>
            <p className="text-xs font-bold text-orange-400">
              developed by Zameer Tanoli, Version 1.0 (Demo)
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-white">JALEEL BUILDER</strong> is a dedicated money management and multi-site project accounting solution engineered specifically for building contractors, civil engineers, and master builders. Designed to deliver instant financial clarity on site: know what came in, what went out, who owes you, whom you owe, and whether each project is yielding net profit.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-400">
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
            <span className="text-white font-bold block mb-0.5">Multi-Site Tracking</span>
            <span>Real-time budget alerts &gt;90% and contract value P&L.</span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
            <span className="text-white font-bold block mb-0.5">Labor Payroll</span>
            <span>Daily wage calculation with 1-click expense creation.</span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
            <span className="text-white font-bold block mb-0.5">Offline-Ready Storage</span>
            <span>All entries persist securely in your browser's localStorage.</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>JALEEL BUILDER — Construction Project Accounting</span>
          <span className="text-orange-400 font-bold">by Zameer Tanoli</span>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h4 className="text-base font-bold text-slate-900">Reset All Demo Data?</h4>
              <p className="text-xs text-slate-500 mt-1">
                This will overwrite any newly created projects or transactions and restore the default 3 projects, 30 transactions, and worker roster.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="flex-1 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs"
              >
                Yes, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
