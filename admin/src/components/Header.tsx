'use client';

import { usePathname } from 'next/navigation';
import { Bell, Search, User } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  
  // Convert pathname to title
  const getTitle = (path: string) => {
    if (path === '/dashboard') return 'Dashboard';
    const segment = path.split('/').pop();
    if (!segment) return 'Dashboard';
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center h-16 sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-gray-800">{getTitle(pathname)}</h2>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="hidden md:flex items-center relative">
          <Search className="absolute left-3 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 w-64"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 leading-none">Super Admin</p>
              <p className="text-xs text-gray-500 mt-1">admin@silentfocus.com</p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
              <User size={20} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
