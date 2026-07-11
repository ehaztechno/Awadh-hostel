import React from 'react';
import { UserRole, Student } from '../types';
import { Shield, ShieldAlert, User, CheckCircle2, Eye, HelpCircle } from 'lucide-react';

interface RoleSelectorProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  students: Student[];
  currentStudentId: string;
  onStudentIdChange: (id: string) => void;
}

export default function RoleSelector({
  currentRole,
  onRoleChange,
  students,
  currentStudentId,
  onStudentIdChange
}: RoleSelectorProps) {
  const roles: { value: UserRole; label: string; desc: string; color: string; badgeColor: string; icon: React.ReactNode }[] = [
    {
      value: 'Owner',
      label: 'PG Owner',
      desc: 'Full financial overview, occupancy rates, income reports, and high-level summaries.',
      color: 'border-amber-500 text-amber-700 bg-amber-50',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: <Shield className="w-4 h-4 text-amber-600" />
    },
    {
      value: 'Manager',
      label: 'PG Manager',
      desc: 'Daily operations, room allocation, collections, and complaint status.',
      color: 'border-blue-500 text-blue-700 bg-blue-50',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      icon: <User className="w-4 h-4 text-blue-600" />
    },
    {
      value: 'Guard',
      label: 'Security Guard',
      desc: 'Simplified interface for instant visitor check-in, check-out, and auto-logs.',
      color: 'border-red-500 text-red-700 bg-red-50',
      badgeColor: 'bg-red-100 text-red-900 border-red-300',
      icon: <Shield className="w-4 h-4 text-red-600" />
    },
    {
      value: 'Student',
      label: 'Student Portal',
      desc: 'Personal room details, payment invoices, filing complaints, and reading notices.',
      color: 'border-indigo-500 text-indigo-700 bg-indigo-50',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      icon: <User className="w-4 h-4 text-indigo-600" />
    }
  ];

  const activeDetails = roles.find(r => r.value === currentRole);

  return (
    <div className="bg-slate-900 text-white rounded-xl p-4 shadow-xl border border-slate-800 mb-6" id="role-selector-container">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 rounded-lg text-indigo-400">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-sans font-medium text-sm text-slate-300">Live Multi-Role Simulator</h3>
            <p className="text-xs text-slate-400">Toggle roles below to experience specialized PG views & controls.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {roles.map((r) => (
            <button
              key={r.value}
              id={`role-btn-${r.value}`}
              onClick={() => onRoleChange(r.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                currentRole === r.value
                  ? 'bg-indigo-600 text-white shadow-md scale-105'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {r.icon}
              {r.label}
            </button>
          ))}
        </div>
      </div>
      
      {activeDetails && (
        <div className="mt-3 pt-3 border-t border-slate-800 flex items-start gap-2.5 text-slate-300 text-xs">
          <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-white mr-1">Active View: {activeDetails.label}</span>
            — <span className="text-slate-400">{activeDetails.desc}</span>
          </div>
        </div>
      )}

      {currentRole === 'Student' && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-indigo-950/25 p-3 rounded-xl border border-indigo-500/10">
          <div className="space-y-0.5">
            <h4 className="font-sans font-bold text-xs text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>🔒 Simulated Resident Authentication</span>
            </h4>
            <p className="text-[11px] text-slate-400">Select any student in the directory to simulate their portal access and view specific records.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <label className="text-xs font-bold text-slate-300 whitespace-nowrap">Choose Resident:</label>
            <select
              value={currentStudentId}
              onChange={(e) => onStudentIdChange(e.target.value)}
              className="bg-slate-800 border border-indigo-500/30 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer font-semibold"
              id="student-login-selector"
            >
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} (Room {student.roomNumber} - {student.status})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
