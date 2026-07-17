import React, { useState } from 'react';
import { UserRole, Student } from '../types';
import { Shield, User, Key, Check, AlertCircle, Sparkles, Building2, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (role: UserRole, studentId?: string) => void;
  students: Student[];
}

export default function Login({ onLoginSuccess, students }: LoginProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('Owner');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [studentPasscode, setStudentPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Demo Credentials Map
  const demoAccounts = {
    Owner: { email: 'owner@avadh.com', pass: 'owner123', label: 'Owner Portal' },
    Manager: { email: 'manager@avadh.com', pass: 'manager123', label: 'Manager Portal' },
    Guard: { email: 'guard@avadh.com', pass: 'guard123', label: 'Security Gate' },
  };

  const handleDemoFill = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
    if (role !== 'Student') {
      const creds = demoAccounts[role];
      setEmail(creds.email);
      setPassword(creds.pass);
    } else {
      // Pick first student as default
      if (students.length > 0) {
        setSelectedStudentId(students[0].id);
        setStudentPasscode(students[0].roomNumber);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedRole === 'Student') {
      if (!selectedStudentId) {
        setError('Please select a student resident from the dropdown.');
        return;
      }
      const student = students.find(s => s.id === selectedStudentId);
      if (!student) {
        setError('Selected resident not found.');
        return;
      }
      // Simple functional authentication: Student passcode is their Room Number!
      if (studentPasscode.trim() !== student.roomNumber) {
        setError(`Incorrect passcode! Hint: Use the resident's room number (${student.roomNumber}) for simulation.`);
        return;
      }

      onLoginSuccess('Student', student.id);
    } else {
      const creds = demoAccounts[selectedRole];
      if (!email || !password) {
        setError('Please fill in both email and password.');
        return;
      }
      if (email.toLowerCase().trim() === creds.email && password === creds.pass) {
        onLoginSuccess(selectedRole);
      } else {
        setError(`Invalid credentials for ${selectedRole}. Click 'Autofill Demo' to use correct credentials.`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden" id="login-screen-container">
      {/* Background Decorative Rings */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="w-full max-w-md z-10 space-y-6">
        {/* Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-950/50 border border-indigo-400/20 mb-1">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="font-sans font-black text-2xl text-white tracking-tight">
            AVADH RESIDENCY <span className="text-indigo-400 font-medium text-lg">Portal</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Authorized access only. Select your operational role below to authenticate securely.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl p-6 space-y-6">
          {/* Role Tabs */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">Select Role</label>
            <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              {(['Owner', 'Manager', 'Guard', 'Student'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setSelectedRole(r);
                    setError('');
                    // Reset fields or fill
                    if (r !== 'Student') {
                      setEmail('');
                      setPassword('');
                    } else if (students.length > 0) {
                      setSelectedStudentId(students[0].id);
                      setStudentPasscode('');
                    }
                  }}
                  className={`py-2 px-1 rounded-lg text-xs font-bold transition-all duration-150 flex flex-col items-center gap-1 cursor-pointer ${
                    selectedRole === r
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  {r === 'Owner' && <Shield className="w-4 h-4" />}
                  {r === 'Manager' && <User className="w-4 h-4" />}
                  {r === 'Guard' && <Shield className="w-4 h-4 text-emerald-400" />}
                  {r === 'Student' && <User className="w-4 h-4 text-amber-400" />}
                  <span className="text-[10px]">{r}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Demo Assist */}
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <span className="font-semibold text-slate-300">Quick Test Drive?</span>
                <p className="text-[10px] text-slate-500">Auto-fill verified login data.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleDemoFill(selectedRole)}
              className="px-2.5 py-1.5 bg-indigo-900/30 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-500/20 rounded-lg font-bold text-[11px] transition-all cursor-pointer whitespace-nowrap"
            >
              Autofill Demo
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-rose-950/40 border border-rose-500/30 rounded-xl p-3 flex items-start gap-2.5 text-rose-200 text-xs animate-pulse">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <p className="leading-relaxed">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {selectedRole !== 'Student' ? (
              <>
                {/* Staff Credentials */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={`e.g., ${demoAccounts[selectedRole].email}`}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                    <span className="text-[10px] text-indigo-400 font-semibold select-none">
                      Hint: {demoAccounts[selectedRole].pass}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-3 pr-10 py-2.5 text-xs text-white focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Student Selector */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Select Student Resident</label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => {
                      setSelectedStudentId(e.target.value);
                      setError('');
                    }}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="" disabled>-- Select Resident --</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} (Room {student.roomNumber} - {student.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Access Passcode (Room No.)</label>
                    {selectedStudentId && (
                      <span className="text-[10px] text-amber-400 font-semibold select-none">
                        Room Number of selected: {students.find(s => s.id === selectedStudentId)?.roomNumber}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    value={studentPasscode}
                    onChange={(e) => setStudentPasscode(e.target.value)}
                    placeholder="Enter resident's Room Number to unlock"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none transition-all"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full mt-2 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:scale-98 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-950/50 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4" />
              Sign In to {selectedRole} Portal
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-[10px] text-slate-500">
          Avadh Residency High-Performance Hostel Engine © 2026. Fully persistent database powered.
        </p>
      </div>
    </div>
  );
}
