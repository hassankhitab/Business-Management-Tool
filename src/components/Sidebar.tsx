import React from 'react';
import {
  LayoutDashboard,
  Building2,
  ArrowLeftRight,
  Users,
  Contact,
  FileBarChart,
  Settings,
  Plus,
  X,
  HardHat,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    currentTab,
    setCurrentTab,
    setSelectedProjectId,
    setSelectedPartyId,
    setIsAddExpenseOpen,
    settings,
    alerts,
  } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: Building2 },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'workers', label: 'Workers & Labor', icon: Users },
    { id: 'parties', label: 'Clients & Vendors', icon: Contact },
    { id: 'reports', label: 'Reports & P&L', icon: FileBarChart },
    { id: 'settings', label: 'Settings & About', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    setSelectedProjectId(null);
    setSelectedPartyId(null);
    onClose();
  };

  const dangerAlertsCount = alerts.filter((a) => a.type === 'danger').length;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo size="md" />
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-white leading-tight">
                {settings.companyName || 'JALEEL BUILDER'}
              </h1>
              <p className="text-xs font-medium text-orange-400/90 tracking-wide">
                {settings.tagline || 'by Zameer Tanoli'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 lg:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Add Expense Action */}
        <div className="p-4 border-b border-slate-800/60">
          <button
            onClick={() => {
              setIsAddExpenseOpen(true);
              onClose();
            }}
            className="w-full py-2.5 px-3.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-orange-950/40 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Record New Expense</span>
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-sm shadow-orange-950/30 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.id === 'dashboard' && dangerAlertsCount > 0 && (
                  <span className="flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    <span>{dangerAlertsCount}</span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Contractor Profile Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-orange-400 shrink-0">
              <HardHat className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-white truncate">
                  {settings.contractorName || 'Jaleel'}
                </p>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Active on Site" />
              </div>
              <p className="text-xs text-slate-400 truncate">General Contractor</p>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/50 flex items-center justify-between text-[11px] text-slate-500">
            <span>JALEEL BUILDER v1.0</span>
            <span className="text-orange-400/80 font-medium">by Zameer Tanoli</span>
          </div>
        </div>
      </aside>
    </>
  );
};
