// src/app/dashboard/support/page.js
import SystemStatus from './components/SystemStatus';
import NewTicketForm from './components/NewTicketForm';
import TicketHistory from './components/TicketHistory';
import { BookOpenIcon, LifebuoyIcon } from '@heroicons/react/24/outline';

export default function SupportDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <LifebuoyIcon className="w-8 h-8 mr-3 text-indigo-600" />
          Support & Help Center
        </h1>
        <p className="mt-2 text-lg text-gray-600">Quickly find help, check system health, and track your issues.</p>
      </header>

      {/* Primary Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* New Ticket Form (Takes 2/3 of the width on large screens) */}
        <div className="lg:col-span-2">
          <NewTicketForm />
        </div>

        {/* System Status (Takes 1/3 of the width on large screens) */}
        <div className="lg:col-span-1">
          <SystemStatus />
          
          {/* External Links Section - Crucial for self-service support */}
          <div className="p-6 mt-6 bg-white rounded-lg shadow-lg">
             <h3 className="text-lg font-semibold mb-3 text-gray-800">Resources</h3>
             <a 
                href="[Link to your full public Knowledge Base]" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
             >
                <BookOpenIcon className="w-5 h-5 mr-2" />
                Access Full Knowledge Base
             </a>
             <p className='mt-3 text-sm text-gray-500'>*A quick search feature would also go here*</p>
          </div>
        </div>

      </div>

      {/* Ticket History Section */}
      <div className="mt-8">
        <TicketHistory />
      </div>
    </div>
  );
}
