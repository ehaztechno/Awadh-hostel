import React, { useState, useEffect } from 'react';
import {
  UserRole,
  Student,
  Room,
  Payment,
  Visitor,
  Complaint,
  Notice,
  HostelStats
} from './types';
import {
  INITIAL_ROOMS,
  INITIAL_STUDENTS,
  INITIAL_PAYMENTS,
  INITIAL_VISITORS,
  INITIAL_COMPLAINTS,
  INITIAL_NOTICES
} from './mockData';

// Component Imports
import RoleSelector from './components/RoleSelector';
import RentReceipt from './components/RentReceipt';
import AdmissionForm from './components/AdmissionForm';
import Dashboard from './components/Dashboard';
import RoomsGrid from './components/RoomsGrid';
import StudentsList from './components/StudentsList';
import ComplaintsView from './components/ComplaintsView';
import VisitorLog from './components/VisitorLog';
import NoticesView from './components/NoticesView';
import Login from './components/Login';
import WhatsAppNotificationSystem from './components/WhatsAppNotificationSystem';

import {
  Home,
  Users,
  CreditCard,
  ShieldAlert,
  Footprints,
  Megaphone,
  Plus,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  X,
  Printer,
  MessageSquare,
  LogOut
} from 'lucide-react';

export default function App() {
  // --- Persistent Storage State ---
  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    return (localStorage.getItem('avadh_role') as UserRole) || 'Owner';
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('avadh_rooms');
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('avadh_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('avadh_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [visitors, setVisitors] = useState<Visitor[]>(() => {
    const saved = localStorage.getItem('avadh_visitors');
    return saved ? JSON.parse(saved) : INITIAL_VISITORS;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('avadh_complaints');
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem('avadh_notices');
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  const [currentStudentId, setCurrentStudentId] = useState<string>(() => {
    return localStorage.getItem('avadh_current_student_id') || 'std-001';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('avadh_is_authenticated') === 'true';
  });

  const handleLoginSuccess = (role: UserRole, studentId?: string) => {
    setActiveRole(role);
    if (studentId) {
      setCurrentStudentId(studentId);
    }
    setIsAuthenticated(true);
    if (role === 'Guard') {
      setActiveTab('visitors');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const [showDevSwapper, setShowDevSwapper] = useState(false);

  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Trigger Modal States
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [preselectedRoomNumber, setPreselectedRoomNumber] = useState('');
  const [preselectedBedId, setPreselectedBedId] = useState('');

  const [receiptPayment, setReceiptPayment] = useState<Payment | null>(null);
  const [studentForRentCollection, setStudentForRentCollection] = useState<Student | null>(null);

  // Quick payment form states
  const [paymentMethod, setPaymentMethod] = useState<'PhonePe' | 'GPay' | 'Paytm' | 'Cash' | 'Bank Transfer'>('PhonePe');
  const [paymentRemarks, setPaymentRemarks] = useState('Rent received via UPI');

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('avadh_role', activeRole);
  }, [activeRole]);

  useEffect(() => {
    localStorage.setItem('avadh_is_authenticated', String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('avadh_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('avadh_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('avadh_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('avadh_visitors', JSON.stringify(visitors));
  }, [visitors]);

  useEffect(() => {
    localStorage.setItem('avadh_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('avadh_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('avadh_current_student_id', currentStudentId);
  }, [currentStudentId]);

  // Adjust default tab when Role changes
  useEffect(() => {
    if (activeRole === 'Guard') {
      setActiveTab('visitors');
    } else {
      setActiveTab('dashboard');
    }
  }, [activeRole]);

  // --- Reset Database function ---
  const handleResetDatabase = () => {
    if (confirm('Revert all adjustments back to curated default Lucknow PG templates? Your modifications will be reset.')) {
      setRooms(INITIAL_ROOMS);
      setStudents(INITIAL_STUDENTS);
      setPayments(INITIAL_PAYMENTS);
      setVisitors(INITIAL_VISITORS);
      setComplaints(INITIAL_COMPLAINTS);
      setNotices(INITIAL_NOTICES);
      localStorage.clear();
      alert('Database restored successfully! Experience the PG default workflow.');
      setActiveTab('dashboard');
    }
  };

  // --- Financial & Occupancy Aggregation Stats ---
  const getStats = (): HostelStats => {
    const totalBeds = rooms.reduce((acc, r) => acc + r.sharingType, 0);
    const occupiedBeds = students.filter(s => s.status === 'Active').length;
    const vacantBeds = totalBeds - occupiedBeds;
    const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100);

    // Filter current month (July 2026) payments
    const currentMonthPayments = payments.filter(p => p.month === 'July 2026');
    const totalCollectedRent = currentMonthPayments
      .filter(p => p.status === 'Paid')
      .reduce((acc, p) => acc + p.amount, 0);

    const pendingRentList = currentMonthPayments.filter(p => p.status === 'Pending');
    const totalPendingRent = pendingRentList.reduce((acc, p) => acc + p.amount, 0);
    const pendingRentCount = pendingRentList.length;

    const activeComplaints = complaints.filter(c => c.status !== 'Resolved').length;
    const todayVisitors = visitors.filter(v => v.status === 'CheckedIn').length;

    return {
      totalBeds,
      occupiedBeds,
      vacantBeds,
      occupancyRate,
      pendingRentCount,
      totalPendingRent,
      totalCollectedRent,
      activeComplaints,
      todayVisitors
    };
  };

  const stats = getStats();

  // --- Dynamic Workflows ---

  // 1. Check-In Bed Allocation (Admission Form)
  const handleAllocateBedFromMap = (roomNumber: string, bedId: string) => {
    setPreselectedRoomNumber(roomNumber);
    setPreselectedBedId(bedId);
    setShowAdmissionModal(true);
  };

  const handleAddStudentAdmission = (newStudent: Student) => {
    // Add student to directory
    setStudents(prev => [newStudent, ...prev]);

    // Update Room vacancy state
    setRooms(prevRooms =>
      prevRooms.map(r => {
        if (r.roomNumber === newStudent.roomNumber) {
          return {
            ...r,
            beds: r.beds.map(b =>
              b.bedId === newStudent.bedId
                ? { ...b, isOccupied: true, studentId: newStudent.id }
                : b
            )
          };
        }
        return r;
      })
    );

    // Create July 2026 pending payment bill for the new admission
    const newBill: Payment = {
      id: `pay-${Date.now()}`,
      studentId: newStudent.id,
      studentName: newStudent.name,
      roomNumber: newStudent.roomNumber,
      amount: newStudent.monthlyRent,
      month: 'July 2026',
      date: '',
      method: 'PhonePe',
      status: 'Pending',
      invoiceNumber: `AR-2026-07-${Math.floor(100 + Math.random() * 900)}`
    };
    setPayments(prev => [newBill, ...prev]);

    setShowAdmissionModal(false);
    setPreselectedRoomNumber('');
    setPreselectedBedId('');

    // Trigger instant check-out feedback
    alert(`🎉 Admission Completed for ${newStudent.name}! Checked into Room ${newStudent.roomNumber} (${newStudent.bedId.split('-')[1]}). pending invoice generated.`);
  };

  // 2. Rent Collection workflow
  const handleConfirmRentCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForRentCollection) return;

    const student = studentForRentCollection;
    
    // Find the pending invoice for this student for July 2026
    const pendingInvoice = payments.find(
      p => p.studentId === student.id && p.status === 'Pending' && p.month === 'July 2026'
    );

    let updatedPayment: Payment;

    if (pendingInvoice) {
      // Update existing pending invoice to Paid
      updatedPayment = {
        ...pendingInvoice,
        status: 'Paid',
        date: new Date().toISOString().split('T')[0],
        method: paymentMethod,
        remarks: paymentRemarks
      };

      setPayments(prev =>
        prev.map(p => (p.id === pendingInvoice.id ? updatedPayment : p))
      );
    } else {
      // Create new paid payment record if none was pending
      updatedPayment = {
        id: `pay-${Date.now()}`,
        studentId: student.id,
        studentName: student.name,
        roomNumber: student.roomNumber,
        amount: student.monthlyRent,
        month: 'July 2026',
        date: new Date().toISOString().split('T')[0],
        method: paymentMethod,
        remarks: paymentRemarks,
        status: 'Paid',
        invoiceNumber: `AR-2026-07-${Math.floor(100 + Math.random() * 900)}`
      };
      setPayments(prev => [updatedPayment, ...prev]);
    }

    setStudentForRentCollection(null);
    setPaymentRemarks('Rent received via UPI');

    // Instantly launch print receipt modal! (Zero training, direct outcome)
    setReceiptPayment(updatedPayment);
  };

  // 3. Checkout Student (Releasing Bed)
  const handleCheckoutStudent = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    // Release bed in rooms
    setRooms(prevRooms =>
      prevRooms.map(r => {
        if (r.roomNumber === student.roomNumber) {
          return {
            ...r,
            beds: r.beds.map(b =>
              b.bedId === student.bedId
                ? { ...b, isOccupied: false, studentId: undefined }
                : b
            )
          };
        }
        return r;
      })
    );

    // Update student status to CheckedOut
    setStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, status: 'CheckedOut' } : s))
    );

    alert(`🚪 Checked Out: ${student.name} has left PG. Bed ${student.bedId.split('-')[1]} in Room ${student.roomNumber} is now vacant.`);
  };

  // 4. Visitor Entries
  const handleAddVisitor = (newVisitor: Visitor) => {
    setVisitors(prev => [newVisitor, ...prev]);
  };

  const handleCheckOutVisitor = (visitorId: string) => {
    setVisitors(prev =>
      prev.map(v =>
        v.id === visitorId
          ? {
              ...v,
              status: 'CheckedOut',
              exitTime: new Date().toISOString().substring(0, 16)
            }
          : v
      )
    );
  };

  // 5. Complaints Ticket Operations
  const handleAddComplaint = (newComplaint: Complaint) => {
    setComplaints(prev => [newComplaint, ...prev]);
    alert(`🔧 Maintenance Ticket filed successfully for Room ${newComplaint.roomNumber}!`);
  };

  const handleUpdateComplaintStatus = (
    complaintId: string,
    newStatus: 'Pending' | 'In Progress' | 'Resolved'
  ) => {
    const statusNote = `Warden updated status to: ${newStatus}`;
    setComplaints(prev =>
      prev.map(c => {
        if (c.id === complaintId) {
          return {
            ...c,
            status: newStatus,
            comments: [
              ...c.comments,
              {
                id: `cmt-${Date.now()}`,
                date: new Date().toLocaleString(),
                text: statusNote,
                sender: 'Warden'
              }
            ]
          };
        }
        return c;
      })
    );
  };

  const handleAddComplaintComment = (
    complaintId: string,
    text: string,
    sender: string
  ) => {
    setComplaints(prev =>
      prev.map(c => {
        if (c.id === complaintId) {
          return {
            ...c,
            comments: [
              ...c.comments,
              {
                id: `cmt-${Date.now()}`,
                date: new Date().toLocaleString(),
                text,
                sender
              }
            ]
          };
        }
        return c;
      })
    );
  };

  // 6. notices board
  const handleAddNotice = (newNotice: Notice) => {
    setNotices(prev => [newNotice, ...prev]);
  };

  const handleDeleteNotice = (noticeId: string) => {
    setNotices(prev => prev.filter(n => n.id !== noticeId));
  };

  // Helper mapping quick dashboard clicks to tabs
  const handleDashboardQuickAction = (action: string) => {
    if (action === 'new-admission') {
      setShowAdmissionModal(true);
    } else if (action === 'collect-rent') {
      setActiveTab('students');
    } else if (action === 'rooms-grid') {
      setActiveTab('rooms');
    } else if (action === 'students-list') {
      setActiveTab('students');
    } else if (action === 'complaints-view') {
      setActiveTab('complaints');
    } else if (action === 'visitor-log') {
      setActiveTab('visitors');
    } else if (action === 'notices-view') {
      setActiveTab('notices');
    }
  };

  // Nav items based on role authorization
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" />, roles: ['Owner', 'Manager', 'Student'] },
    { id: 'rooms', label: 'Rooms Map', icon: <Printer className="w-4 h-4" />, roles: ['Owner', 'Manager'] },
    { id: 'students', label: 'Students Directory', icon: <Users className="w-4 h-4" />, roles: ['Owner', 'Manager'] },
    { id: 'visitors', label: 'Gate Visitors', icon: <Footprints className="w-4 h-4" />, roles: ['Owner', 'Manager', 'Guard'] },
    { id: 'complaints', label: 'Complaints', icon: <ShieldAlert className="w-4 h-4" />, roles: ['Owner', 'Manager', 'Student'] },
    { id: 'notices', label: 'Notice Board', icon: <Megaphone className="w-4 h-4" />, roles: ['Owner', 'Manager', 'Student'] },
    { id: 'whatsapp', label: 'WhatsApp Alerts', icon: <MessageSquare className="w-4 h-4" />, roles: ['Owner', 'Manager'] }
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(activeRole));

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} students={students} />;
  }

  return (
    <div className="min-h-screen bg-slate-100/50 flex flex-col text-slate-950 font-sans antialiased pb-12" id="hostel-root-container">
      
      {/* GLOBAL TOP NAVIGATION BRANDING */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs" id="main-header">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🏢</span>
            <div>
              <h1 className="font-sans font-black text-sm tracking-tight text-slate-900 uppercase">Avadh Residency PG</h1>
              <p className="text-[10px] text-slate-400 font-bold tracking-wider">LUCKNOW, UTTAR PRADESH</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Active User Badging */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 select-none">
              <span className="text-slate-400">Portal:</span>
              <span className="text-slate-900 font-extrabold">
                {activeRole === 'Student' 
                  ? (students.find(s => s.id === currentStudentId)?.name || 'Student')
                  : activeRole
                }
              </span>
            </div>

            <button
              onClick={handleResetDatabase}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset Demo</span>
            </button>

            <button
              onClick={handleLogout}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER CONTENT BODY */}
      <main className="max-w-7xl mx-auto px-4 w-full flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 mt-2">
        
        {/* Navigation Sidebar Drawer */}
        <aside className="md:col-span-3 lg:col-span-2 space-y-2">
          <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-3xs space-y-1">
            <p className="text-[9px] uppercase font-black text-slate-400 tracking-wider p-2">Operations</p>
            {filteredNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-indigo-600 text-white shadow-md font-extrabold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                id={`sidebar-nav-${item.id}`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* Quick Stats sidebar banner */}
          {activeRole !== 'Guard' && (
            <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-2xl p-4 space-y-3 shadow-md border border-slate-800">
              <div className="flex justify-between items-center">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-indigo-400">Occupancy Gauge</span>
                <span className="font-mono text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded-md font-bold">{stats.occupancyRate}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full transition-all" style={{ width: `${stats.occupancyRate}%` }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>{stats.occupiedBeds} Beds occupied</span>
                <span>{stats.vacantBeds} Free</span>
              </div>
            </div>
          )}
        </aside>

        {/* Dynamic Route Pages Display Section */}
        <section className="md:col-span-9 lg:col-span-10">
          {activeTab === 'dashboard' && (
            <Dashboard
              role={activeRole}
              stats={stats}
              rooms={rooms}
              students={students}
              payments={payments}
              visitors={visitors}
              complaints={complaints}
              notices={notices}
              onQuickAction={handleDashboardQuickAction}
              onSelectStudentPortalOption={(opt) => setActiveTab(opt)}
              onCollectRentDirect={(student) => setStudentForRentCollection(student)}
              currentStudentId={currentStudentId}
            />
          )}

          {activeTab === 'rooms' && (
            <RoomsGrid
              role={activeRole}
              rooms={rooms}
              students={students}
              onSelectBed={handleAllocateBedFromMap}
            />
          )}

          {activeTab === 'students' && (
            <StudentsList
              role={activeRole}
              students={students}
              payments={payments}
              rooms={rooms}
              onCollectRentTrigger={(student) => setStudentForRentCollection(student)}
              onCheckoutStudent={handleCheckoutStudent}
              onOpenNewAdmission={() => setShowAdmissionModal(true)}
            />
          )}

          {activeTab === 'complaints' && (
            <ComplaintsView
              role={activeRole}
              complaints={complaints}
              students={students}
              onAddComplaint={handleAddComplaint}
              onUpdateStatus={handleUpdateComplaintStatus}
              onAddComment={handleAddComplaintComment}
              currentStudentId={currentStudentId}
            />
          )}

          {activeTab === 'visitors' && (
            <VisitorLog
              role={activeRole}
              visitors={visitors}
              students={students}
              onAddVisitor={handleAddVisitor}
              onCheckOutVisitor={handleCheckOutVisitor}
            />
          )}

          {activeTab === 'notices' && (
            <NoticesView
              role={activeRole}
              notices={notices}
              onAddNotice={handleAddNotice}
              onDeleteNotice={handleDeleteNotice}
            />
          )}

          {activeTab === 'whatsapp' && (
            <WhatsAppNotificationSystem
              role={activeRole}
              students={students}
              payments={payments}
            />
          )}
        </section>
      </main>

      {/* --- FLOATING OVERLAY MODAL: Admission Wizard --- */}
      {showAdmissionModal && (
        <AdmissionForm
          rooms={rooms}
          students={students}
          onAddStudent={handleAddStudentAdmission}
          onClose={() => {
            setShowAdmissionModal(false);
            setPreselectedRoomNumber('');
            setPreselectedBedId('');
          }}
        />
      )}

      {/* --- FLOATING OVERLAY MODAL: Rent Receipt Letterhead --- */}
      {receiptPayment && (
        <RentReceipt
          payment={receiptPayment}
          student={students.find(s => s.id === receiptPayment.studentId)}
          onClose={() => setReceiptPayment(null)}
        />
      )}

      {/* --- FLOATING OVERLAY MODAL: Rapid 2-Click Rent Collector --- */}
      {studentForRentCollection && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="rent-collector-modal">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden text-slate-800" id="rent-collector-modal-content">
            <div className="bg-emerald-600 text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="font-sans font-bold text-sm">₹ Rapid UPI/Cash Rent Collection</h3>
                <p className="text-[10px] text-emerald-100">Record payments in exactly 2 clicks • Avadh Residency</p>
              </div>
              <button
                onClick={() => setStudentForRentCollection(null)}
                className="text-emerald-100 hover:text-white p-1 rounded-lg cursor-pointer"
                id="close-rent-collector-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmRentCollection} className="p-5 space-y-4 text-xs font-semibold">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex justify-between items-center">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Student Name</p>
                  <p className="text-slate-800 font-extrabold text-sm">{studentForRentCollection.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Room {studentForRentCollection.roomNumber} ({studentForRentCollection.bedId.split('-')[1]})</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Monthly Rent</p>
                  <p className="text-emerald-700 font-black text-base">₹{studentForRentCollection.monthlyRent.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Collect Rent configuration fields */}
              <div>
                <label className="block text-slate-600 mb-1.5">Collection Month Cycle</label>
                <select
                  disabled
                  className="w-full border border-slate-200 bg-slate-100 text-slate-600 rounded-lg p-2 focus:outline-none"
                >
                  <option value="July 2026">July 2026 (Current Cycle)</option>
                </select>
                <p className="text-[9px] text-slate-400 mt-0.5 italic">Auto-locked to July 2026</p>
              </div>

              <div>
                <label className="block text-slate-600 mb-1.5">Select Payment Mode *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['PhonePe', 'GPay', 'Paytm', 'Cash', 'Bank Transfer'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPaymentMethod(mode)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        paymentMethod === mode
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Receipt Remarks (Optional)</label>
                <input
                  type="text"
                  value={paymentRemarks}
                  onChange={(e) => setPaymentRemarks(e.target.value)}
                  placeholder="e.g. Paid online, transaction ID check"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Confirm action button */}
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
                id="record-collection-confirm-btn"
              >
                Confirm Payment & Print Receipt
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer Branding line */}
      <footer className="text-center text-xs text-slate-400 mt-12 py-4 border-t border-slate-200/50">
        <p>© 2026 Avadh Residency PG • Built for Lucknow, UP • Designed for simple, paperless management</p>
      </footer>

    </div>
  );
}
