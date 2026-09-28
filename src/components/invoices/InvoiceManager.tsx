import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import type { Invoice } from '../../types';
import jsPDF from 'jspdf';
import {
  FileText,
  Plus,
  Search,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const InvoiceManager: React.FC = () => {
  const { invoices, addInvoice, setInvoices } = useBusiness();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // New Invoice Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [dueDate, setDueDate] = useState('2026-10-30');
  const [itemDesc, setItemDesc] = useState('');
  const [itemAmount, setItemAmount] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !itemAmount) return;

    const amount = parseFloat(itemAmount);
    addInvoice({
      customerName: custName,
      customerEmail: custEmail,
      amount: amount,
      dueDate: dueDate,
      items: [
        {
          id: `item-${Date.now()}`,
          description: itemDesc || 'Consulting & Business Supplies',
          quantity: 1,
          unitPrice: amount,
          amount: amount
        }
      ]
    });

    setIsModalOpen(false);
    setCustName('');
    setCustEmail('');
    setItemDesc('');
    setItemAmount('');
  };

  const markPaid = (id: string) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'PAID' } : inv));
  };

  const generatePDF = (inv: Invoice) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('ProfitIQ Invoice', 14, 20);
    doc.setFontSize(10);
    doc.text(`Invoice No: ${inv.invoiceNumber}`, 14, 30);
    doc.text(`Date: ${inv.issueDate}`, 14, 36);
    doc.text(`Due Date: ${inv.dueDate}`, 14, 42);
    doc.text(`Customer: ${inv.customerName} (${inv.customerEmail})`, 14, 48);
    doc.text(`Status: ${inv.status}`, 14, 54);

    doc.line(14, 60, 196, 60);

    doc.setFontSize(12);
    doc.text('Line Items', 14, 70);
    let y = 80;
    inv.items.forEach(item => {
      doc.setFontSize(10);
      doc.text(`${item.description} (x${item.quantity})`, 14, y);
      doc.text(`₹${item.amount}`, 160, y);
      y += 8;
    });

    doc.line(14, y, 196, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Total Amount Due: ₹${inv.amount}`, 14, y);

    doc.save(`${inv.invoiceNumber}.pdf`);
  };

  const filtered = invoices.filter(inv => {
    const matchStatus = filterStatus === 'ALL' || inv.status === filterStatus;
    const matchSearch = inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-400" /> Customer Invoices & Receivables
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate invoices, track overdue payments, and send automated payment follow-ups.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20 shrink-0"
        >
          <Plus className="w-4 h-4" /> Create New Invoice
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-xl border border-white/10">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer or invoice #..."
            className="w-full bg-navy-950 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-navy-950 p-1 rounded-xl border border-white/5 text-xs font-medium">
          {['ALL', 'PENDING', 'OVERDUE', 'PAID'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterStatus === st ? 'bg-amber-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoice Grid Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950 text-slate-400 uppercase font-mono border-b border-white/10">
              <tr>
                <th className="px-5 py-3.5">Invoice #</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Issue / Due Date</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-navy-800/40 transition">
                  <td className="px-5 py-4 font-mono font-bold text-white">{inv.invoiceNumber}</td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-200">{inv.customerName}</div>
                    <div className="text-[11px] text-slate-400">{inv.customerEmail}</div>
                  </td>
                  <td className="px-5 py-4 text-slate-300">
                    <div>Issued: {inv.issueDate}</div>
                    <div className="text-[11px] text-slate-400">Due: {inv.dueDate}</div>
                  </td>
                  <td className="px-5 py-4 font-bold text-white">₹{inv.amount.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      inv.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      inv.status === 'OVERDUE' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                      'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}>
                      {inv.status === 'PAID' && <CheckCircle2 className="w-3 h-3" />}
                      {inv.status === 'OVERDUE' && <AlertCircle className="w-3 h-3" />}
                      {inv.status === 'PENDING' && <Clock className="w-3 h-3" />}
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => generatePDF(inv)}
                        className="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-white border border-white/10 transition"
                        title="Download PDF Invoice"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      {inv.status !== 'PAID' && (
                        <button
                          onClick={() => markPaid(inv.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 transition"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal to Create Invoice */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-lg glass-panel rounded-2xl border border-white/20 p-6 bg-navy-900 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" /> Create New Customer Invoice
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-sm">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Customer / Client Name*</label>
                <input
                  type="text"
                  required
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="e.g. Metro Catering Pvt Ltd"
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Customer Email</label>
                <input
                  type="email"
                  value={custEmail}
                  onChange={(e) => setCustEmail(e.target.value)}
                  placeholder="billing@metrocatering.com"
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Total Amount (₹)*</label>
                  <input
                    type="number"
                    required
                    value={itemAmount}
                    onChange={(e) => setItemAmount(e.target.value)}
                    placeholder="14500"
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Payment Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Item Description</label>
                <textarea
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  placeholder="e.g. Monthly Coffee Bean Wholesale Supply (20kg)"
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white focus:outline-none focus:border-amber-500 h-20"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-navy-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold transition shadow-lg shadow-amber-500/20"
                >
                  Save & Generate PDF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
