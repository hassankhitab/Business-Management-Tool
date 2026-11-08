import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Calendar,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Project, ProjectStatus } from '../types';
import { ProjectModal } from '../components/ProjectModal';
import { ProjectDetailModal } from '../components/ProjectDetailModal';

export const ProjectsView: React.FC = () => {
  const {
    projects,
    getProjectStats,
    formatCurrency,
    deleteProject,
    selectedProjectId,
    setSelectedProjectId,
    isAddProjectOpen,
    setIsAddProjectOpen,
    setIsAddExpenseOpen,
  } = useApp();

  const [activeStatus, setActiveStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    if (activeStatus !== 'all' && p.status !== activeStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchClient = p.clientName.toLowerCase().includes(q);
      const matchLoc = p.location.toLowerCase().includes(q);
      if (!matchName && !matchClient && !matchLoc) return false;
    }
    return true;
  });

  const statuses: { label: string; value: string }[] = [
    { label: 'All Projects', value: 'all' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Planning', value: 'Planning' },
    { label: 'Completed', value: 'Completed' },
    { label: 'On Hold', value: 'On Hold' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by project title, client, or site location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            setProjectToEdit(null);
            setIsAddProjectOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs transition-all active:scale-[0.98] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Status Segmented Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {statuses.map((s) => {
          const count =
            s.value === 'all'
              ? projects.length
              : projects.filter((p) => p.status === s.value).length;
          const isActive = activeStatus === s.value;

          return (
            <button
              key={s.value}
              onClick={() => setActiveStatus(s.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{s.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No projects match criteria</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search terms or filter tags, or create a new construction project to start tracking site financials.
          </p>
          <button
            onClick={() => setIsAddProjectOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Project</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const stats = getProjectStats(project.id);

            return (
              <div
                key={project.id}
                className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md ${
                  stats.isNearLimit ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200'
                }`}
              >
                {/* Card Top */}
                <div className="p-5 space-y-4">
                  {/* Status & Actions Row */}
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        project.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : project.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : project.status === 'Planning'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {project.status}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setProjectToEdit(project);
                          setIsAddProjectOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Project"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              `Are you sure you want to delete project "${project.name}"?`
                            )
                          ) {
                            deleteProject(project.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Client */}
                  <div>
                    <h3
                      onClick={() => setSelectedProjectId(project.id)}
                      className="text-base font-bold text-slate-900 hover:text-orange-600 transition-colors cursor-pointer line-clamp-1"
                      title={project.name}
                    >
                      {project.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      Client: <span className="text-slate-700 font-semibold">{project.clientName}</span>
                    </p>
                  </div>

                  {/* Location & Dates */}
                  <div className="space-y-1.5 text-xs text-slate-500 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{project.location}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{project.startDate} to {project.endDate}</span>
                    </div>
                  </div>

                  {/* Budget Progress Bar */}
                  <div className="pt-2 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">
                        Spent: <span className="font-mono font-bold text-slate-900">{formatCurrency(stats.spent)}</span>
                      </span>
                      <span
                        className={`font-mono font-bold ${
                          stats.isNearLimit ? 'text-rose-600' : 'text-slate-700'
                        }`}
                      >
                        {stats.percentSpent.toFixed(1)}% of budget
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        style={{ width: `${Math.min(100, stats.percentSpent)}%` }}
                        className={`h-full rounded-full transition-all duration-300 ${
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

                    {/* Warning if spending exceeds 90% of budget */}
                    {stats.isNearLimit && (
                      <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-bold flex items-center gap-1.5 mt-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>Warning: Budget spent &gt; 90% ({stats.percentSpent.toFixed(1)}%)</span>
                      </div>
                    )}
                  </div>

                  {/* Numbers Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">
                        Contract Value
                      </span>
                      <p className="font-mono font-bold text-slate-900 truncate">
                        {formatCurrency(project.contractValue)}
                      </p>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">
                        Allocated Budget
                      </span>
                      <p className="font-mono font-bold text-slate-900 truncate">
                        {formatCurrency(project.budget)}
                      </p>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">
                        Income Received
                      </span>
                      <p className="font-mono font-bold text-emerald-600 truncate">
                        {formatCurrency(stats.income)}
                      </p>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">
                        Profit / Loss
                      </span>
                      <p
                        className={`font-mono font-bold truncate ${
                          stats.profit >= 0 ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        {formatCurrency(stats.profit)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedProjectId(project.id)}
                    className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-slate-200/60 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Details</span>
                  </button>

                  <button
                    onClick={() => setIsAddExpenseOpen(true)}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-orange-50 transition-colors"
                  >
                    <span>+ Add Expense</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Project Modal (Add / Edit) */}
      <ProjectModal
        isOpen={isAddProjectOpen}
        onClose={() => {
          setIsAddProjectOpen(false);
          setProjectToEdit(null);
        }}
        projectToEdit={projectToEdit}
      />

      {/* Project Detail Modal */}
      <ProjectDetailModal
        projectId={selectedProjectId}
        onClose={() => setSelectedProjectId(null)}
        onEdit={(proj) => {
          setSelectedProjectId(null);
          setProjectToEdit(proj);
          setIsAddProjectOpen(true);
        }}
      />
    </div>
  );
};
