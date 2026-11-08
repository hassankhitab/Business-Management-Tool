/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, ArrowUpRight } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './views/DashboardView';
import { ProjectsView } from './views/ProjectsView';
import { TransactionsView } from './views/TransactionsView';
import { WorkersView } from './views/WorkersView';
import { PartiesView } from './views/PartiesView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';
import { TransactionModal } from './components/TransactionModal';

const AppContent: React.FC = () => {
  const {
    currentTab,
    isAddExpenseOpen,
    setIsAddExpenseOpen,
    isAddIncomeOpen,
    setIsAddIncomeOpen,
    settings,
  } = useApp();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'projects':
        return <ProjectsView />;
      case 'transactions':
        return <TransactionsView />;
      case 'workers':
        return <WorkersView />;
      case 'parties':
        return <PartiesView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area (offset by sidebar on desktop) */}
      <div className="lg:pl-72 flex flex-col min-h-screen flex-1">
        {/* Top Header */}
        <Header onOpenSidebar={() => setIsSidebarOpen(true)} />

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>

        {/* Persistent Footer on every page */}
        <footer className="no-print mt-auto border-t border-slate-200 bg-white py-4 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-800 tracking-tight">
                {settings.companyName || 'JALEEL BUILDER'}
              </span>
              <span>·</span>
              <span className="font-bold text-orange-600">
                {settings.tagline || 'by Zameer Tanoli'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 text-center sm:text-right">
              Professional Multi-Project Construction Financial Management &copy; {new Date().getFullYear()}
            </p>
          </div>
        </footer>

        {/* Floating Quick Action Button on Mobile */}
        <div className="floating-action-btn lg:hidden fixed bottom-5 right-5 z-40">
          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="flex items-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold text-xs rounded-full shadow-lg shadow-orange-900/30 transition-all cursor-pointer"
            aria-label="Add Expense"
          >
            <Plus className="w-5 h-5" />
            <span className="pr-1">+ Add Expense</span>
          </button>
        </div>
      </div>

      {/* Global Quick Add Expense Modal */}
      <TransactionModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        defaultType="expense"
      />

      {/* Global Quick Add Income Modal */}
      <TransactionModal
        isOpen={isAddIncomeOpen}
        onClose={() => setIsAddIncomeOpen(false)}
        defaultType="income"
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
