import React, { useState } from 'react';
import {
  FileBarChart,
  Printer,
  Download,
  Building2,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  CheckCircle2,
  HardHat,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from '../components/BrandLogo';

export const ReportsView: React.FC = () => {
  const {
    projects,
    transactions,
    overallStats,
    formatCurrency,
    getProjectStats,
    exportProjectReportToCSV,
    exportTransactionsToCSV,
    settings,
  } = useApp();

  const [activeReportTab, setActiveReportTab] = useState<'pnl' | 'monthly' | 'categories'>('pnl');

  const handlePrint = () => {
    window.print();
  };

  // Monthly summary aggregation
  const monthlySummary = React.useMemo(() => {
    const map: Record<string, { income: number; expense: number }> = {};

    transactions.forEach((t) => {
      const month = t.date.slice(0, 7); // 'YYYY-MM'
      if (!map[month]) {
        map[month] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        map[month].income += t.amount;
      } else {
        map[month].expense += t.amount;
      }
    });

    return Object.entries(map)
      .map(([month, data]) => ({
        month,
        income: data.income,
        expense: data.expense,
        net: data.income - data.expense,
      }))
      .sort((a, b) => b.month.localeCompare(a.month));
  }, [transactions]);

  // Category expense breakdown
  const categorySummary = React.useMemo(() => {
    const map: Record<string, number> = {};
    let total = 0;

    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
        total += t.amount;
      });

    return Object.entries(map)
      .map(([cat, amount]) => ({
        category: cat,
        amount,
        percent: total > 0 ? (amount / total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Top Controls (Screen only) */}
      <div className="no-print flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Report tab selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl max-w-fit">
          <button
            onClick={() => setActiveReportTab('pnl')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeReportTab === 'pnl'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Project Profit & Loss
          </button>
          <button
            onClick={() => setActiveReportTab('monthly')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeReportTab === 'monthly'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly Cashflow
          </button>
          <button
            onClick={() => setActiveReportTab('categories')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeReportTab === 'categories'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Expense Breakdown
          </button>
        </div>

        {/* Action Buttons: Print & CSV */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportProjectReportToCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-all active:scale-[0.98] print-keep"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* PRINTABLE REPORT CONTAINER */}
      <div className="printable-area bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Print & Report Official Header */}
        <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo size="lg" />
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                {settings.companyName || 'JALEEL BUILDER'}
              </h2>
              <p className="text-xs font-bold text-orange-600 tracking-wide mt-1">
                {settings.tagline || 'by Zameer Tanoli'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Contractor: <span className="font-semibold text-slate-800">{settings.contractorName}</span> | Phone: {settings.phone}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-600 space-y-0.5">
            <span className="font-mono font-bold text-slate-900 block text-sm uppercase">
              Financial Status Statement
            </span>
            <p>Generated Date: <span className="font-semibold">{currentDate}</span></p>
            <p>Currency: <span className="font-mono font-bold">{settings.currency} ({settings.currencySymbol})</span></p>
          </div>
        </div>

        {/* Overall KPI Summary Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <span className="text-[11px] font-medium text-slate-500 block uppercase">
              Gross Inflow (Collected)
            </span>
            <span className="text-base font-bold font-mono text-emerald-600 block mt-0.5">
              {formatCurrency(overallStats.totalIncome)}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-medium text-slate-500 block uppercase">
              Gross Outflow (Spent)
            </span>
            <span className="text-base font-bold font-mono text-rose-600 block mt-0.5">
              {formatCurrency(overallStats.totalExpenses)}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-medium text-slate-500 block uppercase">
              Net Profit / Margin
            </span>
            <span
              className={`text-base font-bold font-mono block mt-0.5 ${
                overallStats.netProfit >= 0 ? 'text-slate-900' : 'text-rose-600'
              }`}
            >
              {formatCurrency(overallStats.netProfit)}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-medium text-slate-500 block uppercase">
              Pending Receivables
            </span>
            <span className="text-base font-bold font-mono text-amber-600 block mt-0.5">
              {formatCurrency(overallStats.pendingReceivables)}
            </span>
          </div>
        </div>

        {/* 1. PROJECT PROFIT & LOSS STATEMENT */}
        {(activeReportTab === 'pnl' || true) && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                1. Project-Wise Profit & Loss Statement
              </h3>
              <span className="text-xs text-slate-500">{projects.length} Active Building Sites</span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-3.5 py-2.5">Project Name & Client</th>
                      <th className="px-3.5 py-2.5">Status</th>
                      <th className="px-3.5 py-2.5 text-right">Contract Value</th>
                      <th className="px-3.5 py-2.5 text-right">Budget</th>
                      <th className="px-3.5 py-2.5 text-right">Total Spent</th>
                      <th className="px-3.5 py-2.5 text-right">Received</th>
                      <th className="px-3.5 py-2.5 text-right">Net Profit</th>
                      <th className="px-3.5 py-2.5 text-right">Budget Used</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {projects.map((p) => {
                      const stats = getProjectStats(p.id);

                      return (
                        <tr key={p.id} className="hover:bg-slate-50/70">
                          <td className="px-3.5 py-3 font-sans">
                            <span className="font-bold text-slate-900 block">{p.name}</span>
                            <span className="text-[11px] text-slate-500">{p.clientName}</span>
                          </td>
                          <td className="px-3.5 py-3 font-sans">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                p.status === 'Completed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : p.status === 'In Progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="px-3.5 py-3 text-right font-medium text-slate-700">
                            {formatCurrency(p.contractValue)}
                          </td>
                          <td className="px-3.5 py-3 text-right font-medium text-slate-700">
                            {formatCurrency(p.budget)}
                          </td>
                          <td className="px-3.5 py-3 text-right font-bold text-rose-600">
                            {formatCurrency(stats.spent)}
                          </td>
                          <td className="px-3.5 py-3 text-right font-bold text-emerald-600">
                            {formatCurrency(stats.income)}
                          </td>
                          <td
                            className={`px-3.5 py-3 text-right font-black ${
                              stats.profit >= 0 ? 'text-emerald-700' : 'text-rose-600'
                            }`}
                          >
                            {formatCurrency(stats.profit)}
                          </td>
                          <td
                            className={`px-3.5 py-3 text-right font-bold ${
                              stats.isNearLimit ? 'text-rose-600' : 'text-slate-700'
                            }`}
                          >
                            {stats.percentSpent.toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  {/* Totals Row */}
                  <tfoot className="bg-slate-100 border-t-2 border-slate-300 font-bold font-mono">
                    <tr>
                      <td className="px-3.5 py-3 font-sans font-bold" colSpan={2}>
                        Total Across All Projects:
                      </td>
                      <td className="px-3.5 py-3 text-right">
                        {formatCurrency(projects.reduce((sum, p) => sum + p.contractValue, 0))}
                      </td>
                      <td className="px-3.5 py-3 text-right">
                        {formatCurrency(projects.reduce((sum, p) => sum + p.budget, 0))}
                      </td>
                      <td className="px-3.5 py-3 text-right text-rose-600">
                        {formatCurrency(overallStats.totalExpenses)}
                      </td>
                      <td className="px-3.5 py-3 text-right text-emerald-600">
                        {formatCurrency(overallStats.totalIncome)}
                      </td>
                      <td className="px-3.5 py-3 text-right text-slate-900">
                        {formatCurrency(overallStats.netProfit)}
                      </td>
                      <td className="px-3.5 py-3 text-right">—</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. MONTHLY CASHFLOW SUMMARY */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              2. Monthly Financial Summary
            </h3>
            <span className="text-xs text-slate-500">Chronological Cash Inflow vs Outflow</span>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2.5">Month</th>
                  <th className="px-4 py-2.5 text-right">Inflow (Income)</th>
                  <th className="px-4 py-2.5 text-right">Outflow (Expenses)</th>
                  <th className="px-4 py-2.5 text-right">Net Cash Flow</th>
                  <th className="px-4 py-2.5 text-center">Cash Position</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {monthlySummary.map((m) => (
                  <tr key={m.month} className="hover:bg-slate-50/70">
                    <td className="px-4 py-2.5 font-bold font-sans text-slate-800">
                      {new Date(m.month + '-01').toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium text-emerald-600">
                      +{formatCurrency(m.income)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium text-rose-600">
                      -{formatCurrency(m.expense)}
                    </td>
                    <td
                      className={`px-4 py-2.5 text-right font-bold ${
                        m.net >= 0 ? 'text-slate-900' : 'text-rose-600'
                      }`}
                    >
                      {formatCurrency(m.net)}
                    </td>
                    <td className="px-4 py-2.5 text-center font-sans">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          m.net >= 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {m.net >= 0 ? 'Surplus' : 'Deficit'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. EXPENSE CATEGORY DISTRIBUTION */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              3. Expenditure Breakdown by Head of Account
            </h3>
            <span className="text-xs text-slate-500">Materials, Labor, Equipment, etc.</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categorySummary.map((c) => (
              <div key={c.category} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-700 block truncate">
                  {c.category}
                </span>
                <span className="text-sm font-bold font-mono text-slate-900 block mt-1">
                  {formatCurrency(c.amount)}
                </span>
                <span className="text-[11px] text-slate-500 block font-medium">
                  {c.percent.toFixed(1)}% of total spent
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Signatures & Certification for Printed Report */}
        <div className="pt-8 mt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-slate-600">
          <div>
            <p className="font-bold text-slate-800 uppercase text-[10px] tracking-wider mb-8">
              Prepared & Verified By:
            </p>
            <div className="border-t border-slate-400 pt-1">
              <p className="font-bold text-slate-900">{settings.contractorName} (Contractor)</p>
              <p className="text-[10px] text-slate-500">{settings.companyName}</p>
            </div>
          </div>

          <div>
            <p className="font-bold text-slate-800 uppercase text-[10px] tracking-wider mb-8">
              Site Accounts Officer:
            </p>
            <div className="border-t border-slate-400 pt-1">
              <p className="font-bold text-slate-900">Chief Accountant / QS</p>
              <p className="text-[10px] text-slate-500">Financial Audit & Verification</p>
            </div>
          </div>

          <div className="hidden sm:block">
            <p className="font-bold text-slate-800 uppercase text-[10px] tracking-wider mb-8">
              Official Seal:
            </p>
            <div className="w-24 h-12 border border-dashed border-slate-300 rounded-lg flex items-center justify-center text-[10px] text-slate-400">
              Company Stamp
            </div>
          </div>
        </div>

        {/* Report Mandatory Footer: App Name & "by Zameer Tanoli" */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">{settings.companyName || 'JALEEL BUILDER'}</span>
            <span>·</span>
            <span className="text-orange-600 font-bold">{settings.tagline || 'by Zameer Tanoli'}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 sm:mt-0">
            Official Multi-Project Construction Financial Statement
          </p>
        </div>
      </div>
    </div>
  );
};
