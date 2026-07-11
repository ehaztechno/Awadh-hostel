import { useState } from 'react';
import { Student, Payment, Room, UserRole } from '../types';
import { Search, Phone, ShieldAlert, CheckCircle, CreditCard, ChevronRight, FileText, UserMinus, Plus, Trash2 } from 'lucide-react';

interface StudentsListProps {
  role: UserRole;
  students: Student[];
  payments: Payment[];
  rooms: Room[];
  onCollectRentTrigger: (student: Student) => void;
  onCheckoutStudent: (studentId: string) => void;
  onOpenNewAdmission: () => void;
}

export default function StudentsList({
  role,
  students,
  payments,
  rooms,
  onCollectRentTrigger,
  onCheckoutStudent,
  onOpenNewAdmission
}: StudentsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusTab, setStatusTab] = useState<'Active' | 'CheckedOut'>('Active');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Filter Students
  const filteredStudents = students.filter((s) => {
    if (s.status !== statusTab) return false;
    
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    return (
      s.name.toLowerCase().includes(query) ||
      s.roomNumber.toLowerCase().includes(query) ||
      s.mobile.includes(query) ||
      s.city.toLowerCase().includes(query) ||
      s.localArea.toLowerCase().includes(query) ||
      s.institutionOrOffice.toLowerCase().includes(query)
    );
  });

  const getStudentPendingRent = (studentId: string) => {
    return payments.find((p) => p.studentId === studentId && p.status === 'Pending' && p.month === 'July 2026');
  };

  const getStudentPaidRent = (studentId: string) => {
    return payments.find((p) => p.studentId === studentId && p.status === 'Paid' && p.month === 'July 2026');
  };

  const canManage = role !== 'Student' && role !== 'Guard';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="students-view-split">
      {/* Left 2 Columns: Student Directory Grid & Search */}
      <div className="lg:col-span-2 space-y-4">
        
        {/* Search & Tabs Controls */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row gap-3 justify-between items-center">
          <div className="relative w-full md:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search student, room, mobile, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="bg-slate-100 p-1 rounded-lg flex text-xs font-semibold flex-1 md:flex-none">
              <button
                onClick={() => setStatusTab('Active')}
                className={`px-3 py-1.5 rounded-md flex-1 md:flex-none cursor-pointer text-center ${
                  statusTab === 'Active' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Active ({students.filter(s => s.status === 'Active').length})
              </button>
              <button
                onClick={() => setStatusTab('CheckedOut')}
                className={`px-3 py-1.5 rounded-md flex-1 md:flex-none cursor-pointer text-center ${
                  statusTab === 'CheckedOut' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Checked Out ({students.filter(s => s.status === 'CheckedOut').length})
              </button>
            </div>

            {canManage && (
              <button
                onClick={onOpenNewAdmission}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Admission
              </button>
            )}
          </div>
        </div>

        {/* Student Cards List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="students-grid-list">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => {
              const pendingRent = getStudentPendingRent(student.id);
              const paidRent = getStudentPaidRent(student.id);
              const isSelected = selectedStudent?.id === student.id;

              return (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`bg-white rounded-2xl border p-4 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 ring-2 ring-indigo-50'
                      : 'border-slate-150'
                  }`}
                  id={`student-card-${student.id}`}
                >
                  <div className="space-y-3">
                    {/* Header: Room Number and City */}
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-extrabold text-sm text-indigo-950 bg-indigo-50 px-2.5 py-1 rounded-lg">
                        Room {student.roomNumber}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                        📍 {student.city}
                      </span>
                    </div>

                    {/* Name & Contact */}
                    <div>
                      <h3 className="font-sans font-bold text-sm text-slate-900">{student.name}</h3>
                      <p className="text-[11px] font-mono text-slate-500 mt-0.5">📞 +91 {student.mobile}</p>
                    </div>

                    {/* Sub-info details */}
                    <div className="space-y-1 pt-1 border-t border-slate-50">
                      <p className="text-[11px] text-slate-600 truncate">
                        🏢 <span className="font-medium text-slate-700">{student.institutionOrOffice}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        🗓️ Joined: {student.admissionDate}
                      </p>
                    </div>
                  </div>

                  {/* Operational Rent Trigger buttons / Badges */}
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      {statusTab === 'Active' ? (
                        pendingRent ? (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            ₹{pendingRent.amount} Overdue
                          </span>
                        ) : paidRent ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            July Rent Paid ✅
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-md">
                            No bills
                          </span>
                        )
                      ) : (
                        <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Inactive Account
                        </span>
                      )}
                    </div>

                    {statusTab === 'Active' && canManage && pendingRent && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCollectRentTrigger(student);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] py-1 px-2.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                        id={`quick-pay-btn-${student.id}`}
                      >
                        <CreditCard className="w-3 h-3" />
                        ₹ Pay Rent
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-2 text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
              <p className="text-slate-400 text-xs font-semibold">No students found matching your query.</p>
              <p className="text-slate-400 text-[11px] mt-0.5">Try searching with different city, area, or spelling.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Complete Interactive Profile Viewer */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xl border border-slate-800 h-fit" id="student-profile-pane">
        {selectedStudent ? (
          <div className="space-y-5 animate-fade-in">
            {/* Header */}
            <div className="text-center pb-4 border-b border-slate-800">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-2 text-white">
                {selectedStudent.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h2 className="font-sans font-black text-base">{selectedStudent.name}</h2>
              <p className="text-xs text-slate-400">Room {selectedStudent.roomNumber} ({selectedStudent.bedId.split('-')[1]})</p>
              <span className={`inline-block mt-2 text-[9px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                selectedStudent.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-300'
              }`}>
                {selectedStudent.status} Resident
              </span>
            </div>

            {/* Profile Fields */}
            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Mobile Number</span>
                <p className="font-mono text-slate-200 font-bold flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-400" />
                  +91 {selectedStudent.mobile}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Parent/Guardian</span>
                  <p className="font-medium text-slate-200 mt-0.5">{selectedStudent.parentName}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Guardian Contact</span>
                  <p className="font-mono text-slate-200 mt-0.5">+91 {selectedStudent.emergencyMobile}</p>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Local Institute / Hub</span>
                <p className="font-medium text-slate-200 mt-0.5">{selectedStudent.institutionOrOffice}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{selectedStudent.studentType}</p>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Gov ID Verification</span>
                <div className="flex items-center gap-2 p-2 bg-slate-800 rounded-lg mt-1 border border-slate-700">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="font-bold text-slate-200 text-[11px]">{selectedStudent.idProofType}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{selectedStudent.idProofNumber}</p>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Home Origin Address</span>
                <p className="text-slate-300 text-[11px] mt-0.5">{selectedStudent.homeAddress}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[10px]">Monthly Rent</span>
                  <p className="font-mono text-slate-200 font-bold">₹{selectedStudent.monthlyRent}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Security Deposit</span>
                  <p className="font-mono text-slate-200 font-bold">₹{selectedStudent.depositAmount}</p>
                </div>
              </div>
            </div>

            {/* Profile Action Controls */}
            {canManage && selectedStudent.status === 'Active' && (
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => {
                    const pending = getStudentPendingRent(selectedStudent.id);
                    if (pending) {
                      onCollectRentTrigger(selectedStudent);
                    } else {
                      alert("July 2026 rent has already been paid for this student!");
                    }
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                  id="profile-collect-rent-btn"
                >
                  <CreditCard className="w-4 h-4" /> Collect Rent (₹)
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to trigger Check-Out for ${selectedStudent.name}? This will mark Room ${selectedStudent.roomNumber} bed as vacant.`)) {
                      onCheckoutStudent(selectedStudent.id);
                      setSelectedStudent(null);
                    }
                  }}
                  className="w-full bg-red-950/40 hover:bg-red-950 text-red-400 hover:text-red-200 font-bold py-2 px-4 rounded-xl text-xs border border-red-900/50 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  id="profile-checkout-btn"
                >
                  <UserMinus className="w-4 h-4" /> Trigger Check-Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">
            <span className="text-3xl block mb-2">👤</span>
            <p className="text-xs font-semibold">Select a student profile card</p>
            <p className="text-[10px] mt-0.5 text-slate-600">to view verified documents, parent contacts, and check-out logs.</p>
          </div>
        )}
      </div>
    </div>
  );
}
