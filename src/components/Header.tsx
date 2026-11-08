import React from 'react';
import { Menu, Plus, ArrowDownLeft, ArrowUpRight, Coins } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  onOpenSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSidebar }) => {
  const {
    currentTab,
    setCurrentTab,
    setIsAddExpenseOpen,
    setIsAddIncomeOpen,
    settings,
  } = useApp();

  const getPageTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return { title: 'Dashboard Overview', subtitle: 'Real-time financial status across all active building sites' };
      case 'projects':
        return { title: 'Construction Projects', subtitle: 'Budgets, contracts, timeline, and cost tracking per site' };
      case 'transactions':
        return { title: 'Cash Flow & Transactions', subtitle: 'Complete log of income receipts and site expenses' };
      case 'workers':
        return { title: 'Workers & Site Labor', subtitle: 'Masons, tradesmen, daily wage records, and attendance payroll' };
      case 'parties':
        return { title: 'Clients & Suppliers Ledger', subtitle: 'Track incoming client payments and supplier payables' };
      case 'reports':
        return { title: 'Financial Reports & P&L', subtitle: 'Project profitability, monthly cashflow, and print statements' };
      case 'settings':
        return { title: 'Company Settings & About', subtitle: 'Contractor profile, currency preferences, and demo data controls' };
      default:
        return { title: 'Contractor Management', subtitle: 'JALEEL BUILDER by Zameer Tanoli' };
    }
  };

  const { title, subtitle } = getPageTitle();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger + Brand logo & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenSidebar}
            className="p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="lg:hidden flex items-center gap-2">
            <BrandLogo size="sm" />
          </div>

          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate tracking-tight">
              {title}
            </h1>
            <p className="hidden sm:block text-xs text-slate-500 truncate font-normal">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Currency indicator button */}
          <button
            onClick={() => setCurrentTab('settings')}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Change Currency in Settings"
          >
            <Coins className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-mono">{settings.currency} ({settings.currencySymbol})</span>
          </button>

          {/* Quick Add Income Button */}
          <button
            onClick={() => setIsAddIncomeOpen(true)}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all active:scale-[0.98] cursor-pointer"
            title="Record Income"
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden xs:inline">+ Income</span>
          </button>

          {/* Quick Add Expense Button */}
          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs shadow-orange-700/20 transition-all active:scale-[0.98] cursor-pointer"
            title="Record Expense"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-white" />
            <span>+ Expense</span>
          </button>
        </div>
      </div>
    </header>
  );
};
