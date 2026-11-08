import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Coins,
  Clock,
  Building2,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { IncomeExpenseChart } from '../components/IncomeExpenseChart';
import { ExpenseCategoryDonut } from '../components/ExpenseCategoryDonut';

export const DashboardView: React.FC = () => {
  const {
    overallStats,
    formatCurrency,
    alerts,
    transactions,
    projects,
    setCurrentTab,
    setSelectedProjectId,
    setSelectedPartyId,
    setIsAddExpenseOpen,
    setIsAddIncomeOpen,
    getProjectStats,
  } = useApp();

  const recentTransactions = transactions.slice(0, 6);

  const profitMargin =
    overallStats.totalIncome > 0
      ? ((overallStats.netProfit / overallStats.totalIncome) * 100).toFixed(1)
      : '0';

  return (
    <div className="space-y-6">
      {/* Actionable Alerts Bar */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3.5 sm:p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs ${
                alert.type === 'danger'
                  ? 'bg-rose-50/90 border-rose-200 text-rose-900'
                  : 'bg-amber-50/90 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-1.5 rounded-lg shrink-0 ${
                    alert.type === 'danger' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold">{alert.title}</h4>
                  <p className="text-xs text-slate-700 mt-0.5">{alert.description}</p>
                </div>
              </div>

              {alert.linkTab && (
                <button
                  onClick={() => {
                    setCurrentTab(alert.linkTab!);
                    if (alert.targetId && alert.linkTab === 'projects') {
                      setSelectedProjectId(alert.targetId);
                    } else if (alert.targetId && alert.linkTab === 'parties') {
                      setSelectedPartyId(alert.targetId);
                    }
                  }}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors shrink-0 flex items-center gap-1.5 ${
                    alert.type === 'danger'
                      ? 'bg-rose-600 text-white border-rose-600 hover:bg-rose-700'
                      : 'bg-amber-600 text-white border-amber-600 hover:bg-amber-700'
                  }`}
                >
                  <span>Resolve Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 6 Core Financial Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Income */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Income</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold font-mono text-emerald-600 truncate">
              {formatCurrency(overallStats.totalIncome)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Client payments & advances</p>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Expenses</span>
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold font-mono text-rose-600 truncate">
              {formatCurrency(overallStats.totalExpenses)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Materials, labor & site costs</p>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Net Profit</span>
            <div
              className={`p-1.5 rounded-lg ${
                overallStats.netProfit >= 0
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-rose-50 text-rose-600'
              }`}
            >
              {overallStats.netProfit >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
            </div>
          </div>
          <div>
            <div
              className={`text-lg sm:text-xl font-bold font-mono truncate ${
                overallStats.netProfit >= 0 ? 'text-slate-900' : 'text-rose-600'
              }`}
            >
              {formatCurrency(overallStats.netProfit)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Margin: <span className="font-semibold text-slate-700">{profitMargin}%</span>
            </p>
          </div>
        </div>

        {/* Cash in Hand */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Cash in Hand</span>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 truncate">
              {formatCurrency(overallStats.cashInHand)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Liquid operational liquidity</p>
          </div>
        </div>

        {/* Pending Receivables */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Pending Receivables</span>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold font-mono text-amber-600 truncate">
              {formatCurrency(overallStats.pendingReceivables)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Clients owe contractor</p>
          </div>
        </div>

        {/* Pending Payables */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Pending Payables</span>
            <div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold font-mono text-orange-600 truncate">
              {formatCurrency(overallStats.pendingPayables)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Due to vendors & suppliers</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncomeExpenseChart />
        <ExpenseCategoryDonut />
      </div>

      {/* Projects Health & Recent Transactions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects Overview (1 col on desktop) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Project Budgets</h3>
              <p className="text-xs text-slate-500">Live spend progress per site</p>
            </div>
            <button
              onClick={() => setCurrentTab('projects')}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4 flex-1">
            {projects.map((proj) => {
              const stats = getProjectStats(proj.id);
              return (
                <div
                  key={proj.id}
                  onClick={() => {
                    setSelectedProjectId(proj.id);
                    setCurrentTab('projects');
                  }}
                  className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{proj.name}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        proj.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : proj.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {proj.status}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">
                        Spent: <span className="font-mono font-semibold text-slate-800">{formatCurrency(stats.spent)}</span>
                      </span>
                      <span
                        className={`font-mono font-bold ${
                          stats.isNearLimit ? 'text-rose-600' : 'text-slate-700'
                        }`}
                      >
                        {stats.percentSpent.toFixed(0)}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
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

                    {stats.isNearLimit && (
                      <p className="text-[10px] font-bold text-rose-600 flex items-center gap-1 pt-0.5">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Critical: Exceeded 90% budget threshold</span>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions (2 cols on desktop) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Transactions</h3>
              <p className="text-xs text-slate-500">Latest site inflows & expenses</p>
            </div>
            <button
              onClick={() => setCurrentTab('transactions')}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 flex-1 overflow-x-auto">
            {recentTransactions.map((tx) => {
              const proj = projects.find((p) => p.id === tx.projectId);
              const isIncome = tx.type === 'income';

              return (
                <div
                  key={tx.id}
                  className="py-3 px-1 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {tx.vendorOrPayer}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span>{tx.category}</span>
                        <span>·</span>
                        <span className="truncate max-w-[140px]">{proj?.name || 'Site'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className={`text-xs sm:text-sm font-bold font-mono ${
                        isIncome ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
                    </p>
                    <p className="text-[10px] text-slate-600 font-medium">{tx.date}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Showing 6 of {transactions.length} transactions</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddExpenseOpen(true)}
                className="font-semibold text-rose-600 hover:underline"
              >
                + Expense
              </button>
              <span>·</span>
              <button
                onClick={() => setIsAddIncomeOpen(true)}
                className="font-semibold text-emerald-600 hover:underline"
              >
                + Income
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
