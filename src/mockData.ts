import { Student, Room, Payment, Visitor, Complaint, Notice } from './types';

// Let's seed Avadh Residency PG - Aliganj, Lucknow
export const INITIAL_ROOMS: Room[] = [
  {
    roomNumber: "101",
    floor: 1,
    sharingType: 2,
    hasAC: true,
    genderType: "Boys",
    monthlyRent: 9500,
    beds: [
      { bedId: "101-A", bedLabel: "Bed A", isOccupied: true, studentId: "std-001" },
      { bedId: "101-B", bedLabel: "Bed B", isOccupied: true, studentId: "std-002" }
    ]
  },
  {
    roomNumber: "102",
    floor: 1,
    sharingType: 1,
    hasAC: true,
    genderType: "Boys",
    monthlyRent: 13500,
    beds: [
      { bedId: "102-A", bedLabel: "Single Bed", isOccupied: true, studentId: "std-003" }
    ]
  },
  {
    roomNumber: "103",
    floor: 1,
    sharingType: 3,
    hasAC: false,
    genderType: "Boys",
    monthlyRent: 6500,
    beds: [
      { bedId: "103-A", bedLabel: "Bed A", isOccupied: true, studentId: "std-004" },
      { bedId: "103-B", bedLabel: "Bed B", isOccupied: false },
      { bedId: "103-C", bedLabel: "Bed C", isOccupied: true, studentId: "std-005" }
    ]
  },
  {
    roomNumber: "104",
    floor: 1,
    sharingType: 2,
    hasAC: false,
    genderType: "Boys",
    monthlyRent: 7500,
    beds: [
      { bedId: "104-A", bedLabel: "Bed A", isOccupied: false },
      { bedId: "104-B", bedLabel: "Bed B", isOccupied: false }
    ]
  },
  {
    roomNumber: "201",
    floor: 2,
    sharingType: 2,
    hasAC: true,
    genderType: "Girls",
    monthlyRent: 10000,
    beds: [
      { bedId: "201-A", bedLabel: "Bed A", isOccupied: true, studentId: "std-006" },
      { bedId: "201-B", bedLabel: "Bed B", isOccupied: true, studentId: "std-007" }
    ]
  },
  {
    roomNumber: "202",
    floor: 2,
    sharingType: 3,
    hasAC: true,
    genderType: "Girls",
    monthlyRent: 8000,
    beds: [
      { bedId: "202-A", bedLabel: "Bed A", isOccupied: true, studentId: "std-008" },
      { bedId: "202-B", bedLabel: "Bed B", isOccupied: false },
      { bedId: "202-C", bedLabel: "Bed C", isOccupied: false }
    ]
  },
  {
    roomNumber: "203",
    floor: 2,
    sharingType: 2,
    hasAC: false,
    genderType: "Girls",
    monthlyRent: 7000,
    beds: [
      { bedId: "203-A", bedLabel: "Bed A", isOccupied: true, studentId: "std-009" },
      { bedId: "203-B", bedLabel: "Bed B", isOccupied: true, studentId: "std-010" }
    ]
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: "std-001",
    name: "Aman Tripathi",
    mobile: "9876543210",
    emergencyMobile: "9450123456",
    parentName: "Rajesh Tripathi",
    parentMobile: "9450123456",
    roomNumber: "101",
    bedId: "101-A",
    idProofType: "Aadhar Card",
    idProofNumber: "4532 8901 2345",
    homeAddress: "Civil Lines, Prayagraj, UP",
    city: "Prayagraj",
    localArea: "Aliganj",
    institutionOrOffice: "Allen Career Institute, Kapoorthala",
    studentType: "Coaching Student",
    status: "Active",
    admissionDate: "2026-02-15",
    monthlyRent: 9500,
    depositAmount: 9500,
    documents: [
      { id: "doc-1", name: "Aadhar Card Front", fileType: "image/jpeg", uploadedAt: "2026-02-15", size: "245 KB" },
      { id: "doc-2", name: "Admission Agreement", fileType: "application/pdf", uploadedAt: "2026-02-15", size: "1.2 MB" }
    ]
  },
  {
    id: "std-002",
    name: "Siddharth Verma",
    mobile: "8765432109",
    emergencyMobile: "7388234561",
    parentName: "Dinesh Verma",
    parentMobile: "7388234561",
    roomNumber: "101",
    bedId: "101-B",
    idProofType: "Aadhar Card",
    idProofNumber: "8901 2345 6789",
    homeAddress: "Vikas Nagar, Gorakhpur, UP",
    city: "Gorakhpur",
    localArea: "Aliganj",
    institutionOrOffice: "FITJEE, Kapoorthala",
    studentType: "Coaching Student",
    status: "Active",
    admissionDate: "2026-03-01",
    monthlyRent: 9500,
    depositAmount: 9500,
    documents: [
      { id: "doc-3", name: "Aadhar Card Front", fileType: "image/jpeg", uploadedAt: "2026-03-01", size: "280 KB" }
    ]
  },
  {
    id: "std-003",
    name: "Vikramaditya Singh",
    mobile: "9123456780",
    emergencyMobile: "9935123456",
    parentName: "Sanjay Singh",
    parentMobile: "9935123456",
    roomNumber: "102",
    bedId: "102-A",
    idProofType: "Driving License",
    idProofNumber: "UP32 2024009876",
    homeAddress: "Sigra, Varanasi, UP",
    city: "Varanasi",
    localArea: "Gomti Nagar",
    institutionOrOffice: "TCS, Vibhuti Khand",
    studentType: "Working Professional",
    status: "Active",
    admissionDate: "2025-11-10",
    monthlyRent: 13500,
    depositAmount: 13500,
    documents: [
      { id: "doc-4", name: "Driving License", fileType: "image/jpeg", uploadedAt: "2025-11-10", size: "190 KB" },
      { id: "doc-5", name: "Company Offer Letter", fileType: "application/pdf", uploadedAt: "2025-11-10", size: "840 KB" }
    ]
  },
  {
    id: "std-004",
    name: "Rohan Dwivedi",
    mobile: "9451234567",
    emergencyMobile: "9451122334",
    parentName: "Prem Dwivedi",
    parentMobile: "9451122334",
    roomNumber: "103",
    bedId: "103-A",
    idProofType: "Aadhar Card",
    idProofNumber: "7765 4321 0987",
    homeAddress: "Civil Lines, Ayodhya, UP",
    city: "Ayodhya",
    localArea: "Jankipuram",
    institutionOrOffice: "Lucknow University",
    studentType: "College Student",
    status: "Active",
    admissionDate: "2026-01-20",
    monthlyRent: 6500,
    depositAmount: 6500,
    documents: [
      { id: "doc-6", name: "Aadhar Card Front", fileType: "image/jpeg", uploadedAt: "2026-01-20", size: "310 KB" }
    ]
  },
  {
    id: "std-005",
    name: "Mohit Chaudhary",
    mobile: "7007123456",
    emergencyMobile: "9839234512",
    parentName: "Arun Chaudhary",
    parentMobile: "9839234512",
    roomNumber: "103",
    bedId: "103-C",
    idProofType: "PAN Card",
    idProofNumber: "BYUPC1234F",
    homeAddress: "Civil Lines, Basti, UP",
    city: "Basti",
    localArea: "Aliganj",
    institutionOrOffice: "Mahendra's Coaching",
    studentType: "Coaching Student",
    status: "Active",
    admissionDate: "2026-04-10",
    monthlyRent: 6500,
    depositAmount: 6500,
    documents: []
  },
  {
    id: "std-006",
    name: "Ananya Mishra",
    mobile: "9812345678",
    emergencyMobile: "9415678901",
    parentName: "Shashank Mishra",
    parentMobile: "9415678901",
    roomNumber: "201",
    bedId: "201-A",
    idProofType: "Aadhar Card",
    idProofNumber: "1234 5678 9012",
    homeAddress: "Cantt Area, Bareilly, UP",
    city: "Bareilly",
    localArea: "Aliganj",
    institutionOrOffice: "Allen Career Institute, Kapoorthala",
    studentType: "Coaching Student",
    status: "Active",
    admissionDate: "2026-05-01",
    monthlyRent: 10000,
    depositAmount: 10000,
    documents: [
      { id: "doc-7", name: "Aadhar Card Front", fileType: "image/jpeg", uploadedAt: "2026-05-01", size: "260 KB" }
    ]
  },
  {
    id: "std-007",
    name: "Priya Shrivastava",
    mobile: "8090123456",
    emergencyMobile: "8090001234",
    parentName: "Anil Shrivastava",
    parentMobile: "8090001234",
    roomNumber: "201",
    bedId: "201-B",
    idProofType: "Aadhar Card",
    idProofNumber: "2345 6789 0123",
    homeAddress: "Shastri Nagar, Kanpur, UP",
    city: "Kanpur",
    localArea: "Aliganj",
    institutionOrOffice: "LTI Mindtree, Gomti Nagar",
    studentType: "Working Professional",
    status: "Active",
    admissionDate: "2026-04-15",
    monthlyRent: 10000,
    depositAmount: 10000,
    documents: [
      { id: "doc-8", name: "Aadhar Card Front", fileType: "image/jpeg", uploadedAt: "2026-04-15", size: "295 KB" }
    ]
  },
  {
    id: "std-008",
    name: "Ritu Sahu",
    mobile: "7705123456",
    emergencyMobile: "7705001234",
    parentName: "Ram Sahu",
    parentMobile: "7705001234",
    roomNumber: "202",
    bedId: "202-A",
    idProofType: "Aadhar Card",
    idProofNumber: "3456 7890 1234",
    homeAddress: "Civil Lines, Sitapur, UP",
    city: "Sitapur",
    localArea: "Indira Nagar",
    institutionOrOffice: "BBD University",
    studentType: "College Student",
    status: "Active",
    admissionDate: "2026-06-01",
    monthlyRent: 8000,
    depositAmount: 8000,
    documents: []
  },
  {
    id: "std-009",
    name: "Komal Yadav",
    mobile: "9519123456",
    emergencyMobile: "9519001234",
    parentName: "Vijay Yadav",
    parentMobile: "9519001234",
    roomNumber: "203",
    bedId: "203-A",
    idProofType: "Voter ID",
    idProofNumber: "ZQX9876543",
    homeAddress: "Civil Lines, Jhansi, UP",
    city: "Jhansi",
    localArea: "Aliganj",
    institutionOrOffice: "Mahendra's Coaching",
    studentType: "Coaching Student",
    status: "Active",
    admissionDate: "2026-05-15",
    monthlyRent: 7000,
    depositAmount: 7000,
    documents: []
  },
  {
    id: "std-010",
    name: "Sneha Rawat",
    mobile: "7309123456",
    emergencyMobile: "7309001234",
    parentName: "Satish Rawat",
    parentMobile: "7309001234",
    roomNumber: "203",
    bedId: "203-B",
    idProofType: "Aadhar Card",
    idProofNumber: "5678 9012 3456",
    homeAddress: "Naka, Lucknow, UP",
    city: "Lucknow",
    localArea: "Aliganj",
    institutionOrOffice: "Lucknow University",
    studentType: "College Student",
    status: "Active",
    admissionDate: "2026-06-10",
    monthlyRent: 7000,
    depositAmount: 7000,
    documents: []
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  // July 2026 Payments (Current Month)
  {
    id: "pay-001",
    studentId: "std-001",
    studentName: "Aman Tripathi",
    roomNumber: "101",
    amount: 9500,
    month: "July 2026",
    date: "2026-07-03",
    method: "PhonePe",
    remarks: "Rent received",
    status: "Paid",
    invoiceNumber: "AR-2026-07-001"
  },
  {
    id: "pay-002",
    studentId: "std-002",
    studentName: "Siddharth Verma",
    roomNumber: "101",
    amount: 9500,
    month: "July 2026",
    date: "2026-07-05",
    method: "GPay",
    remarks: "Rent received",
    status: "Paid",
    invoiceNumber: "AR-2026-07-002"
  },
  {
    id: "pay-003",
    studentId: "std-003",
    studentName: "Vikramaditya Singh",
    roomNumber: "102",
    amount: 13500,
    month: "July 2026",
    date: "2026-07-02",
    method: "Bank Transfer",
    remarks: "Rent July NEFT",
    status: "Paid",
    invoiceNumber: "AR-2026-07-003"
  },
  {
    id: "pay-004",
    studentId: "std-006",
    studentName: "Ananya Mishra",
    roomNumber: "201",
    amount: 10000,
    month: "July 2026",
    date: "2026-07-07",
    method: "Paytm",
    remarks: "Rent July Paytm",
    status: "Paid",
    invoiceNumber: "AR-2026-07-004"
  },
  // Pending for July 2026
  {
    id: "pay-005",
    studentId: "std-004",
    studentName: "Rohan Dwivedi",
    roomNumber: "103",
    amount: 6500,
    month: "July 2026",
    date: "",
    method: "PhonePe",
    status: "Pending",
    invoiceNumber: "AR-2026-07-005"
  },
  {
    id: "pay-006",
    studentId: "std-005",
    studentName: "Mohit Chaudhary",
    roomNumber: "103",
    amount: 6500,
    month: "July 2026",
    date: "",
    method: "Cash",
    status: "Pending",
    invoiceNumber: "AR-2026-07-006"
  },
  {
    id: "pay-007",
    studentId: "std-007",
    studentName: "Priya Shrivastava",
    roomNumber: "201",
    amount: 10000,
    month: "July 2026",
    date: "",
    method: "PhonePe",
    status: "Pending",
    invoiceNumber: "AR-2026-07-007"
  },
  {
    id: "pay-008",
    studentId: "std-008",
    studentName: "Ritu Sahu",
    roomNumber: "202",
    amount: 8000,
    month: "July 2026",
    date: "",
    method: "GPay",
    status: "Pending",
    invoiceNumber: "AR-2026-07-008"
  },
  {
    id: "pay-009",
    studentId: "std-009",
    studentName: "Komal Yadav",
    roomNumber: "203",
    amount: 7000,
    month: "July 2026",
    date: "2026-07-08",
    method: "Cash",
    remarks: "Paid to management",
    status: "Paid",
    invoiceNumber: "AR-2026-07-009"
  },
  {
    id: "pay-010",
    studentId: "std-010",
    studentName: "Sneha Rawat",
    roomNumber: "203",
    amount: 7000,
    month: "July 2026",
    date: "",
    method: "PhonePe",
    status: "Pending",
    invoiceNumber: "AR-2026-07-010"
  },

  // Historical June 2026 (All Paid)
  {
    id: "pay-011",
    studentId: "std-001",
    studentName: "Aman Tripathi",
    roomNumber: "101",
    amount: 9500,
    month: "June 2026",
    date: "2026-06-03",
    method: "PhonePe",
    status: "Paid",
    invoiceNumber: "AR-2026-06-001"
  },
  {
    id: "pay-012",
    studentId: "std-002",
    studentName: "Siddharth Verma",
    roomNumber: "101",
    amount: 9500,
    month: "June 2026",
    date: "2026-06-04",
    method: "GPay",
    status: "Paid",
    invoiceNumber: "AR-2026-06-002"
  }
];

export const INITIAL_VISITORS: Visitor[] = [
  {
    id: "vis-001",
    guestName: "Narendra Tripathi",
    guestMobile: "9415123456",
    studentId: "std-001",
    studentName: "Aman Tripathi",
    roomNumber: "101",
    purpose: "Father visiting, giving pocket money",
    entryTime: "2026-07-10T10:30",
    exitTime: "2026-07-10T12:00",
    status: "CheckedOut",
    vehicleNumber: "UP32 KH 7890"
  },
  {
    id: "vis-002",
    guestName: "Arpit Jaiswal",
    guestMobile: "8899887766",
    studentId: "std-002",
    studentName: "Siddharth Verma",
    roomNumber: "101",
    purpose: "Group study, FITJEE mock discussion",
    entryTime: "2026-07-10T17:15",
    status: "CheckedIn",
    vehicleNumber: "UP32 EJ 1234"
  },
  {
    id: "vis-003",
    guestName: "Manoj Mishra",
    guestMobile: "9450998877",
    studentId: "std-006",
    studentName: "Ananya Mishra",
    roomNumber: "201",
    purpose: "Uncle visiting with food items",
    entryTime: "2026-07-10T11:00",
    exitTime: "2026-07-10T11:45",
    status: "CheckedOut"
  },
  {
    id: "vis-004",
    guestName: "Sarla Sahu",
    guestMobile: "9935443322",
    studentId: "std-008",
    studentName: "Ritu Sahu",
    roomNumber: "202",
    purpose: "Mother visiting with home sweets",
    entryTime: "2026-07-10T19:30",
    status: "CheckedIn"
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: "comp-001",
    title: "WiFi not working on 1st Floor",
    description: "The WiFi signal in room 101 and 103 is extremely weak and keeps disconnecting. Speed is slow, cannot attend online classes.",
    category: "Wifi",
    studentId: "std-001",
    studentName: "Aman Tripathi",
    roomNumber: "101",
    status: "In Progress",
    priority: "High",
    dateSubmitted: "2026-07-09",
    comments: [
      { id: "c1", date: "2026-07-09 18:00", text: "Complained filed by student.", sender: "Student" },
      { id: "c2", date: "2026-07-10 10:00", text: "Warden inspected and raised with Jio fiber representative.", sender: "Warden" }
    ]
  },
  {
    id: "comp-002",
    title: "Bathroom tap leaking in 203",
    description: "The washbasin tap is continuously dripping, causing noise and water waste. Please fix it immediately.",
    category: "Plumbing",
    studentId: "std-009",
    studentName: "Komal Yadav",
    roomNumber: "203",
    status: "Pending",
    priority: "Medium",
    dateSubmitted: "2026-07-10",
    comments: [
      { id: "c3", date: "2026-07-10 08:30", text: "Reported in morning register.", sender: "Student" }
    ]
  },
  {
    id: "comp-003",
    title: "AC cooling is low in room 102",
    description: "AC is running but it's not cooling properly. Dust may be choked in the filter. Need servicing.",
    category: "Electrical",
    studentId: "std-003",
    studentName: "Vikramaditya Singh",
    roomNumber: "102",
    status: "Resolved",
    priority: "High",
    dateSubmitted: "2026-07-05",
    comments: [
      { id: "c4", date: "2026-07-05 14:00", text: "Reported cooling issue.", sender: "Student" },
      { id: "c5", date: "2026-07-06 11:30", text: "Urban Company electrician cleaned the filters and refilled gas.", sender: "Manager" },
      { id: "c6", date: "2026-07-06 12:00", text: "Marked as resolved. Student verified cooling is excellent now.", sender: "Manager" }
    ]
  },
  {
    id: "comp-004",
    title: "Water filter taste is sour",
    description: "The RO system in the dining hall needs new candles/filters. The taste is a bit sour since yesterday.",
    category: "Food",
    studentId: "std-004",
    studentName: "Rohan Dwivedi",
    roomNumber: "103",
    status: "Pending",
    priority: "High",
    dateSubmitted: "2026-07-10",
    comments: [
      { id: "c7", date: "2026-07-10 14:15", text: "Reported RO filter concern.", sender: "Student" }
    ]
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: "not-001",
    title: "Sunday Special Dinner Feast (Awadhi Theme)",
    content: "This Sunday, we have arranged a Special Awadhi Feast in the dining hall featuring Veg/Paneer Biryani, Sheermal, and Lucknow Special Shahi Tukda. Timings: 8:00 PM to 10:30 PM. Compulsory attendance for everyone!",
    date: "2026-07-10",
    category: "Mess",
    targetAudience: "All"
  },
  {
    id: "not-002",
    title: "PG Main Gate Gate-Lock Timings Strict Rule",
    content: "As per the guidelines of Lucknow Police, all residents must return to the PG before 10:30 PM. The main gate will be locked exactly at 10:30 PM. Late entries will only be allowed in case of medical emergency with prior approval from parent and management.",
    date: "2026-07-08",
    category: "Rules",
    targetAudience: "All"
  },
  {
    id: "not-003",
    title: "Generator Fuel Surcharge & Routine Maintenance",
    content: "There will be a scheduled power back-up generator maintenance this Saturday from 12:00 PM to 02:00 PM. High power appliances like ACs and Geysers will not operate on the generator during this period. Kindly plan accordingly.",
    date: "2026-07-09",
    category: "General",
    targetAudience: "All"
  },
  {
    id: "not-004",
    title: "July Rent Reminder: Please pay by 10th",
    content: "To avoid late fee charges, please complete your monthly rent payment of July 2026 by today, 10th July. You can pay via GPay/PhonePe to the manager. If already paid, please ignore.",
    date: "2026-07-05",
    category: "Payment",
    targetAudience: "All"
  }
];

export const LUCKNOW_AREAS = [
  "Aliganj",
  "Gomti Nagar",
  "Indira Nagar",
  "Jankipuram",
  "Mahanagar",
  "Hazratganj",
  "Alambagh",
  "Chinhat",
  "Ashiyana",
  "Vikas Nagar"
];

export const CITIES_OF_UP = [
  "Lucknow",
  "Prayagraj",
  "Varanasi",
  "Gorakhpur",
  "Kanpur",
  "Bareilly",
  "Jhansi",
  "Ayodhya",
  "Basti",
  "Sitapur",
  "Meerut",
  "Agra"
];
