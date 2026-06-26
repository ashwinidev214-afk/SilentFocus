export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center h-16">
      <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600 font-medium">Super Admin</span>
        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
          A
        </div>
      </div>
    </header>
  );
}
