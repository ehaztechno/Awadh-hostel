import { HostelStats, Room, Student, Payment, Visitor, Complaint, Notice, UserRole } from '../types';
import { Users, CreditCard, Home, ShieldAlert, Footprints, AlertTriangle, ArrowUpRight, ArrowDownRight, TrendingUp, Sparkles, Megaphone, CheckCircle2 } from 'lucide-react';

interface DashboardProps {
  role: UserRole;
  stats: HostelStats;
  rooms: Room[];
  students: Student[];
  payments: Payment[];
  visitors: Visitor[];
  complaints: Complaint[];
  notices: Notice[];
  onQuickAction: (action: string) => void;
  onSelectStudentPortalOption?: (option: string) => void;
  onCollectRentDirect?: (student: Student) => void;
  currentStudentId?: string;
}

export default function Dashboard({
  role,
  stats,
  rooms,
  students,
  payments,
  visitors,
  complaints,
  notices,
  onQuickAction,
  onSelectStudentPortalOption,
  onCollectRentDirect,
  currentStudentId = "std-001"
}: DashboardProps) {

  // For Student Resident view
  const currentStudent = students.find(s => s.id === currentStudentId) || students[0];
  const studentRoom = rooms.find(r => r.roomNumber === currentStudent?.roomNumber);
  const studentPayments = payments.filter(p => p.studentId === currentStudent?.id);
  const studentComplaints = complaints.filter(c => c.studentId === currentStudent?.id);
  const pendingRentObj = studentPayments.find(p => p.status === 'Pending');

  if (role === 'Student') {
    return (
      <div className="space-y-6 animate-fade-in" id="student-portal-dashboard">
        {/* Student Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden border border-indigo-800">
          <div className="absolute right-0 bottom-0 opacity-10 translate-y-4 translate-x-4">
            <Sparkles className="w-48 h-48" />
          </div>
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold">
              👋 Resident Portal Active
            </div>
            <h1 className="font-sans font-bold text-2xl tracking-tight">Welcome back, {currentStudent?.name}!</h1>
            <p className="text-sm text-slate-300">Room Number: <span className="font-bold text-white font-mono">{currentStudent?.roomNumber}</span> • Bed: <span className="font-mono font-bold text-white">{currentStudent?.bedId.split('-')[1]}</span> • Wing: <span className="font-bold text-pink-300">{studentRoom?.genderType}</span></p>
            <p className="text-xs text-slate-400">Avadh Residency PG, Kapoorthala, Aliganj, Lucknow</p>
          </div>
        </div>

        {/* Dynamic Alerts for Student */}
        {pendingRentObj && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">Pending Rent Alert</h4>
              <p className="text-xs">Your rent for <span className="font-bold">{pendingRentObj.month}</span> (₹{pendingRentObj.amount.toLocaleString('en-IN')}) is pending. Please clear it by GPay/PhonePe to avoid a late fee.</p>
              <button 
                onClick={() => onSelectStudentPortalOption?.('payments')}
                className="text-xs font-bold text-indigo-700 hover:underline mt-1 block cursor-pointer"
              >
                Go to Bills & Rent →
              </button>
            </div>
          </div>
        )}

        {/* Resident Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">My Rent Price</span>
              <p className="font-mono text-xl font-bold text-slate-900">₹{currentStudent?.monthlyRent.toLocaleString('en-IN')}/mo</p>
              <p className="text-[10px] text-slate-500">{studentRoom?.hasAC ? 'AC Room' : 'Non-AC Room'} • {studentRoom?.sharingType}-Seater</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Payment Status</span>
              <p className={`text-base font-bold ${pendingRentObj ? 'text-amber-600' : 'text-emerald-700'}`}>
                {pendingRentObj ? '⚠️ ₹' + pendingRentObj.amount + ' Pending' : '✅ July Rent Cleared'}
              </p>
              <p className="text-[10px] text-slate-500">Last payment: 3rd July</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-700 rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">My Active Complaints</span>
              <p className="font-mono text-xl font-bold text-slate-900">{studentComplaints.filter(c => c.status !== 'Resolved').length} Active</p>
              <p className="text-[10px] text-slate-500">Total complaints: {studentComplaints.length}</p>
            </div>
          </div>
        </div>

        {/* Student Quick Actions */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
          <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-4">Student Quick Help</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              onClick={() => onSelectStudentPortalOption?.('complaints')}
              className="p-4 bg-white hover:bg-slate-100 rounded-xl border border-slate-100 text-center flex flex-col items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <span className="text-xl">🛠️</span>
              <span className="text-xs font-bold text-slate-800">Raise Complaint</span>
            </button>
            <button
              onClick={() => onSelectStudentPortalOption?.('payments')}
              className="p-4 bg-white hover:bg-slate-100 rounded-xl border border-slate-100 text-center flex flex-col items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <span className="text-xl">₹</span>
              <span className="text-xs font-bold text-slate-800">View Invoices</span>
            </button>
            <button
              onClick={() => onSelectStudentPortalOption?.('notices')}
              className="p-4 bg-white hover:bg-slate-100 rounded-xl border border-slate-100 text-center flex flex-col items-center justify-center gap-2 transition-all shadow-xs cursor-pointer col-span-2 sm:col-span-1"
            >
              <span className="text-xl">📢</span>
              <span className="text-xs font-bold text-slate-800">Read PG Notices</span>
            </button>
          </div>
        </div>

        {/* Latest Notices for Student */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-950">
            <Megaphone className="w-5 h-5 text-indigo-600" />
            <h3 className="font-sans font-bold text-sm">Latest PG Announcements</h3>
          </div>
          <div className="space-y-3">
            {notices.slice(0, 2).map((notice) => (
              <div key={notice.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-150 space-y-1">
                <div className="flex justify-between items-center">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    notice.category === 'Urgent' ? 'bg-red-100 text-red-800' : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {notice.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{notice.date}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800">{notice.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{notice.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Admin / Guard / Manager Dashboard
  return (
    <div className="space-y-6 animate-fade-in" id="admin-hostel-dashboard">
      {/* Overview Stat Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="stats-dashboard-grid">
        
        {/* Stat 1: Occupancy */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between" id="stat-occupancy">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              {stats.occupancyRate}%
            </span>
          </div>
          <div className="mt-4">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Occupancy</span>
            <p className="font-mono text-2xl font-black text-slate-900 mt-1">
              {stats.occupiedBeds} <span className="text-xs text-slate-400 font-normal">/ {stats.totalBeds} Beds</span>
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              <span className="text-emerald-600 font-bold">{stats.vacantBeds} beds vacant</span> across all floors
            </p>
          </div>
        </div>

        {/* Stat 2: Rent Collected */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between" id="stat-collected">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              July
            </span>
          </div>
          <div className="mt-4">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Collected Rent</span>
            <p className="font-mono text-2xl font-black text-slate-900 mt-1">
              ₹{stats.totalCollectedRent.toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-emerald-600 font-medium mt-1">
              Collected from {payments.filter(p => p.status === 'Paid' && p.month === 'July 2026').length} residents
            </p>
          </div>
        </div>

        {/* Stat 3: Pending Rent */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between" id="stat-pending">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
              {stats.pendingRentCount} Overdue
            </span>
          </div>
          <div className="mt-4">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Pending Rent</span>
            <p className="font-mono text-2xl font-black text-red-600 mt-1">
              ₹{stats.totalPendingRent.toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              Needs collection follow-up today
            </p>
          </div>
        </div>

        {/* Stat 4: Active Complaints */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between" id="stat-complaints">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full">
              {complaints.filter(c => c.priority === 'High' && c.status !== 'Resolved').length} High Urgency
            </span>
          </div>
          <div className="mt-4">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Active Complaints</span>
            <p className="font-mono text-2xl font-black text-slate-900 mt-1">
              {stats.activeComplaints} <span className="text-xs text-slate-400 font-normal">Pending</span>
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              Electrical / Plumbing / WiFi issues
            </p>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS BAR - Instant access to daily jobs */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5" id="quick-actions-bar">
        <h3 className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-4">Quick Operator Commands</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          
          <button
            onClick={() => onQuickAction('new-admission')}
            className="p-3.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl text-center flex flex-col items-center justify-center gap-1.5 transition-all shadow-xs group cursor-pointer"
            id="action-new-admission"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">➕</span>
            <span className="text-[11px] font-bold text-slate-800">New Admission</span>
          </button>

          <button
            onClick={() => onQuickAction('collect-rent')}
            className="p-3.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-xl text-center flex flex-col items-center justify-center gap-1.5 transition-all shadow-xs group cursor-pointer"
            id="action-collect-rent"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">₹</span>
            <span className="text-[11px] font-bold text-slate-800">Collect Rent</span>
          </button>

          <button
            onClick={() => onQuickAction('rooms-grid')}
            className="p-3.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl text-center flex flex-col items-center justify-center gap-1.5 transition-all shadow-xs group cursor-pointer"
            id="action-rooms"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">🛏️</span>
            <span className="text-[11px] font-bold text-slate-800">Rooms & Beds</span>
          </button>

          <button
            onClick={() => onQuickAction('students-list')}
            className="p-3.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl text-center flex flex-col items-center justify-center gap-1.5 transition-all shadow-xs group cursor-pointer"
            id="action-students"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">👥</span>
            <span className="text-[11px] font-bold text-slate-800">Student Directory</span>
          </button>

          <button
            onClick={() => onQuickAction('complaints-view')}
            className="p-3.5 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl text-center flex flex-col items-center justify-center gap-1.5 transition-all shadow-xs group cursor-pointer"
            id="action-complaints"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">🔧</span>
            <span className="text-[11px] font-bold text-slate-800">Complaints Register</span>
          </button>

          <button
            onClick={() => onQuickAction('visitor-log')}
            className="p-3.5 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-200 rounded-xl text-center flex flex-col items-center justify-center gap-1.5 transition-all shadow-xs group cursor-pointer"
            id="action-visitors"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">🚪</span>
            <span className="text-[11px] font-bold text-slate-800">Visitor Entry</span>
          </button>

          <button
            onClick={() => onQuickAction('notices-view')}
            className="p-3.5 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-200 rounded-xl text-center flex flex-col items-center justify-center gap-1.5 transition-all shadow-xs group cursor-pointer"
            id="action-notices"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">📢</span>
            <span className="text-[11px] font-bold text-slate-800">Publish Notice</span>
          </button>

        </div>
      </div>

      {/* Three Column Layout for Alerts, Logs & Pending Rents */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" id="dashboard-details-split">
        
        {/* Column 1: Important Live Logs (Visitors & Alerts) */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="font-sans font-bold text-sm text-slate-800 flex items-center gap-1.5">
              <Footprints className="w-5 h-5 text-indigo-600" /> Active Visitors in Building
            </h3>
            <span className="bg-indigo-50 text-indigo-700 font-mono font-bold text-xs px-2 py-0.5 rounded-full">
              {visitors.filter(v => v.status === 'CheckedIn').length} Inside
            </span>
          </div>

          <div className="space-y-3">
            {visitors.filter(v => v.status === 'CheckedIn').length > 0 ? (
              visitors.filter(v => v.status === 'CheckedIn').map((visitor) => (
                <div key={visitor.id} className="p-3 bg-slate-50 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{visitor.guestName}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Visiting Room {visitor.roomNumber} ({visitor.studentName})</p>
                    {visitor.vehicleNumber && (
                      <p className="text-[9px] font-mono text-slate-400 mt-0.5">Vehicle: {visitor.vehicleNumber}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="bg-amber-100 text-amber-800 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Entered {visitor.entryTime.split('T')[1] || 'N/A'}
                    </span>
                    <button
                      onClick={() => onQuickAction('visitor-log')}
                      className="block text-[10px] font-bold text-indigo-600 hover:underline mt-1 cursor-pointer"
                    >
                      Check-out gate →
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-xs text-center py-4">No visitors currently inside. Secure locked gate.</p>
            )}
          </div>
        </div>

        {/* Column 2: Immediate Attention Needed (High Priority Complaints) */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="font-sans font-bold text-sm text-slate-800 flex items-center gap-1.5">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> High-Urgency Complaints
            </h3>
            <span className="bg-rose-50 text-rose-700 font-mono font-bold text-xs px-2 py-0.5 rounded-full">
              {complaints.filter(c => c.status !== 'Resolved' && c.priority === 'High').length} Urgent
            </span>
          </div>

          <div className="space-y-3">
            {complaints.filter(c => c.status !== 'Resolved' && c.priority === 'High').length > 0 ? (
              complaints.filter(c => c.status !== 'Resolved' && c.priority === 'High').map((comp) => (
                <div key={comp.id} className="p-3 bg-red-50/50 border border-red-100 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-800">{comp.title}</span>
                    <span className="text-[9px] uppercase font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded-md">
                      Room {comp.roomNumber}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] line-clamp-1">{comp.description}</p>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[10px] text-slate-400 font-mono">Filed by {comp.studentName}</span>
                    <button
                      onClick={() => onQuickAction('complaints-view')}
                      className="text-[10px] font-bold text-indigo-700 hover:underline cursor-pointer"
                    >
                      View Ticket →
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                <p>🎉 All high urgency complaints resolved!</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Avadh Residency maintenance is operating flawlessly.</p>
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Outstanding Rent Follow-ups (Pending Rent) */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4" id="dashboard-pending-rents">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="font-sans font-bold text-sm text-slate-800 flex items-center gap-1.5">
              <CreditCard className="w-5 h-5 text-rose-500" /> Pending Rent List ({payments.filter(p => p.status === 'Pending').length})
            </h3>
            <span className="bg-rose-50 text-rose-700 font-mono font-bold text-xs px-2 py-0.5 rounded-full">
              ₹{stats.totalPendingRent.toLocaleString('en-IN')} Due
            </span>
          </div>

          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {payments.filter(p => p.status === 'Pending').length > 0 ? (
              payments.filter(p => p.status === 'Pending').map((payment) => {
                const student = students.find(s => s.id === payment.studentId);
                return (
                  <div key={payment.id} className="p-3 bg-rose-50/30 border border-rose-100/50 rounded-xl space-y-2 text-xs hover:bg-rose-50/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{payment.studentName}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Room {payment.roomNumber} • Bed {student?.bedId.split('-')[1] || 'A'}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-extrabold text-rose-600 text-sm block">
                          ₹{payment.amount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[9px] uppercase font-bold text-slate-400">
                          {payment.month}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1 border-t border-rose-100/30">
                      {student?.mobile ? (
                        <a
                          href={`tel:${student.mobile}`}
                          className="text-[10px] text-slate-500 hover:text-indigo-600 font-mono flex items-center gap-1"
                        >
                          📞 {student.mobile}
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-400">No mobile</span>
                      )}

                      <button
                        onClick={() => {
                          if (student && onCollectRentDirect) {
                            onCollectRentDirect(student);
                          } else {
                            onQuickAction('collect-rent');
                          }
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-2.5 py-1 rounded-lg text-[10px] shadow-2xs cursor-pointer flex items-center gap-0.5 transition-colors"
                        title="Collect Rent"
                      >
                        ₹ Collect
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                <p>✅ All rents are fully paid!</p>
                <p className="text-[10px] text-slate-400 mt-0.5">No outstanding payments for July 2026.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Lucknow Operational Location Context */}
      <div className="bg-indigo-950 text-white rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-900 rounded-xl text-indigo-300">
            📍
          </div>
          <div>
            <p className="font-bold text-white">Lucknow Regional Operations Center Active</p>
            <p className="text-slate-400 text-[11px]">Primary server targeting Gomti Nagar, Indira Nagar, Kapoorthala & Aliganj campuses.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="px-2.5 py-1 bg-indigo-900 border border-indigo-800 rounded-lg text-[10px] font-mono">Beds: 15</span>
          <span className="px-2.5 py-1 bg-indigo-900 border border-indigo-800 rounded-lg text-[10px] font-mono">LKO Gateways Up</span>
        </div>
      </div>

    </div>
  );
}
