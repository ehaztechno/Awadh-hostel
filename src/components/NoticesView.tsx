import React, { useState } from 'react';
import { Notice, UserRole } from '../types';
import { Megaphone, Plus, Trash2, Calendar, ShieldCheck } from 'lucide-react';

interface NoticesViewProps {
  role: UserRole;
  notices: Notice[];
  onAddNotice: (notice: Notice) => void;
  onDeleteNotice: (noticeId: string) => void;
}

export default function NoticesView({
  role,
  notices,
  onAddNotice,
  onDeleteNotice
}: NoticesViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'General' | 'Mess' | 'Rules' | 'Payment' | 'Urgent'>('General');
  const [targetAudience, setTargetAudience] = useState<'All' | 'Boys' | 'Girls'>('All');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newNotice: Notice = {
      id: `not-${Date.now()}`,
      title,
      content,
      category,
      targetAudience,
      date: new Date().toISOString().split('T')[0]
    };

    onAddNotice(newNotice);
    setTitle('');
    setContent('');
    setShowAddForm(false);
  };

  const canPublish = role === 'Owner' || role === 'Manager';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="notices-view-layout">
      
      {/* Column 1: Publish notice (Only for Owner/Manager) */}
      <div className="lg:col-span-1 space-y-4">
        {canPublish ? (
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
            <h2 className="font-sans font-bold text-sm text-slate-900 mb-2 flex items-center gap-1.5">
              📢 Publish New Announcement
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Write a message to immediately notify students on their portal dashboard.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold" id="publish-notice-form">
              <div>
                <label className="block text-slate-600 mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunday Special Awadhi Dinner Menu"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Detailed Content *</label>
                <textarea
                  required
                  placeholder="Provide precise details, timings, instructions, and dates."
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Alert Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-xl p-2 bg-white focus:outline-none"
                  >
                    <option value="General">🔔 General Alert</option>
                    <option value="Mess">🍲 Food / Mess</option>
                    <option value="Rules">⚠️ Rules & Safety</option>
                    <option value="Payment">₹ Fee / Payment</option>
                    <option value="Urgent">🚨 Urgent Warning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Target Wing</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-xl p-2 bg-white focus:outline-none"
                  >
                    <option value="All">All Rooms (Co-Ed)</option>
                    <option value="Boys">Boys Floor Wing</option>
                    <option value="Girls">Girls Floor Wing</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                id="publish-notice-btn"
              >
                <Plus className="w-4 h-4" /> Publish Announcement
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800 space-y-3">
            <h3 className="font-sans font-bold text-sm flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Admin Verification Info
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Only hostel administrators (Owners or Managers) are authorized to publish announcements.
            </p>
            <p className="text-[11px] text-slate-400">
              Students and security personnel can read notices but cannot edit or publish new ones, protecting the board from unauthorized tampering.
            </p>
          </div>
        )}

        {/* Local guidelines widget */}
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl text-[11px] space-y-1">
          <p className="font-bold text-amber-800">📌 Mandatory UP Notice Protocol</p>
          <p>Local state laws mandate displaying clear gate timing regulations, fire exit guides, and anti-ragging contact hotlines prominently at the PG entrance.</p>
        </div>
      </div>

      {/* Right 2 Columns: Notice Board Display Feed */}
      <div className="lg:col-span-2 space-y-4" id="notices-feed-pane">
        <h2 className="font-sans font-bold text-base text-slate-900 flex items-center gap-2">
          📢 Active Board Announcements ({notices.length})
        </h2>

        <div className="space-y-4">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className={`bg-white rounded-2xl border p-5 shadow-2xs space-y-3 relative ${
                notice.category === 'Urgent' ? 'border-red-200 bg-red-50/10' : 'border-slate-150'
              }`}
              id={`notice-card-${notice.id}`}
            >
              {/* Category, Date, Target */}
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center flex-wrap">
                  <span className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                    notice.category === 'Urgent'
                      ? 'bg-red-100 text-red-800'
                      : notice.category === 'Rules'
                      ? 'bg-amber-100 text-amber-800'
                      : notice.category === 'Mess'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {notice.category}
                  </span>
                  
                  <span className="bg-slate-100 text-slate-600 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide">
                    Wing: {notice.targetAudience}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {notice.date}
                  </span>

                  {canPublish && (
                    <button
                      onClick={() => {
                        if (confirm("Delete this announcement notice from board?")) {
                          onDeleteNotice(notice.id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700 p-1 rounded-lg cursor-pointer hover:bg-red-50 transition-colors"
                      title="Delete notice"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Title & Body content */}
              <div className="space-y-1">
                <h3 className="font-sans font-bold text-slate-900 text-sm">{notice.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{notice.content}</p>
              </div>

              {/* Footer decorative border */}
              <div className="pt-2 border-t border-slate-50 text-[10px] text-slate-400 font-semibold">
                🔔 Published by: Hostel Operations Command Center, Lucknow
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
