import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ExpenseCategory } from '../types';

const CATEGORY_COLORS: Record<string, string> = {
  Materials: '#ea580c', // Orange-600
  Labor: '#2563eb', // Blue-600
  'Equipment Rental': '#8b5cf6', // Violet-500
  'Fuel/Transport': '#d97706', // Amber-600
  Subcontractor: '#0d9488', // Teal-600
  'Permits/Fees': '#64748b', // Slate-500
  Utilities: '#0284c7', // Sky-600
  Miscellaneous: '#94a3b8', // Slate-400
};

export const ExpenseCategoryDonut: React.FC = () => {
  const { transactions, formatCurrency } = useApp();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Group all expenses by category
  const { categoryTotals, totalExpense } = React.useMemo(() => {
    const map: Record<string, number> = {};
    let total = 0;

    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const cat = t.category;
        map[cat] = (map[cat] || 0) + t.amount;
        total += t.amount;
      });

    const sorted = Object.entries(map)
      .map(([name, amount]) => ({
        name,
        amount,
        percent: total > 0 ? (amount / total) * 100 : 0,
        color: CATEGORY_COLORS[name] || '#94a3b8',
      }))
      .sort((a, b) => b.amount - a.amount);

    return { categoryTotals: sorted, totalExpense: total };
  }, [transactions]);

  // Compute SVG Donut paths
  const radius = 64;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;
  const segments = categoryTotals.map((cat) => {
    const strokeDasharray = `${(cat.percent / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((cumulativePercent / 100) * circumference);
    cumulativePercent += cat.percent;

    return {
      ...cat,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-900">Expenses by Category</h3>
        <p className="text-xs text-slate-500">Distribution of site expenditure across all projects</p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-center gap-6 justify-center">
        {/* SVG Donut */}
        <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
            {/* Background ring */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
            />
            {/* Segments */}
            {segments.map((seg) => (
              <circle
                key={seg.name}
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={activeCategory === seg.name ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setActiveCategory(seg.name)}
                onMouseLeave={() => setActiveCategory(null)}
              />
            ))}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              {activeCategory || 'Total Spent'}
            </span>
            <span className="text-sm font-bold font-mono text-slate-900 truncate max-w-[120px]">
              {activeCategory
                ? formatCurrency(categoryTotals.find((c) => c.name === activeCategory)?.amount || 0)
                : formatCurrency(totalExpense)}
            </span>
          </div>
        </div>

        {/* Categories Legend List */}
        <div className="flex-1 w-full space-y-2 max-h-56 overflow-y-auto pr-1">
          {categoryTotals.map((cat) => (
            <div
              key={cat.name}
              onMouseEnter={() => setActiveCategory(cat.name)}
              onMouseLeave={() => setActiveCategory(null)}
              className={`flex items-center justify-between text-xs p-1.5 rounded-lg transition-colors cursor-pointer ${
                activeCategory === cat.name ? 'bg-slate-100' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="font-medium text-slate-700 truncate">{cat.name}</span>
              </div>
              <div className="flex items-center gap-2 text-right shrink-0">
                <span className="font-mono text-slate-900 font-semibold">
                  {formatCurrency(cat.amount)}
                </span>
                <span className="text-slate-600 text-[11px] w-9 text-right font-medium">
                  {cat.percent.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
