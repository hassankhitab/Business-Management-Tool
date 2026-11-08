import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const IncomeExpenseChart: React.FC = () => {
  const { transactions, formatCurrency, settings } = useApp();
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  // Group transactions by month for the last 6 months
  const monthlyData = React.useMemo(() => {
    const monthsMap: Record<string, { label: string; income: number; expense: number }> = {};

    // Get last 6 months in chronological order
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-US', { month: 'short' });
      monthsMap[key] = { label, income: 0, expense: 0 };
    }

    transactions.forEach((tx) => {
      const key = tx.date.slice(0, 7); // 'YYYY-MM'
      if (monthsMap[key]) {
        if (tx.type === 'income') {
          monthsMap[key].income += tx.amount;
        } else {
          monthsMap[key].expense += tx.amount;
        }
      }
    });

    return Object.entries(monthsMap).map(([key, data]) => ({
      key,
      ...data,
    }));
  }, [transactions]);

  const maxVal = Math.max(
    ...monthlyData.map((d) => Math.max(d.income, d.expense)),
    1000000
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">Cash Flow (Last 6 Months)</h3>
          <p className="text-xs text-slate-500">Monthly breakdown of income received vs site expenses</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block" />
            <span className="text-slate-600">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-rose-500 inline-block" />
            <span className="text-slate-600">Expense</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 flex flex-col justify-end pt-4 min-h-[200px]">
        <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-44 pb-2 border-b border-slate-200">
          {monthlyData.map((m) => {
            const incomeHeight = Math.max(4, Math.round((m.income / maxVal) * 140));
            const expenseHeight = Math.max(4, Math.round((m.expense / maxVal) * 140));
            const isHovered = hoveredMonth === m.key;

            return (
              <div
                key={m.key}
                className="relative flex flex-col items-center justify-end h-full group cursor-pointer"
                onMouseEnter={() => setHoveredMonth(m.key)}
                onMouseLeave={() => setHoveredMonth(null)}
              >
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute -top-16 z-20 bg-slate-900 text-white text-[11px] py-1.5 px-2.5 rounded-lg shadow-lg pointer-events-none whitespace-nowrap border border-slate-700">
                    <p className="font-bold text-slate-300">{m.label} Cash Flow</p>
                    <p className="text-emerald-400 font-mono">In: {formatCurrency(m.income)}</p>
                    <p className="text-rose-400 font-mono">Out: {formatCurrency(m.expense)}</p>
                  </div>
                )}

                {/* Bars */}
                <div className="flex items-end gap-1 sm:gap-2 w-full justify-center">
                  {/* Income bar */}
                  <div
                    style={{ height: `${incomeHeight}px` }}
                    className={`w-3.5 sm:w-6 bg-emerald-500 rounded-t-sm transition-all duration-300 ${
                      isHovered ? 'brightness-110 shadow-sm shadow-emerald-500/50' : ''
                    }`}
                  />
                  {/* Expense bar */}
                  <div
                    style={{ height: `${expenseHeight}px` }}
                    className={`w-3.5 sm:w-6 bg-rose-500 rounded-t-sm transition-all duration-300 ${
                      isHovered ? 'brightness-110 shadow-sm shadow-rose-500/50' : ''
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="grid grid-cols-6 gap-2 sm:gap-4 pt-2">
          {monthlyData.map((m) => (
            <div key={m.key} className="text-center">
              <span className="text-xs font-semibold text-slate-600 block">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
