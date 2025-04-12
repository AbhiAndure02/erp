import React, { useState, useRef } from 'react';
import { FiDownload, FiPrinter, FiPlus, FiTrash2, FiEdit } from 'react-icons/fi';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const InvoiceGenerator = () => {
  // Form state
  const [invoice, setInvoice] = useState({
    invoiceNumber: 'INV-001',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    from: {
      name: 'CodeNtraa',
      address: '123 Business St, City',
      email: 'business@codentraa.com',
      phone: '+917558200679',
      gst: 'GST123456789',
      bank: 'Bank Name',
      accountNumber: '123456789012',
      ifsc: 'BANK1234567'
    },
    to: {
      name: '',
      address: '',
      email: '',
      phone: '',
      gst: ''
    },
    items: [],
    sgstRate: 9,
    cgstRate: 9,
    notes: '',
    terms: 'Payment due within 15 days'
  });

  function getTaxType(fromGST, toGST) {
    if (!fromGST || !toGST || fromGST.length < 2 || toGST.length < 2) {
      return "UNKNOWN";
    }
  
    const fromStateCode = fromGST.substring(0, 2);
    const toStateCode = toGST.substring(0, 2);
  
    return fromStateCode === toStateCode ? "CGST_SGST" : "IGST";
  }
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const invoiceRef = useRef();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoice(prev => ({ ...prev, [name]: value }));
  };

  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setInvoice(prev => ({
      ...prev,
      to: { ...prev.to, [name]: value }
    }));
  };

  const handleItemChange = (id, e) => {
    const { name, value } = e.target;
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id 
          ? { 
              ...item, 
              [name]: name === 'quantity' || name === 'rate' ? parseFloat(value) || 0 : value,
              amount: name === 'quantity' || name === 'rate' 
                ? (name === 'quantity' 
                    ? (parseFloat(value) || 0) * item.rate 
                    : item.quantity * (parseFloat(value) || 0))
                : item.amount
            } 
          : item
      )
    }));
  };

  // Calculate totals
  const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);
  const sgstAmount = subtotal * (invoice.sgstRate / 100);
  const cgstAmount = subtotal * (invoice.cgstRate / 100);
  const total = subtotal + sgstAmount + cgstAmount;

  // Add new item
  const addItem = () => {
    const newId = invoice.items.length > 0 ? Math.max(...invoice.items.map(item => item.id)) + 1 : 1;
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { id: newId, description: '', quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  // Remove item
  const removeItem = (id) => {
    if (invoice.items.length >= 1) {
      setInvoice(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id)
      }));
    }
  };

  // Generate PDF
  const generatePDF = () => {
    try {
      // Initialize jsPDF
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });      
      // Add autoTable to the doc instance
      doc.autoTable = autoTable;

      // Add logo or title
      doc.setTextColor(41, 128, 185);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('INVOICE', 105, 25, { align: 'center' });
      
      // Invoice info
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica');
      doc.text(`Invoice #: ${invoice.invoiceNumber}`, 15, 35);
      doc.text(`Date: ${invoice.date}`, 15, 40);
      doc.text(`Due Date: ${invoice.dueDate}`, 15, 45);
      
      // From/To addresses
      doc.setTextColor(41, 128, 185);
      doc.text('From:', 15, 55);
      doc.text('To:', 105, 55);
      
      doc.setTextColor(0, 0, 0);
      doc.text(invoice.from.name, 15, 60);
      doc.text(invoice.to.name, 105, 60);
      doc.text(invoice.from.address, 15, 65);
      doc.text(invoice.to.address, 105, 65);
      doc.text(invoice.from.email, 15, 70);
      doc.text(invoice.to.email, 105, 70);
      doc.text(invoice.from.phone, 15, 75);
      doc.text(invoice.to.phone, 105, 75);
      doc.text(`GST: ${invoice.from.gst}`, 15, 80);
      doc.text(`GST: ${invoice.to.gst}`, 105, 80);
      
      // Items table
      const itemsData = invoice.items.map(item => [
        item.description,
        item.quantity,
        `₹${item.rate.toFixed(2)}`,
        `₹${item.amount.toFixed(2)}`
      ]);
      
      // Generate table
      doc.autoTable({
        startY: 90,
        head: [['Description', 'Qty', 'Rate', 'Amount']],
        body: itemsData,
        theme: 'grid',
        headStyles: { 
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        },
        margin: { top: 90 },
        styles: {
          cellPadding: 3,
          fontSize: 10
        }
      });
      
      // Totals
      const finalY = doc.lastAutoTable.finalY + 15;
      doc.setTextColor(0, 0, 0);
      doc.text(`Subtotal:`, 130, finalY);
      doc.text(`₹${subtotal.toFixed(2)}`, 170, finalY, { align: 'right' });
      
      doc.text(`SGST (${invoice.sgstRate}%):`, 130, finalY + 5);
      doc.text(`₹${sgstAmount.toFixed(2)}`, 170, finalY + 5, { align: 'right' });
      
      doc.text(`CGST (${invoice.cgstRate}%):`, 130, finalY + 10);
      doc.text(`₹${cgstAmount.toFixed(2)}`, 170, finalY + 10, { align: 'right' });
      
      doc.setTextColor(41, 128, 185);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`Total:`, 130, finalY + 15);
      doc.text(`₹${total.toFixed(2)}`, 170, finalY + 15, { align: 'right' });
      
      // Notes and terms
      doc.setTextColor(41, 128, 185);
      doc.setFontSize(12);
      doc.text('Notes:', 15, finalY + 25);
      doc.text('Terms:', 15, finalY + 40);
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(invoice.notes, 15, finalY + 30, { maxWidth: 180 });
      doc.text(invoice.terms, 15, finalY + 45, { maxWidth: 180 });
      
      // Save the PDF
      doc.save(`invoice_${invoice.invoiceNumber}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Print only the invoice content
  const handlePrint = () => {
    const printContent = invoiceRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    
    // Refresh the page to restore functionality
    window.location.reload();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - won't print */}
      <div className={`bg-blue-800 text-white ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 print:hidden`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h2 className="text-xl font-bold">Invoice App</h2>}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white focus:outline-none"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        <nav className="mt-6">
          <div className="px-4 py-2 hover:bg-blue-700 cursor-pointer flex items-center">
            <FiEdit className="mr-3" />
            {sidebarOpen && <span>Create Invoice</span>}
          </div>
          <div 
            onClick={generatePDF}
            className="px-4 py-2 hover:bg-blue-700 cursor-pointer flex items-center"
          >
            <FiDownload className="mr-3" />
            {sidebarOpen && <span>Download PDF</span>}
          </div>
          <div 
            onClick={handlePrint}
            className="px-4 py-2 hover:bg-blue-700 cursor-pointer flex items-center"
          >
            <FiPrinter className="mr-3" />
            {sidebarOpen && <span>Print Invoice</span>}
          </div>
        </nav>
      </div>

      {/* Main Content - will print */}
      <div className="flex-1 overflow-auto p-8 print:p-0">
        <div 
          className="bg-white rounded-lg shadow-md p-6 print:shadow-none print:rounded-none print:p-4" 
          ref={invoiceRef}
        >
          <h1 className="text-2xl font-bold mb-6 text-center text-blue-700 print:text-black">INVOICE</h1>
          
          {/* Invoice Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 print:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 print:text-black">Invoice Number</label>
              <input
                type="text"
                name="invoiceNumber"
                value={invoice.invoiceNumber}
                onChange={handleInputChange}
                className="w-full p-2 border rounded print:border-0 print:p-1 print:bg-transparent"
                placeholder="INV-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 print:text-black">Date</label>
              <input
                type="date"
                name="date"
                value={invoice.date}
                onChange={handleInputChange}
                className="w-full p-2 border rounded print:border-0 print:p-1 print:bg-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 print:text-black">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={invoice.dueDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded print:border-0 print:p-1 print:bg-transparent"
              />
            </div>
          </div>

          {/* From/To */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 print:grid-cols-2">
            <div className="bg-gray-50 p-4 rounded print:bg-transparent print:border print:border-gray-300">
              <h3 className="font-bold mb-2 text-blue-700 print:text-black">From</h3>
              <p>{invoice.from.name}</p>
              <p>{invoice.from.address}</p>
              <p>{invoice.from.email}</p>
              <p>{invoice.from.phone}</p>
              <p>GST: {invoice.from.gst}</p>
              <p>Bank: {invoice.from.bank}</p>
              <p>Account No: {invoice.from.accountNumber}</p>

            </div>
            <div className="bg-gray-50 p-4 rounded print:bg-transparent print:border print:border-gray-300">
              <h3 className="font-bold mb-2 text-blue-700 print:text-black">To</h3>
              <input
                type="text"
                name="name"
                value={invoice.to.name}
                onChange={handleClientChange}
                className="w-full p-2 border rounded mb-2 print:border-0 print:p-1 print:bg-transparent"
                placeholder="Client Name"
              />
              <input
                type="text"
                name="address"
                value={invoice.to.address}
                onChange={handleClientChange}
                className="w-full p-2 border rounded mb-2 print:border-0 print:p-1 print:bg-transparent"
                placeholder="Client Address"
              />
              <input
                type="email"
                name="email"
                value={invoice.to.email}
                onChange={handleClientChange}
                className="w-full p-2 border rounded mb-2 print:border-0 print:p-1 print:bg-transparent"
                placeholder="Client Email"
              />
              <input
                type="text"
                name="phone"
                value={invoice.to.phone}
                onChange={handleClientChange}
                className="w-full p-2 border rounded mb-2 print:border-0 print:p-1 print:bg-transparent"
                placeholder="Client Phone"
              />
              
              <input
                type="text"
                name="gst"
                value={invoice.to.gst}
                onChange={handleClientChange}
                className="w-full p-2 border rounded print:border-0 print:p-1 print:bg-transparent"
                pla
                ceholder="Client GST"
              />
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <h3 className="font-bold mb-2 text-blue-700 print:text-black">Items</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-100 print:bg-gray-200">
                  <th className="p-2 border text-left">Description</th>
                  <th className="p-2 border text-center">Quantity</th>
                  <th className="p-2 border text-center">Rate</th>
                  <th className="p-2 border text-center">Amount</th>
                  <th className="p-2 border text-center print:hidden">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-2 border">
                      <input
                        type="text"
                        name="description"
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, e)}
                        className="w-full p-1 border rounded print:border-0 print:p-0 print:bg-transparent"
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="number"
                        name="quantity"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, e)}
                        className="w-full p-1 border rounded text-center print:border-0 print:p-0 print:bg-transparent"
                        min="1"
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="number"
                        name="rate"
                        value={item.rate}
                        onChange={(e) => handleItemChange(item.id, e)}
                        className="w-full p-1 border rounded text-center print:border-0 print:p-0 print:bg-transparent"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="p-2 border text-center">₹{item.amount.toFixed(2)}</td>
                    <td className="p-2 border text-center print:hidden">
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={addItem}
              className="mt-2 flex items-center text-blue-600 hover:text-blue-800 print:hidden"
            >
              <FiPlus className="mr-1" /> Add Item
            </button>
          </div>

          {/* Totals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 print:grid-cols-3">
     
            <div className="md:col-span-2">
              <div className="bg-gray-50 p-4 rounded print:bg-transparent print:border print:border-gray-300">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>SGST ({invoice.sgstRate}%):</span>
                  <span>₹{sgstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>CGST ({invoice.cgstRate}%):</span>
                  <span>₹{cgstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes and Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 print:text-black">Notes</label>
              <textarea
                name="notes"
                placeholder='Any special instructions or notes'
                value={invoice.notes}
                onChange={handleInputChange}
                className="w-full p-2 border rounded print:border-0 print:p-1 print:bg-transparent"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 print:text-black">Terms</label>
              <textarea
                name="terms"
                placeholder='Terms and conditions'
                value={invoice.terms}
                onChange={handleInputChange}
                className="w-full p-2 border rounded print:border-0 print:p-1 print:bg-transparent"
                rows="3"
              />
            </div>
          </div>

          {/* Action Buttons - hidden when printing */}
          <div className="mt-8 flex justify-end space-x-4 print:hidden">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gray-200 rounded flex items-center hover:bg-gray-300"
            >
              <FiPrinter className="mr-2" /> Print
            </button>
            <button
              onClick={generatePDF}
              className="px-4 py-2 bg-blue-600 text-white rounded flex items-center hover:bg-blue-700"
            >
              <FiDownload className="mr-2" /> Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;