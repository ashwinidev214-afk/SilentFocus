import Link from 'next/link';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Users', href: '/users' },
  { name: 'Hosts', href: '/hosts' },
  { name: 'Retreats', href: '/retreats' },
  { name: 'Experiences', href: '/experiences' },
  { name: 'Bookings', href: '/bookings' },
  { name: 'Revenue', href: '/revenue' },
  { name: 'Reviews', href: '/reviews' },
  { name: 'Notifications', href: '/notifications' },
  { name: 'CMS', href: '/cms' },
  { name: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen flex flex-col">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        Silent Focus Admin
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="block p-2 hover:bg-gray-700 rounded transition-colors"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <Link href="/login" className="block p-2 hover:bg-gray-700 rounded transition-colors text-gray-400">
          Logout
        </Link>
      </div>
    </aside>
  );
}
