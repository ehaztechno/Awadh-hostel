import { useState } from 'react';
import { Room, Bed, Student, UserRole } from '../types';
import { Home, Filter, Sparkles, CheckCircle, HelpCircle, ShieldCheck } from 'lucide-react';

interface RoomsGridProps {
  role: UserRole;
  rooms: Room[];
  students: Student[];
  onSelectBed: (roomNumber: string, bedId: string) => void;
}

export default function RoomsGrid({ role, rooms, students, onSelectBed }: RoomsGridProps) {
  const [selectedFloor, setSelectedFloor] = useState<number | 'All'>('All');
  const [selectedWing, setSelectedWing] = useState<'All' | 'Boys' | 'Girls'>('All');
  const [selectedAC, setSelectedAC] = useState<'All' | 'AC' | 'Non-AC'>('All');

  // Filter Rooms
  const filteredRooms = rooms.filter((room) => {
    if (selectedFloor !== 'All' && room.floor !== selectedFloor) return false;
    if (selectedWing !== 'All' && room.genderType !== selectedWing) return false;
    if (selectedAC !== 'All') {
      if (selectedAC === 'AC' && !room.hasAC) return false;
      if (selectedAC === 'Non-AC' && room.hasAC) return false;
    }
    return true;
  });

  const getStudentForBed = (studentId?: string) => {
    if (!studentId) return undefined;
    return students.find((s) => s.id === studentId);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="rooms-grid-container">
      {/* Header and Filter bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h2 className="font-sans font-bold text-lg text-slate-950 flex items-center gap-2">
              🛏️ Interactive Rooms & Bed Allocation Map
            </h2>
            <p className="text-xs text-slate-500">
              Live status tracker of all beds in Avadh Residency PG. Click any vacant bed to allocate.
            </p>
          </div>
          <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto text-xs font-semibold">
            <button
              onClick={() => setSelectedWing('All')}
              className={`px-3 py-1.5 rounded-md cursor-pointer transition-all ${selectedWing === 'All' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              All Wings
            </button>
            <button
              onClick={() => setSelectedWing('Boys')}
              className={`px-3 py-1.5 rounded-md cursor-pointer transition-all ${selectedWing === 'Boys' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              👦 Boys Wing
            </button>
            <button
              onClick={() => setSelectedWing('Girls')}
              className={`px-3 py-1.5 rounded-md cursor-pointer transition-all ${selectedWing === 'Girls' ? 'bg-pink-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              👧 Girls Wing
            </button>
          </div>
        </div>

        {/* Detailed Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-medium">
          <div>
            <label className="block text-slate-500 mb-1 text-[11px] font-bold uppercase tracking-wider">Floor Level</label>
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value === 'All' ? 'All' : Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none"
            >
              <option value="All">All Floors</option>
              <option value={1}>1st Floor (Boys)</option>
              <option value={2}>2nd Floor (Girls)</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-500 mb-1 text-[11px] font-bold uppercase tracking-wider">AC / Cooling</label>
            <select
              value={selectedAC}
              onChange={(e) => setSelectedAC(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none"
            >
              <option value="All">All AC Types</option>
              <option value="AC">AC Rooms</option>
              <option value="Non-AC">Non-AC Air Cooled</option>
            </select>
          </div>
          <div className="col-span-2 sm:col-span-1 flex items-end">
            <div className="w-full bg-indigo-50 border border-indigo-100 p-2 rounded-lg text-[11px] text-indigo-800 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>
                Total Displayed Rooms: <strong>{filteredRooms.length}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Rooms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="rooms-grid-cards">
        {filteredRooms.map((room) => {
          const isBoys = room.genderType === 'Boys';
          const occupiedCount = room.beds.filter((b) => b.isOccupied).length;
          const isFullyOccupied = occupiedCount === room.sharingType;

          return (
            <div
              key={room.roomNumber}
              className={`bg-white rounded-2xl border-2 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden ${
                isBoys ? 'border-blue-50' : 'border-pink-50'
              }`}
              id={`room-card-${room.roomNumber}`}
            >
              {/* Room Card Title Bar */}
              <div className={`p-4 flex justify-between items-center ${isBoys ? 'bg-blue-50/50' : 'bg-pink-50/50'}`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-sans font-black text-slate-900 text-lg">Room {room.roomNumber}</span>
                    {room.hasAC ? (
                      <span className="bg-cyan-100 text-cyan-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wide">AC</span>
                    ) : (
                      <span className="bg-slate-100 text-slate-500 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wide">NON-AC</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                    {room.sharingType}-Seater • {room.genderType} Floor
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-black px-2 py-1 rounded-full ${
                    isFullyOccupied 
                      ? 'bg-red-100 text-red-800' 
                      : occupiedCount === 0 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {occupiedCount} / {room.sharingType} Filled
                  </span>
                  <p className="text-[11px] font-bold text-slate-800 mt-1">₹{room.monthlyRent.toLocaleString('en-IN')}/mo</p>
                </div>
              </div>

              {/* Beds Inside Room */}
              <div className="p-4 flex-1 space-y-3 bg-slate-50/20">
                {room.beds.map((bed) => {
                  const resident = getStudentForBed(bed.studentId);
                  const canManage = role !== 'Student' && role !== 'Guard';

                  return (
                    <div
                      key={bed.bedId}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                        bed.isOccupied
                          ? 'bg-white border-slate-150 shadow-2xs'
                          : 'bg-slate-50 border-dashed border-slate-300 hover:bg-indigo-50/30'
                      }`}
                    >
                      {/* Left: Bed Label & Status */}
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg ${bed.isOccupied ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-700'}`}>
                          🛏️
                        </div>
                        <div>
                          <p className="font-mono text-xs font-bold text-slate-800">{bed.bedLabel}</p>
                          {bed.isOccupied ? (
                            <p className="text-xs text-indigo-600 font-bold hover:underline cursor-default">
                              👤 {resident?.name || 'Loading Student...'}
                            </p>
                          ) : (
                            <p className="text-[10px] text-slate-400 font-medium">🔴 Vacant Bed</p>
                          )}
                        </div>
                      </div>

                      {/* Right Action: Allocate/Details */}
                      <div>
                        {bed.isOccupied ? (
                          <div className="text-right text-[10px]">
                            <span className="text-slate-400 block font-mono">{resident?.mobile || 'Verified'}</span>
                            <span className="text-slate-400 italic block font-mono text-[9px]">July Rent paid</span>
                          </div>
                        ) : (
                          canManage ? (
                            <button
                              onClick={() => onSelectBed(room.roomNumber, bed.bedId)}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold py-1 px-2.5 rounded-lg transition-all cursor-pointer shadow-sm"
                            >
                              + Allocate
                            </button>
                          ) : (
                            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">Available</span>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Room Amenity Checkboxes footer */}
              <div className="px-4 py-2 bg-slate-100/50 border-t border-slate-150 flex gap-4 text-[10px] text-slate-500 font-semibold">
                <span>⚡ Generator Back-up</span>
                <span>📶 Jio Fiber WiFi</span>
                <span>🧹 Cleaned Daily</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
