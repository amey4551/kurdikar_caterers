import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Invoice = () => {
  const [invoiceData, setInvoiceData] = useState({
    number_of_people: 100,
    order_location: 'Goa',
    client_name: 'Amey',
    per_plate_cost: 200,
    event_date: '2024-06-30',
    bill_date: new Date().toLocaleDateString(),
    food_items: [
      { item: 'Item 1', description: 'Description for item 1', quantity: 2, unitPrice: '$30.00', total: '$60.00' },
      { item: 'Item 2', description: 'Description for item 2', quantity: 1, unitPrice: '$50.00', total: '$50.00' },
    ],
  });

  const generatePDF = () => {
    const doc : any = new jsPDF();

    // Extract data from state
    const { number_of_people, order_location, client_name, per_plate_cost, event_date, bill_date, food_items } = invoiceData;

    // Title
    doc.setFontSize(24);
    doc.text('Invoice', 14, 22);

    // Catering Order Info
    doc.setFontSize(12);
    doc.text(`Number of People: ${number_of_people}`, 14, 40);
    doc.text(`Order Location: ${order_location}`, 14, 46);
    doc.text(`Client Name: ${client_name}`, 14, 52);
    doc.text(`Per Plate Cost: $${per_plate_cost}`, 14, 58);
    doc.text(`Event Date: ${event_date}`, 14, 64);
    doc.text(`Bill Date: ${bill_date}`, 14, 70);

    // Invoice Table
    doc.autoTable({
      startY: 86,
      headStyles: { fillColor: [166, 166, 166], textColor: [255, 255, 255], fontStyle: 'bold' },
      bodyStyles: { textColor: [0, 0, 0] },
      head: [['Item', 'Description', 'Quantity', 'Unit Price', 'Total']],
      body: food_items.map(item => [item.item, item.description, item.quantity, item.unitPrice, item.total]),
    });

    // Total
    const total = number_of_people * per_plate_cost;
    doc.setFontSize(12);
    doc.text(`Total: $${total.toFixed(2)}`, 140, doc.autoTable.previous.finalY + 10);

    // Footer
    doc.setFontSize(10);
    doc.text('Thank you for choosing our catering service!', 14, doc.autoTable.previous.finalY + 30);

    // Set border for all pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.rect(10, 10, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 20, 'S');
    }

    // Download the PDF
    doc.save('invoice.pdf');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Invoice Generator</h1>
        <button
          // onClick={generatePDF}
          onClick={(e)=> alert("Coming soon")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Generate Invoice
        </button>
      </div>
    </div>
  );
};

export default Invoice;
