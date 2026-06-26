import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  UserRound, 
  Map, 
  Activity, 
  CalendarCheck, 
  DollarSign, 
  MessageSquare, 
  Bell, 
  FileText, 
  Settings,
  LogOut
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { name: 'Users', href: '/users', icon: <Users size={20} /> },
  { name: 'Hosts', href: '/hosts', icon: <UserRound size={20} /> },
  { name: 'Retreats', href: '/retreats', icon: <Map size={20} /> },
  { name: 'Experiences', href: '/experiences', icon: <Activity size={20} /> },
  { name: 'Bookings', href: '/bookings', icon: <CalendarCheck size={20} /> },
  { name: 'Revenue', href: '/revenue', icon: <DollarSign size={20} /> },
  { name: 'Reviews', href: '/reviews', icon: <MessageSquare size={20} /> },
  { name: 'Notifications', href: '/notifications', icon: <Bell size={20} /> },
  { name: 'CMS', href: '/cms', icon: <FileText size={20} /> },
  { name: 'Settings', href: '/settings', icon: <Settings size={20} /> },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col sticky top-0 h-screen">
      <div className="p-6 text-xl font-bold border-b border-gray-800 flex items-center space-x-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white">S</span>
        </div>
        <span>Silent Focus</span>
      </div>
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="flex items-center space-x-3 p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
              >
                {item.icon}
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-800">
        <Link 
          href="/login" 
          className="flex items-center space-x-3 p-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Logout</span>
        </Link>
      </div>
    </aside>
  );
}
