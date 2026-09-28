import React from 'react';
import { useBusiness } from '../../context/BusinessContext';
import jsPDF from 'jspdf';
import { FileSpreadsheet, Download, Sparkles, CheckCircle2, Printer } from 'lucide-react';

export const MonthlyReportGenerator: React.FC = () => {
  const { pulseData, products } = useBusiness();

  const downloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Category,Metric,Value\n";
    csvContent += `Business Pulse,Score,${pulseData.score}/100\n`;
    csvContent += `Sales,Monthly Revenue,₹4,82,500\n`;
    csvContent += `Profit,Net Profit,₹1,18,500\n`;
    csvContent += `Expenses,Total Expenses,₹68,500\n`;
    csvContent += `Inventory,Active SKUs,${products.length}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ProfitIQ_Monthly_Report_${new Date().toISOString().substring(0, 7)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('ProfitIQ — Monthly Business Intelligence Report', 14, 22);
    
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Business Name: Apex Retail & Café`, 14, 36);
    doc.text(`Overall Business Pulse: ${pulseData.score}/100 (Healthy)`, 14, 42);

    doc.line(14, 48, 196, 48);

    doc.setFontSize(14);
    doc.text('1. Executive Summary', 14, 58);
    doc.setFontSize(10);
    doc.text('Monthly revenue grew +12.4% to ₹4,82,500 driven by weekend sales surges. Net profit margins compressed slightly to 24.8% due to a 14% wholesale supplier cost increase.', 14, 66, { maxWidth: 180 });

    doc.setFontSize(14);
    doc.text('2. Key Business Metrics', 14, 85);
    doc.setFontSize(10);
    doc.text('• Monthly Revenue: ₹4,82,500 (+12.4%)', 14, 95);
    doc.text('• Net Profit: ₹1,18,500 (-7.4%)', 14, 102);
    doc.text('• Total Expenses: ₹68,500 (+14.2%)', 14, 109);
    doc.text('• Active SKUs Below Safety Threshold: 5 SKUs', 14, 116);
    doc.text('• Overdue Customer Receivables: ₹14,500 (7 Invoices)', 14, 123);

    doc.setFontSize(14);
    doc.text('3. AI-Detected Opportunities & Next-Month Focus', 14, 138);
    doc.setFontSize(10);
    doc.text('1. Consolidate transportation freight shipments into weekly orders to save ~₹4,500/mo.', 14, 148);
    doc.text('2. Trigger safety stock reorders for Coffee Beans Powder and Green Tea.', 14, 155);
    doc.text('3. Execute automated SMS payment reminders for overdue invoices.', 14, 162);

    doc.save(`ProfitIQ_Executive_Report_${new Date().toISOString().substring(0,7)}.pdf`);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-electric-400" /> Monthly Business Intelligence Report
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated multi-section executive summary with downloadable PDF and raw CSV exports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={downloadCSV}
            className="px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-bold border border-white/10 transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={generatePDFReport}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-electric-500 to-electric-400 hover:from-electric-400 transition shadow-lg shadow-electric-500/20 flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Download PDF Report
          </button>
        </div>
      </div>

      {/* Report Document Preview */}
      <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-6 bg-navy-900">
        <div className="border-b border-white/10 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white">Apex Retail & Café</h2>
            <div className="text-xs text-slate-400">Monthly Intelligence Report • September 2026</div>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
              BUSINESS PULSE: {pulseData.score}/100 HEALTHY
            </span>
          </div>
        </div>

        {/* 1. Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-electric-400 uppercase tracking-wider">1. Executive Summary</h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-navy-950 p-4 rounded-xl border border-white/5">
            Top-line monthly revenue grew <strong>+12.4% to ₹4,82,500</strong> driven by strong weekend sales performance in beverages and bakery items. However, net profit margin compressed by 7.4% due to wholesale supplier cost inflation (+14%) and an emergency freight transport spike (+23.5%).
          </p>
        </div>

        {/* 2. Key Performance Metrics */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-electric-400 uppercase tracking-wider">2. Sales & Profit Breakdown</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-navy-950 border border-white/5">
              <div className="text-slate-400">Revenue</div>
              <div className="font-extrabold text-white text-base">₹4,82,500</div>
            </div>
            <div className="p-3.5 rounded-xl bg-navy-950 border border-white/5">
              <div className="text-slate-400">Net Profit</div>
              <div className="font-extrabold text-emerald-400 text-base">₹1,18,500</div>
            </div>
            <div className="p-3.5 rounded-xl bg-navy-950 border border-white/5">
              <div className="text-slate-400">Expenses</div>
              <div className="font-extrabold text-slate-200 text-base">₹68,500</div>
            </div>
            <div className="p-3.5 rounded-xl bg-navy-950 border border-white/5">
              <div className="text-slate-400">Receivables Overdue</div>
              <div className="font-extrabold text-rose-400 text-base">₹14,500</div>
            </div>
          </div>
        </div>

        {/* 3. AI Opportunities */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-ai-glow uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> 3. AI-Detected Opportunities & Next-Month Focus
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2 p-2.5 rounded bg-navy-950 border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              Consolidate freight shipments into a single weekly delivery to save ~₹4,500/mo.
            </li>
            <li className="flex items-center gap-2 p-2.5 rounded bg-navy-950 border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              Trigger safety stock reorders for Coffee Beans Powder and Green Tea before Friday peak.
            </li>
            <li className="flex items-center gap-2 p-2.5 rounded bg-navy-950 border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              Dispatch automated payment reminders to 7 accounts with overdue balances past 30 days.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
