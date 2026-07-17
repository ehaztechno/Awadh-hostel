import React, { useState, useEffect } from 'react';
import { UserRole, Student, Payment } from '../types';
import { MessageSquare, Calendar, Bell, Settings, Send, CheckCircle2, AlertCircle, RefreshCw, UserCheck, HelpCircle, PhoneCall } from 'lucide-react';

interface WhatsAppNotificationSystemProps {
  role: UserRole;
  students: Student[];
  payments: Payment[];
}

interface NotificationLog {
  id: string;
  studentName: string;
  phone: string;
  type: 'Auto-Scheduled' | 'Manual-Broadcast' | 'Instant-Direct';
  timestamp: string;
  status: 'Sent' | 'Delivered';
  message: string;
}

export default function WhatsAppNotificationSystem({ role, students, payments }: WhatsAppNotificationSystemProps) {
  const [dueDay, setDueDay] = useState(10);
  const [daysBefore, setDaysBefore] = useState(5);
  const [autoEnabled, setAutoEnabled] = useState(true);
  const [messageTemplate, setMessageTemplate] = useState(
    "Dear {name}, this is a friendly reminder that your monthly PG rent of ₹{amount} for Room {room} is due on {due_date}. Please pay via UPI to avoid any late fees. Thank you! - Avadh Residency"
  );
  
  const [logs, setLogs] = useState<NotificationLog[]>(() => {
    const saved = localStorage.getItem('avadh_whatsapp_logs');
    if (saved) return JSON.parse(saved);

    // Initial demo logs to populate history
    return [
      {
        id: 'log-001',
        studentName: 'Aman Tripathi',
        phone: '9876543210',
        type: 'Auto-Scheduled',
        timestamp: '2026-07-05 09:30 AM',
        status: 'Sent',
        message: 'Dear Aman Tripathi, this is a friendly reminder that your monthly PG rent of ₹6500 for Room 101 is due on 10th July 2026. Please pay via UPI to avoid any late fees. Thank you! - Avadh Residency'
      },
      {
        id: 'log-002',
        studentName: 'Vikram Singh',
        phone: '8765432109',
        type: 'Auto-Scheduled',
        timestamp: '2026-07-05 09:31 AM',
        status: 'Sent',
        message: 'Dear Vikram Singh, this is a friendly reminder that your monthly PG rent of ₹5500 for Room 104 is due on 10th July 2026. Please pay via UPI. Thank you! - Avadh Residency'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('avadh_whatsapp_logs', JSON.stringify(logs));
  }, [logs]);

  // Filter students who have pending rent
  const pendingRentStudents = students.filter(student => {
    if (student.status !== 'Active') return false;
    const pendingPayment = payments.find(p => p.studentId === student.id && p.status === 'Pending' && p.month === 'July 2026');
    return !!pendingPayment;
  });

  // Calculate due date (e.g. July 10, 2026)
  const getDueDateString = (monthYear: string = 'July 2026') => {
    return `${dueDay}th ${monthYear}`;
  };

  // Generate WhatsApp pre-filled text
  const generateMessageText = (student: Student, amount: number, dueDate: string) => {
    let msg = messageTemplate;
    msg = msg.replace(/{name}/g, student.name);
    msg = msg.replace(/{amount}/g, amount.toString());
    msg = msg.replace(/{room}/g, student.roomNumber);
    msg = msg.replace(/{due_date}/g, dueDate);
    return msg;
  };

  // Generate WhatsApp direct URL
  const getWhatsAppUrl = (phone: string, text: string) => {
    // Sanitise phone number to make it a fully functional link
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    return `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(text)}`;
  };

  const handleManualTriggerAll = () => {
    // Simulate auto-notification script executing 5 days before the due date (or current date as backup)
    const newLogs: NotificationLog[] = [];
    let count = 0;

    pendingRentStudents.forEach(student => {
      const payment = payments.find(p => p.studentId === student.id && p.status === 'Pending' && p.month === 'July 2026');
      if (payment) {
        const dueDate = getDueDateString(payment.month);
        const text = generateMessageText(student, payment.amount, dueDate);
        
        // Add log entry
        newLogs.push({
          id: `log-gen-${Date.now()}-${count++}`,
          studentName: student.name,
          phone: student.mobile,
          type: 'Auto-Scheduled',
          timestamp: new Date().toLocaleString('en-US', { hour12: true, dateStyle: 'medium', timeStyle: 'short' }),
          status: 'Sent',
          message: text
        });
      }
    });

    if (newLogs.length === 0) {
      alert("All active residents have cleared their rent. No notifications need to be sent!");
      return;
    }

    setLogs(prev => [ ...newLogs, ...prev ]);
    alert(`Successfully simulated automated rent checks! Found ${newLogs.length} pending accounts. Simulated SMS & WhatsApp broadcasts dispatched.`);
  };

  const handleIndividualLog = (student: Student, type: 'Manual-Broadcast' | 'Instant-Direct', message: string) => {
    const newLog: NotificationLog = {
      id: `log-ind-${Date.now()}`,
      studentName: student.name,
      phone: student.mobile,
      type: type,
      timestamp: new Date().toLocaleString('en-US', { hour12: true, dateStyle: 'medium', timeStyle: 'short' }),
      status: 'Sent',
      message: message
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const cleanLogs = () => {
    if (confirm("Are you sure you want to clear the notification dispatch logs history?")) {
      setLogs([]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="whatsapp-notifications-view">
      {/* Column 1: System settings and controllers */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Status Dashboard Widget */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-sans font-bold text-sm tracking-tight flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Auto-Notification Engine
            </h3>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              autoEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${autoEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              {autoEnabled ? 'ACTIVE SCHEDULE' : 'PAUSED'}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            The background cron service periodically checks pending rent records. If a resident has unpaid invoices <strong>{daysBefore} days before</strong> the due date (<strong>{dueDay}th of month</strong>), the system dispatches WhatsApp and SMS alerts automatically.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold">Trigger Date</span>
              <span className="font-bold font-mono text-indigo-400">{getDueDateString().replace('10th', `${dueDay - daysBefore}th`)}</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold">Unpaid Leads</span>
              <span className="font-bold text-amber-400 font-mono">{pendingRentStudents.length} Students</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleManualTriggerAll}
            className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Force Rent Auto-Check Run
          </button>
        </div>

        {/* Configuration Panel */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
          <h3 className="font-sans font-bold text-sm text-slate-900 flex items-center gap-2">
            <Settings className="w-4 h-4 text-indigo-500" />
            Reminder Thresholds
          </h3>

          <div className="space-y-4 text-xs font-medium text-slate-700">
            {/* Toggle Status */}
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-900 block font-bold text-xs">Enable Background Alerts</span>
                <span className="text-[10px] text-slate-400 block font-normal">Dispatches messages without intervention</span>
              </div>
              <input
                type="checkbox"
                checked={autoEnabled}
                onChange={(e) => setAutoEnabled(e.target.checked)}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded cursor-pointer"
              />
            </div>

            {/* Rent Due Date */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Default Monthly Due Date</label>
              <select
                value={dueDay}
                onChange={(e) => setDueDay(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-semibold cursor-pointer"
              >
                {[1, 5, 7, 10, 15, 20, 25, 28].map(day => (
                  <option key={day} value={day}>{day}th of every month</option>
                ))}
              </select>
            </div>

            {/* Days before warning */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Trigger Window</label>
              <select
                value={daysBefore}
                onChange={(e) => setDaysBefore(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-semibold cursor-pointer"
              >
                {[2, 3, 4, 5, 7, 10].map(days => (
                  <option key={days} value={days}>{days} days before due date</option>
                ))}
              </select>
            </div>

            {/* Template text area */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">WhatsApp Template</label>
                <span className="text-[10px] text-slate-400">Available: &#123;name&#125;, &#123;amount&#125;, &#123;room&#125;, &#123;due_date&#125;</span>
              </div>
              <textarea
                rows={4}
                value={messageTemplate}
                onChange={(e) => setMessageTemplate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-indigo-500 font-medium leading-relaxed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Column 2: Unpaid queue and manual click-to-whatsapp launcher */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-sans font-bold text-sm text-slate-900">Rent Pending Residents Queue</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">List of residents with unpaid invoices eligible for 5-day pre-due alerts.</p>
            </div>
            <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold">
              {pendingRentStudents.length} Pending
            </span>
          </div>

          <div className="divide-y divide-slate-100" id="pending-whatsapp-list">
            {pendingRentStudents.length > 0 ? (
              pendingRentStudents.map(student => {
                const payment = payments.find(p => p.studentId === student.id && p.status === 'Pending' && p.month === 'July 2026');
                const amount = payment ? payment.amount : student.monthlyRent;
                const dueDate = getDueDateString(payment?.month || 'July 2026');
                const draftMessage = generateMessageText(student, amount, dueDate);
                const whatsappLink = getWhatsAppUrl(student.mobile, draftMessage);

                return (
                  <div key={student.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-sans font-bold text-xs text-slate-900">{student.name}</h4>
                        <span className="bg-slate-100 text-slate-700 text-[9px] font-mono px-2 py-0.5 rounded-md font-bold">
                          Room {student.roomNumber}
                        </span>
                        <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                          ₹{amount} Due
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-500">📞 Contact: +91 {student.mobile}</p>
                      
                      {/* Draft Message preview block */}
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2 text-[10px] text-slate-600 font-mono leading-relaxed max-w-xl">
                        <span className="font-bold text-indigo-600 block text-[9px] uppercase tracking-wider mb-0.5">Alert Preview:</span>
                        {draftMessage}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      {/* Real API Link Integration! opens WhatsApp web/app with preloaded message! */}
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => handleIndividualLog(student, 'Instant-Direct', draftMessage)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all hover:translate-y-[-1px]"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Direct WhatsApp
                      </a>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800">All student rent payments are up to date!</p>
                <p className="text-[11px] text-slate-400 mt-0.5">No pending auto-reminders are currently queued.</p>
              </div>
            )}
          </div>
        </div>

        {/* WhatsApp Logs History */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-sans font-bold text-sm text-slate-900">SMS & WhatsApp Dispatch Logs</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Logs of automated chron notifications and manual alert broadcasts.</p>
            </div>
            {logs.length > 0 && (
              <button
                onClick={cleanLogs}
                className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
              >
                Clear History
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1" id="whatsapp-logs-container">
            {logs.length > 0 ? (
              logs.map(log => (
                <div key={log.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">{log.studentName} (+91 {log.phone})</span>
                    <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono bg-white p-2 rounded border border-slate-100 leading-relaxed">
                    {log.message}
                  </p>
                  <div className="flex justify-between items-center pt-1 text-[10px]">
                    <span className={`inline-flex items-center gap-1 font-bold ${
                      log.type === 'Auto-Scheduled' ? 'text-indigo-600' : 'text-emerald-600'
                    }`}>
                      • {log.type} Triggered
                    </span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Dispatched
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs font-semibold">
                No notifications logged yet. Trigger rent checks to see logs.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
