// src/app/dashboard/support/components/SystemStatus.js
import React from 'react';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/solid';

const services = [
  { name: 'Booking Engine', status: 'Operational', icon: CheckCircleIcon, color: 'text-green-500' },
  { name: 'Payment Gateway', status: 'Operational', icon: CheckCircleIcon, color: 'text-green-500' },
  { name: 'Email Notifications', status: 'Degraded', icon: ClockIcon, color: 'text-yellow-500' },
  { name: 'CRM Integration', status: 'Offline', icon: XCircleIcon, color: 'text-red-500' },
];

const SystemStatus = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">System Health Status 🩺</h2>
      <p className="text-sm text-gray-600 mb-4">Last Updated: {new Date().toLocaleTimeString()}</p>
      <ul className="space-y-3">
        {services.map((service) => (
          <li key={service.name} className="flex items-center justify-between border-b pb-2">
            <span className="font-medium text-gray-700">{service.name}</span>
            <div className="flex items-center">
              <service.icon className={`w-5 h-5 mr-2 ${service.color}`} />
              <span className={`font-bold ${service.color}`}>{service.status}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SystemStatus;