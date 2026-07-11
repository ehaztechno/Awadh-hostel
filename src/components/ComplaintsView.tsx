import React, { useState } from 'react';
import { Complaint, Student, UserRole, Comment } from '../types';
import { ShieldAlert, Plus, Check, MessageSquare, AlertCircle, Clock, Trash2 } from 'lucide-react';

interface ComplaintsViewProps {
  role: UserRole;
  complaints: Complaint[];
  students: Student[];
  onAddComplaint: (complaint: Complaint) => void;
  onUpdateStatus: (complaintId: string, newStatus: 'Pending' | 'In Progress' | 'Resolved') => void;
  onAddComment: (complaintId: string, text: string, sender: string) => void;
  currentStudentId?: string;
}

export default function ComplaintsView({
  role,
  complaints,
  students,
  onAddComplaint,
  onUpdateStatus,
  onAddComment,
  currentStudentId = "std-001"
}: ComplaintsViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Plumbing' | 'Electrical' | 'Wifi' | 'Food' | 'Housekeeping' | 'Other'>('Plumbing');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  
  // State for adding a new comment
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

  // For Student view, only show their own complaints. For others, show all.
  const isStudent = role === 'Student';
  const currentStudent = students.find(s => s.id === currentStudentId) || students[0];

  const displayedComplaints = isStudent
    ? complaints.filter((c) => c.studentId === currentStudent?.id)
    : complaints;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    // Use Aman Tripathi if Student, otherwise first student in list
    const studentForComplaint = isStudent ? currentStudent : students[0];

    const newComplaint: Complaint = {
      id: `comp-${Date.now()}`,
      title,
      description,
      category,
      studentId: studentForComplaint?.id || 'guest',
      studentName: studentForComplaint?.name || 'Walk-in Student',
      roomNumber: studentForComplaint?.roomNumber || '101',
      status: 'Pending',
      priority,
      dateSubmitted: new Date().toISOString().split('T')[0],
      comments: [
        { id: `cmt-${Date.now()}`, date: new Date().toLocaleString(), text: "Complaint filed initially.", sender: isStudent ? "Student" : "Staff" }
      ]
    };

    onAddComplaint(newComplaint);
    setTitle('');
    setDescription('');
    setShowAddForm(false);
  };

  const handleSendComment = (complaintId: string) => {
    const text = commentText[complaintId];
    if (!text || !text.trim()) return;

    const sender = role === 'Student' ? 'Student' : 'Management';
    onAddComment(complaintId, text, sender);
    setCommentText(prev => ({ ...prev, [complaintId]: '' }));
  };

  const canResolve = role === 'Owner' || role === 'Manager';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="complaints-view-layout">
      
      {/* Left Column: Register New Complaint Form */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <h2 className="font-sans font-bold text-sm text-slate-900 mb-2 flex items-center gap-1.5">
            🔧 Quick Register Ticket
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Management can register a ticket for any room instantly. Students can also use the resident portal.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium" id="new-complaint-form">
            <div>
              <label className="block text-slate-600 mb-1">Issue Headline *</label>
              <input
                type="text"
                required
                placeholder="e.g. Bathroom light flickering, slow WiFi"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1">Detailed Description *</label>
              <textarea
                required
                placeholder="What is wrong? Specify exact details for the plumber/electrician."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full border border-slate-200 rounded-xl p-2 bg-white focus:outline-none"
                >
                  <option value="Plumbing">💧 Plumbing</option>
                  <option value="Electrical">⚡ Electrical</option>
                  <option value="Wifi">📶 WiFi/Net</option>
                  <option value="Food">🍽️ Mess Food</option>
                  <option value="Housekeeping">🧹 Cleaning</option>
                  <option value="Other">❓ Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Priority / Urgency</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full border border-slate-200 rounded-xl p-2 bg-white focus:outline-none"
                >
                  <option value="Low">🟢 Low (Routine)</option>
                  <option value="Medium">🟡 Medium (Normal)</option>
                  <option value="High">🔴 High (Urgent)</option>
                </select>
              </div>
            </div>

            {isStudent && (
              <div className="bg-indigo-50/50 p-2 border border-indigo-100 rounded-lg text-[10px] text-indigo-800 font-semibold">
                Auto-Tagged: Room {currentStudent?.roomNumber} ({currentStudent?.name})
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              id="submit-complaint-btn"
            >
              <Plus className="w-4 h-4" /> File Ticket
            </button>
          </form>
        </div>

        {/* Lucknow Municipal Contacts */}
        <div className="bg-slate-900 text-slate-300 rounded-2xl p-4 text-[11px] space-y-2 border border-slate-800">
          <p className="font-bold text-white text-xs">🛠️ Emergency Lucknow Vendors</p>
          <div className="space-y-1">
            <p>• Electrician: Raju (Aliganj Area) — +91 94151 55667</p>
            <p>• Plumber: Chhotu Bhai (Kapoorhtala) — +91 80902 33445</p>
            <p>• Jio Fiber Lucknow helpline — +91 1800 896 9999</p>
          </div>
        </div>
      </div>

      {/* Right 2 Columns: Complaints Directory List & Resolution Center */}
      <div className="lg:col-span-2 space-y-4" id="complaints-list-pane">
        <h2 className="font-sans font-bold text-base text-slate-900 flex items-center gap-2">
          🛠️ Active & Historical Tickets ({displayedComplaints.length})
        </h2>

        <div className="space-y-4">
          {displayedComplaints.length > 0 ? (
            displayedComplaints.map((comp) => (
              <div
                key={comp.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4"
                id={`complaint-card-${comp.id}`}
              >
                {/* Header: Status badges, dates, priority */}
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-slate-900 text-sm">{comp.title}</span>
                      <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                        comp.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {comp.priority} Priority
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Submitted: {comp.dateSubmitted} • Category: <strong className="text-slate-600">{comp.category}</strong>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      comp.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : comp.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {comp.status}
                    </span>
                    <p className="text-[10px] font-mono font-bold text-indigo-600 mt-1.5">Room {comp.roomNumber}</p>
                  </div>
                </div>

                {/* Description Body */}
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {comp.description}
                </p>

                {/* Comment Section (Activity log) */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" /> Resolution Logs
                  </p>
                  <div className="space-y-1.5">
                    {comp.comments.map((comment, idx) => (
                      <div key={idx} className="text-xs bg-slate-50 p-2 rounded-lg flex justify-between items-start">
                        <div>
                          <span className={`font-bold text-[10px] mr-1.5 px-1.5 py-0.5 rounded-full ${
                            comment.sender === 'Student' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {comment.sender}
                          </span>
                          <span className="text-slate-700">{comment.text}</span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono">{comment.date}</span>
                      </div>
                    ))}
                  </div>

                  {/* Add instant activity comment */}
                  <div className="flex gap-2 pt-1.5">
                    <input
                      type="text"
                      placeholder="Add an update comment..."
                      value={commentText[comp.id] || ''}
                      onChange={(e) => setCommentText(prev => ({ ...prev, [comp.id]: e.target.value }))}
                      className="flex-1 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 bg-white"
                    />
                    <button
                      onClick={() => handleSendComment(comp.id)}
                      className="bg-slate-900 text-white hover:bg-slate-800 px-3 py-1 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Update
                    </button>
                  </div>
                </div>

                {/* Action Footer for Warden / Manager */}
                {canResolve && comp.status !== 'Resolved' && (
                  <div className="pt-3 border-t border-slate-100 flex gap-2 justify-end">
                    {comp.status === 'Pending' && (
                      <button
                        onClick={() => onUpdateStatus(comp.id, 'In Progress')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-1.5 px-4 rounded-xl flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Clock className="w-3.5 h-3.5" /> Mark In-Progress
                      </button>
                    )}
                    <button
                      onClick={() => onUpdateStatus(comp.id, 'Resolved')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-1.5 px-4 rounded-xl flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Check className="w-3.5 h-3.5" /> Resolve Ticket
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white border border-slate-150 rounded-2xl">
              <p className="text-slate-400 text-xs font-bold">No active complaint tickets recorded!</p>
              <p className="text-slate-400 text-[10px] mt-0.5">Residents have reported clean operations.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
