// src/app/dashboard/support/components/TicketHistory.js
import React from 'react';

const mockTickets = [
  { id: 'TKS-455', subject: 'API Key Expired', status: 'Closed', date: '2025-10-01', priority: 'High' },
  { id: 'TKS-456', subject: 'Minor Display Bug on Checkout', status: 'Open', date: '2025-10-05', priority: 'Medium' },
  { id: 'TKS-457', subject: 'Question about Manifest CSV export', status: 'In Progress', date: '2025-10-06', priority: 'Low' },
];

const statusStyles = {
  Open: 'bg-red-100 text-red-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  Closed: 'bg-green-100 text-green-800',
};

const TicketHistory = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Ticket History 📅</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockTickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{ticket.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.subject}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[ticket.status]}`}
                  >
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketHistory;

