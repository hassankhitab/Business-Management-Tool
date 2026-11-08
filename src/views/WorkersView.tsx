import React, { useState } from 'react';
import {
  Users,
  HardHat,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Phone,
  DollarSign,
  AlertCircle,
  Building2,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Worker, AttendanceRecord } from '../types';
import { WorkerModal } from '../components/WorkerModal';
import { AttendanceModal } from '../components/AttendanceModal';

export const WorkersView: React.FC = () => {
  const {
    workers,
    attendance,
    projects,
    formatCurrency,
    markAttendancePaid,
    deleteWorker,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'attendance' | 'directory'>('attendance');
  const [filterProjectId, setFilterProjectId] = useState<string>('all');
  const [attendanceStatus, setAttendanceStatus] = useState<'all' | 'unpaid' | 'paid'>('unpaid');
  const [searchWorker, setSearchWorker] = useState<string>('');

  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);
  const [workerToEdit, setWorkerToEdit] = useState<Worker | null>(null);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [preselectedWorkerId, setPreselectedWorkerId] = useState<string | undefined>(undefined);

  // Filtered attendance
  const filteredAttendance = attendance.filter((a) => {
    if (attendanceStatus === 'unpaid' && a.paid) return false;
    if (attendanceStatus === 'paid' && !a.paid) return false;
    if (filterProjectId !== 'all' && a.projectId !== filterProjectId) return false;

    if (searchWorker.trim()) {
      const q = searchWorker.toLowerCase();
      const worker = workers.find((w) => w.id === a.workerId);
      const proj = projects.find((p) => p.id === a.projectId);
      const matchWorker = (worker?.name || '').toLowerCase().includes(q);
      const matchRole = (worker?.role || '').toLowerCase().includes(q);
      const matchProj = (proj?.name || '').toLowerCase().includes(q);
      if (!matchWorker && !matchRole && !matchProj) return false;
    }
    return true;
  });

  // Totals
  const totalUnpaidDue = attendance
    .filter((a) => !a.paid)
    .reduce((sum, a) => sum + a.totalDue, 0);

  const totalPaidLabor = attendance
    .filter((a) => a.paid)
    .reduce((sum, a) => sum + a.totalDue, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Unpaid Labor Wages</span>
            <div className="text-lg sm:text-xl font-bold font-mono text-amber-600 mt-0.5">
              {formatCurrency(totalUnpaidDue)}
            </div>
            <p className="text-[11px] text-slate-400">
              {attendance.filter((a) => !a.paid).length} pending attendance records
            </p>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Total Wages Paid Out</span>
            <div className="text-lg sm:text-xl font-bold font-mono text-emerald-600 mt-0.5">
              {formatCurrency(totalPaidLabor)}
            </div>
            <p className="text-[11px] text-slate-400">Recorded as site labor expenses</p>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Registered Site Crew</span>
            <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 mt-0.5">
              {workers.length} Tradesmen
            </div>
            <p className="text-[11px] text-slate-400">Masons, plumbers, shuttering, helpers</p>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* View Tabs & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Sub-tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl max-w-fit">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'attendance'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Attendance & Wages Due ({attendance.filter((a) => !a.paid).length} pending)
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'directory'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Worker Directory ({workers.length})
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setPreselectedWorkerId(undefined);
              setIsAttendanceModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs transition-all whitespace-nowrap"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>+ Log Attendance</span>
          </button>
          <button
            onClick={() => {
              setWorkerToEdit(null);
              setIsWorkerModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-2xs whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Worker</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ATTENDANCE & WAGES DUE */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search worker or site..."
                value={searchWorker}
                onChange={(e) => setSearchWorker(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Status toggle */}
            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setAttendanceStatus('unpaid')}
                className={`flex-1 py-1 rounded-lg font-bold text-center transition-colors ${
                  attendanceStatus === 'unpaid'
                    ? 'bg-amber-100 text-amber-900'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Unpaid Only
              </button>
              <button
                onClick={() => setAttendanceStatus('paid')}
                className={`flex-1 py-1 rounded-lg font-bold text-center transition-colors ${
                  attendanceStatus === 'paid'
                    ? 'bg-emerald-100 text-emerald-900'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Paid History
              </button>
              <button
                onClick={() => setAttendanceStatus('all')}
                className={`flex-1 py-1 rounded-lg font-bold text-center transition-colors ${
                  attendanceStatus === 'all'
                    ? 'bg-slate-200 text-slate-900'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
            </div>

            {/* Project Filter */}
            <div>
              <select
                value={filterProjectId}
                onChange={(e) => setFilterProjectId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 truncate"
              >
                <option value="all">All Site Projects</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Attendance Log Table */}
          {filteredAttendance.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">
                {attendanceStatus === 'unpaid'
                  ? 'All labor wages are fully settled!'
                  : 'No attendance records found'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {attendanceStatus === 'unpaid'
                  ? 'There are no pending daily wages awaiting disbursement.'
                  : 'Log new attendance to calculate daily wages.'}
              </p>
              <button
                onClick={() => setIsAttendanceModalOpen(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl"
              >
                + Log New Attendance
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider">
                    <tr>
                      <th className="px-4 py-3.5">Log Date</th>
                      <th className="px-4 py-3.5">Worker & Trade</th>
                      <th className="px-4 py-3.5">Project Site</th>
                      <th className="px-4 py-3.5">Days Worked</th>
                      <th className="px-4 py-3.5">Daily Rate</th>
                      <th className="px-4 py-3.5 text-right">Total Due</th>
                      <th className="px-4 py-3.5 text-center">Status & Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAttendance.map((rec) => {
                      const worker = workers.find((w) => w.id === rec.workerId);
                      const proj = projects.find((p) => p.id === rec.projectId);

                      return (
                        <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-4 py-3 font-medium text-slate-600 whitespace-nowrap">
                            {rec.date}
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-bold text-slate-900 block">
                              {worker?.name || 'Worker'}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {worker?.role || 'Labor'}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-800">
                            {proj?.name || 'General Site'}
                            {rec.notes && (
                              <span className="text-[11px] text-slate-500 block font-normal italic">
                                {rec.notes}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-slate-800">
                            {rec.daysWorked} {rec.daysWorked === 1 ? 'day' : 'days'}
                          </td>
                          <td className="px-4 py-3 font-mono text-slate-600">
                            {formatCurrency(rec.dailyWage)}/day
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <span className="font-mono font-black text-sm text-slate-900">
                              {formatCurrency(rec.totalDue)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center whitespace-nowrap">
                            {rec.paid ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Paid (Expense Created)</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => markAttendancePaid(rec.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-lg shadow-2xs transition-all cursor-pointer"
                                title="Creates an expense entry in transactions and marks as paid"
                              >
                                <DollarSign className="w-3.5 h-3.5" />
                                <span>Mark as Paid</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: WORKER DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {workers.map((worker) => (
            <div
              key={worker.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center font-bold">
                    <HardHat className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setWorkerToEdit(worker);
                        setIsWorkerModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove worker "${worker.name}"?`)) {
                          deleteWorker(worker.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 truncate">{worker.name}</h4>
                  <span className="text-xs font-semibold text-orange-600 block">
                    {worker.role}
                  </span>
                </div>

                {worker.phone && (
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{worker.phone}</span>
                  </p>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Daily Rate:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatCurrency(worker.dailyWage)}/day
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    setPreselectedWorkerId(worker.id);
                    setIsAttendanceModalOpen(true);
                  }}
                  className="w-full py-1.5 px-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Log Days Worked</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <WorkerModal
        isOpen={isWorkerModalOpen}
        onClose={() => {
          setIsWorkerModalOpen(false);
          setWorkerToEdit(null);
        }}
        workerToEdit={workerToEdit}
      />

      <AttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        preselectedWorkerId={preselectedWorkerId}
      />
    </div>
  );
};
