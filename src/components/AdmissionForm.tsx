import React, { useState, useEffect } from 'react';
import { Student, Room, Bed, Document } from '../types';
import { LUCKNOW_AREAS, CITIES_OF_UP } from '../mockData';
import { X, User, Phone, Home, Shield, School, FileText, Upload, Plus, Check } from 'lucide-react';

interface AdmissionFormProps {
  rooms: Room[];
  students: Student[];
  onAddStudent: (student: Student) => void;
  onClose: () => void;
}

export default function AdmissionForm({ rooms, students, onAddStudent, onClose }: AdmissionFormProps) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [emergencyMobile, setEmergencyMobile] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentMobile, setParentMobile] = useState('');
  const [gender, setGender] = useState<'Boys' | 'Girls'>('Boys');
  
  // Selection States
  const [selectedRoomNumber, setSelectedRoomNumber] = useState('');
  const [selectedBedId, setSelectedBedId] = useState('');
  
  const [idProofType, setIdProofType] = useState<'Aadhar Card' | 'PAN Card' | 'Voter ID' | 'Driving License'>('Aadhar Card');
  const [idProofNumber, setIdProofNumber] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [city, setCity] = useState('Prayagraj');
  const [localArea, setLocalArea] = useState('Aliganj');
  const [institutionOrOffice, setInstitutionOrOffice] = useState('');
  const [studentType, setStudentType] = useState<'Coaching Student' | 'College Student' | 'Working Professional'>('Coaching Student');
  
  const [monthlyRent, setMonthlyRent] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);

  // Document Upload State
  const [uploadedDocs, setUploadedDocs] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Step Tracker
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');

  // Filter available rooms based on Gender
  const filteredRooms = rooms.filter(r => r.genderType === gender);

  // Auto-fill rent when room changes
  useEffect(() => {
    const rm = rooms.find(r => r.roomNumber === selectedRoomNumber);
    if (rm) {
      setMonthlyRent(rm.monthlyRent);
      setDepositAmount(rm.monthlyRent); // Default deposit = 1 month rent
      
      // Select first vacant bed
      const firstVacantBed = rm.beds.find(b => !b.isOccupied);
      if (firstVacantBed) {
        setSelectedBedId(firstVacantBed.bedId);
      } else {
        setSelectedBedId('');
      }
    }
  }, [selectedRoomNumber, rooms]);

  // Handle Drag & Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateUpload(e.target.files[0]);
    }
  };

  const simulateUpload = (file: File) => {
    setUploading(true);
    setTimeout(() => {
      const newDoc: Document = {
        id: `doc-${Date.now()}`,
        name: file.name,
        fileType: file.type || 'application/pdf',
        uploadedAt: new Date().toISOString().split('T')[0],
        size: `${Math.round(file.size / 1024)} KB`
      };
      setUploadedDocs(prev => [...prev, newDoc]);
      setUploading(false);
    }, 1200);
  };

  const handleNextStep = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!name.trim()) return setErrorMsg('Student name is required');
      if (mobile.length !== 10 || isNaN(Number(mobile))) return setErrorMsg('Please enter a valid 10-digit mobile number');
      if (!parentName.trim()) return setErrorMsg('Parent/Guardian name is required');
      if (parentMobile.length !== 10 || isNaN(Number(parentMobile))) return setErrorMsg('Please enter a valid 10-digit emergency parent mobile number');
      setStep(2);
    } else if (step === 2) {
      if (!selectedRoomNumber) return setErrorMsg('Please select a room');
      if (!selectedBedId) return setErrorMsg('Please select a bed');
      setStep(3);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!idProofNumber.trim()) {
      return setErrorMsg('ID Proof Number is required');
    }

    const newStudent: Student = {
      id: `std-${Date.now()}`,
      name,
      mobile,
      emergencyMobile: parentMobile,
      parentName,
      parentMobile,
      roomNumber: selectedRoomNumber,
      bedId: selectedBedId,
      idProofType,
      idProofNumber,
      homeAddress,
      city,
      localArea,
      institutionOrOffice: institutionOrOffice || 'Self study',
      studentType,
      status: 'Active',
      admissionDate: new Date().toISOString().split('T')[0],
      monthlyRent,
      depositAmount,
      documents: uploadedDocs
    };

    onAddStudent(newStudent);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto" id="admission-modal-backdrop">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-800 flex flex-col my-8" id="admission-modal-content">
        {/* Title */}
        <div className="bg-slate-900 text-white p-5 flex justify-between items-center shrink-0">
          <div>
            <h2 className="font-sans font-bold text-base">New Admission Entry</h2>
            <p className="text-xs text-slate-400">Takes less than 2 minutes • Avadh Residency PG</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer" id="close-admission-btn">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Steps Indicators */}
        <div className="flex bg-slate-50 border-b border-slate-100 p-3 justify-around text-xs font-semibold text-slate-400">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-indigo-600' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${step >= 1 ? 'border-indigo-600 bg-indigo-50 font-bold' : 'border-slate-300'}`}>1</span>
            Personal Info
          </div>
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-indigo-600' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${step >= 2 ? 'border-indigo-600 bg-indigo-50 font-bold' : 'border-slate-300'}`}>2</span>
            Room & Rent
          </div>
          <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-indigo-600' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${step >= 3 ? 'border-indigo-600 bg-indigo-50 font-bold' : 'border-slate-300'}`}>3</span>
            ID & Docs
          </div>
        </div>

        {/* Error Alert Banner */}
        {errorMsg && (
          <div className="bg-red-50 text-red-700 p-3 text-xs font-medium border-b border-red-100 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div>
            {errorMsg}
          </div>
        )}

        {/* Steps Container */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in" id="admission-step-1">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => { setGender('Boys'); setSelectedRoomNumber(''); }}
                  className={`flex-1 py-3 border-2 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    gender === 'Boys' ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-slate-200 hover:border-slate-300 text-slate-500'
                  }`}
                >
                  👦 Boys Hostel Wing
                </button>
                <button
                  type="button"
                  onClick={() => { setGender('Girls'); setSelectedRoomNumber(''); }}
                  className={`flex-1 py-3 border-2 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    gender === 'Girls' ? 'border-pink-600 bg-pink-50 text-pink-800' : 'border-slate-200 hover:border-slate-300 text-slate-500'
                  }`}
                >
                  👧 Girls Hostel Wing
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Student Details */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> Student Details
                  </h3>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Student Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aman Tripathi"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Student Mobile *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">+91</span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="10-digit number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                        className="w-full border border-slate-200 rounded-xl pl-12 pr-3 py-2 text-sm focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Category / Occupation</label>
                    <select
                      value={studentType}
                      onChange={(e) => setStudentType(e.target.value as any)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-white"
                    >
                      <option value="Coaching Student">Coaching Student (IIT/NEET/Govt)</option>
                      <option value="College Student">College Student (LU/BBD/AKTU)</option>
                      <option value="Working Professional">Working Professional (TCS/LTI)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Institute / Office Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Allen Aliganj, Mahendra's, LU"
                      value={institutionOrOffice}
                      onChange={(e) => setInstitutionOrOffice(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Guardian Details */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> Parent / Guardian Details
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Father / Guardian Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Tripathi"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Parent Mobile (Emergency) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">+91</span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="Parent contact"
                        value={parentMobile}
                        onChange={(e) => setParentMobile(e.target.value.replace(/\D/g, ''))}
                        className="w-full border border-slate-200 rounded-xl pl-12 pr-3 py-2 text-sm focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">City of Origin (Home City)</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-white"
                    >
                      {CITIES_OF_UP.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Lucknow Branch Area</label>
                    <select
                      value={localArea}
                      onChange={(e) => setLocalArea(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-white"
                    >
                      {LUCKNOW_AREAS.map((la) => (
                        <option key={la} value={la}>{la}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in" id="admission-step-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Home className="w-3.5 h-3.5" /> Room Allocation ({gender} Wing)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Select Room */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Select Room *</label>
                  <div className="grid grid-cols-3 gap-2 max-h-[180px] overflow-y-auto border border-slate-100 rounded-xl p-2 bg-slate-50">
                    {filteredRooms.map((room) => {
                      const vacantCount = room.beds.filter(b => !b.isOccupied).length;
                      const hasVacancy = vacantCount > 0;
                      return (
                        <button
                          key={room.roomNumber}
                          type="button"
                          disabled={!hasVacancy}
                          onClick={() => setSelectedRoomNumber(room.roomNumber)}
                          className={`p-2.5 rounded-lg border text-left flex flex-col justify-between cursor-pointer transition-all ${
                            selectedRoomNumber === room.roomNumber
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm'
                              : hasVacancy
                              ? 'border-slate-200 hover:border-slate-300 bg-white'
                              : 'border-slate-100 bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          <span className="font-bold text-sm">R-{room.roomNumber}</span>
                          <span className="text-[10px] mt-1 text-slate-500 font-medium">
                            {room.sharingType} sharing
                          </span>
                          <span className="text-[9px] mt-0.5 text-slate-400">
                            {vacantCount} vacant
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Select Bed */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Select Bed *</label>
                  {selectedRoomNumber ? (
                    <div className="space-y-2 border border-slate-100 rounded-xl p-3 bg-slate-50">
                      <p className="text-xs text-slate-500 font-semibold mb-2">Room {selectedRoomNumber} Beds:</p>
                      {rooms.find(r => r.roomNumber === selectedRoomNumber)?.beds.map((bed) => (
                        <button
                          key={bed.bedId}
                          type="button"
                          disabled={bed.isOccupied}
                          onClick={() => setSelectedBedId(bed.bedId)}
                          className={`w-full p-3 rounded-lg border text-left flex justify-between items-center transition-all ${
                            selectedBedId === bed.bedId
                              ? 'border-indigo-600 bg-indigo-100 text-indigo-900 font-bold'
                              : bed.isOccupied
                              ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'border-slate-200 hover:border-slate-300 bg-white cursor-pointer'
                          }`}
                        >
                          <span className="text-xs font-mono">{bed.bedLabel}</span>
                          <span className="text-[10px]">
                            {bed.isOccupied ? '🔴 Occupied' : '🟢 Available'}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="h-[180px] border border-slate-200 border-dashed rounded-xl flex items-center justify-center text-slate-400 text-xs p-4 text-center">
                      Please select a Room first to see available beds.
                    </div>
                  )}
                </div>
              </div>

              {/* Rent & Security Deposit Summary */}
              {selectedRoomNumber && (
                <div className="grid grid-cols-2 gap-4 pt-3 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                  <div>
                    <label className="block text-xs font-semibold text-indigo-900 mb-1">Monthly Rent (₹)</label>
                    <input
                      type="number"
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(Number(e.target.value))}
                      className="w-full bg-white border border-indigo-200 rounded-lg px-3 py-1.5 text-sm font-bold font-mono text-indigo-950 focus:outline-none"
                    />
                    <p className="text-[10px] text-indigo-600 mt-1">Standard rent for room {selectedRoomNumber}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-indigo-900 mb-1">Security Deposit (₹)</label>
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(Number(e.target.value))}
                      className="w-full bg-white border border-indigo-200 rounded-lg px-3 py-1.5 text-sm font-bold font-mono text-indigo-950 focus:outline-none"
                    />
                    <p className="text-[10px] text-indigo-600 mt-1">Refundable security amount</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in" id="admission-step-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> Identification & Verification
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Select Gov ID Proof *</label>
                  <select
                    value={idProofType}
                    onChange={(e) => setIdProofType(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-white"
                  >
                    <option value="Aadhar Card">Aadhar Card</option>
                    <option value="PAN Card">PAN Card</option>
                    <option value="Voter ID">Voter ID</option>
                    <option value="Driving License">Driving License</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">{idProofType} Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1234 5678 9012"
                    value={idProofNumber}
                    onChange={(e) => setIdProofNumber(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Home Address *</label>
                <textarea
                  required
                  placeholder="Full home village/city address for verification"
                  rows={2}
                  value={homeAddress}
                  onChange={(e) => setHomeAddress(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* File Upload Section */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2 flex items-center gap-1.5">
                  <School className="w-4 h-4 text-slate-500" /> Digital Document Uploads
                </label>
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                    dragActive
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-slate-200 hover:border-indigo-400 bg-slate-50/50'
                  }`}
                >
                  <input
                    type="file"
                    id="file-upload-input"
                    multiple
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">Drag & Drop Document Here</p>
                  <p className="text-[10px] text-slate-400 mt-1">Accepts Photo ID, Aadhar Front/Back, Rent Agreement (Max 4MB)</p>
                  <button
                    type="button"
                    onClick={() => document.getElementById('file-upload-input')?.click()}
                    className="mt-3 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium cursor-pointer hover:bg-slate-800"
                  >
                    Select File
                  </button>
                </div>

                {/* Upload Progress/Status */}
                {uploading && (
                  <div className="mt-3 p-2 bg-indigo-50 border border-indigo-100 rounded-lg text-xs flex items-center justify-between text-indigo-700 font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
                      Uploading document...
                    </span>
                    <span>45%</span>
                  </div>
                )}

                {/* Uploaded Documents List */}
                {uploadedDocs.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Uploaded Files ({uploadedDocs.length})</p>
                    {uploadedDocs.map((doc) => (
                      <div key={doc.id} className="flex justify-between items-center p-2 bg-slate-100 rounded-lg text-xs">
                        <span className="font-medium text-slate-800 truncate max-w-[200px]">{doc.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-mono">{doc.size}</span>
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.5 rounded-full font-bold">Verified</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev - 1)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1"
            >
              Continue Next
            </button>
          ) : (
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
              id="confirm-admission-btn"
            >
              <Check className="w-4 h-4" />
              Complete Admission
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
