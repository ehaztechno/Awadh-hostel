import { Payment, Student } from '../types';
import { Copy, Check, Printer, Share2, X } from 'lucide-react';
import { useState } from 'react';

interface RentReceiptProps {
  payment: Payment;
  student?: Student;
  onClose: () => void;
}

export default function RentReceipt({ payment, student, onClose }: RentReceiptProps) {
  const [copied, setCopied] = useState(false);

  const whatsappMessage = `*RENT RECEIPT - AVADH RESIDENCY PG*
---------------------------------------
*Invoice No:* ${payment.invoiceNumber}
*Date:* ${payment.date || 'N/A'}
*Student Name:* ${payment.studentName}
*Room Number:* ${payment.roomNumber} (Bed: ${student?.bedId || 'N/A'})
*Month:* ${payment.month}
*Amount Paid:* ₹${payment.amount.toLocaleString('en-IN')}
*Payment Mode:* ${payment.method}
*Status:* PAID ✅
---------------------------------------
Thank you for your payment!
_Avadh Residency PG, Kapoorthala, Aliganj, Lucknow_
_Contact: +91 94150 12345_`;

  const handleCopy = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="receipt-modal-backdrop">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-800 flex flex-col max-h-[90vh]" id="receipt-modal-content">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="font-sans font-medium text-sm">Rent Receipt Generated</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer" id="close-receipt-btn">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Content (Printable area) */}
        <div className="p-6 overflow-y-auto print:p-0" id="printable-receipt-area">
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 print:border-none print:bg-white">
            {/* PG Branding */}
            <div className="text-center pb-4 border-b border-dashed border-slate-300">
              <h2 className="font-sans font-bold text-lg text-slate-900 tracking-tight">AVADH RESIDENCY PG</h2>
              <p className="text-xs text-slate-500">Kapoorthala, Aliganj, Lucknow, UP - 226024</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Contact: +91 94150 12345 | Email: contact@avadhpg.com</p>
            </div>

            {/* Receipt Title */}
            <div className="flex justify-between items-center my-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Invoice No</span>
                <p className="font-mono text-xs font-semibold text-slate-800">{payment.invoiceNumber}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Date</span>
                <p className="font-mono text-xs font-semibold text-slate-800">{payment.date || 'N/A'}</p>
              </div>
            </div>

            {/* Paid Badge */}
            <div className="bg-emerald-100 text-emerald-800 text-center py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider mb-4">
              Rent Received — Paid ✅
            </div>

            {/* Details Grid */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-medium text-slate-800">{payment.studentName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Room & Bed:</span>
                <span className="font-medium text-slate-800">
                  Room {payment.roomNumber} ({student?.bedId ? `Bed ${student.bedId.split('-')[1]}` : 'Bed allocated'})
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Resident Contact:</span>
                <span className="font-mono text-slate-800">+91 {student?.mobile || payment.studentId === 'std-001' ? '9876543210' : '9519123456'}</span>
              </div>
              {student?.parentName && (
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Guardian Name:</span>
                  <span className="font-medium text-slate-800">{student.parentName}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Billing Cycle:</span>
                <span className="font-medium text-slate-800">{payment.month}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Payment Mode:</span>
                <span className="font-medium text-slate-800">{payment.method}</span>
              </div>
              {payment.remarks && (
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Remarks:</span>
                  <span className="italic text-slate-600">{payment.remarks}</span>
                </div>
              )}

              {/* Total Row */}
              <div className="flex justify-between items-center pt-3 mt-1 bg-slate-100/60 p-2 rounded-lg border-t border-slate-200">
                <span className="font-bold text-slate-900 text-sm">Amount Paid:</span>
                <span className="font-mono font-bold text-slate-900 text-base">₹{payment.amount.toLocaleString('en-IN')}.00</span>
              </div>
            </div>

            {/* Note */}
            <div className="text-center mt-6 pt-3 border-t border-slate-200/50">
              <p className="text-[10px] text-slate-400">This is an electronically generated receipt. No physical signature is required.</p>
              <p className="text-[10px] font-medium text-indigo-600 mt-1">Avadh Residency PG — Built for Lucknow's finest students</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            id="copy-whatsapp-btn"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied WhatsApp Format!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                Copy WhatsApp Format
              </>
            )}
          </button>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              id="print-receipt-btn"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
