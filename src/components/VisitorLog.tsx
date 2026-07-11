import React, { useState } from 'react';
import { Visitor, Student, UserRole } from '../types';
import { Footprints, Plus, Search, Check, Trash2, Clock, CheckCircle2 } from 'lucide-react';

interface VisitorLogProps {
  role: UserRole;
  visitors: Visitor[];
  students: Student[];
  onAddVisitor: (visitor: Visitor) => void;
  onCheckOutVisitor: (visitorId: string) => void;
}

export default function VisitorLog({
  role,
  visitors,
  students,
  onAddVisitor,
  onCheckOutVisitor
}: VisitorLogProps) {
  const [guestName, setGuestName] = useState('');
  const [guestMobile, setGuestMobile] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [purpose, setPurpose] = useState('Parent visiting');
  const [vehicleNumber, setVehicleNumber] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-fill room when student changes
  const targetStudent = students.find((s) => s.id === selectedStudentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestMobile.trim() || !selectedStudentId) return;

    const newVisitor: Visitor = {
      id: `vis-${Date.now()}`,
      guestName,
      guestMobile,
      studentId: selectedStudentId,
      studentName: targetStudent?.name || 'Resident',
      roomNumber: targetStudent?.roomNumber || 'N/A',
      purpose,
      entryTime: new Date().toISOString().substring(0, 16), // Format: YYYY-MM-DDTHH:MM
      status: 'CheckedIn',
      vehicleNumber: vehicleNumber || undefined
    };

    onAddVisitor(newVisitor);

    // Reset Form
    setGuestName('');
    setGuestMobile('');
    setSelectedStudentId('');
    setPurpose('Parent visiting');
    setVehicleNumber('');
  };

  // Filter visitors by search
  const filteredVisitors = visitors.filter((v) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    return (
      v.guestName.toLowerCase().includes(query) ||
      v.studentName.toLowerCase().includes(query) ||
      v.roomNumber.toLowerCase().includes(query) ||
      v.guestMobile.includes(query)
    );
  });

  const activeVisitors = filteredVisitors.filter((v) => v.status === 'CheckedIn');
  const historicalVisitors = filteredVisitors.filter((v) => v.status === 'CheckedOut');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="visitor-log-layout">
      
      {/* Column 1: Gate Entry Form (Simplified for Guard) */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl border border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🚪</span>
            <div>
              <h2 className="font-sans font-bold text-base">Security Gate Entry</h2>
              <p className="text-[10px] text-slate-400">Complete visitor registration in 30 seconds</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold" id="gate-entry-form">
            <div>
              <label className="block text-slate-300 mb-1">Guest Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Narendra Tripathi"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Guest Mobile Contact *</label>
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="10-digit mobile number"
                value={guestMobile}
                onChange={(e) => setGuestMobile(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Who are they meeting? *</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500 bg-white"
              >
                <option value="">-- Choose Resident Student --</option>
                {students.filter(s => s.status === 'Active').map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (Room {s.roomNumber})
                  </option>
                ))}
              </select>
            </div>

            {targetStudent && (
              <div className="bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-[10px] text-slate-300 flex justify-between font-mono">
                <span>Room Auto-tag: {targetStudent.roomNumber}</span>
                <span className="text-emerald-400 font-bold">Active Resident</span>
              </div>
            )}

            <div>
              <label className="block text-slate-300 mb-1">Purpose of Visit</label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500 bg-white"
              >
                <option value="Parent visiting">Parent visiting</option>
                <option value="Friend group study">Friend group study</option>
                <option value="Delivery Person">Delivery Person (Zomato/Amazon)</option>
                <option value="Maintenance / Electrician">Maintenance / Vendor</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Vehicle Plate Number (Optional)</label>
              <input
                type="text"
                placeholder="e.g. UP32 KH 7890"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              id="visitor-checkin-btn"
            >
              Check-In Entry ✅
            </button>
          </form>
        </div>
      </div>

      {/* Right 2 Columns: Live Checked-In Visitors & Exit Logs */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Search bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search visitor list by guest, resident, or mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 font-medium"
          />
        </div>

        {/* Live Checked-In Section */}
        <div className="space-y-3">
          <h3 className="font-sans font-bold text-sm text-slate-800 flex items-center gap-1.5">
            <Footprints className="w-5 h-5 text-indigo-600 animate-pulse" /> Live Checked-In Visitors ({activeVisitors.length})
          </h3>

          <div className="space-y-3">
            {activeVisitors.length > 0 ? (
              activeVisitors.map((v) => (
                <div
                  key={v.id}
                  className="bg-white border-2 border-amber-100 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  id={`visitor-card-${v.id}`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-sans font-extrabold text-slate-900 text-sm">{v.guestName}</span>
                      <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide">
                        Gate Entry
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono">📞 +91 {v.guestMobile}</p>
                    <p className="text-xs text-slate-600">
                      Meeting: <strong className="text-slate-800">{v.studentName}</strong> (Room {v.roomNumber})
                    </p>
                    <p className="text-[11px] italic text-slate-400 mt-1">Purpose: {v.purpose}</p>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1.5 shrink-0">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Gate Check-In</span>
                      <span className="font-mono text-xs font-bold text-slate-800">{v.entryTime.split('T')[1]}</span>
                    </div>
                    <button
                      onClick={() => onCheckOutVisitor(v.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] py-1 px-3 rounded-lg transition-all cursor-pointer shadow-sm flex items-center gap-1"
                    >
                      <Clock className="w-3.5 h-3.5" /> Check-Out Gate
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl p-6 text-center border border-slate-150 text-slate-400 text-xs">
                🔒 Gate is secure. No guest log active right now.
              </div>
            )}
          </div>
        </div>

        {/* Historical Exit Logs Section */}
        <div className="space-y-3">
          <h3 className="font-sans font-bold text-sm text-slate-500">
            📜 Historical Exit Logs ({historicalVisitors.length})
          </h3>

          <div className="space-y-2">
            {historicalVisitors.length > 0 ? (
              historicalVisitors.map((v) => (
                <div
                  key={v.id}
                  className="bg-slate-50 border border-slate-150 rounded-xl p-3 text-xs flex flex-col sm:flex-row justify-between sm:items-center gap-2"
                >
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-slate-800">{v.guestName}</span>
                      <span className="text-[9px] text-slate-400 font-mono">Meet: {v.studentName} (Room {v.roomNumber})</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Purpose: {v.purpose} {v.vehicleNumber ? `• Vehicle: ${v.vehicleNumber}` : ''}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono flex items-center gap-0.5">
                      Exit: {v.exitTime ? v.exitTime.split('T')[1] : 'Checked Out'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-400 text-[11px]">
                No historical exits recorded for today yet.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
