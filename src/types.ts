export type UserRole = 'Owner' | 'Manager' | 'Guard' | 'Student';

export interface Document {
  id: string;
  name: string; // e.g. "Aadhar Card Front", "Admission Form"
  fileType: string; // e.g. "image/jpeg", "application/pdf"
  uploadedAt: string;
  size: string;
}

export interface Student {
  id: string;
  name: string;
  mobile: string;
  emergencyMobile: string;
  parentName: string;
  parentMobile: string;
  roomNumber: string;
  bedId: string;
  idProofType: 'Aadhar Card' | 'PAN Card' | 'Voter ID' | 'Driving License';
  idProofNumber: string;
  homeAddress: string;
  city: string; // e.g. Lucknow, Varanasi, Gorakhpur, etc.
  localArea: string; // Aliganj, Gomti Nagar, etc.
  institutionOrOffice: string; // e.g. FITJEE, Mahendra's, LU, TCS
  studentType: 'Coaching Student' | 'College Student' | 'Working Professional';
  status: 'Active' | 'CheckedOut';
  admissionDate: string;
  monthlyRent: number;
  depositAmount: number;
  documents: Document[];
}

export interface Bed {
  bedId: string;
  bedLabel: string; // e.g. "Bed A", "Bed B"
  isOccupied: boolean;
  studentId?: string;
}

export interface Room {
  roomNumber: string; // e.g. "101", "102"
  floor: number; // 0 for Ground Floor, 1 for 1st Floor, etc.
  sharingType: 1 | 2 | 3 | 4; // Single, Double, Triple, etc.
  hasAC: boolean;
  genderType: 'Boys' | 'Girls';
  monthlyRent: number;
  beds: Bed[];
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  amount: number;
  month: string; // e.g. "July 2026", "June 2026"
  date: string;
  method: 'PhonePe' | 'GPay' | 'Paytm' | 'Cash' | 'Bank Transfer';
  remarks?: string;
  status: 'Paid' | 'Pending';
  invoiceNumber: string;
}

export interface Visitor {
  id: string;
  guestName: string;
  guestMobile: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  purpose: string;
  entryTime: string;
  exitTime?: string;
  status: 'CheckedIn' | 'CheckedOut';
  vehicleNumber?: string;
  entryToken?: string;
}

export interface Comment {
  id: string;
  date: string;
  text: string;
  sender: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: 'Plumbing' | 'Electrical' | 'Wifi' | 'Food' | 'Housekeeping' | 'Other';
  studentId: string;
  studentName: string;
  roomNumber: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  priority: 'High' | 'Medium' | 'Low';
  dateSubmitted: string;
  comments: Comment[];
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'General' | 'Mess' | 'Rules' | 'Payment' | 'Urgent';
  targetAudience: 'All' | 'Boys' | 'Girls';
}

export interface HostelStats {
  totalBeds: number;
  occupiedBeds: number;
  vacantBeds: number;
  occupancyRate: number;
  pendingRentCount: number;
  totalPendingRent: number;
  totalCollectedRent: number;
  activeComplaints: number;
  todayVisitors: number;
}
